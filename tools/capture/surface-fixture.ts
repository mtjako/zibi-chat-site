// Demo backend for surfaces.tsx. Values match the Current Session fixture (32% / 18%, 42 requests,
// $2.34) and the site's Threads replica projects. Times are relative to now, like fixture.ts.
const now = Date.now(), minute = 60_000, hour = 60 * minute;
const lang = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'pl';
const text = (pl: string, en: string) => lang === 'pl' ? pl : en;
const tokens = {input_tokens: 18420, output_tokens: 8320, cache_creation_tokens: 12000, cache_creation_5m_tokens: 12000, cache_creation_1h_tokens: 0, cache_read_tokens: 86040, reasoning_tokens: 2100, total_tokens: 124780};

const subagent = (id: string, name: string, model: string, startedMinutesAgo: number) => ({
  id, parent_id: 'claude-1', name, role: null, status: 'running', model,
  started_at_ms: now - startedMinutesAgo * minute, updated_at_ms: now, depth: 1, is_active: true,
});

// Environments row (HarnessUpdateStatus in src/harness/harness-updates.ts).
function harness(id: string, name: string, current: string | null, latest: string, method: string, updateCommand: string | null) {
  return {id, name, installed: true, current_version: current, latest_version: latest, update_available: current !== null && current !== latest,
    install_method: method, update_command: updateCommand, install_options: [], uninstall_preview: updateCommand ? `uninstall ${name}` : null,
    uninstall_kind: updateCommand ? 'command' : null, detection_error: null, missing_install_tool: null};
}

export function surfaceInvoke(cmd: string, args?: unknown): unknown {
  switch (cmd) {
    case 'list_detected_harnesses': return ['claude-code', 'codex', 'grok-build', 'google-antigravity'];
    case 'plugin:window|is_focused':
    case 'plugin:window|is_visible': return true;
    case 'get_notch_hovered': return false;
    case 'get_notch_geometry': return {topInset: 32, physicalWidth: 185, menuBarHeight: 32};
    case 'get_claude_oauth_usage': return {limits: [
      {kind: 'session', group: 'session', percent: 32, severity: null, resets_at: new Date(now + 3.4 * hour).toISOString(), model_display_name: null, is_active: true},
      {kind: 'weekly_all', group: 'weekly', percent: 18, severity: null, resets_at: new Date(now + 96 * hour).toISOString(), model_display_name: null, is_active: true},
    ], fetched_at_utc: new Date(now).toISOString()};
    case 'get_claude_oauth_profile': return {email: 'dev@example.com', display_name: null, organization_name: null, organization_type: null, rate_limit_tier: 'default_claude_max_5x', has_claude_max: true, has_claude_pro: false, source: 'api'};
    case 'get_claude_service_status': return {indicator: 'none', description: 'All Systems Operational', components: [], incidents: [], page_updated_at: null, fetched_at_utc: new Date(now).toISOString()};
    case 'get_claude_current_billing_block': return {start_timestamp: new Date(now - 1.6 * hour).toISOString(), end_timestamp: new Date(now + 3.4 * hour).toISOString(), first_activity: new Date(now - hour).toISOString(), last_activity: new Date(now).toISOString(), is_active: true, message_count: 42, tokens, per_model: [{model: 'claude-sonnet-4-5', message_count: 42, tokens, cost: {total: 2.34, incomplete: false}}], cost: {total: 2.34, incomplete: false}};
    case 'list_active_claude_sessions': return [{
      pid: 4242, session_id: 'claude-1', cwd: '/Users/demo/zibi-site', name: null, title: null, effective_status: 'busy', model: 'claude-sonnet-4-5',
      last_prompt: text('Przebuduj sekcję funkcji na bento grid', 'Rebuild the features section as a bento grid'),
      status_updated_at_ms: now - 2 * minute, updated_at_ms: now,
      // One subagent keeps all three sessions inside the expanded notch's 400 px content limit.
      subagents: [subagent('sa-1', 'explorer', 'claude-haiku-4-5', 1)],
    }];
    case 'list_active_codex_sessions': return [{
      pid: 5151, session_id: 'codex-1', cwd: '/Users/demo/api-gateway', effective_status: 'waiting', model: 'gpt-5-codex',
      last_prompt: text('Zmigruj endpointy do v2', 'Migrate the endpoints to v2'),
      status_updated_at_ms: now - 7 * minute, updated_at_ms: now - 7 * minute, subagents: [],
    }];
    case 'list_active_grok_sessions': return [{pid: 6161, id: 'grok-1', cwd: '/Users/demo/mobile-app', title: text('Poprawki ekranu logowania', 'Login screen fixes'), model: 'grok-code-fast-1', updated_at_ms: now - 24 * minute, effective_status: 'idle'}];
    case 'list_active_antigravity_sessions': return [];
    case 'plugin:window|is_fullscreen': return false;
    // safari: [] is what Windows and Linux report (the backend fills it only on macOS); the site promotes
    // cross-platform features, so the Safari part of this section stays hidden like on those systems.
    case 'get_playwright_cli_status': return {cli_version: '0.1.9', npm_available: true,
      skills: [{harness: 'claude', installed: true}, {harness: 'codex', installed: true}, {harness: 'grok', installed: true}, {harness: 'antigravity', installed: true}],
      browsers: [{browser: 'chromium', installed: true, launch_error: null}, {browser: 'firefox', installed: true, launch_error: null}, {browser: 'webkit', installed: true, launch_error: null}],
      headed: true, firefox_blocked: false, safari: [], system_deps_command: null};
    case 'get_zibi_command_status': return {state: 'installed', location: '/usr/local/bin/zibi'};
    case 'list_herdr_integrations': return [{target: 'claude', status: 'installed', version: 3, latest_version: 3}, {target: 'codex', status: 'outdated', version: 2, latest_version: 3}];
    case 'list_installed_harness_clis': return ['claude-code', 'codex', 'grok-build', 'herdr'];
    case 'check_harness_updates': return [
      harness('claude-code', 'Claude Code', '2.1.12', '2.1.12', 'native', 'claude update'),
      harness('codex', 'Codex', '0.161.0', '0.162.0', 'npm', 'npm install -g @openai/codex@latest'),
      harness('grok-build', 'Grok Build', '1.4.0', '1.4.0', 'native', 'grok update'),
      {...harness('google-antigravity', 'Antigravity', null, '1.9.2', 'unknown', null), installed: false,
        install_options: [{channel: 'native', command: 'curl -fsSL https://antigravity.google/install.sh | sh'}], uninstall_preview: null, uninstall_kind: null},
      harness('herdr', 'Herdr', '0.9.3', '0.9.3', 'native', 'herdr update'),
    ];
    default:
      // Resize/state/accent commands need no answer; anything unexpected is logged, not thrown.
      if (!['set_tray_panel_height', 'set_notch_state', 'set_accent_color'].includes(cmd) && !cmd.startsWith('plugin:event|')) console.debug('surface-fixture: unhandled', cmd, args);
      return null;
  }
}
