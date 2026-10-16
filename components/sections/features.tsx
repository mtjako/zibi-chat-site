import type { CSSProperties } from "react";
import { createTranslator, type Language } from "../../lib/i18n";

import { TerminalDemo } from "../terminal-demo";
import { ChartDate } from "../site-controls";

export function Features({ language }: { language: Language }) {
  const t = createTranslator(language);
  return (
    <section className="features section content-grid" id="funkcje">
      <div className="section-heading">
        <div>
          <h2>
            {t("Dużo się dzieje.")}
            <br /> {t("Wiesz dokładnie co.")}
          </h2>
        </div>
      </div>
      <div className="bento">
        <article
          data-motion="card"
          suppressHydrationWarning
          style={{ "--reveal-delay": "0ms" } as CSSProperties}
          className="bento-card bento-limits flex flex-row flex-wrap gap-6 min-w-0 border border-[var(--line)] rounded-2xl bg-[var(--paper)] p-[var(--space-card)]"
        >
          <div className="bento-copy">
            <span
              className="bento-icon grid place-items-center size-9 border border-[var(--line)] rounded-[10px] bg-[var(--control)]"
              aria-hidden="true"
            >
              <svg
                className="lucide lucide-gauge"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="m12 14 4-4"></path>
                <path d="M3.34 19a10 10 0 1 1 17.32 0"></path>
              </svg>
            </span>
            <h3>{t("Limity bez niespodzianek.")}</h3>
            <p>
              {t(
                "Sprawdzaj zużycie, okna resetu, tokeny i szacowane koszty. Planuj pracę, zanim skończy się dostępny limit.",
              )}
            </p>
          </div>
          <div className="app-ui app-limits" aria-hidden="true">
            <div className="app-limit flex flex-col gap-1.5 [padding-block:10px] [padding-inline:0]">
              <span className="app-limit-title">{"5H"}</span>
              <span className="app-limit-progress">
                <span className="app-limit-track">
                  <i style={{ "--value": "32%" } as CSSProperties}></i>
                </span>
                <span
                  className="app-limit-pace"
                  style={{ "--pace": "32.3%" } as CSSProperties}
                ></span>
              </span>
              <span className="app-limit-meta">
                <span className="app-limit-used">
                  {t("32% zużyte")}
                  <span className="app-limit-delta">{t("0% vs tempo")}</span>
                </span>
                <span className="app-limit-reset">{t("reset za 3h 23m")}</span>
              </span>
            </div>
            <div className="app-limit flex flex-col gap-1.5 [padding-block:10px] [padding-inline:0]">
              <span className="app-limit-title">{"7D"}</span>
              <span className="app-limit-progress">
                <span className="app-limit-track">
                  <i style={{ "--value": "18%" } as CSSProperties}></i>
                </span>
                <span
                  className="app-limit-pace"
                  style={{ "--pace": "43.5%" } as CSSProperties}
                ></span>
              </span>
              <span className="app-limit-meta">
                <span className="app-limit-used">
                  {t("18% zużyte")}
                  <span className="app-limit-delta">{t("−25% vs tempo")}</span>
                </span>
                <span className="app-limit-reset">{t("reset za 3d 23h")}</span>
              </span>
            </div>
          </div>
        </article>
        <article
          data-motion="card"
          suppressHydrationWarning
          style={{ "--reveal-delay": "60ms" } as CSSProperties}
          className="bento-card bento-sessions flex flex-col gap-6 min-w-0 border border-[var(--line)] rounded-2xl bg-[var(--paper)] p-[var(--space-card)]"
        >
          <div className="bento-copy">
            <span
              className="bento-icon grid place-items-center size-9 border border-[var(--line)] rounded-[10px] bg-[var(--control)]"
              aria-hidden="true"
            >
              <svg
                className="lucide lucide-messages-square"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                <path d="M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1"></path>
              </svg>
            </span>
            <h3>{t("Każda sesja na radarze.")}</h3>
            <p>
              {t(
                "Zobacz, kto pracuje, a kto czeka. Śledź projekty i subagentów bez szukania właściwego okna.",
              )}
            </p>
          </div>
          <div className="app-ui app-threads" aria-hidden="true">
            <ul className="app-threads-list">
              <li className="app-thread is-receded">
                <span className="app-thread-line flex items-center gap-1.5 min-w-0">
                  <span className="app-thread-dot-col">
                    <span
                      className="app-thread-dot"
                      data-status="working"
                    ></span>
                  </span>
                  <span className="app-thread-project flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-medium">
                    {"zibi-site"}
                  </span>
                  <span className="app-thread-time">{"2m"}</span>
                </span>
                <span className="app-thread-title overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium">
                  {t("Przebudowa sekcji funkcji")}
                </span>
                <span className="app-thread-line flex items-center gap-1.5 min-w-0">
                  <span className="app-thread-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M15 6a9 9 0 0 0-9 9V3"></path>
                      <circle cx="18" cy="6" r="3"></circle>
                      <circle cx="6" cy="18" r="3"></circle>
                    </svg>
                  </span>
                  <span className="app-thread-branch flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                    {"feat/bento-grid"}
                  </span>
                  <span className="app-thread-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <rect width="20" height="14" x="2" y="3" rx="2"></rect>
                      <line x1="8" x2="16" y1="21" y2="21"></line>
                      <line x1="12" x2="12" y1="17" y2="21"></line>
                    </svg>
                  </span>
                  <svg
                    className="app-thread-agent"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    fillRule="evenodd"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z"></path>
                  </svg>
                </span>
              </li>
              <li className="app-thread is-selected">
                <span className="app-thread-line flex items-center gap-1.5 min-w-0">
                  <span className="app-thread-dot-col">
                    <span
                      className="app-thread-dot"
                      data-status="blocked"
                    ></span>
                  </span>
                  <span className="app-thread-project flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-medium">
                    {"api-gateway"}
                  </span>
                  <span className="app-thread-time">{"7m"}</span>
                </span>
                <span className="app-thread-title overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium">
                  {t("Migracja endpointów do v2")}
                </span>
                <span className="app-thread-line flex items-center gap-1.5 min-w-0">
                  <span className="app-thread-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M15 6a9 9 0 0 0-9 9V3"></path>
                      <circle cx="18" cy="6" r="3"></circle>
                      <circle cx="6" cy="18" r="3"></circle>
                    </svg>
                  </span>
                  <span className="app-thread-branch flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                    {"main"}
                  </span>
                  <span className="app-thread-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <rect width="20" height="14" x="2" y="3" rx="2"></rect>
                      <line x1="8" x2="16" y1="21" y2="21"></line>
                      <line x1="12" x2="12" y1="17" y2="21"></line>
                    </svg>
                  </span>
                  <svg
                    className="app-thread-agent"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    fillRule="evenodd"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z"></path>
                  </svg>
                </span>
              </li>
              <li className="app-thread">
                <span className="app-thread-line flex items-center gap-1.5 min-w-0">
                  <span className="app-thread-dot-col">
                    <span className="app-thread-dot" data-status="done"></span>
                  </span>
                  <span className="app-thread-project flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-medium">
                    {"mobile-app"}
                  </span>
                  <span className="app-thread-time">{"24m"}</span>
                </span>
                <span className="app-thread-title overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium">
                  {t("Poprawki ekranu logowania")}
                </span>
                <span className="app-thread-line flex items-center gap-1.5 min-w-0">
                  <span className="app-thread-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M15 6a9 9 0 0 0-9 9V3"></path>
                      <circle cx="18" cy="6" r="3"></circle>
                      <circle cx="6" cy="18" r="3"></circle>
                    </svg>
                  </span>
                  <span className="app-thread-branch flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                    {"fix/login-keyboard"}
                  </span>
                  <span className="app-thread-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <rect width="20" height="14" x="2" y="3" rx="2"></rect>
                      <line x1="8" x2="16" y1="21" y2="21"></line>
                      <line x1="12" x2="12" y1="17" y2="21"></line>
                    </svg>
                  </span>
                  <svg
                    className="app-thread-agent"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    fillRule="evenodd"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M6.469 8.776L16.512 23h-4.464L2.005 8.776H6.47zm-.004 7.9l2.233 3.164L6.467 23H2l4.465-6.324zM22 2.582V23h-3.659V7.764L22 2.582zM22 1l-9.952 14.095-2.233-3.163L17.533 1H22z"></path>
                  </svg>
                </span>
              </li>
              <li className="app-thread">
                <span className="app-thread-line flex items-center gap-1.5 min-w-0">
                  <span className="app-thread-dot-col">
                    <span className="app-thread-dot" data-status="idle"></span>
                  </span>
                  <span className="app-thread-project flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-medium">
                    {"docs"}
                  </span>
                  <span className="app-thread-time">{"2h"}</span>
                </span>
                <span className="app-thread-title overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium">
                  {t("Aktualizacja dokumentacji CLI")}
                </span>
                <span className="app-thread-line flex items-center gap-1.5 min-w-0">
                  <span className="app-thread-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M15 6a9 9 0 0 0-9 9V3"></path>
                      <circle cx="18" cy="6" r="3"></circle>
                      <circle cx="6" cy="18" r="3"></circle>
                    </svg>
                  </span>
                  <span className="app-thread-branch flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                    {"docs/cli"}
                  </span>
                  <span className="app-thread-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <rect width="20" height="14" x="2" y="3" rx="2"></rect>
                      <line x1="8" x2="16" y1="21" y2="21"></line>
                      <line x1="12" x2="12" y1="17" y2="21"></line>
                    </svg>
                  </span>
                  <svg
                    className="app-thread-agent"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    fillRule="evenodd"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M21.751 22.607c1.34 1.005 3.35.335 1.508-1.508C17.73 15.74 18.904 1 12.037 1 5.17 1 6.342 15.74.815 21.1c-2.01 2.009.167 2.511 1.507 1.506 5.192-3.517 4.857-9.714 9.715-9.714 4.857 0 4.522 6.197 9.714 9.715z"></path>
                  </svg>
                </span>
              </li>
            </ul>
          </div>
        </article>
        <article
          data-motion="card"
          suppressHydrationWarning
          style={{ "--reveal-delay": "120ms" } as CSSProperties}
          className="bento-card bento-improve flex flex-col gap-6 min-w-0 border border-[var(--line)] rounded-2xl bg-[var(--paper)] p-[var(--space-card)]"
        >
          <div className="bento-copy">
            <span
              className="bento-icon grid place-items-center size-9 border border-[var(--line)] rounded-[10px] bg-[var(--control)]"
              aria-hidden="true"
            >
              <svg
                className="lucide lucide-lightbulb"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                <path d="M9 18h6"></path>
                <path d="M10 22h4"></path>
              </svg>
            </span>
            <h3>{t("Ulepszaj swój warsztat")}</h3>
            <p>
              {t(
                "Analizy sesji pomagają dopracować prompty i odkryć, gdzie przydadzą się skille, MCP, agenci czy hooki.",
              )}
            </p>
          </div>
        </article>
        <article
          data-motion="card"
          suppressHydrationWarning
          style={{ "--reveal-delay": "0ms" } as CSSProperties}
          className="bento-card bento-config flex flex-col gap-6 min-w-0 border border-[var(--line)] rounded-2xl bg-[var(--paper)] p-[var(--space-card)]"
        >
          <div className="bento-copy">
            <span
              className="bento-icon grid place-items-center size-9 border border-[var(--line)] rounded-[10px] bg-[var(--control)]"
              aria-hidden="true"
            >
              <svg
                className="lucide lucide-settings-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M14 17H5"></path>
                <path d="M19 7h-9"></path>
                <circle cx="17" cy="17" r="3"></circle>
                <circle cx="7" cy="7" r="3"></circle>
              </svg>
            </span>
            <h3>{t("Konfiguruj w jednym miejscu")}</h3>
            <p>
              {t(
                "Zarządzaj skillami, serwerami MCP i instrukcjami agentów. Mniej szukania w plikach, więcej porządku.",
              )}
            </p>
          </div>
        </article>
        <article
          data-motion="card"
          suppressHydrationWarning
          style={{ "--reveal-delay": "60ms" } as CSSProperties}
          className="bento-card bento-analytics flex flex-row flex-wrap gap-6 min-w-0 border border-[var(--line)] rounded-2xl bg-[var(--paper)] p-[var(--space-card)]"
        >
          <div className="bento-copy">
            <span
              className="bento-icon grid place-items-center size-9 border border-[var(--line)] rounded-[10px] bg-[var(--control)]"
              aria-hidden="true"
            >
              <svg
                className="lucide lucide-chart-column"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
                <path d="M18 17V9"></path>
                <path d="M13 17V5"></path>
                <path d="M8 17v-3"></path>
              </svg>
            </span>
            <h3>{t("Liczby, które mają sens.")}</h3>
            <p>
              {t(
                "Porównuj zużycie i koszty w czasie, z rozbiciem na modele. Od dziennego przeglądu po obraz całego roku.",
              )}
            </p>
          </div>
          <div className="app-ui app-chart" aria-hidden="true">
            <svg
              className="app-chart-svg"
              viewBox="0 0 348 200"
              focusable="false"
            >
              <g className="app-chart-grid">
                <line x1="58" y1="170" x2="336" y2="170"></line>
                <line x1="58" y1="127.5" x2="336" y2="127.5"></line>
                <line x1="58" y1="85" x2="336" y2="85"></line>
                <line x1="58" y1="42.5" x2="336" y2="42.5"></line>
                <line x1="58" y1="0" x2="336" y2="0"></line>
              </g>
              <path
                className="app-chart-area"
                d="M58,126.083L68.692,126.083L68.692,104.833L90.077,104.833L90.077,138.833L111.462,138.833L111.462,87.833L132.846,87.833L132.846,111.917L154.231,111.917L154.231,150.167L175.615,150.167L175.615,133.167L197,133.167L197,80.75L218.385,80.75L218.385,100.583L239.769,100.583L239.769,65.167L261.154,65.167L261.154,96.333L282.538,96.333L282.538,123.25L303.923,123.25L303.923,55.25L325.308,55.25L325.308,85L336,85L336,170L325.308,170L325.308,170L303.923,170L303.923,170L282.538,170L282.538,170L261.154,170L261.154,170L239.769,170L239.769,170L218.385,170L218.385,170L197,170L197,170L175.615,170L175.615,170L154.231,170L154.231,170L132.846,170L132.846,170L111.462,170L111.462,170L90.077,170L90.077,170L68.692,170L68.692,170L58,170Z"
              ></path>
              <path
                className="app-chart-line"
                d="M58,126.083L68.692,126.083L68.692,104.833L90.077,104.833L90.077,138.833L111.462,138.833L111.462,87.833L132.846,87.833L132.846,111.917L154.231,111.917L154.231,150.167L175.615,150.167L175.615,133.167L197,133.167L197,80.75L218.385,80.75L218.385,100.583L239.769,100.583L239.769,65.167L261.154,65.167L261.154,96.333L282.538,96.333L282.538,123.25L303.923,123.25L303.923,55.25L325.308,55.25L325.308,85L336,85"
              ></path>
              <g className="app-chart-ticks">
                <ChartDate
                  day={0}
                  x="58"
                  y="184"
                  dy="0.71em"
                  textAnchor="middle"
                />
                <ChartDate
                  day={4}
                  x="143.54"
                  y="184"
                  dy="0.71em"
                  textAnchor="middle"
                />
                <ChartDate
                  day={8}
                  x="229.08"
                  y="184"
                  dy="0.71em"
                  textAnchor="middle"
                />
                <ChartDate
                  day={13}
                  x="317.31"
                  y="184"
                  dy="0.71em"
                  textAnchor="middle"
                />
                <text x="50" y="170" dy="0.355em" textAnchor="end">
                  {"$0"}
                </text>
                <text x="50" y="127.5" dy="0.355em" textAnchor="end">
                  {"$3"}
                </text>
                <text x="50" y="85" dy="0.355em" textAnchor="end">
                  {"$6"}
                </text>
                <text x="50" y="42.5" dy="0.355em" textAnchor="end">
                  {"$9"}
                </text>
                <text x="50" y="9" dy="0.355em" textAnchor="end">
                  {"$12"}
                </text>
              </g>
            </svg>
          </div>
        </article>
        <article
          data-motion="card"
          suppressHydrationWarning
          style={{ "--reveal-delay": "120ms" } as CSSProperties}
          className="bento-card bento-cli flex flex-col gap-6 min-w-0 border border-[var(--line)] rounded-2xl bg-[var(--paper)] p-[var(--space-card)]"
        >
          <div className="bento-copy">
            <span
              className="bento-icon grid place-items-center size-9 border border-[var(--line)] rounded-[10px] bg-[var(--control)]"
              aria-hidden="true"
            >
              <svg
                className="lucide lucide-square-terminal"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="m7 11 2-2-2-2"></path>
                <path d="M11 13h4"></path>
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
              </svg>
            </span>
            <h3>{t("Także z terminala")}</h3>
            <p>
              {t("Wolisz CLI? Polecenie")} <code>{"zibi"}</code>{" "}
              {t(
                "udostępnia sesje, statystyki i analizy — również jako JSON do Twoich skryptów.",
              )}
            </p>
          </div>
          <TerminalDemo />
        </article>
      </div>
    </section>
  );
}
