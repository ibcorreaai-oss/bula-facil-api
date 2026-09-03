export default function Home() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "48px 20px", lineHeight: 1.6 }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "#CCFBF1",
          color: "#0F766E",
          borderRadius: 999,
          padding: "4px 12px",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        💊 Grátis · Não é orientação médica
      </div>
      <h1 style={{ fontSize: 34, fontWeight: 800, marginTop: 12 }}>Bula Fácil</h1>
      <p style={{ fontSize: 17, opacity: 0.85 }}>
        Fotografe a bula de um remédio ou uma receita médica e entenda, em linguagem simples,
        pra que serve, como tomar e o que observar — sem trocar a orientação do seu médico ou
        farmacêutico.
      </p>

      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Como funciona</h2>
        <ol style={{ paddingLeft: 20 }}>
          <li>Aponte a câmera pra caixa do remédio, bula ou receita.</li>
          <li>A IA explica em linguagem simples o que aquilo significa.</li>
          <li>Confirme que entendeu os pontos mais importantes antes de seguir.</li>
        </ol>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Privacidade</h2>
        <p>
          A foto é analisada só pra gerar a explicação e não fica guardada em nenhum servidor.
          Seu histórico de remédios fica salvo apenas no seu aparelho. Leia a{" "}
          <a href="/privacy" style={{ color: "#0F766E" }}>
            política de privacidade completa
          </a>
          .
        </p>
      </section>

      <footer style={{ marginTop: 48, fontSize: 13, opacity: 0.6 }}>
        Bula Fácil é um produto Cortex Tech. Dúvidas ou suporte:{" "}
        <a href="mailto:cortextechbr@gmail.com">cortextechbr@gmail.com</a>
      </footer>
    </main>
  );
}
