import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BoardCell } from "../components/BoardCell";
import { api } from "../services/api";
import "../styles/WatchGamePage.css";

/* ── helpers (sem alteração) ── */
function sameId(a, b) {
    if (a === undefined || a === null || b === undefined || b === null) return false;
    return String(a) === String(b);
}
function getPlayerName(player, fallback) {
    return player?.ai_player_name || player?.group_name || player?.name || fallback;
}
function getWinnerId(game) {
    return game?.winner_player_id ?? game?.winner_id ?? game?.winner?.id ?? game?.winner_player?.id ?? game?.game?.winner_player_id ?? game?.game?.winner_id ?? null;
}
function getTuringId(game) {
    return game?.turing_player?.id ?? game?.turing_player_id ?? game?.game?.turing_player?.id ?? game?.game?.turing_player_id ?? null;
}
function getLovelaceId(game) {
    return game?.lovelace_player?.id ?? game?.lovelace_player_id ?? game?.game?.lovelace_player?.id ?? game?.game?.lovelace_player_id ?? null;
}
function getWinnerName(game) {
    const winnerId = getWinnerId(game);
    const turingId = getTuringId(game);
    const lovelaceId = getLovelaceId(game);
    const turingName = getPlayerName(game?.turing_player, "Jogador 1");
    const lovelaceName = getPlayerName(game?.lovelace_player, "Jogador 2");
    if (sameId(winnerId, turingId)) return turingName;
    if (sameId(winnerId, lovelaceId)) return lovelaceName;
    return "Vencedor indefinido";
}
function isFinished(game) {
    return String(game?.status || "").toUpperCase() === "FINISHED";
}
function getPhaseLabel(phase) {
    return phase === "setup_placement" ? "Setup" : "Batalha";
}
function formatId(idValue) {
    if (idValue === undefined || idValue === null) return "sem id";
    return `#${idValue}`;
}
function formatGameTitleId(id) {
    if (!id) return "";
    const text = String(id);
    if (text.length <= 16) return text;
    return `${text.slice(0, 8)}...${text.slice(-6)}`;
}
function logWinnerDebug(game) {
    console.table({
        winner_player_id: getWinnerId(game),
        turing_player_id: getTuringId(game),
        turing_name: getPlayerName(game?.turing_player, "Jogador 1"),
        lovelace_player_id: getLovelaceId(game),
        lovelace_name: getPlayerName(game?.lovelace_player, "Jogador 2"),
        winner_name_resolvido_pelo_front: getWinnerName(game),
    });
}

/* ── InfoPill ── */
function InfoPill({ label, value, subValue, accent }) {
    return (
        <div className="wg-pill">
            <span className="wg-pill-label">{label}</span>
            <span className={`wg-pill-value${accent ? " wg-pill-value--accent" : ""}`}>
                {value}
            </span>
            {subValue && <span className="wg-pill-subvalue">{subValue}</span>}
        </div>
    );
}

/* ── WatchGamePage ── */
export function WatchGamePage() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const loggedFinishedGameRef = useRef(false);

    async function fetchGame() {
        setError(false);
        try {
            const game = await api.get(`/games/${id}`);
            setData(game);
            if (isFinished(game) && !loggedFinishedGameRef.current) {
                loggedFinishedGameRef.current = true;
                logWinnerDebug(game);
            }
        } catch (err) {
            console.error("Erro ao carregar partida:", err);
            if (!data) setError(true);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!id) return;
        loggedFinishedGameRef.current = false;
        fetchGame();
        const intervalId = setInterval(() => { fetchGame(); }, 1000);
        return () => clearInterval(intervalId);
    }, [id]);

    const turingName  = getPlayerName(data?.turing_player, "Jogador 1");
    const lovelaceName = getPlayerName(data?.lovelace_player, "Jogador 2");
    const turingId    = getTuringId(data);
    const lovelaceId  = getLovelaceId(data);
    const winnerId    = getWinnerId(data);
    const winnerName  = data ? getWinnerName(data) : "";

    return (
        <div className="wg-page">
            <div className="wg-inner">

                {/* Título */}
                <h1 className="wg-title">
                    Assistindo Jogo{" "}
                    <span className="wg-title-id">#{formatGameTitleId(id)}</span>
                </h1>

                {/* Voltar */}
                <Link to="/watch" className="wg-back-link">
                    ← Voltar para a lista
                </Link>

                {/* Loading */}
                {loading && !data && (
                    <div className="wg-status-box">Iniciando conexão com a arena...</div>
                )}

                {/* Erro */}
                {error && (
                    <div className="wg-error-box">
                        ⚠ Erro ao carregar os dados da partida.
                    </div>
                )}

                {/* Conteúdo */}
                {data && data.board && (
                    <>
                        {/* Painel de info */}
                        <div className="wg-panel">

                            <div className="wg-info-row">
                                <InfoPill label="Turno"   value={data.current_turn_number ?? "-"} />
                                <InfoPill label="Status"  value={data.status ?? "DESCONHECIDO"} accent={isFinished(data)} />
                                <InfoPill label="Fase"    value={getPhaseLabel(data.current_turn_phase)} />
                                <InfoPill label="Turing"  value={turingName}   subValue={formatId(turingId)} />
                                <InfoPill label="Lovelace" value={lovelaceName} subValue={formatId(lovelaceId)} />
                            </div>

                            {isFinished(data) && (
                                <>
                                    <div className="wg-divider" />

                                    <div className="wg-winner">
                                        <span className="wg-winner-trophy">🏆</span>
                                        <span className="wg-winner-label">Vencedor:</span>
                                        <span className="wg-winner-name">{winnerName}</span>
                                    </div>

                                    <details className="wg-debug">
                                        <summary>Dados técnicos</summary>
                                        <div className="wg-debug-grid">
                                            <div className="wg-debug-item">
                                                <strong>winner_player_id:</strong><br />
                                                {winnerId ?? "sem winner_player_id"}
                                            </div>
                                            <div className="wg-debug-item">
                                                <strong>turing_player_id:</strong><br />
                                                {turingId ?? "sem id"}
                                            </div>
                                            <div className="wg-debug-item">
                                                <strong>lovelace_player_id:</strong><br />
                                                {lovelaceId ?? "sem id"}
                                            </div>
                                        </div>
                                    </details>
                                </>
                            )}
                        </div>

                        {/* Tabuleiro */}
                        <div className="wg-board-outer">
                            <div className="board-container">
                                <div className="board-grid">
                                    {data.board.map((row, rowIndex) =>
                                        row.map((cell, colIndex) => (
                                            <BoardCell
                                                key={`${rowIndex}-${colIndex}`}
                                                level={cell.level}
                                                professor={cell.professor}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}