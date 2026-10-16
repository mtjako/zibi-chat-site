import { assetPath } from "../lib/paths";
import type { Language } from "../lib/i18n";
const sizes =
  "(max-width: 360px) calc(100vw - 36px), (max-width: 1064px) calc(100vw - 48px), 1000px";
const widths = [480, 720, 800, 1100, 1600, 2200];
export function ProductShot({
  shot,
  language,
  alt,
  priority = false,
}: {
  shot: string;
  language: Language;
  alt: string;
  priority?: boolean;
}) {
  const srcset = (theme: string) =>
    widths
      .map(
        (width) =>
          `${assetPath(`assets/${shot}-${language}-${theme}-${width}.webp`)} ${width}w`,
      )
      .join(", ");
  return (
    <>
      <img
        className="product-shot block w-full h-auto"
        data-shot={shot}
        data-language={language}
        sizes={sizes}
        width={1100}
        height={760}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        suppressHydrationWarning
      />
      <noscript>
        <picture>
          <source
            media="(prefers-color-scheme: dark)"
            srcSet={srcset("dark")}
            sizes={sizes}
          />
          <img
            className="product-shot block w-full h-auto"
            src={assetPath(`assets/${shot}-${language}-light-1100.webp`)}
            srcSet={srcset("light")}
            sizes={sizes}
            width={1100}
            height={760}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
          />
        </picture>
      </noscript>
    </>
  );
}
