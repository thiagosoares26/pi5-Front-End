import { useEffect, useState } from "react";
import { GameCard } from "../components/GameCard";
import { api } from "../services/api";
import { PlayerSelect, PLAYERS } from "../components/PlayerSelect";
import "../styles/WatchListPage.css";

function getErrorDetail(err) {
    const detail = err?.detail ?? err?.data?.detail ?? err?.data ?? err?.message ?? err;
    if (Array.isArray(detail)) {
        return detail.map((item) => {
            const campo = item?.loc ? item.loc[item.loc.length - 1] : "campo";
            return `${campo}: ${item?.msg || JSON.stringify(item)}`;
        }).join("\n");
    }
    if (typeof detail === "object") return JSON.stringify(detail, null, 2);
    return String(detail || "Erro desconhecido");
}

export function WatchListPage() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState(false);
    const [selectedPlayerId, setSelectedPlayerId] = useState("");
    const [selectedTeamSlot, setSelectedTeamSlot] = useState("1");

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
            if (!selectedPlayerId) { alert("Erro: Nenhum jogador selecionado!"); return; }
            const playerEncontrado = PLAYERS.find(p => String(p.id) === String(selectedPlayerId));
            if (!playerEncontrado) { alert("Erro: Jogador não encontrado!"); return; }
            const teamSlot = Number(selectedTeamSlot);
            if (![1, 2].includes(teamSlot)) { alert("Escolha um slot válido: 1 ou 2."); return; }
            api.setToken(playerEncontrado.token);
            await api.post("/games", { player_id: playerEncontrado.id, team_slot: teamSlot, vs_random_bot: true });
            await fetchGamesList();
        } catch (err) {
            console.error("Erro completo da API:", err);
            alert(`Erro ao criar partida:\n${getErrorDetail(err)}`);
        } finally {
            setCreating(false);
        }
    }

    useEffect(() => { fetchGamesList(); }, []);

    return (
        <div className="wl-page">
            <div className="wl-inner">

                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "44px" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                        <div className="wl-badge">
                            <span className="wl-dot" />
                            Partidas ao vivo
                        </div>
                    </div>
                    <h1 className="wl-title">Selecione uma Partida</h1>
                    <p className="wl-subtitle">Lista das últimas partidas listadas.</p>
                </div>

                {/* Controls card */}
                <div className="wl-controls">

                    {/* Campo 1: Jogador */}
                    <div className="wl-field">
                        <span className="wl-label">1. Escolha seu jogador</span>
                        <PlayerSelect
                            value={selectedPlayerId}
                            onChange={setSelectedPlayerId}
                            label=""
                            variant="watchlist"
                        />
                    </div>

                    <div className="wl-divider" />

                    {/* Campo 2: Equipe */}
                    <div className="wl-field">
                        <span className="wl-label">2. Escolha sua equipe</span>
                        <select
                            className="wl-select"
                            value={selectedTeamSlot}
                            onChange={(e) => setSelectedTeamSlot(e.target.value)}
                        >
                            <option value="1">Equipe Turing</option>
                            <option value="2">Equipe Lovelace</option>
                        </select>
                    </div>

                    <div className="wl-divider" />

                    {/* Botões */}
                    <div className="wl-btn-row">
                        <button onClick={fetchGamesList} className="wl-btn-secondary" disabled={loading}>
                            {loading ? "Buscando..." : "↺ Atualizar"}
                        </button>
                        <button onClick={createNewGame} className="wl-btn-primary" disabled={creating}>
                            {creating ? "Iniciando..." : "+ Nova Partida"}
                        </button>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="wl-error">
                        ⚠ Erro ao carregar as partidas. Verifique se o seu token ainda é válido.
                    </div>
                )}

                {/* List */}
                {loading && games.length === 0 ? (
                    <div className="wl-state-box">A carregar partidas...</div>
                ) : !loading && !error && games.length === 0 ? (
                    <div className="wl-state-box">Nenhuma partida encontrada.</div>
                ) : (
                    <>
                        <div className="wl-list-header">
                            <span className="wl-list-title">Partidas recentes</span>
                            <span className="wl-list-count">{games.length} encontradas</span>
                        </div>
                        <div className="wl-list">
                            {games.map((game) => (
                                <GameCard key={game.id} game={game} />
                            ))}
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}