import { PlayerRegisterForm } from '../feature/game/components/player-register-form';
import "../styles/RegisterPage.css";

const S = {
  page: {
    background: "#08090d",
    minHeight: "100vh",
    fontFamily: "'Syne', sans-serif",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
  },
  inner: {
    width: "100%",
    maxWidth: "520px",
    textAlign: "center",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(255,71,87,0.08)",
    border: "1px solid rgba(255,71,87,0.25)",
    borderRadius: "50px",
    padding: "5px 14px",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "#ff4757",
    textTransform: "uppercase",
    marginBottom: "16px",
  },
  dot: {
    width: "6px", height: "6px",
    borderRadius: "50%",
    background: "#ff4757",
    boxShadow: "0 0 8px #ff4757",
    animation: "pulse 2s infinite",
  },
  title: {
    fontSize: "2.6rem",
    fontWeight: 900,
    letterSpacing: "-0.02em",
    margin: "0 0 12px",
    background: "linear-gradient(90deg, #fff 30%, #ff4757)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: "0.93rem",
    color: "#5a6280",
    lineHeight: 1.65,
    marginBottom: "40px",
  },
  card: {
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(255,71,87,0.2)",
    borderRadius: "16px",
    padding: "36px 32px",
    boxShadow: "0 0 60px rgba(255,71,87,0.07), inset 0 1px 0 rgba(255,255,255,0.04)",
    textAlign: "left",
  },
};

export function RegisterPage() {
  return (
    <>
      <style>{`
        
      `}</style>

      <div style={S.page}>
        <div style={S.inner}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <div style={S.badge}>
              <span style={S.dot} />
              Registro de Bot
            </div>
          </div>
          <h1 style={S.title}>Cadastro do jogador</h1>
          <p style={S.subtitle}>
            Cadastre seus dados para conectá-lo<br />
            ao server.
          </p>

          {/* Form card */}
          <div style={S.card} className="register-card">
            <PlayerRegisterForm />
          </div>

        </div>
      </div>
    </>
  );
}