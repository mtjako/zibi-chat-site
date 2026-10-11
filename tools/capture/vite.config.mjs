import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const captureRoot = fileURLToPath(new URL('.', import.meta.url));
const app = resolve(process.env.ZIBI_APP_DIR || resolve(captureRoot, '../../../zibi-chat'));
const { defineConfig } = await import(app + '/node_modules/vite/dist/node/index.js');
const { default: react } = await import(app + '/node_modules/@vitejs/plugin-react/dist/index.js');
const { default: tailwind } = await import(app + '/node_modules/@tailwindcss/vite/dist/index.mjs');

export default defineConfig({root:captureRoot,plugins:[{name:'capture-fixtures',enforce:'pre',transform(code,id){if(id.endsWith('/src/style.css')) return code+'\n@source '+JSON.stringify(app+'/src')+';';if(id.endsWith('/hooks/use-window-focus.ts')) return 'export function useWindowFocus(){} export function useWindowFocusChange(){}';if(id.endsWith('/components/window-controls.tsx')) return 'export function WindowControls(){return null}';if(id.endsWith('/harness/claude/components/current-session.tsx')||id.endsWith('/components/harness-account-row.tsx'))code=code.replace('import { isTauri } from "@/lib/is-tauri";','const isTauri = () => true;'); if(id.endsWith('/harness/claude/api.ts')) code=code.replace('import { invoke } from "@tauri-apps/api/core";','import { invoke } from '+JSON.stringify(captureRoot+'fixture.ts')+';');return code;}},react(),tailwind()],resolve:{alias:{'@':app+'/src','react-router':app+'/node_modules/react-router','react':app+'/node_modules/react','react-dom':app+'/node_modules/react-dom'},dedupe:['react','react-dom']},server:{port:8089,host:'127.0.0.1',fs:{allow:[app,captureRoot]}}});
