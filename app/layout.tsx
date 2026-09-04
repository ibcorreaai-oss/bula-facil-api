import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explicare",
  description: "Photograph a medicine label, prescription, or lab result and understand it in plain language.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#F0FDFA", color: "#134E4A" }}>
        {children}
      </body>
    </html>
  );
}
