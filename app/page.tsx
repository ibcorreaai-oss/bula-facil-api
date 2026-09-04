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
        💊🩺 Free · Not medical advice
      </div>
      <h1 style={{ fontSize: 34, fontWeight: 800, marginTop: 12 }}>Explicare</h1>
      <p style={{ fontSize: 17, opacity: 0.85 }}>
        Photograph a medicine label, prescription, or lab result and understand, in plain
        language, what it's for, how to use it, and what to watch out for — without replacing
        your doctor's or pharmacist's guidance. Available in Portuguese, English, Spanish,
        French, and Chinese.
      </p>

      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>How it works</h2>
        <ol style={{ paddingLeft: 20 }}>
          <li>Point the camera at the medicine box, package insert, prescription, or lab result.</li>
          <li>The AI explains in plain language what it means.</li>
          <li>Confirm you understood the most important points before moving on.</li>
        </ol>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Privacy</h2>
        <p>
          The photo is analyzed only to generate the explanation and is never stored on any
          server. Your history is saved only on your own device. Read the{" "}
          <a href="/privacy" style={{ color: "#0F766E" }}>
            full privacy policy
          </a>
          .
        </p>
      </section>

      <footer style={{ marginTop: 48, fontSize: 13, opacity: 0.6 }}>
        Explicare is a Cortex Tech product. Questions or support:{" "}
        <a href="mailto:cortextechbr@gmail.com">cortextechbr@gmail.com</a>
      </footer>
    </main>
  );
}
