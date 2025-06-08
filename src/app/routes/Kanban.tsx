import { useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Kanban.css";
import type { Board as Bt, Opportunity as Ot } from "../../types/types";
import Board_Card from "../../components/ui/Board";
import { DndContext, DragEndEvent } from "@dnd-kit/core";

export default function Kanban() {
  const { _id } = useLoaderData() as { _id: string }; // Because we are using Type script I need to specify what im return form my loader
  const [boards, setBoards] = useState<Bt[]>([]);

  useEffect(() => {
    async function fetchBoards() {
      try {
        const res = await fetch(
          `http://localhost:3000/api/status?projectId=${_id}`
        );
        const data = await res.json();
        console.log("✅ Boards data from API:", data);
        setBoards(data);
      } catch (err) {
        console.error(`Failed to fetch boards for project ${_id}:`, err);
      }
    }

    fetchBoards();
  }, [_id]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const OpporID = active.id as string; // We gotta manually typecast this two as there ir no way Dragevent can tell
    const newBoard = over.id as Ot["board_id"]; // We gotta manually typecast this two as there ir no way Dragevent can tell
  }

  // Ideally: Optimistically update local state here or trigger a Zustand action

  // Send update to backend
  //   fetch(`/api/opportunities/${opportunityId}`, {
  //     method: "PATCH",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ board_id: newBoardId }),
  //   }).catch((err) => console.error("Failed to move opportunity", err));
  // }

  return (
    <div className="page">
      <div className="boardWrapper">
        <DndContext onDragEnd={handleDragEnd}>
          {boards.map((board) => {
            return <Board_Card key={board._id} {...board} />;
          })}
        </DndContext>
      </div>
    </div>
  );
}
