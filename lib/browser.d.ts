export {};
declare global {
  interface Window {
    sitePreferences?: {
      language: "pl" | "en";
      theme: "system" | "light" | "dark";
      setShot: (image: HTMLImageElement, shot: string) => void;
      setTheme: (theme: "system" | "light" | "dark") => void;
    };
  }
}
