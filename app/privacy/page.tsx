export default function Privacy() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "48px 20px", lineHeight: 1.7 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Política de Privacidade — Bula Fácil</h1>
      <p style={{ opacity: 0.6, fontSize: 14 }}>Última atualização: setembro de 2026</p>

      <h2 style={{ fontSize: 19, fontWeight: 700, marginTop: 28 }}>O que fazemos com a foto</h2>
      <p>
        Quando você fotografa uma bula, embalagem de remédio ou receita, a imagem é enviada, de
        forma criptografada, para gerar a explicação em linguagem simples usando um serviço de
        inteligência artificial de terceiro (Groq). A imagem é processada em memória para gerar
        essa resposta e não é armazenada pelos servidores do Bula Fácil depois que a resposta é
        gerada. Não usamos suas fotos para treinar modelos de IA.
      </p>

      <h2 style={{ fontSize: 19, fontWeight: 700, marginTop: 28 }}>O que fica salvo no seu aparelho</h2>
      <p>
        Seu histórico de remédios explicados (nome do medicamento, explicação e, se você optar,
        a foto) fica salvo apenas localmente no seu celular, em um banco de dados local
        (SQLite). Não temos acesso a esse histórico e ele não é enviado para nenhum servidor
        nosso. Se você desinstalar o app ou apagar os dados dele, esse histórico é apagado
        também.
      </p>

      <h2 style={{ fontSize: 19, fontWeight: 700, marginTop: 28 }}>Assinatura e compras</h2>
      <p>
        Assinaturas premium são processadas pela Apple, Google ou Samsung (conforme a loja de
        onde você baixou o app) e gerenciadas tecnicamente pela RevenueCat, que recebe apenas os
        dados necessários para validar sua compra (um identificador anônimo de usuário e o status
        da assinatura) — nunca dados de cartão de crédito, que ficam só com a própria loja de
        aplicativos.
      </p>

      <h2 style={{ fontSize: 19, fontWeight: 700, marginTop: 28 }}>O que NÃO fazemos</h2>
      <ul style={{ paddingLeft: 20 }}>
        <li>Não exibimos anúncios de terceiros.</li>
        <li>Não vendemos ou compartilhamos seus dados com anunciantes.</li>
        <li>Não exigimos cadastro, login ou e-mail para usar as funções principais do app.</li>
        <li>Não rastreamos sua localização.</li>
      </ul>

      <h2 style={{ fontSize: 19, fontWeight: 700, marginTop: 28 }}>Crianças</h2>
      <p>
        O Bula Fácil não é direcionado a crianças e não coleta intencionalmente dados de menores
        de 13 anos.
      </p>

      <h2 style={{ fontSize: 19, fontWeight: 700, marginTop: 28 }}>Aviso médico</h2>
      <p>
        O Bula Fácil não é um dispositivo médico, não faz diagnóstico e não substitui a
        orientação de um médico ou farmacêutico licenciado. As explicações são um resumo
        educativo em linguagem simples — sempre confirme qualquer decisão sobre medicamentos com
        um profissional de saúde.
      </p>

      <h2 style={{ fontSize: 19, fontWeight: 700, marginTop: 28 }}>Contato</h2>
      <p>
        Dúvidas sobre privacidade: <a href="mailto:cortextechbr@gmail.com">cortextechbr@gmail.com</a>
      </p>
    </main>
  );
}
