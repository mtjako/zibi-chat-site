import type { CSSProperties } from "react";

const command =
  "zibi stats --harness claude-code \\\n    --format json | jq .summary";
const output =
  '\n{\n  "requests": 42,\n  "total_tokens": 124780,\n  "cost_usd": 2.34,\n  "cost_incomplete": false\n}';

// All text is rendered at build time. CSS reveals glyphs without changing layout.
export function TerminalDemo() {
  return (
    <pre
      className="bento-visual bento-terminal"
      data-motion="terminal"
      suppressHydrationWarning
      aria-hidden="true"
      style={
        {
          "--terminal-complete": `${280 + command.length * 28 + 140}ms`,
        } as CSSProperties
      }
    >
      <code>
        <span className="terminal-prompt">{"$ "}</span>
        <span className="terminal-command">
          {Array.from(command).map((character, index) =>
            character === "\n" ? (
              character
            ) : (
              <span
                key={index}
                className="terminal-char"
                style={{ "--character": index } as CSSProperties}
              >
                {character}
              </span>
            ),
          )}
        </span>
        <span className="terminal-output">{output}</span>
      </code>
    </pre>
  );
}
