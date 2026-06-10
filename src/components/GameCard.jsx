import { Link } from "react-router-dom";
import "../styles/GameCard.css";

export function GameCard({ game }) {
    const turingPlayer = game.turing_player;
    const lovelacePlayer = game.lovelace_player;

    const player1Name = turingPlayer?.ai_player_name || turingPlayer?.group_name || "Bot 1";
    const player2Name = lovelacePlayer?.ai_player_name || lovelacePlayer?.group_name || "Bot 2";

    const turingImg = turingPlayer?.ai_player_avatar;
    const lovelaceImg = lovelacePlayer?.ai_player_avatar;

    const finished = game.status === "FINISHED";
    const winnerName = game.winner_player_id === turingPlayer?.id ? player1Name : player2Name;

    return (
        <div className="gc-card">
            {/* Players */}
            <div className="gc-players">
                <div className="gc-player">
                    {turingImg ? (
                        <img
                            src={turingImg}
                            alt={player1Name}
                            className="gc-avatar"
                            onError={(e) => { e.target.style.display = "none"; }}
                        />
                    ) : (
                        <div className="gc-avatar gc-avatar--placeholder">
                            {player1Name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <span className="gc-player-name">{player1Name}</span>
                </div>

                <span className="gc-vs">VS</span>

                <div className="gc-player">
                    {lovelaceImg ? (
                        <img
                            src={lovelaceImg}
                            alt={player2Name}
                            className="gc-avatar"
                            onError={(e) => { e.target.style.display = "none"; }}
                        />
                    ) : (
                        <div className="gc-avatar gc-avatar--placeholder">
                            {player2Name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <span className="gc-player-name">{player2Name}</span>
                </div>
            </div>

            {/* Status */}
            <div className="gc-meta">
                {finished ? (
                    <span className="gc-status gc-status--finished">
                        🏆 {winnerName}
                    </span>
                ) : (
                    <span className="gc-status gc-status--live">
                        <span className="gc-live-dot" />
                        Turno {game.current_turn_number ?? "—"}
                    </span>
                )}
            </div>

            {/* CTA */}
            <Link to={`/watch/${game.id}`} className="gc-btn">
                Assistir
            </Link>
        </div>
    );
}