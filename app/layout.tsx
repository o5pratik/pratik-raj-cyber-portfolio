import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pratik Raj — Digital Universe",
  description: "Engineering student, software developer, creator, and builder of digital experiences.",
  keywords: ["Pratik Raj", "software developer", "engineering student", "content creator"],
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#050505" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
