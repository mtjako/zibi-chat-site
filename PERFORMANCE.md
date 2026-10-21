# Audyt wydajności — 2026-10-16

Next.js 16.4.2, Lighthouse 13.5.0, lokalny statyczny eksport z Brotli/gzip. Pomiary wykonywane kolejno, z domyślną symulacją mobile i presetem desktop. Trzy pomiary na wariant; tabela pokazuje mediany.

| Parametr       |  Mobile | Desktop |
| -------------- | ------: | ------: |
| Wydajność      |      99 |     100 |
| Dostępność     |     100 |     100 |
| Dobre praktyki |     100 |     100 |
| SEO            |      66 |      66 |
| FCP            |  0.86 s |  0.23 s |
| LCP            |  2.18 s |  0.50 s |
| TBT            | 16.5 ms |  0.0 ms |
| CLS            |  0.0000 |  0.0001 |

Wyniki wydajności z kolejnych przebiegów: mobile **100 / 99 / 99**, desktop **100 / 100 / 100**. Nie deklarujemy stałego 100 na mobile; mediana wynosi 99.

Pierwszy audyt przed optymalizacją pokazał mobile 80 i desktop 98, ale używał serwera bez kompresji. Porównanie obejmuje więc zarówno zmiany kodu, jak i konfigurację podglądu. Weryfikacja na docelowym hostingu (od 2026-10-21 Cloudflare Pages; pomiary wyżej pochodzą z czasów GitHub Pages) pozostaje do wykonania.

## Wprowadzone zmiany

- Osobne statyczne wersje PL/EN i metadane, bez pełnego słownika oraz sekcji strony w pakiecie klienta.
- Właściwy zrzut hero wybierany i preloadowany przed Reactem; brak podmiany jasnego na ciemny po hydracji.
- WebP w sześciu rozmiarach oraz małe logotypy; ikony poza pierwszym ekranem ładowane leniwie.
- CSS osadzony w HTML przez `experimental.inlineCss`.
- Podgląd produkcyjny z kompresją i cache oraz polecenie audytu z powtarzalną konfiguracją.

## Weryfikacja

Build i TypeScript, PL/EN i metadane, zapis i przełączanie motywów, menu Linuksa i klawiatura, brak instalatorów, FAQ, szerokości 360–1440 px, zablokowany localStorage, wersja EN bez JavaScriptu oraz eksport pod prefiksem GitHub Pages. Test zimnego wejścia z zapisanym ciemnym motywem i opóźnionym Reactem potwierdza pojedyncze pobranie właściwego obrazu.

## Odtworzenie

```sh
npm run build
npm run lighthouse
```

Raporty HTML/JSON i wszystkie wartości liczbowe: `.reports/lighthouse/`. Pełne wyniki poszczególnych przebiegów: `.reports/lighthouse/summary.json`. Katalog jest ignorowany przez Git.

Blokada indeksowania (`noindex`) pozostaje zgodnie z dotychczasową decyzją przed premierą; odpowiada za SEO 66.

## Historia kontroli animacji

Pojedyncze kontrole po dodaniu efektów dawały 100 mobile / 100 desktop. Są to pomiary lokalne z kompresją, a nie kolejna seria trzech przebiegów. Najnowszy audyt nadpisuje `.reports/lighthouse/summary.json`.

## Korekta zgodności z aplikacją

Usunięto pulsowanie kropek sesji i zamianę czasu na „Gotowe” / „Done”. Kod `herdr-space-dots.tsx` jawnie zachowuje nieruchome kropki, a `herdr-threads-list.tsx` pokazuje czas ostatniej aktywności. Replika pozostaje statyczna i zgodna z tym interfejsem. Animację limitów dopasowano do `PacedProgress`: wypełnienie i znacznik tempa poruszają się równocześnie przez 500 ms. Komendę terminala i pola JSON potwierdzono w kodzie CLI.

Test `tests/details.js` sprawdza brak wymyślonych kontrolek i animacji sesji oraz przejścia motywu, anulowanie szybkich zmian, ograniczony ruch i hover na dotyku.

## Informacje o wydaniu i pierwszy start

Po dodaniu danych wydania, wymagań, instrukcji i wiersza zaufania: kontrolny pojedynczy audyt lokalny z kompresją **100 mobile / 100 desktop**, LCP **1,40 s / 0,65 s**. Metadane korzystają z dotychczasowego żądania manifestu; wymagania, instrukcja i komunikaty zaufania są renderowane podczas buildu. Testy potwierdzają PL/EN, brak dodatkowego pobrania manifestu, zmianę danych po aktualizacji manifestu, niepoprawne metadane, brak manifestu, klawiaturę, szerokości 360–1440 px i treść bez JS.
