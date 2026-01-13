import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../../../../services/api";
import BoardHeader from "../components/BoardHeader";
import VotesList from "../components/VotesList";

export default function BoardDetailPage() {
  const { id } = useParams();

  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    apiGet(`/secretaria/boards/get.php?id=${id}`)
      .then((res) => {
        if (!res.success) {
          throw new Error(res.message || "Error al cargar junta");
        }
        setBoard(res.board);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Cargando junta...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!board) return <p>Junta no encontrada</p>;

  // console.log(id, board.id);

  return (
    <div className="board-detail--page">
      <BoardHeader board={board} />

      <div className="board-detail-content">
        <VotesList
          boardId={board.id}
          boardMeetingDate={board.meeting_date}
          attendance={board.attendance}
        />
      </div>
    </div>
  );
}
