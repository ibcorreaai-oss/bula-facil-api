import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bula Fácil",
  description: "Fotografe uma bula ou receita e entenda em linguagem simples.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#F0FDFA", color: "#134E4A" }}>
        {children}
      </body>
    </html>
  );
}
