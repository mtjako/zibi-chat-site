# Zibi Chat — strona w Next.js + Tailwind CSS

Strona działa w Next.js App Router, React, TypeScript i Tailwind CSS 4. Zachowuje treść, układ, ikony, obrazy, PL/EN, motyw systemowy/jasny/ciemny, FAQ i pobieranie instalatorów. Projekt działa jako statyczny eksport na Cloudflare Pages i zastępuje poprzednią wersję w repozytorium `mtjako/zibi-chat-site`.

## Uruchomienie

Wymagany Node.js 24 i npm.

```sh
npm ci
npm run dev
```

Otwórz http://localhost:3000.

```sh
npm run typecheck
npm run build
npm run preview
```

Build tworzy folder `out/`. `preview` serwuje gotowy eksport na http://localhost:3000, również bez serwera Next.js.

## Struktura

- `app/(entry)/` — strona startowa z wyborem języka na podstawie preferencji.
- `app/[lang]/` — gotowe statyczne wersje `/pl/` i `/en/`, w tym przetłumaczone metadane i atrybut `lang`.
- `components/site-page.tsx` — składanie strony z sekcji.
- `components/site-document.tsx` — wspólny dokument HTML, metadane i inicjalizacja motywu.
- `components/sections/` — nawigacja, hero, funkcje, środowiska, FAQ, pobieranie i stopka jako JSX.
- `components/site-provider.tsx` — stan małych kontrolek: motywu, systemu użytkownika i instalatorów. Pełny słownik tłumaczeń nie trafia do pakietu przeglądarki.
- `components/site-controls.tsx` — kontrolki Reacta i menu Linuksa z obsługą klawiatury.
- `components/product-shot.tsx` — obraz jako komponent serwerowy, z natywnym fallbackiem bez JavaScriptu.
- `public/preferences.js` — mały skrypt wbudowywany do HTML; wybiera i preloaduje właściwy zrzut przed ładowaniem Reacta.
- `lib/translations.ts` — oryginalny słownik EN; polska treść znajduje się w komponentach.
- `app/globals.css` — Tailwind, tokeny obu motywów oraz szczegółowe style oryginalnej strony i makiet aplikacji. Wspólne układy korzystają z klas Tailwinda bezpośrednio w JSX.
- `public/assets/` — oryginalne grafiki i licencje.
- `public/updates/` — kopia manifestów wydania z momentu migracji.

Wybory użytkownika są zapisywane w localStorage; zablokowany storage nie blokuje działania strony. `?lang=pl` / `?lang=en` mają pierwszeństwo przed zapisanym językiem. Motyw systemowy reaguje na zmianę systemu. Skrypt w head ustawia motyw przed pierwszym rysowaniem. Obie wersje językowe są generowane podczas buildu i zawierają pełną treść, metadane oraz zrzuty także bez JavaScriptu. Przełącznik języka przechodzi do odpowiedniego statycznego URL i zachowuje hash sekcji. Stare linki `?lang=pl` i `?lang=en` nadal działają. Jawny URL `/pl/` lub `/en/` ma pierwszeństwo przed zapisanym wyborem; na wejściu przez `/` używane są preferencje użytkownika.

## Wydajność i audyt

Sekcje strony są Server Components. Pełny słownik i treść PL/EN są przetwarzane podczas buildu. JavaScript Reacta obsługuje kontrolki, instalatory i daty. Bootstrap w head wybiera i preloaduje właściwy zrzut przed hydracją.

Grafiki mają rozmiary 480, 720, 800, 1100, 1600 i 2200 px; logotypy korzystają z małych wariantów. Po zmianie źródłowych PNG uruchom `npm run images` (wymaga `cwebp`, na macOS: `brew install webp`). Wygenerowane pliki są zapisane w repozytorium, więc CI nie wymaga tego narzędzia.

`experimental.inlineCss` osadza CSS w HTML i usuwa blokujące żądanie arkusza. Przy aktualizacji Next.js należy sprawdzić dalszą obsługę tej eksperymentalnej opcji. Podgląd (`npm run preview`) używa Brotli/gzip i cache; po wdrożeniu za te ustawienia odpowiada Cloudflare Pages.

```sh
npm run build
npm run lighthouse
```

Audyt wymaga lokalnego Chrome i dostępu do npm przy pierwszym pobraniu Lighthouse 13.5.0. Sam uruchamia serwer na porcie 4173, wykonuje kolejno trzy pomiary mobile i trzy desktopowe, po czym zamyka serwer. Raporty i mediany zapisuje w ignorowanym przez Git katalogu `.reports/lighthouse/`; następny audyt nadpisuje `summary.json`.

Opcje: `LH_RUNS=1` dla pojedynczego pomiaru, `LH_PATH=/en/` dla EN, `PORT=4180` dla innego portu. Przy eksporcie do podkatalogu ustaw ten sam `NEXT_PUBLIC_BASE_PATH` podczas buildu, podglądu i audytu. Lokalne wyniki należy potwierdzić na docelowym hostingu. Celowa blokada indeksowania obniża SEO, a nie wydajność. Wyniki i historia pomiarów: [PERFORMANCE.md](PERFORMANCE.md).

## Animacje i zgodność z aplikacją

- Podkreślenie w hero rysuje się raz po otwarciu strony. Karty mają subtelne wejście i uniesienie pod kursorem. Są to efekty prezentacyjne strony.
- Wiersze sesji zachowują wygląd aplikacji: nieruchome kropki, czas ostatniej aktywności i przygaszony tytuł pracującego agenta. Nie dodajemy pulsowania ani etykiety „Gotowe” w miejscu czasu.
- Wypełnienie limitu i znacznik tempa startują razem przez 500 ms, tak jak `PacedProgress` w aplikacji. Wykres odsłania się przy wejściu sekcji.
- Terminal wpisuje prawdziwą komendę `zibi stats` i pokazuje przykładowe wartości pól rzeczywistego JSON `summary`. Start następuje przy wejściu terminala w widok.
- Zmiana motywu strony przenika prawdziwe zrzuty aplikacji w 240 ms po dekodowaniu obrazu. Szybkie kolejne zmiany anulują poprzednie przejście; pierwsze wejście nadal pobiera tylko właściwy wariant hero.

Źródła zgodności w repozytorium aplikacji: `src/components/herdr-threads-list.tsx`, `src/components/herdr-space-dots.tsx`, `src/components/ui/progress.tsx` oraz `src-tauri/src/cli/stats.rs`. Dalsze animacje wewnątrz replik UI powinny wynikać z rzeczywistego zachowania tych komponentów.

Efekty korzystają z CSS i jednego IntersectionObservera, bez biblioteki animacji ani timerów pisania. `prefers-reduced-motion: reduce` wyłącza ruch; bez JavaScriptu pełna treść i terminal pozostają widoczne.

## Testy przeglądarkowe

Uruchom eksport na porcie 3001 (`PORT=3001 npm run preview`), a w drugim terminalu:

```sh
playwright-cli -s=zibi-performance open http://127.0.0.1:3001/pl/
playwright-cli -s=zibi-performance run-code --filename=tests/browser.js
playwright-cli -s=zibi-performance run-code --filename=tests/motion.js
playwright-cli -s=zibi-performance run-code --filename=tests/details.js
playwright-cli -s=zibi-performance close
```

## Cloudflare Pages

Strona jest hostowana na Cloudflare Pages (od 2026-10-21; wcześniej GitHub Pages, wyłączone). Cloudflare buduje ją sam po każdym pushu na `main`, przez integrację z Gitem:

- gałąź produkcyjna: `main` (domyślna gałąź repozytorium; tam `publish-update` z repozytorium aplikacji wypycha manifesty);
- polecenie: `npm run build`, katalog wynikowy: `out`, zmienna `NODE_VERSION=24`, bez `NEXT_PUBLIC_BASE_PATH`;
- domena `zibi.chat` (strefa DNS w Cloudflare); pliki statyczne mają domyślnie `Cache-Control: public, max-age=0, must-revalidate`, więc nowy manifest widać od razu po wdrożeniu.

`NEXT_PUBLIC_BASE_PATH` zostaje na wypadek eksportu do podkatalogu (np. podglądu pod innym adresem):

```sh
NEXT_PUBLIC_BASE_PATH=/repozytorium npm run build
```

Serwuj wtedy `out/` pod `/repozytorium/`. Dla własnej domeny pozostaw pusty prefiks. Metadane OG zachowują oryginalny adres produkcyjny. Zachowana jest blokada indeksowania przed premierą (`noindex` i `robots.txt`).

## Informacje przy pobieraniu

Hero pokazuje wiersz „Bezpłatnie · Bez konta · Bez telemetrii” w PL/EN. Wersja i data publikacji pochodzą z tego samego żądania manifestu co instalatory. Datę formatujemy dla języka strony w UTC. Brak lub błędne metadane nie blokują poprawnych instalatorów.


`npm run test:downloads` sprawdza parser manifestu (Node.js 24). Testy przeglądarkowe nowych elementów: `tests/downloads.js`, uruchamiane tak samo jak pozostałe testy.

## Manifesty instalatorów i aktualizacji

Strona pobiera `public/updates/downloads.json` w przeglądarce. Przyjmowane są tylko adresy z repozytorium `mtjako/zibi-chat-releases`. Menu Linuksa udostępnia AppImage, DEB i RPM dla x86_64 i ARM64; główne CTA dobiera AppImage według architektury zgłaszanej przez przeglądarkę. Brak manifestu lub instalatora wyświetla dotychczasowy komunikat.

Proces `publish-update` w repozytorium aplikacji powinien aktualizować `public/updates/` i uruchamiać deployment strony. Manifestów nie edytujemy ręcznie. Zrzuty aplikacji można odświeżyć narzędziami w `tools/editor-capture/`, a następnie wygenerować responsywne pliki przez `npm run images`.

Dokumentacja: [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports), [Tailwind CSS z Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs).

## Sekcja edytora

Sekcja `#edytor` znajduje się między bento a Środowiskami. Trzy klikalne kafelki pokazują edytor plików, Git i kolekcje API. Współdzielony obraz ładuje wyłącznie wybrany widok, obsługuje PL/EN, motywy i reduced motion. Strzałki, Home i End przełączają kafelki. Bez JavaScriptu zostają pierwszy zrzut i opisy. Test: `tests/editor.js`. Zrzuty PL/EN w obu motywach pochodzą z rzeczywistych komponentów aplikacji z przykładowymi danymi, bez dostępu do plików użytkownika. Renderer: `tools/editor-capture/` (wymaga sąsiedniego repozytorium `zibi-chat` lub `ZIBI_APP_DIR`). Uruchom Vite z konfiguracją `tools/editor-capture/vite.config.mjs`, wykonaj `take-shots.js` przez Playwright CLI z katalogu projektu, następnie `npm run images`.

Git i API używają danych demonstracyjnych; request nie trafia do zewnętrznej usługi.
