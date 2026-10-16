import {mockIPC, mockWindows} from '@tauri-apps/api/mocks';
import {surfaceInvoke} from './surface-fixture';
const params = new URLSearchParams(location.search);
const projectPath = '/Users/demo/zibi-site';
const view = params.get('view') || 'editor';
const source = `import { useState } from "react";

const agents = ["Claude Code", "Codex", "Grok Build"];

export function AgentPicker() {
  const [selected, setSelected] = useState(agents[0]);

  return (
    <section className="agent-picker">
      <h2>Choose your coding agent</h2>
      <p>One workspace. Your favourite tools.</p>

      <div role="group" aria-label="Coding agents">
        {agents.map((agent) => (
          <button
            key={agent}
            aria-pressed={selected === agent}
            onClick={() => setSelected(agent)}
          >
            {agent}
          </button>
        ))}
      </div>
    </section>
  );
}
`;
const {newApiRequest} = await import('@/lib/api-collections-file');
const request = {...newApiRequest('List agents'), id:'request-agents',url:'https://api.example.com/agents'};
const apiFile = {version:1,collections:[{id:'collection-workspace',name:'Workspace API',variables:[],items:[request,{...newApiRequest('Create session'),id:'request-session',method:'POST',url:'https://api.example.com/sessions'},{...newApiRequest('Get usage'),id:'request-usage',url:'https://api.example.com/usage'}]}]};
const patch = `diff --git a/src/AgentPicker.tsx b/src/AgentPicker.tsx
index 1234567..abcdef0 100644
--- a/src/AgentPicker.tsx
+++ b/src/AgentPicker.tsx
@@ -1,26 +1,30 @@
 import { useState } from "react";
 
-const agents = ["Claude Code", "Codex"];
+const agents = ["Claude Code", "Codex", "Grok Build"];
 
 export function AgentPicker() {
   const [selected, setSelected] = useState(agents[0]);
+
+  const activeAgent = agents.find((agent) => agent === selected);
+  const canStart = Boolean(activeAgent);
 
   return (
     <section className="agent-picker">
       <h2>Choose your coding agent</h2>
       <p>One workspace. Your favourite tools.</p>
 
       <div role="group" aria-label="Coding agents">
         {agents.map((agent) => (
           <button
             key={agent}
+            disabled={!canStart}
             aria-pressed={selected === agent}
             onClick={() => setSelected(agent)}
           >
             {agent}
           </button>
         ))}
       </div>
     </section>
   );
 }
`;
(window as any).isTauri = true;
mockWindows('main');
mockIPC((cmd, args: any) => {
  if(cmd === 'resolve_project_path') return args.projectPath;
  if(cmd === 'read_project_file_if_exists') return {contents:JSON.stringify(apiFile),revision:'api-demo-1'};
  if(cmd === 'plugin:app|version') return '0.9.8';
  if(cmd === 'get_herdr_cli') return {binary_path:'/usr/local/bin/herdr',session_name:'zibi-site'};
  if(cmd === 'resolve_herdr_workspace') return {workspace_id:'w1',label:'zibi-site',session_name:'zibi-site',cwd:projectPath,created:false,binary_path:'/usr/local/bin/herdr'};
  if(cmd === 'read_project_git_diff') return {isRepository:true,patch,untrackedPaths:[],truncated:false,untrackedContentTruncated:false,repositoryPrefix:'',fingerprint:'demo',unchanged:false};
  if(cmd === 'send_api_request') return {status:200,status_text:'OK',final_url:request.url,redirected:false,headers:[{name:'content-type',value:'application/json'}],body:JSON.stringify({agents:[{id:'claude',name:'Claude Code',status:'ready'},{id:'codex',name:'Codex',status:'ready'},{id:'grok',name:'Grok Build',status:'ready'}],total:3},null,2),body_truncated:false,size_bytes:312,duration_ms:84};
  if(cmd === 'read_project_file') return {contents: source, revision:'demo-1'};
  if(cmd === 'list_project_directory') return {entries: args.relativePath ? [{name:'AgentPicker.tsx',kind:'file'}, {name:'App.tsx',kind:'file'}, {name:'main.tsx',kind:'file'}, {name:'style.css',kind:'file'}] : [{name:'public',kind:'folder'},{name:'src',kind:'folder'},{name:'.gitignore',kind:'file'},{name:'index.html',kind:'file'},{name:'package.json',kind:'file'},{name:'README.md',kind:'file'},{name:'tsconfig.json',kind:'file'},{name:'vite.config.ts',kind:'file'}],omitted:0};
  if(cmd === 'read_project_git_status') return {is_repository:true,entries:view==='git'?[{path:'src/AgentPicker.tsx',original_path:null,section:'tracked',staged:'unmodified',unstaged:'modified',line_stat:{additions:5,deletions:1}}]:[],repository_prefix:'',truncated:false};
  if(cmd === 'list_project_git_worktrees') return {isRepository:true,repositoryRoot:projectPath,worktrees:[{path:projectPath,head:'abc123',branch:'main'}]};
  if(cmd === 'list_open_task_counts') return {};
  return surfaceInvoke(cmd,args);
}, {shouldMockEvents:true});
localStorage.setItem('zibi-chat:editor-open-projects:v1',JSON.stringify([projectPath]));
localStorage.setItem('zibi-chat:editor-active-project:v1',projectPath);
const tab = (id:number, launchKind:string, filePath?:string) => ({id,sessionKey:`capture-${id}`,generation:0,started:false,launchKind,...(filePath?{filePath}:{})});
const group=(id:number,tabs:any[])=>({kind:'group',id,tabs,activeTabId:tabs[0].id});
const layout = {kind:'split',id:1,axis:'horizontal',ratio:0.72,
    first: view === 'api' ? group(1,[{...tab(1,'api-request'),apiRequestId:'request-agents'}]) : view === 'git' ? group(1,[tab(1,'repository-diff')]) : group(1,[tab(1,'editor','src/AgentPicker.tsx'),tab(2,'editor','src/App.tsx')]),
    second: view === 'api' ? group(2,[tab(3,'api-collections')]) : view === 'git' ? group(2,[tab(3,'diff'),tab(4,'files')]) : group(2,[tab(3,'files'),tab(4,'diff')])};
localStorage.setItem(`zibi-chat:project-terminal-layout:v1:${projectPath}`,JSON.stringify({version:1,activeGroupId:1,layout}));
localStorage.setItem('zibi-chat.harness','claude-code');
const [{createRoot},{createMemoryRouter,RouterProvider},{ThemeProvider},{HarnessProvider},{default:i18n},{default:RootLayout},{default:Editor},{default:CurrentSession},{default:HarnessUpdates}] = await Promise.all([import('react-dom/client'),import('react-router'),import('@/components/theme-provider'),import('@/components/harness-provider'),import('@/i18n'),import('@/routes/root-layout'),import('@/routes/editor'),import('@/routes/current-session'),import('@/routes/harness-updates')]);
await import('@/style.css');
await i18n.changeLanguage(params.get('lang')==='en'?'en':'pl');
const theme = params.get('theme')==='dark'?'dark':'light';
const routes = [{path:'/editor',element:<Editor/>},{path:'/current-session',element:<CurrentSession/>},{path:'/harness-updates',element:<HarnessUpdates/>}];
const routePath = view==='session' ? '/current-session' : view==='environments' ? '/harness-updates' : '/editor';
const router = createMemoryRouter([{element:<RootLayout/>,children:routes}],{initialEntries:[`${routePath}?path=${encodeURIComponent(projectPath)}`]});
createRoot(document.getElementById('root')!).render(<ThemeProvider defaultTheme={theme} storageKey={`capture-editor-${theme}`}><HarnessProvider><RouterProvider router={router}/></HarnessProvider></ThemeProvider>);
