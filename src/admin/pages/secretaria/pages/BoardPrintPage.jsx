import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { apiGet } from "../../../../services/api";
import { getDayMonthYear, formatDateDMY } from "../../../../utils/date";
import formatUsername from "../../../utils/formatUsername";

export default function BoardPrintPage() {
  const { id } = useParams();
  const [params] = useSearchParams();

  const filename = params.get("filename");

  // ⚠️ CLAVE: esto se ejecuta inmediatamente
  if (filename) {
    document.title = filename;
  }

  const [board, setBoard] = useState(null);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readyToPrint, setReadyToPrint] = useState(false);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.action === "print" && readyToPrint) {
        window.print();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [readyToPrint]);

  useEffect(() => {
    if (!readyToPrint) return;

    window.opener?.postMessage({ action: "ready-to-print" }, "*");
  }, [readyToPrint]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const boardRes = await apiGet(`/secretaria/boards/get.php?id=${id}`);
        if (!boardRes?.success) throw new Error();

        const votesRes = await apiGet(
          `/secretaria/boards/votes/list.php?board_id=${id}`
        );

        setBoard(boardRes.board);
        setVotes(votesRes.votes || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setReadyToPrint(true);
      }
    };

    loadData();
  }, [id]);

  if (loading) return <p>Cargando acta...</p>;
  if (!board) return <p>Junta no encontrada</p>;

  const present = board.attendance.filter((a) => a.present);
  const absent = board.attendance.filter((a) => !a.present);

  return (
    <div className="board-print">
      {/* ENCABEZADO */}
      <header className="print-header">
        <h1>
          Junta ordinaria | {getDayMonthYear(board.meeting_date)?.monthName}{" "}
          {getDayMonthYear(board.meeting_date)?.year}
        </h1>
        <div className="print-header__meta">
          <div className="print-description">{board.description}</div>
          <div className="print-meta">
            <span>
              <strong>Nro de votos:</strong> {votes.length}
            </span>
            <span>
              <strong>Fecha:</strong> {formatDateDMY(board.meeting_date)}
            </span>
          </div>
        </div>
      </header>

      {/* ASISTENCIA */}
      <section className="print-attendance">
        <p>
          <strong>Asistentes:</strong>{" "}
          {present.map((a) => formatUsername(a.username)).join(", ")}
        </p>
        <p>
          <strong>Ausentes:</strong>{" "}
          {absent.map((a) => formatUsername(a.username)).join(", ")}
        </p>
      </section>
      <div className="print-divider"></div>
      {/* VOTOS */}
      <section className="print-votes">
        {votes.map((v) => (
          <article key={v.id} className="print-vote">
            <h3>
              Nro de voto: {v.vote_number}/{v.vote_year}
            </h3>

            <p className="vote-description">
              <strong>Descripción:</strong>
              <br />
              {v.description}
            </p>

            <p>
              <strong>Responsable:</strong>{" "}
              {v.responsible_name || "Sin responsable"}
            </p>

            <p>
              <strong>Estado:</strong>{" "}
              {v.fulfilled_date ? "Cumplido" : "Pendiente"}
            </p>
            <div className="print-divider"></div>
          </article>
        ))}
      </section>
      <section className="signature-section">
        <div className="signature-block">
          <div className="signature-line"></div>
          <p className="signature-name">Secretario/a</p>
          <p className="signature-role">Secretaría de Junta</p>
        </div>

        <div className="signature-block">
          <div className="signature-line"></div>
          <p className="signature-name">Pastor</p>
          <p className="signature-role">Pastor de Distrito</p>
        </div>
      </section>
    </div>
  );
}
