import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { PlayerSelect, PLAYERS } from "../components/PlayerSelect";
import "../styles/BattlePage.css";
 
export function BattlePage() {
  const navigate = useNavigate();
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [opponentId, setOpponentId] = useState("");
  const [creating, setCreating] = useState(false);
 
  async function handleChallenge(e) {
    e.preventDefault();
    setCreating(true);
    try {
      if (!selectedPlayerId) { alert("Selecione o seu lutador primeiro!"); setCreating(false); return; }
      const playerEncontrado = PLAYERS.find(p => String(p.id) === String(selectedPlayerId));
      if (!playerEncontrado) { alert("Jogador não encontrado!"); setCreating(false); return; }
      if (!opponentId) { alert("Digite o ID do grupo adversário!"); setCreating(false); return; }
 
      const response = await api.post("/games", {
        player_id: playerEncontrado.id,
        opponent_id: parseInt(opponentId),
        team_slot: 1,
        vs_random_bot: false,
      });
      const data = response.data || response;
      navigate(data?.id ? `/watch/${data.id}` : "/watch");
    } catch (err) {
      const msg = err?.detail
        ? (typeof err.detail === "string" ? err.detail : JSON.stringify(err.detail))
        : "Erro ao criar a batalha.";
      alert(`Falha no combate:\n${msg}`);
    } finally {
      setCreating(false);
    }
  }
 
  return (
    <>
      <div className="page">
        <div className="inner">
 
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <div className="badge">
              <span className="dot" />
              Arena de Batalha
            </div>
          </div>
          <h1 className="title">⚔️ Entre em Combate</h1>
          <p className="subtitle">
            Prepare seu bot para o torneio.<br />
            Insira o ID do adversário e inicie o combate.
          </p>
 
          {/* Form card */}
          <div className="card">
 
            {/* Step 1 — player select */}
            <div className="fieldGroup">
              <label className="fieldLabel">1. Selecione o seu lutador</label>
              <PlayerSelect
                value={selectedPlayerId}
                onChange={setSelectedPlayerId}
                label=""
                variant="battle"
              />
            </div>
 
            <div className="divider" />
 
            {/* Step 2 — opponent ID */}
            <div className="fieldGroup" style={{ marginBottom: "32px" }}>
              <label className="fieldLabel">2. ID do Grupo Adversário</label>
              <input
                type="number"
                placeholder="Ex: 42"
                className="battle-input input"
                value={opponentId}
                onChange={(e) => setOpponentId(e.target.value)}
              />
            </div>
 
            {/* Submit */}
            <button
              onClick={handleChallenge}
              disabled={creating}
              className="battle-btn btnDanger"
            >
              {creating ? "⏳ Gerando Arena..." : "⚔️ Entrar em Combate"}
            </button>
          </div>
 
        </div>
      </div>
    </>
  );
}