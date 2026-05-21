import localFont from "next/font/local";

/** Full Inter variable font (local `.ttf`) so `font-feature-settings` / `--inter-features` match the desktop build. */
export const inter = localFont({
  src: "../../assets/fonts/InterVariable.ttf",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});
