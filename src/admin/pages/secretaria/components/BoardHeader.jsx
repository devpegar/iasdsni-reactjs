// admin/secretaria/components/BoardHeader.jsx
import { formatDateDMY } from "../../../../utils/date";

export default function BoardHeader({ board }) {
  return (
    <div className="board-header">
      <div>
        <h2 className="board-header__title">
          Junta del {formatDateDMY(board.meeting_date)}
        </h2>

        {board.description && (
          <p className="board-header__description">{board.description}</p>
        )}
      </div>

      <div className="board-meta">
        <span className="board-meta__text">
          <strong className="board-meta__strong">Votos:</strong>{" "}
          {board.votes_count}
        </span>

        <span className="board-meta__text">
          <strong className="board-meta__strong">Creada:</strong>{" "}
          {new Date(board.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
