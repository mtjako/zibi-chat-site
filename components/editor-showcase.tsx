"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

type View = { id: string; title: string; description: string; alt: string; shot: string };

export function EditorShowcase({ views, label, children }: { views: View[]; label: string; children: ReactNode }) {
  const [selected, setSelected] = useState(0);
  const frame = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const select = (index: number) => {
    setSelected(index);
    const image = frame.current?.querySelector<HTMLImageElement>("img[data-shot]");
    if (image) {
      image.alt = views[index].alt;
      window.sitePreferences?.setShot(image, views[index].shot);
    }
  };
  const navigate = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    if (event.key === "ArrowRight") next = (index + 1) % views.length;
    else if (event.key === "ArrowLeft") next = (index + views.length - 1) % views.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = views.length - 1;
    else return;
    event.preventDefault();
    tabs.current[next]?.focus();
    select(next);
  };

  return (
    <>
      <div ref={frame} className="screenshot-frame editor-frame relative overflow-clip rounded-xl max-[520px]:rounded-[7px] border border-[var(--line)] bg-[var(--surface)]" role="tabpanel" id="editor-preview" aria-labelledby={`editor-tab-${views[selected].id}`} tabIndex={0}>
        {children}
      </div>
      <div className="editor-tiles" role="tablist" aria-label={label}>
        {views.map((view, index) => (
          <button key={view.id} ref={node => { tabs.current[index] = node; }} className="editor-tile" type="button" role="tab" id={`editor-tab-${view.id}`} aria-controls="editor-preview" aria-selected={selected === index} aria-labelledby={`editor-title-${view.id}`} aria-describedby={`editor-description-${view.id}`} tabIndex={selected === index ? 0 : -1} onClick={() => select(index)} onKeyDown={event => navigate(event, index)}>
            <span className="editor-tile-heading"><span className="editor-tile-number" aria-hidden="true">0{index + 1}</span><span id={`editor-title-${view.id}`}>{view.title}</span></span>
            <span className="editor-tile-description" id={`editor-description-${view.id}`}>{view.description}</span>
          </button>
        ))}
      </div>
      <noscript>
        <ul className="editor-features">{views.map(view => <li key={view.id}><h3>{view.title}</h3><p>{view.description}</p></li>)}</ul>
      </noscript>
    </>
  );
}
