// Renderer for the menu-bar tray panel and the Dynamic Notch. Unlike vite.config.mjs it does not
// stub app modules: surfaces.tsx mocks the whole Tauri layer (@tauri-apps/api/mocks) instead.
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const captureRoot = fileURLToPath(new URL('.', import.meta.url));
const app = resolve(process.env.ZIBI_APP_DIR || resolve(captureRoot, '../../../zibi-chat'));
const { defineConfig } = await import(app + '/node_modules/vite/dist/node/index.js');
const { default: react } = await import(app + '/node_modules/@vitejs/plugin-react/dist/index.js');
const { default: tailwind } = await import(app + '/node_modules/@tailwindcss/vite/dist/index.mjs');

export default defineConfig({
  root: captureRoot,
  plugins: [{name: 'capture-styles', enforce: 'pre', transform(code, id) {
    if (id.endsWith('/harness/terminal-api.ts')) return `
      export async function startProjectTerminal(options) {
        window.captureTerminalSize = {cols:options.cols,rows:options.rows};
        return {id:'capture-herdr',shell:'/bin/zsh',pid:null};
      }
      export async function writeProjectTerminalText(){}
      export async function writeProjectTerminal(){}
      export async function resizeProjectTerminal(){}
      export async function stopProjectTerminal(){}
      export async function isProjectTerminalBusy(){return false;}
    `;
    if (id.endsWith('/src/style.css')) return code + '\n@source ' + JSON.stringify(app + '/src') + ';';
    return null;
  }}, react(), tailwind()],
  resolve: {
    alias: {
      '@tauri-apps/api': app + '/node_modules/@tauri-apps/api',
      '@': app + '/src',
      'react': app + '/node_modules/react',
      'react-dom': app + '/node_modules/react-dom',
      'react-router': app + '/node_modules/react-router',
    },
    dedupe: ['react', 'react-dom'],
  },
  // Scan only this entry; index.html (Current Session renderer) needs the other config's aliases.
  optimizeDeps: {entries: ['index.html']},
  server: {port: 8090, host: '127.0.0.1', fs: {allow: [app, captureRoot]}},
});
