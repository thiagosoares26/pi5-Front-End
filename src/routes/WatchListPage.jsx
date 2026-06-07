import { useEffect, useState } from "react";
import { GameCard } from "../components/GameCard";
import { api } from "../services/api";
import { PlayerSelect, PLAYERS } from "../components/PlayerSelect";
import "../styles/WatchListPage.css";
 
export function WatchListPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
 
  async function fetchGamesList() {
    setLoading(true);
    setError(false);
    try {
      const data = await api.get("/games?page=1&page_size=20");
      setGames(data.items || []);
    } catch (err) {
      console.error("Erro ao buscar lista:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }
 
  async function createNewGame() {
    setCreating(true);
    try {
      if (!selectedPlayerId) {
        alert("Erro: Nenhum jogador selecionado!");
        setCreating(false);
        return;
      }
      const playerEncontrado = PLAYERS.find(p => String(p.id) === String(selectedPlayerId));
      if (!playerEncontrado) {
        alert("Erro: Jogador não encontrado!");
        setCreating(false);
        return;
      }
      await api.post("/games", { player_id: playerEncontrado.id, team_slot: 1, vs_random_bot: true });
      fetchGamesList();
    } catch (err) {
      const msg = err?.detail
        ? (Array.isArray(err.detail)
          ? err.detail.map(e => `${e.loc?.at(-1)}: ${e.msg}`).join("\n")
          : err.detail)
        : "Erro desconhecido";
      alert(`Erro ao criar partida:\n${msg}`);
    } finally {
      setCreating(false);
    }
  }
 
  useEffect(() => { fetchGamesList(); }, []);
 
  return (
    <>
      <div className="page">
        <div className="inner">
 
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "44px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
              <div className="badge">
                <span className="dot" />
                Partidas ao vivo
              </div>
            </div>
            <h1 className="title">Selecione a Partida</h1>
            <p className="subtitle">Lista das últimas partidas geradas no servidor.</p>
          </div>
 
          {/* Controls card */}
          <div className="controls">
            <div className="playerBlock">
              <span className="label">Jogar como:</span>
              {/* If PlayerSelect renders its own select, wrap it; otherwise use inline select */}
              <PlayerSelect
                value={selectedPlayerId}
                onChange={setSelectedPlayerId}
                label=""
                variant="watchlist"
              />
            </div>
            <div className="btnRow">
              <button
                onClick={fetchGamesList}
                className="wl-btn-secondary btnSecondary"
                disabled={loading}
              >
                {loading ? "Buscando..." : "↺ Atualizar"}
              </button>
              <button
                onClick={createNewGame}
                className="wl-btn-primary btnPrimary"
                disabled={creating}
              >
                {creating ? "Iniciando..." : "+ Nova Partida"}
              </button>
            </div>
          </div>
 
          {/* Error */}
          {error && (
            <div className="errorText">
              ⚠ Erro ao carregar as partidas. Verifique se o seu token ainda é válido.
            </div>
          )}
 
          {/* List */}
          {loading && games.length === 0 ? (
            <div className="stateBox">A carregar partidas...</div>
          ) : !loading && !error && games.length === 0 ? (
            <div className="stateBox">Nenhuma partida encontrada.</div>
          ) : (
            <>
              <div className="listHeader">
                <span className="listTitle">Partidas recentes</span>
                <span className="listCount">{games.length} encontradas</span>
              </div>
              <div className="list">
                {games.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            </>
          )}
 
        </div>
      </div>
    </>
  );
}