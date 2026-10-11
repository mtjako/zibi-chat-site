# Zibi Chat — zibi.chat

Statyczna strona single page w języku polskim i angielskim. HTML, CSS i JavaScript, bez zależności i kroku build.

## Podgląd

```sh
python3 -m http.server 8080
```

Otwórz http://localhost:8080. Bezpośrednie otwarcie `index.html` również działa.

## Języki i motywy

- Selektor PL/EN zmienia wszystkie teksty, metadane, opisy dostępności i zrzuty aplikacji.
- Pierwsza wizyta: język przeglądarki (polski dla `pl`, angielski dla pozostałych). Potem zapamiętany wybór.
- `?lang=pl` oraz `?lang=en` pozwalają udostępnić konkretną wersję i mają pierwszeństwo przed zapisanym wyborem.
- Motywy: System (domyślny), Jasny, Ciemny. System reaguje na zmianę `prefers-color-scheme` również podczas otwartej sesji.
- Wybory są zapamiętywane lokalnie. Blokada localStorage nie blokuje działania strony.
- `preferences.js` ustawia motyw przed ładowaniem CSS, ograniczając migotanie.
- Treść źródłowa PL jest w `index.html`, tłumaczenia EN w `translations.js`. Przy zmianie polskiego tekstu zaktualizuj odpowiadający mu klucz w słowniku.

## Zrzuty interfejsu

`assets/session-{pl,en}-{light,dark}.png` to render rzeczywistych komponentów aplikacji z repozytorium `zibi-chat`, a nie narysowana makieta. `detail-*` to kadry tego samego ekranu. Dane są demonstracyjne (bez informacji z kont użytkownika); podpis na stronie to wskazuje. Pełny podgląd otwiera dostępne z klawiatury okno dialogowe, zamykane także klawiszem Escape.

Źródła widoku: `src/routes/root-layout.tsx`, `src/components/app-sidebar.tsx`, `src/components/app-toolbar.tsx`, `src/harness/claude/components/current-session.tsx`, `src/style.css` oraz oryginalne słowniki i18n aplikacji. Zrzuty wykonano w Chromium w rozdzielczości 1100×760. Natywne kontrolki macOS odtworzono przy lewym brzegu paska tytułu; efekty systemowego vibrancy nie są częścią renderu przeglądarkowego. Sesja pokazuje 32% limitu 5H, 18% limitu 7D, 124 780 tokenów, 42 wywołania i koszt $2.34.

## Linki instalatorów

Adresy instalatorów nie są wpisywane ręcznie. `npm run publish-update` w repozytorium `zibi-chat` zapisuje przy każdym wydaniu `updates/downloads.json` (w tym samym commicie co manifest aktualizacji `updates/latest.json`), a `script.js` wczytuje go i ustawia `DOWNLOAD_URLS`. Przyjmowane są tylko adresy z `mtjako/zibi-chat-releases`. Bez pliku (przed pierwszym wydaniem, podgląd z dysku) przyciski pozostają niedostępne, a kliknięcie wyświetla komunikat w wybranym języku bez przeładowania strony.

Linux dostaje AppImage dla architektury zgłoszonej przez przeglądarkę (User-Agent Client Hints, tylko Chromium); bez tej informacji x86_64. Katalogu `updates/` nie edytuj ręcznie — należy do procesu wydania.

## GitHub Pages

1. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Wypchnij zmiany na `develop` albo ręcznie uruchom **Deploy GitHub Pages**.
3. Ustaw domenę `zibi.chat` i DNS dla GitHub Pages. Istniejący `CNAME` jest zachowany.

Workflow publikuje pliki strony, wszystkie warianty screenshotów oraz katalog `updates/`, jeżeli istnieje. Nie wymaga zależności, buildu ani dodatkowych sekretów. Język i motyw nie wymagają reguł routingu po stronie serwera.

### Odtworzenie screenshotów

Źródła izolowanego renderera są w `tools/capture/`. Nie są publikowane na GitHub Pages i nie zmieniają aplikacji. Wymagają lokalnego repozytorium aplikacji z zainstalowanymi zależnościami oraz Playwright CLI.

Z katalogu strony uruchom (podmień ścieżkę aplikacji):

```sh
ZIBI_APP_DIR=/sciezka/do/zibi-chat node /sciezka/do/zibi-chat/node_modules/vite/bin/vite.js --config tools/capture/vite.config.mjs --configLoader native
```

Następnie, również z katalogu strony:

```sh
playwright-cli -s=zibi-capture open http://127.0.0.1:8089
playwright-cli -s=zibi-capture run-code --filename=tools/capture/take-shots.js
playwright-cli -s=zibi-capture close
```

Okno z widokiem „Środowiska” (`assets/environments-*.png`) renderuje osobny serwer, który zamiast podmieniać moduły aplikacji symuluje całą warstwę Tauri (`@tauri-apps/api/mocks`, dane w `tools/capture/surface-fixture.ts`). Ten sam serwer umie też pokazać panel z paska menu i Dynamic Notch (`?surface=tray|notch`), ale strona ich nie używa, bo nie działają na wszystkich systemach:

```sh
ZIBI_APP_DIR=/sciezka/do/zibi-chat node /sciezka/do/zibi-chat/node_modules/vite/bin/vite.js --config tools/capture/vite.surfaces.config.mjs --configLoader native
playwright-cli -s=zibi-capture open "http://127.0.0.1:8088/surfaces.html?surface=window"
playwright-cli -s=zibi-capture run-code --filename=tools/capture/take-surfaces.js
playwright-cli -s=zibi-capture close
```

Oba skrypty zapisują zrzuty w skali 2× (ekrany Retina).

Strona serwuje zrzuty jako WebP (800 i 2200 px), nie PNG. Po każdym nowym zrzucie wygeneruj je z katalogu strony (wymaga `cwebp`, `brew install webp`):

```sh
sh tools/capture/make-webp.sh
```

Pliki PNG zostają: korzysta z nich obrazek podglądu linku i wersja strony bez JavaScriptu.

Obrazek podglądu linku (`assets/og-image.png`, 1200×630) powstaje z `tools/capture/og.html`. Przy serwerze strony na porcie 8765 (`python3 -m http.server 8765`):

```sh
playwright-cli open http://127.0.0.1:8765/
playwright-cli run-code --filename=tools/capture/take-og.js
```

Renderer importuje aktualne komponenty aplikacji. Zmiany ich kontraktów mogą wymagać aktualizacji `fixture.ts`.
