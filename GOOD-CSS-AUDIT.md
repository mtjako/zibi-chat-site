# Audyt stylów według good-css

Data: 2026-10-12 · Zakres: `styles.css` (225 linii), `index.html` (atrybuty `style`, struktura wrapperów), powiązania w `preferences.js` i `script.js`. `tools/capture/og.html` to wewnętrzny render Chromium dla obrazka OG, więc tylko go odnotowuję. Nie zmieniono żadnego pliku poza utworzeniem tego raportu.

## Założenia i metoda

- **Przeglądarki (potwierdzone 2026-10-12):** ostatnie 2 wersje Chrome i Firefox oraz **Safari/iOS 17.5+**. Ten próg rozstrzyga o wsparciu w każdym wierszu. Pierwsza wersja raportu zakładała iOS 16. Punkty, które zmieniły się po podniesieniu progu, są oznaczone „(próg 17.5)”.
- **Numery linii:** linie 1–4 oraz 10–11 w `styles.css` są zminifikowane i zawierają po kilkadziesiąt reguł. Przy nich podaję `styles.css:N` razem z selektorem.
- **Weryfikacja:** podejrzenia o martwy kod i skoki rozmiarów sprawdziłem na stylach obliczonych w Safari 27.0.1 (lokalny `http.server`, szerokości 1024, 761, 760, 700 i 520 px, motyw ciemny z ustawień systemu). Pozostałe ustalenia wynikają z lektury kodu i reguł kaskady.
- **Legenda pewności:** ✅ sprawdzone · ⚠️ przypuszczenie, niezweryfikowane · ❓ nie wiem, podaję jak to sprawdzić.

---

## Krok 0 (poza skillem, ale zmienia plan): martwy kod przycisków

Każdy `.button` w `index.html` ma też klasę `.download-cta` albo `.download-link` (5 elementów). Reguły `.download-*` stoją później w pliku i mają tę samą lub wyższą specyficzność, więc nadpisują większość starszych reguł. ✅ Potwierdzone w Safari 27: obliczone `padding`, `border-radius`, `font-size`, `font-weight`, `gap`, `background`, `box-shadow`, `transition` i `transform` pochodzą wyłącznie z reguł `.download-*` (przy 1024 i 520 px).

| Miejsce | Martwe deklaracje | Co je nadpisuje |
| --- | --- | --- |
| `styles.css:1` `.button` | `padding`, `border-radius`, `font-size`, `font-weight`, `gap`, `transition`, `border` (żywe są tylko `display`, `justify-content`, `align-items`) | `styles.css:25–39`, `:42` |
| `styles.css:1` `.button:hover` | całość | `styles.css:43–50` |
| `styles.css:1` `.dark`, `.dark:hover`, `.small`, `.light` | całość | `styles.css:10`, potem `:25–51` |
| `styles.css:10` `.dark`, `.dark:hover`, `.light` | całość | `styles.css:25–51` |
| `styles.css:4` (@520) `.button`, `.small` | całość | `styles.css:25–39`, `:42` |
| `styles.css:14` `.hero-actions>.button{padding:14px}` | całość (obliczone `8px 12px`) | `styles.css:42` (ta sama specyficzność, później w pliku) |
| `styles.css:19` `width/height:22px`, `:20–22` zmienne `--button-icon-cutout` | całość poza `display` i `flex` w `:19` | `styles.css:40`, `:41`, `:51` |
| `styles.css:3` (@760) `.nav-links{gap;font-size}`, `.nav-links a:nth-child(2)` | całość | `styles.css:13` ukrywa całe `.nav-links` przy tym samym progu |
| `styles.css:4` (@520) `.nav-links{display:none}` | duplikat | `styles.css:13` |
| `styles.css:3` (@760) `.showcase{margin-top:35px}` | duplikat | `styles.css:13` |
| `styles.css:1` `.showcase{max-width:950px}` | wartość | `styles.css:10` (`1000px`) |
| `styles.css:1` `.menubar-section{background:#e5e5e5;border-block:… #e5e5e5}` | kolory | `styles.css:10` |
| `styles.css:2` `.download-inner{background:…}` | duplikat 1:1 | `styles.css:10` |
| `styles.css:1` `.platform-note{color:#737373}`, `:2` `.footer p,.footer>span{color:#737373}` | kolor | `styles.css:10` (`var(--muted)`) |
| `styles.css:8–9` tokeny `--button`, `--button-text` | używane tylko w martwych regułach | — |

**Propozycja:** usunąć to przed resztą prac, bo inaczej punkty 1.1, 1.4 i 2.2 obejmą kod, który nic nie robi. **Ryzyko regresji: niskie** ✅ dla ciemnego motywu przy 1024 i 520 px. ⚠️ Jasnego motywu nie sprawdzałem w przeglądarce, ale reguły zależne od motywu, które tu grają rolę, to `:root[data-theme=dark] .download-*`, więc kaskada w jasnym motywie jest prostsza. Przed usunięciem warto porównać zrzuty obu motywów.

---

## Grupa 1. Szybkie i bezpieczne

### 1.1 `:hover` poza `@media (hover: hover) and (pointer: fine)`

Zasada: *Hover styles only where hover exists* (`interaction.md`). Na ekranie dotykowym stan hover zostaje „przyklejony” po stuknięciu.

| Miejsce | Reguła |
| --- | --- |
| `styles.css:1` | `.nav-links a:hover` (oraz martwe `.button:hover`, `.dark:hover`) |
| `styles.css:22`, `:51` | `.download-link.dark:hover`, `.download-link.light:hover` (zmienna ikony) |
| `styles.css:43–50` | `.download-link:hover, .download-cta:hover` (tło, `translateY(-1px)`, cień) |
| `styles.css:56–59` | `:root[data-theme=dark] … :hover` (cień) |
| `styles.css:73` | `.segmented label:hover span` |
| `styles.css:189–190` | `.nav-actions .download-cta:hover` |
| `styles.css:214` | `.linux-menu-item:hover, .linux-menu-item:focus-visible` (wspólna reguła, patrz 1.2) |

- **Zmiana:** każdą regułę owinąć w zapytanie **w tym samym miejscu pliku**. Kolejność źródłowa decyduje tu o wyniku: `:43` jest nadpisywane przez `:189`, a `:51` przez `:43`. `:214` trzeba rozdzielić na część hover (w zapytaniu) i część `:focus-visible` (poza nim).
- **Ryzyko:** niskie ✅. Zapytanie nie zmienia specyficzności. ⚠️ Laptop dotykowy, którego głównym wskaźnikiem jest ekran (`pointer: coarse`), straci hover nawet przy podłączonej myszy. Tak działa ta technika i skill to akceptuje.
- **Wsparcie:** ✅ Safari 9, Chrome 38, Firefox 64.

### 1.2 `outline: none` na pozycjach menu Linuksa

Zasada: *Never write `outline: none`* (`SKILL.md`, `interaction.md`). `styles.css:214`: `.linux-menu-item:focus-visible{background:var(--soft);outline:none}`. Fokus oznacza tylko tło `--soft`, które w trybie forced-colors (Windows High Contrast) znika.

- **Zmiana:** zostawić tło i dodać pierścień wewnątrz pozycji, żeby nie wychodził na sąsiednie pozycje: `.linux-menu-item:focus-visible{background:var(--soft);outline:2px solid var(--accent);outline-offset:-2px}`. Selektor `(0,2,0)` wygrywa z globalnym `a:focus-visible` `(0,1,1)` ze `styles.css:1`, więc offset 5 px nie zadziała.
- **Ryzyko:** niskie. W menu pojawi się widoczny pierścień, i o to chodzi.
- **Wsparcie:** ✅ `:focus-visible` od Safari 15.4.

### 1.3 Brak stanu `:active` na elementach do naciśnięcia

Zasada: *Give everything pressable an `:active` state* oraz *Press feedback*. `styles.css:1` ustawia `-webkit-tap-highlight-color:transparent` na `button, a, summary`, więc na iOS stuknięcie w te elementy bez własnego `:active` nie daje żadnej natychmiastowej reakcji.

| Element | Miejsce | Propozycja |
| --- | --- | --- |
| `.faq-list summary` | `styles.css:2` | `:active{color:var(--muted)}` (skala na elemencie pełnej szerokości wygląda źle) |
| `.linux-menu-item` | `styles.css:212` | `:active{background:var(--soft)}` |
| `.nav-links a`, `.brand` | `styles.css:1` | `:active{color:var(--accent)}` / `opacity` |
| `.segmented label` | `styles.css:69` | `:active span{scale:.95}`, z przejściem w `prefers-reduced-motion: no-preference` |
| `.skip-link` | `styles.css:2` | opcjonalnie, element prawie nigdy nie jest stukany |

Przyciski `.download-*` już mają `:active` (`styles.css:60–61`, `:191`) ✅.

- **Ryzyko:** niskie. Zmiana widoczna tylko w trakcie naciskania.
- **Wsparcie:** ✅ wszędzie. `scale` jako osobna właściwość działa od Safari 14.1.

### 1.4 Ruch poza `prefers-reduced-motion: no-preference` i globalny wyłącznik

Zasada: *Opt-in motion* (`motion.md`): „Do not strip motion afterwards with a global rule”. `styles.css:5–7` ma `@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{transition:none!important;animation:none!important}}`.

Wszystkie przejścia w pliku (animacji ani `@keyframes` nie ma, ✅ sprawdzone grepem):

| Miejsce | Przejście | Ruch? |
| --- | --- | --- |
| `styles.css:1` `.button` | `transform .2s, background .2s` | tak (martwe, Krok 0) |
| `styles.css:2` `.faq-list summary>span` | `transform .2s` (obrót plusa o 45°) | tak |
| `styles.css:38` `.download-link, .download-cta` | `background, box-shadow, transform .18s` | częściowo |
| `styles.css:71` `.segmented span` | `background, color, box-shadow .15s` | nie, to zanikanie koloru |
| `styles.css:207` `.linux-chevron` | `transform .18s` | tak |
| `styles.css:1` `html` | `scroll-behavior:smooth` | tak |

- **Zmiana:** rozdzielić przejścia. Kolor, tło i cień zostają poza zapytaniem, a `transform` trafia do `@media (prefers-reduced-motion: no-preference)`. To samo z `scroll-behavior: smooth`, przy czym `scroll-padding` zostaje poza zapytaniem. Potem usunąć wyłącznik `styles.css:5–7`. Opcjonalnie dodać tokeny `--ease-out` (*Motion tokens*). Dziś nie ma jawnego easingu, więc działa domyślne `ease`, a nie zakazane `ease-in` ✅. Czasy 150–200 ms mieszczą się w limitach ✅.
- **Ryzyko:** niskie. Osoby z „ogranicz ruch” odzyskają zanikanie kolorów, które skill dopuszcza. ⚠️ Po usunięciu wyłącznika nowe przejścia nie będą już automatycznie wycinane i trzeba będzie o tym pamiętać. ⚠️ Przesunięcia 1 px przy hover i `:active` dalej zachodzą, tylko natychmiast. Tak opisuje to skill („build the state change first”). Jeśli mają zniknąć całkiem, sam `transform` też trzeba przenieść do zapytania.
- **Wsparcie:** ✅ Safari 10.1.

### 1.5 `overflow: hidden` tam, gdzie nic nie jest przewijane skryptem

Zasada: *`overflow: clip` over `hidden`* (`layout.md`).

| Miejsce | Propozycja | Uwagi |
| --- | --- | --- |
| `styles.css:10` `.screenshot-frame` | `clip` | przycina zrzut do zaokrąglenia ramki |
| `styles.css:137` `.app-limit-track` | `clip` | |
| `styles.css:2` `.download-inner` | **usunąć `overflow`** (decyzja 2026-10-12) | Nikt nie zna powodu tej deklaracji. Tło i gradient i tak respektują `border-radius`. W środku jest absolutne menu Linuksa otwierane w górę. ✅ Dziś się mieści (zapas 27 px przy 700 px, 55 px przy 520 px), ale z `hidden` czy `clip` krótsza treść nad przyciskami albo dłuższe menu zostałyby ucięte. Po usunięciu porównać zrzuty sekcji pobierania w obu motywach. |
| `styles.css:116`, `:120`, `:134` (obcinanie tekstu z `text-overflow: ellipsis`) | **zostawić `hidden`** | Skill potwierdza wielokropek przy `clip` tylko dla Chrome 150 i Safari 27. ❓ Safari 17.5 i Firefox są nieprzetestowane, a `hidden` to forma zalecana jako zapasowa. |
| `tools/capture/og.html:5`, `:14` | bez zmian | wewnętrzny render Chromium |

- **Ryzyko:** niskie.
- **Wsparcie:** `overflow: clip` od Safari 16 ✅. ⚠️ Nie sprawdzałem, czy Safari 17.5 przycina przy `clip` do zaokrąglonych rogów tak samo jak przy `hidden`. Safari 27 robi to poprawnie. Warto zrobić jeden zrzut `.screenshot-frame` w symulatorze iOS 17.5.

### 1.6 Za mały obszar dotyku przełączników języka i motywu

Zasada: *Hit area larger than the visual*. `styles.css:71` `.segmented span{height:30px}` i `styles.css:76` (@520) `height:26px`. Na telefonie to jedyne kontrolki w nagłówku i mają poniżej 44 px.

- **Zmiana:** `.segmented label::after{content:"";position:absolute;inset-block:min(0px, (100% - 44px) / 2)}`. Rozszerzam tylko w pionie: segmenty dzieli przerwa 2 px, więc rozszerzenie w poziomie sprawiłoby, że obszary nakładałyby się na siebie i wygrywałby zawsze późniejszy segment. `label` ma już `position:relative` (`styles.css:69`). Kliknięcie w `::after` etykiety zaznacza powiązany `input` ✅. Pseudoelementu nie da się dodać do `input`, ale skill przewiduje taki przypadek przez opakowanie w `label`.
- **Ryzyko:** niskie, bo zmiana jest niewidoczna. ⚠️ Obszar wyjdzie poza pigułkę `.nav` (wysoką na 56–60 px). Mieści się jednak w niej z zapasem, więc nie powinien zachodzić na treść.
- **Wsparcie:** ✅ `inset-block` od Safari 14.1, `min()` od 11.1.

### 1.7 Offset kotwic na sztywno, bez związku z wysokością nagłówka

Zasada: *Anchor targets that clear a sticky header*: „Tie the value to the header's height. Share one custom property”. `styles.css:1` ma `html{scroll-padding-top:100px}` i `.showcase{scroll-margin-top:110px}`, a nagłówek to `padding-top:10px` + `.nav{height:60px}` (56 px przy ≤760).

- **Zmiana:** `--header-offset` liczone z wysokości paska i odstępu, używane w `scroll-padding-block-start` i w `scroll-margin-block-start`.
- **Ryzyko:** niskie, o ile wartości końcowe zostaną takie same.
- **Wsparcie:** ✅ Safari 14.1.

### 1.8 Niekoncentryczne zaokrąglenia w menu Linuksa

Zasada: *Concentric nested radius*. `styles.css:209` `.linux-menu` ma `border-radius:10px` i `padding:6px`, a `styles.css:212` `.linux-menu-item` ma `border-radius:6px`. Zgodnie z regułą zewnętrzny promień to `calc(6px + 6px) = 12px`.

- **Ryzyko:** niskie (+2 px promienia). **Wsparcie:** ✅ wszędzie.

### 1.9 (opcjonalnie) Animowana wysokość akordeonu FAQ

Zasada: *Accordion that animates its height* („Use it for FAQs”). FAQ to natywne `<details>` (`index.html:110`) ✅, a znacznik jest już ukryty zgodnie z regułą (`styles.css:2`) ✅.

- **Zmiana:** `details::details-content{height:0;overflow:clip}`, `[open]` → `height:auto`, `interpolate-size: allow-keywords` na `:root`, a przejście w `no-preference`. Marginesy `p` w środku są w porządku. Na `::details-content` nie może być paddingu.
- **Ryzyko:** niskie. Bez wsparcia akordeon działa jak dziś.
- **Wsparcie:** animacja tylko w Chrome (`interpolate-size`, Chrome 129). Safari 18.4+ i Firefox 143+ otwierają bez animacji. Safari/iOS 17.5 – 18.3 ignoruje regułę. To ulepszenie progresywne, bez fallbacku.

---

## Grupa 2. Mechaniczne, ale szerokie

### 2.1 Właściwości fizyczne zamiast logicznych

Zasada: *Logical properties* (`SKILL.md`, `foundations.md`). Strona jest LTR (pl i en) i ma poziomy tryb pisania, więc wynik obliczony jest identyczny.

| Właściwość | Miejsca |
| --- | --- |
| `margin-top` / `margin-bottom` | `styles.css:1` (`h1,h2,h3,p`, `.hero-copy`, `.platform-note`, `.integrations>p`, `.section-heading`), `:2` (`.faq-list p`, `.download-buttons`), `:10` (`.showcase`), `:79`, `:90`, `:92`, `:96`, `:101`, `:219` |
| `margin-left` | `styles.css:1` (`.brand>span`, `.platform-note span`), `:143`, `:194` |
| `padding-top` / `padding-bottom` | `styles.css:1` (`.header`, `.hero`), `:2` (`.faq-list details:first-child summary`, `.download-section`), `:3` (`.hero` @1500, @760), `:4` (`.download-section`), `:161`, `:162`, `:219` |
| skróty 3-wartościowe (fizyczne) | `styles.css:1` (`.hero h1` `26px 0 22px`, `.showcase` `49px auto 0`, `.integrations` `42px 0 53px`), `:2` (`.download-inner`, `.download-icon`, `.download-inner h2`, `.download-note`, `.footer`), `:4` (`.download-inner`), `:176`, `:177`, `:211` → `margin-block` + `margin-inline` |
| `border-top` / `border-bottom` | `styles.css:1` (`.integrations`), `:2` (`.faq-list details`, `.footer`), `:133` |
| `top` / `left` / `right` / `bottom` | `styles.css:1` (`.header`, `.marked svg`), `:2` (`.skip-link`, `.skip-link:focus`), `:10` (`.marked svg`), `:139` (`.app-limit-pace`), `:209` (`.linux-menu`), `:216` (`left:0;right:0` → `inset-inline:0`) |
| `scroll-padding-top`, `scroll-margin-top` | `styles.css:1` |
| `text-align:left` | `styles.css:4` (`.agent-logos`), `:209` → `start` |

- **Zmiana:** zamiana 1:1. Symetryczne skróty dwuwartościowe (`padding:21px 0`, `padding:0 9px`) są niezależne od kierunku i można je zostawić. Skill zakazuje tylko skrótów czterowartościowych. `width`/`height` → `inline-size`/`block-size` jest opcjonalne, bo skill wymaga tylko zamiany top/right/bottom/left.
- ⚠️ `styles.css:139` (`left:var(--pace)` + `translate(-50%,-50%)`) w RTL wymagałby też odwrócenia znaku w `translate`. Dziś to bez znaczenia.
- ✅ Częściowa migracja jest bezpieczna. Właściwości logiczne i fizyczne mapujące na to samo pole biorą udział w jednej kaskadzie i wygrywa późniejsza deklaracja, więc wystarczy zachować kolejność.
- **Ryzyko:** niskie. **Wsparcie:** ✅ Safari 14.1, Chrome 87, Firefox 66.

### 2.2 Kolory w hex i `rgb()` zamiast `oklch()` i `color-mix()`

Zasada: *OKLCH color* (`foundations.md`). Szarości, biel i czerń z odcieniem `none`, a pochodne (hover, tinta, przezroczystość) przez `color-mix(in oklch, …)`.

**Pochodne, które dziś są osobnym hexem albo `rgb(…/x%)`, czyli najwięcej zysku:**

| Miejsce | Dziś | Proponowane źródło |
| --- | --- | --- |
| `styles.css:188–191` | `#0071e3` / hover `#0077ed` / active `#006edb` | `--cta` + `color-mix(in oklch, var(--cta), white X%)` / `black X%` |
| `styles.css:28`, `:46`, `:61` | `#e5e5e5` / hover `#f5f5f5` / active `#d4d4d4` (+ te same wartości w `--button-icon-cutout`, `:27`, `:45`, `:51`, `:61`) | jeden token tła przycisku + `color-mix` |
| `styles.css:8`, `:9` | `--header: rgb(255 255 255/72%)` / `rgb(37 37 37/72%)` | `color-mix(in oklch, var(--paper) 72%, transparent)` / `var(--surface) 72%` |
| `styles.css:127`, `:130` | `--app-track`, `--app-divider` jako `rgb(229 229 229/70%)` / `60%` | `color-mix(in oklch, var(--app-border) 70%, transparent)`. To dosłownie semantyka `bg-border/70` z komentarza. |
| `styles.css:147`, `:148` | `--app-grid` 50% / 5% | jw. |
| `styles.css:9`, `:99` | `--line` i `--app-border` w ciemnym motywie `rgb(255 255 255/10%)` | `oklch(1 0 none / 10%)` |

**Konwersja 1:1 (bez zmiany wyglądu):** tokeny `styles.css:1`, `:8–9`, `:66–67`, `:84–85`, `:98–99`, `:101–102` (Catppuccin), `:127`, `:130`; hexy w regułach `styles.css:2` (`#d4d4d4`, `#e5e5e5`, cienie), `:10–11` (gradient `download-inner`, cienie), `:37`, `:49`, `:54`, `:58`, `:74`, `:154–155`, `:183–184`, `:209`. Cienie `#000000xx` / `#171717xx` zamienić na `oklch(0 0 none / N%)` / `oklch(… none / N%)`.

- **Fallback (próg 17.5):** `color-mix()` działa od Safari 16.2, więc ✅ fallbacku i bloku `@supports` nie trzeba. (Przy niższym progu trzeba by pamiętać, że podwójna deklaracja nie działa wewnątrz custom property, bo token staje się „invalid at computed-value time”).
- **Tokeny `.app-*` (sprawdzone w `zibi-chat/src/style.css`, tylko odczyt):** ✅ źródło jest mieszane. Większość tokenów jest zapisana w `oklch` z hue `0`, np. `--foreground: oklch(0.145 0 0)` (`:128`), `--muted-foreground: oklch(0.556 0 0)` (`:138`), `--border: oklch(0.922 0 0)` (`:142`), w ciemnym motywie `--border: oklch(1 0 0 / 10%)` (`:209`), a także `--chart-2` (`:146`, `:213`). `--background` (`#ffffff` / `#1e1e1e`, `:127`, `:194`) i `--card` (`#f7f7f7` / `#252525`, `:129`, `:196`) to hexy.
  - Wartości `oklch` kopiować dosłownie z aplikacji (hexy w `styles.css` to ich przybliżenia), ale **hue `0` zamienić na `none`** (`oklch(0.145 0 none)`). Skill wskazuje, że hue `0` to czerwień, która przy `color-mix` ściąga wynik w jej stronę. Na samym kolorze zmiana nic nie daje, bo chroma wynosi 0.
  - Hexy `--background`/`--card` przekonwertować 1:1.
  - Akcent `#007aff` (`styles.css:127`) to wartość zmierzona ze zrzutów aplikacji (komentarz `:126`), a nie token, więc też konwersja 1:1.
- ⚠️ `script.js:85` ustawia `meta[name=theme-color]` na `#1e1e1e`/`#ffffff`. To kopia tokenu `--paper`. Przy migracji zostawić tam hex. ❓ Nie wiem, czy wszystkie przeglądarki przyjmują `oklch()` w `theme-color`.
- **Ryzyko:** konwersja 1:1 jest **niska** (przy 4 miejscach po przecinku różnica nie przekracza 1/255 na kanał). Pochodne z `color-mix` to ryzyko **średnie**: wynik będzie trochę inny niż ręcznie dobrany hex, więc odcień trzeba dopasować na oko.
- **Wsparcie:** `oklch()` od Safari 15.4 ✅. `color-mix()` od Safari 16.2 ✅ (próg 17.5).

### 2.3 Dwa zestawy tokenów zamiast `light-dark()` (odblokowane przy progu 17.5)

Zasada: *One set of color tokens for light and dark*. Dziś ciemny motyw to redefinicje w `:root[data-theme=dark]` (`styles.css:9`, `:67`, `:85`, `:99`, `:102`, `:130`, `:148`) oraz nadpisania reguł (`:11`, `:52–59`, `:91`, `:184`, `:188–190`).

- **Zmiana:** każdy token w jednym miejscu jako `light-dark(jasny, ciemny)` w `:root` z `color-scheme: light dark`. `[data-theme=light|dark]` ustawia tylko `color-scheme`. Skrypty (`preferences.js:10`, `script.js:84`) mogą dalej ustawiać `data-theme`, bo wystarczą dwie reguły CSS mapujące ten atrybut na `color-scheme`. Nadpisania reguł zależne od motywu, które nie są kolorem (np. `:root[data-theme=dark] .agent-logos img{filter:invert(1)}`, `styles.css:11`), zostają osobnymi regułami, bo `light-dark()` przyjmuje tylko kolory. Dotyczy to też cieni z kolorami. Te można zapisać jako `box-shadow: … light-dark(a, b)`.
- **Uwaga:** `meta[name=theme-color]` dalej ustawia `script.js:85` i to się nie zmienia.
- **Wsparcie:** ✅ `light-dark()` od Safari 17.5, Chrome 123, Firefox 120 (dokładnie na progu, bez zapasu).
- **Ryzyko:** wysokie, bo dotyka wszystkich kolorów w obu motywach. Wdrażać **po** 2.2 (oklch), w osobnym kroku, z porównaniem zrzutów obu motywów.

### 2.4 Ikony w `px` zamiast rozmiaru zależnego od tekstu

Zasada: *Icon sized by the text beside it* (`text-and-media.md`): „Never size an icon in px”.

| Miejsce | Dziś |
| --- | --- |
| `styles.css:40`, `:63`, `:167` | ikony w przyciskach 16 px (przy `font-size` 12 i 14 px) |
| `styles.css:72` | `.segmented svg` 14 px |
| `styles.css:103` | `.app-threads svg` 12 px |
| `styles.css:166`, `:168` | `.bento-icon svg`, plus w FAQ 18 px |
| `styles.css:224–225` | `.agent-logo` 25 px → 21 px przez breakpoint 520 |

- **Zmiana:** `block-size: Ncap; inline-size: auto; flex: none`. Przy `align-items: center` (wszystkie te miejsca) mnożnik trzeba dobrać, bo `1cap` dla 12 px to około 8,5 px, a dziś ikona ma 16 px. Logotypy w `.agent-logos` liczone w `em` (25/15 ≈ 1,67em; 21/12 = 1,75em) usuwają breakpoint `:225`.
- **Wsparcie:** ✅ `cap` od Safari 17.2, `lh` od 16.4 (próg 17.5). Fallback w `px` nie jest potrzebny.
- **Ryzyko:** średnie, bo rozmiary ikon zmienią się o 1–2 px. Przy logotypach `em` (wsparcie wszędzie) ryzyko jest niskie.

---

## Grupa 3. Zmiany layoutu

### 3.1 Drabinka rozmiaru nagłówka hero: **potwierdzony skok w górę przy zwężaniu**

Zasada: *Fluid sizes with `clamp()`*: preferowana wartość jako `rem + vw`, nigdy samo `vw`, granice w `rem`, wartość w tokenie, bez drabinki breakpointów.

`.hero h1`: `styles.css:1` `clamp(46px,6.2vw,76px)` → `:3` (@760) `57px` → `:4` (@520) `46px` → `:14` (@520) `clamp(37px,10.5vw,46px)`. ✅ Zmierzone w Safari 27:

| Szerokość | `font-size` |
| --- | --- |
| 761 px | 47,18 px |
| 760 px | **57 px** (o 10 px **więcej** na węższym ekranie) |
| 520 px | 46 px |

Do tego `letter-spacing` w px (-4 / -2,5 / -2,3) ma osobne progi.

- **Zmiana:** jeden token, np. `clamp(2.3125rem, 1.3rem + 4.5vw, 4.75rem)`. Wyliczony z punktów (360 px → 37 px, 1226 px → 76 px), czyli z obecnych skrajnych wartości. Stosunek 76/37 = 2,05 ≤ 2,5 spełnia regułę WCAG 1.4.4 ze skilla. Odstępy liter jako jedno `letter-spacing:-0.05em`. Usuwa `:3`, `:4` i `:14` dla `h1`. Wartości kontrolne z tej formuły: 760 px → 55 px (dziś 57), 520 px → 44 px (dziś 46), 1024 px → 66,9 px (dziś 63,5).
- **Ryzyko:** średnie, bo to najbardziej widoczny element strony i rozmiary zmienią się o 2–3 px.
- **Wsparcie:** ✅ `clamp()` od Safari 13.1.

### 3.2 Pozostałe drabinki rozmiarów i odstępów → tokeny płynne lub jedna skala

Zasady: *Fluid sizes with `clamp()`* i *One fluid scale for type and space* (więcej niż 2–3 rozmiary).

| Wartość | Progi (miejsca) |
| --- | --- |
| `h2` | `clamp(34px,4vw,46px)`, samo `vw` (`styles.css:1`). Do ~850 px zawsze 34 px. |
| `.section` padding | 95 → 64 (`:1`, `:3`) |
| `.features` padding-top | 128 → 88 (`:161`, `:162`) |
| `.menubar-section` | 76 → 55 (`:1`, `:3`) |
| `.integrations` | 42/53 → 35 (`:1`, `:3`) |
| `.hero` padding-top | 66 → 78 @1500 → 46 @760 (`:1`, `:3`) |
| `.download-inner`, `.download-section`, `.footer` | `:2` → `:4` |
| `.bento-card` padding | 26 → 22 (`:88`, `:158`) |
| `.agent-logos` gap | 43 → 26 @1050 → 22/28 @760 → 23/15 @520 (`:1`, `:3`, `:4`) |
| font-size: `.hero-copy` 17/15/14, `.integrations>p` 22/19 (`:79`, `:81`), `.brand` 23/21, `.agent-logos>span` 15/13/12, `.download-inner>p` 14/13, `.platform-note` 10/9, `.footer>span` 11/10, `.segmented span` 30/26 (wysokość, `:71`, `:76`) | `:1`–`:4`, `:71–81` |
| `.faq-list summary` | **14 → 13 @760 → 14 @520** (`:2`, `:3`, `:4`). ✅ Zmierzone: 14 / 13 / 14 px. **Decyzja 2026-10-12: to pozostałość, ujednolicić.** Usunąć `:3` i `:4` dla `summary` i zostawić jeden rozmiar albo token płynny. Ryzyko niskie. |

- **Zmiana:** zestaw tokenów (`--space-section`, `--text-lead` …) albo skala `--step-*` z `foundations.md`. Wszystkie granice w `rem`, bo dziś cała strona jest w `px`, więc ustawienie domyślnego rozmiaru czcionki w przeglądarce nie ma wpływu.
- **Ryzyko:** średnie do wysokiego, bo zmieniają się prawie wszystkie odstępy pionowe. Wymaga porównania zrzutów przy 360, 520, 760, 1024 i 1440 px.
- **Wsparcie:** ✅ `clamp()` od Safari 13.1. Skala z `pow()` od Safari 15.4, Firefox 118.

### 3.3 `.wrap` jako wycentrowany wrapper → content grid

Zasada: *Content grid with breakouts* (`layout.md`): „A centered `max-width` wrapper is the sign … replace each centered max-width wrapper with the grid”.

- Wrapper: `styles.css:1` `.wrap{width:min(1120px,calc(100% - 64px));margin-inline:auto}` + `:3` (@760) `calc(100% - 36px)`.
- Użycia: `index.html:31` (`.nav.wrap`), `:48`, `:58`, `:106` (para `section > .wrap`, którą skill wskazuje wprost), `:110`, `:111`, `:113`, `:114`.
- Zagnieżdżone limity szerokości: `styles.css:1` `.faq-section{grid-template-columns:minmax(0,760px);justify-content:center}`, `:10` `.showcase{max-width:1000px}`, `:176` `.menubar-heading{max-width:560px}`, `:179` `.environments-frame{max-width:1000px}`.

- **Zmiana:** siatka z `--content:1120px` i płynnym `--gutter` (np. `clamp(1.125rem, …, 2rem)`), co usuwa próg 760 dla `.wrap`. `.menubar-section` dostaje siatkę bezpośrednio, a wewnętrzny `div.wrap` znika (`index.html:106`). `.faq-section` dostaje `--content:760px` zamiast własnej kolumny. Figury o szerokości 1000 px mogą zostać dziećmi z `max-width`: to nie wrapper, a węższa treść.
- **Pułapki:**
  - `.nav` jest już siatką trzykolumnową (`styles.css:1`, `:194–196`), więc nie może być jednocześnie content gridem. Siatkę trzeba założyć na `.header`, a `.nav` zrobić jej dzieckiem.
  - ✅ `preferences.js:15–19` (`SHOT_SIZES`) odtwarza obliczenia `.wrap` w atrybucie `sizes` (`100vw - 36px` / `100vw - 64px` / `1000px`). Każda zmiana marginesu bocznego wymaga zmiany tam. Inaczej przeglądarka dobierze trochę nietrafiony wariant WebP (800w/2200w). Layout się nie rozjedzie, ale ucierpi jakość lub wydajność.
  - Każde bezpośrednie dziecko sekcji musi mieć `grid-column`. Reguła `> * { grid-column: content }` to załatwia, ale komentarze HTML i tekst luzem nie mogą być bezpośrednimi dziećmi. ⚠️ W `index.html:56` komentarz stoi wewnątrz `.integrations`, a nie bezpośrednio w sekcji, więc nie przeszkadza.
- **Ryzyko:** wysokie, bo zmienia się geometria pozioma każdej sekcji i przyklejonej nawigacji.
- **Wsparcie:** ✅ nazwane linie siatki i `min()` od Safari 11.1.

### 3.4 Wnętrze kart `.bento-limits` i `.bento-analytics` → „sidebar that wraps”

Zasada: *Sidebar that wraps on its own*. `styles.css:89` ma dwie kolumny (opis i wizualizacja), a `:158` (@640) przełącza je na kolumnę flex.

- **Zmiana:** `display:flex; flex-wrap:wrap; gap`, przy czym opis ma `flex-basis` około 16rem i `flex-grow:1`, a wizualizacja `flex-basis:0; flex-grow:999; min-inline-size:50%`. Karta sama przejdzie do układu pionowego, gdy zabraknie jej miejsca, bez breakpointu.
- **Ryzyko:** średnie. Próg przełączenia przesunie się z „viewport 640 px” na „szerokość karty”. Między 641 a 900 px karta zajmuje dwie kolumny i powinna zostać w układzie poziomym jak dziś (⚠️ niezweryfikowane wizualnie). Proporcje kolumn 1 : 1,15 zastąpi podział z `flex-grow`.
- **Wsparcie:** ✅ `gap` we flexie od Safari 14.1.

**Siatka `.bento`** (`styles.css:86`, `:157`, `:158`): rekomenduję **zostawić**. Nazwane obszary to celowa kompozycja, a *Intrinsic grid* dotyczy równych kafli i tej kompozycji by nie zachował. Zamiana `@media` na `@container` na `.features` dałaby to samo, bo kontener ma szerokość prawie równą viewportowi.

### 3.5 Duplikaty i martwe progi nawigacji

Opisane w Kroku 0 (`styles.css:3`, `:4`, `:12`, `:13`). Po sprzątnięciu zostają trzy sensowne progi: 900 (ukrycie drugiego linku), 760 (ukrycie linków), 520 (ukrycie CTA). Rekomenduję **zostawić je jako `@media`**. Kontener nagłówka ma szerokość viewportu, więc container query nic tu nie zmieni. `.nav{height:60px}` / 56 px (`:1`, `:3`) → `min-block-size` (reguła z *Push one item away*: „Write `min-block-size`, never `block-size`”).

- **Ryzyko:** niskie. **Wsparcie:** ✅.

### 3.6 Logotypy integracji

`styles.css:1`, `:3`, `:4`: flex z `gap` zmienianym na trzech progach, a przy ≤520 przejście na siatkę 2×2 z `max-width:320px`.

- **Zmiana:** `gap` jako `clamp()` usuwa progi 1050 i 760. Przełącznik 2×2 przy 520 zostaje. Inteligentna siatka (`auto-fit`) mogłaby dać układ 3+1, a dziś są tylko 4 albo 2×2.
- **Ryzyko:** średnie. **Wsparcie:** ✅.

### 3.7 Odstępy sekcji zależne od sąsiada

Zasada: *Section spacing that depends on its neighbors*. `styles.css:160–162`: komentarz mówi wprost, że `.features{padding-top:128px}` wynika z tego, że sekcja następuje po hero.

- **Zmiana:** `.hero + .features { padding-block-start: … }`, a `.features` dostaje domyślny padding `.section`.
- **Ryzyko:** niskie, wygląd się nie zmienia. **Wsparcie:** ✅ kombinator `+` wszędzie.

### 3.8 Odstępy między rodzeństwem ustawiane przez rodzica

Zasada: *Space between siblings set by the parent*. Marginesy dzieci zamiast `gap` lub `flow-space`:

- hero: `styles.css:1` (`.hero h1` margin, `.hero-copy` mb, `.platform-note` mt, `.showcase` mt), `:13`
- `.bento-copy`: `styles.css:90`, `:92`
- `.download-inner`: `styles.css:2` (`.download-icon`, `h2`, `.download-buttons`, `.download-note`)
- `.menubar-heading`: `styles.css:177`

- **Zmiana:** kolumna flex z `gap` tam, gdzie znamy dzieci (wszędzie tutaj). Uwaga na regułę skilla: dziecko, które jest linkiem lub przyciskiem, w kolumnie flex rozciąga się na całą szerokość, więc potrzebuje `align-self:start`/`center`. Dotyczy np. `.hero-actions`, które jest jednak `div`em z własnym flexem.
- **Ryzyko:** średnie. Odstępy się różnią (np. h1 26/22, copy 27, note 15, figura 49 px), więc trzeba użyć `--flow-space` na poszczególnych dzieciach albo kilku wartości `gap`. Do tego `p` ma domyślny dolny margines `1em` z arkusza przeglądarki, bo `styles.css:1` zeruje tylko `margin-top`.
- **Wsparcie:** ✅.

### 3.9 Ręczne `<br>` i ukrywanie ich na progach → `text-wrap: balance`

Zasada: reset w `foundations.md` (`h1, h2, h3, h4 { text-wrap: balance; }`). `index.html:49`, `:50`, `:59`, `:107`, `:110`, `:111` mają ręczne `<br>`, a `styles.css:4` je ukrywa (`.desktop-break`, `.faq-section h2 br`).

- **Zmiana:** `text-wrap: balance` na nagłówkach. `<br>` usuwać tylko tam, gdzie służą wyłącznie wyrównaniu. Część z nich (np. „Ty tworzysz.<br>Zibi ogarnia…”) jest celowym podziałem treści i zostaje.
- **Wsparcie:** ✅ `balance` od Safari 17.5, Chrome 114, Firefox 121 (próg 17.5, dokładnie na granicy).
- **Ryzyko:** średnie, bo zmienia się łamanie nagłówków w obu językach.

### 3.10 Stopka: `space-between` przy trzech dzieciach

Zasada: *Push one item away with an auto margin* („It replaces … `space-between` on a container with more than two children”). `styles.css:2` `.footer{justify-content:space-between}` z trzema dziećmi (przy ≤760 `p` jest ukryte i zostają dwa).

- **Zmiana:** `margin-inline-start:auto` na elemencie, który ma odsunąć się na koniec. ⚠️ Dziś środkowe `p` siedzi na środku wolnego miejsca, więc trzeba zdecydować, czy ma zostać pośrodku. Jeśli tak, to `space-between` jest tu właściwe i punkt można pominąć.
- **Ryzyko:** niskie. **Wsparcie:** ✅.

---

## Do decyzji projektowej (świadomie nie przypisane do grup)

- **Niekoncentryczne zaokrąglenia w kartach bento.** `styles.css:88` ma promień 16 px przy paddingu 26 px, a wewnątrz są `.bento-visual` 12 px (`:95`) i `.app-limits` 14 px (`:127`). Reguła skilla dałaby zewnętrzny promień `12 + 26 = 38px`, czyli wyraźnie inną estetykę. Ryzyko wysokie. Nie rekomenduję bez decyzji projektanta.

## Techniki pominięte (przez próg przeglądarek albo brak zastosowania)

| Technika | Powód |
| --- | --- |
| `popover` + anchor positioning dla menu Linuksa (`styles.css:205–216`, `script.js:127–155`) | `popover` ✅ od Safari 17, ale ❌ kotwiczenie dopiero od Safari 26. Popover trafia do top layer i traci pozycjonowanie względem przycisku, więc bez kotwic trzeba by go pozycjonować skryptem. To nie jest uproszczenie. Obecny skrypt obsługuje Escape, strzałki i kliknięcie poza menu. |
| `@starting-style`, odsłanianie przez `clip-path` | Skill: „add no motion beyond what an entry or the task calls for” (wsparcie przy progu 17.5 już jest). |
| `justify-content: safe center` | ❌ Safari 17.6, czyli tuż nad progiem. Na stronie i tak nie ma wycentrowanych rzędów, które mogą się przepełnić. |
| `text-box` | Safari 18.2. Przy obecnym, odczuwalnym centrowaniu etykiet zysk jest marginalny. |
| `scrollbar-gutter`, blokada przewijania przez `:has()` | Strona nie ma modala (✅ grep: brak `dialog`). |
| Pełny reset z `foundations.md` | Skill: „add one rule at a time”. `min-width:0` na `*` zmienia już wyrenderowane flexy. Do osobnej, małej iteracji. |
| `overscroll-behavior-y: none` | To strona marketingowa, a nie aplikacja. Odbicie przy przewijaniu nie przeszkadza. |
| Carousel, scroll area, notch, `field-sizing`, `:user-invalid`, klikalna karta, view transitions | Brak takich elementów na stronie (jedna podstrona). |

## Zauważone przy okazji (poza zasadami good-css)

- Teksty o rozmiarze 9–10 px: `styles.css:1` `.platform-note` 10 px, `:4` 9 px, `:2` `.download-note` 10 px, `:4` `.footer>span` 10 px, `:219` `.trademark-note` 10 px. Czytelność na telefonie jest wątpliwa.
- `styles.css:1` `img{object-fit:contain}` globalnie nie ma efektu, dopóki obraz nie ma obu wymiarów albo proporcji. Jest nieszkodliwe, ale mylące.

## Proponowana kolejność

1. Krok 0 (martwy kod) + zrzuty porównawcze obu motywów.
2. Grupa 1 w całości (każdy punkt osobno, wszystkie o niskim ryzyku).
3. 2.1 (właściwości logiczne) razem z 3.5 i 3.7, bo dotykają tych samych linii.
4. 2.2 (oklch, tokeny `.app-*` z aplikacji z hue `none`), potem 2.3 (`light-dark()`) jako osobny krok.
5. 3.1, potem 3.2 (razem z ujednoliceniem FAQ), z porównaniem zrzutów przy 360, 520, 760, 1024 i 1440 px.
6. 3.3 (content grid) razem ze zmianą `SHOT_SIZES` w `preferences.js`.

## Decyzje (2026-10-12)

1. **Próg przeglądarek:** ostatnie 2 wersje Chrome i Firefox, Safari/iOS 17.5+. To odblokowało `light-dark()` (2.3), `cap` bez fallbacku (2.4), `text-wrap: balance` (3.9) i `color-mix()` bez `@supports` (2.2).
2. **FAQ 14 → 13 → 14 px:** to pozostałość, ujednolicić (3.2).
3. **`overflow:hidden` na `.download-inner`:** powód nieznany, usunąć (1.5).
4. **Tokeny w `zibi-chat`:** mieszane. `oklch` z hue `0` dla większości, hex dla `--background` i `--card`. Szczegóły w 2.2.

---

## Status wdrożenia (2026-10-12)

Wdrożone w `styles.css`, `index.html` (klasy `content-grid` zamiast `.wrap`, nota o znakach towarowych w `<footer>`) i `preferences.js` (`SHOT_SIZES`): Krok 0, 1.1–1.9, 2.1–2.4, 3.1–3.9. Pominięte zgodnie z raportem: 3.10 (stopka, `p` ma zostać pośrodku) i „Do decyzji projektowej”.

Odstępstwa od raportu:
- **3.9:** `<br>` w nagłówkach zostały, bo `translations.js` tłumaczy węzły tekstowe osobno i ich połączenie zepsułoby wersję EN. Dodane jest tylko `text-wrap: balance`.
- **3.4:** równe podstawy (13rem / 15,5rem, wzrost 1 : 1,15) zamiast dosłownego wzorca „sidebar”, który przy 901–1010 px zawijałby karty na desktopie.
- **3.3:** siatka na każdej sekcji, a nie na `body`. Element sticky w siatce trzymałby się tylko swojego obszaru.
- Przy okazji naprawione błędy, które były już w oryginale: `:active` niebieskiego CTA w ciemnym motywie przegrywał z hoverem (specyficzność), a wycięcie ikony w `:active` przycisków pobierania miało kolor hovera.

Weryfikacja: zrzuty całych stron (Chromium + WebKit, 7 szerokości, 2 motywy, menu Linuksa) po każdym etapie. Etapy bez zmiany wyglądu (Krok 0 + właściwości logiczne, content grid przy 360/1024/1440 px) dały 0 różnic pikseli. Kolory dały ≤ 4/255. Stany hover, active, focus, reduced motion, dotyk, obszar dotyku i akordeon sprawdzone skryptem. Firefox niesprawdzony (headless Firefox nie startuje w tym środowisku).

Zauważone, poza zakresem: nawigacja wystaje poza pigułkę przy szerokościach ≤ 375 px i 521–575 px (było tak już przed zmianami).
