// frontend/src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";

export const metadata: Metadata = {
  title: "JD → Mission Engine",
  description: "Turn any job description into missions and a readiness score.",
};

const bodyStyle: CSSProperties = {
  minHeight: "100vh",
  margin: 0,
  backgroundImage:
    "linear-gradient(135deg, #160333 0%, #05030a 55%, #000000 100%)",
  color: "#f5f5ff",
  fontFamily:
    'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif',
  WebkitFontSmoothing: "antialiased",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={bodyStyle}>{children}</body>
    </html>
  );
}
