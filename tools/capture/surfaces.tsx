// Menu-bar tray panel and Dynamic Notch rendered from the real app components with a mocked Tauri
// layer. URL: ?surface=tray|notch|window&lang=pl|en&theme=light|dark (notch geometry: safeTop, safeWidth;
// window: route=/harness-updates).
import {mockIPC, mockWindows} from '@tauri-apps/api/mocks';
import {surfaceInvoke} from './surface-fixture';

const params = new URLSearchParams(location.search);
const surface = params.get('surface');
if (surface !== 'tray' && surface !== 'notch' && surface !== 'window') throw new Error(`surfaces.tsx: unknown ?surface=${surface} (expected tray, notch or window)`);
const WINDOW_ROUTES = ['/harness-updates'];
const route = params.get('route') ?? '/harness-updates';
if (surface === 'window' && !WINDOW_ROUTES.includes(route)) throw new Error(`surfaces.tsx: unsupported ?route=${route}`);

// The mocks must exist before any app module touches @tauri-apps/api, hence the dynamic imports below.
(window as unknown as {isTauri: boolean}).isTauri = true;
mockWindows(surface === 'tray' ? 'tray-panel' : surface === 'notch' ? 'notch-0' : 'main');
mockIPC(surfaceInvoke, {shouldMockEvents: true});
if (surface !== 'window') document.documentElement.classList.add(surface === 'tray' ? 'tray-panel' : 'notch-window');

const [{createRoot}, {ThemeProvider}, {HarnessProvider}, {default: i18n}] = await Promise.all([
  import('react-dom/client'), import('@/components/theme-provider'), import('@/components/harness-provider'), import('@/i18n'),
]);
await import('@/style.css');
await i18n.changeLanguage(params.get('lang') === 'en' ? 'en' : 'pl');
const {default: Surface} = surface === 'tray' ? await import('@/routes/tray-panel') : surface === 'notch' ? await import('@/routes/notch') : await import('@/routes/root-layout');
// Main-window routes are only loaded for surface=window, so tray/notch captures stay unaffected.
const windowRouter = surface === 'window' ? await (async () => {
  const [{default: HarnessUpdates}, {createMemoryRouter}] = await Promise.all([import('@/routes/harness-updates'), import('react-router')]);
  return createMemoryRouter([{element: <Surface/>, children: [{path: '/harness-updates', element: <HarnessUpdates/>}]}], {initialEntries: [route]});
})() : null;
const {RouterProvider} = await import('react-router');
const theme = params.get('theme') === 'dark' ? 'dark' : 'light';
const TRAY_PANEL_WIDTH = 308; // tray.rs: fixed window width in points

// Per-theme storage key: ThemeProvider prefers a stored theme over defaultTheme, so a shared key would leak between runs.
createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme={theme} storageKey={`capture-surface-theme-${theme}`}>
    <HarnessProvider storageKey="capture-surface-harness">
      {surface === 'tray' ? <div id="surface" style={{width: TRAY_PANEL_WIDTH}}><Surface/></div>
        : surface === 'notch' ? <div id="surface"><Surface/></div>
        : <RouterProvider router={windowRouter!}/>}
    </HarnessProvider>
  </ThemeProvider>,
);
