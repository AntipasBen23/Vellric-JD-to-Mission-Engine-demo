// frontend/src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JD → Mission Engine",
  description: "Turn any job description into missions and a readiness score.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-[#160333] via-[#05030a] to-black text-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}
