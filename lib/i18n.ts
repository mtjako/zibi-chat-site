import { english } from "./translations";
export type Language = "pl" | "en";
export const createTranslator = (language: Language) => (text: string) =>
  language === "en" ? (english[text] ?? text) : text;
