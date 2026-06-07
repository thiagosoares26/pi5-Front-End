import { Link } from "react-router-dom";
import "../styles/homePage.css";
 
const BOARD = [
  ["🔴","","","🔵",""],
  ["","🔴","🔵","",""],
  ["","","⬜","",""],
  ["","🔵","","🔴",""],
  ["🔵","","","","🔴"],
];
 
const features = [
  { icon: "🌐", title: "A API Web", desc: "Integração de backend que recebe e valida as jogadas do tabuleiro em tempo real.", accent: "featureAccentApi" },
  { icon: "🧠", title: "IA Heurística", desc: "Decisões autônomas tomadas por algoritmos baseados em pontuação e bloqueios estratégicos.", accent: "featureAccentIa" },
  { icon: "⚛️", title: "O Tabuleiro React", desc: "Interface frontend dinâmica que renderiza os níveis, os professores e o histórico de turnos.", accent: "featureAccentReact" },
];
 
export function HomePage() {
  return (
    <>
      <div className="page" style={{ display: "grid" }}>
 
        {/* ── NAV ── */}
        <nav className="nav">
          <a href="/" className="nav-logo">PI5 · AI</a>
          <ul className="nav-links">
            <li><a href="#features" className="nav-link">Funcionalidades</a></li>
            <li><a href="#team" className="nav-link">Equipe</a></li>
          </ul>
          <Link to="/battle" className="nav-cta">Batalhar →</Link>
        </nav>
 
        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-left">
            <div className="badge">
              <span className="badgeDot"></span>
              Projeto Integrador · PI5
            </div>
            <h1 className="heroTitle">
              Batalha de{" "}
              <span className="heroTitleHighlight">Inteligência</span>
              <br />Artificial
            </h1>
            <p className="heroSubtitle">
              Algoritmos autônomos competindo em um tabuleiro estratégico.
              Heurística, bloqueios, decisões em tempo real — assista ou entre na arena.
            </p>
            <div className="heroButtons">
              <Link to="/watch" className="btnPrimary">
                Assistir à Batalha
              </Link>
              <Link to="/battle" className="btnBattle">
                ⚔ Batalhar
              </Link>
            </div>
          </div>
 
          {/* Board visual */}
          <div className="heroRight">
            <div className="glowOrb" style={{ width: 300, height: 300, background: "#0072ff", top: "10%", right: "5%" }} />
            <div className="glowOrb" style={{ width: 220, height: 220, background: "#b24bff", bottom: "5%", right: "25%" }} />
            <div className="glowOrb" style={{ width: 180, height: 180, background: "#00d2ff", top: "30%", left: "10%" }} />
 
            <div className="board-float boardPreview">
              <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", color: "#3a4060", textTransform: "uppercase", marginBottom: "16px", textAlign: "center" }}>
                Tabuleiro · Turno 12
              </div>
              <div className="boardGrid">
                {BOARD.flat().map((cell, i) => (
                  <div key={i} className="boardCell" style={{
                    background: cell === "🔴" ? "rgba(255,71,87,0.15)" :
                                cell === "🔵" ? "rgba(0,114,255,0.15)" :
                                "rgba(255,255,255,0.03)",
                    borderColor: cell === "🔴" ? "rgba(255,71,87,0.35)" :
                                 cell === "🔵" ? "rgba(0,114,255,0.35)" :
                                 "rgba(255,255,255,0.06)",
                    boxShadow: cell === "🔴" ? "inset 0 0 8px rgba(255,71,87,0.2)" :
                               cell === "🔵" ? "inset 0 0 8px rgba(0,114,255,0.2)" : "none",
                  }}>
                    {cell}
                  </div>
                ))}
              </div>
              {/* Status bar */}
              <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700, color: "#3a4060" }}>
                <span style={{ color: "#ff4757" }}>🔴 Lovelace</span>
                <span style={{ color: "#0072ff" }}>🔵 Turing</span>
              </div>
            </div>
          </div>
        </section>
 
        {/* ── FEATURES ── */}
        <section id="features" className="featuresSection">
          <p className="sectionLabel">Como funciona</p>
          <h2 className="sectionTitle">Três pilares do projeto</h2>
          <div className="featuresGrid">
            {features.map((f) => (
              <div key={f.title} className="feature-card-hover featureCard">
                <div className={f.accent} />
                <span className="featureIcon">{f.icon}</span>
                <div className="featureTitle">{f.title}</div>
                <div className="featureDesc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>
 
        {/* ── TEAM ── */}
        <section id="team" className="teamSection">
          <p className="sectionLabel">Quem fez</p>
          <h2 className="sectionTitle">Equipe de desenvolvimento</h2>
          <div className="teamGrid">
            {["👨‍💻 Thiago Soares", "👨‍💻 Tatiana Maturano", "🎓 Guilherme Rey"].map((m) => (
              <a key={m} href="#" className="team-member-hover team-member">
                {m}
              </a>
            ))}
          </div>
        </section>
 
      </div>
    </>
  );
}