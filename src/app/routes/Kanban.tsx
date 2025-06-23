import { useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Kanban.css";
import Header from "../../components/ui/Header";
import type { Board as Bt, Opportunity as Ot } from "../../types/types";
import Board_Card from "../../components/ui/Board";
import { DndContext, DragEndEvent } from "@dnd-kit/core";

export default function Kanban() {
  const data = useLoaderData()
  const [boards, setBoards] = useState<Bt[]>([]);

  useEffect(() => {
    setBoards(data)

  }, [data]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event; // active -> Draggable Item that was move, over -> droppable board where item was dropped

    if (!over) return; // If dropped in non valid area do nothing

    const OpportunityId = active.id as string; // We gotta manually typecast this two as there ir no way Dragevent can tell -> match opportunity._id
    const newStatusId = over.id as string; // We gotta manually typecast this two as there ir no way Dragevent can tell -> match board._id

    setBoards((prevBoards: Bt[]) => {
      // Remove the opportunity from its board by making a coppy of all the boards and just filtering the one that matched the Dragged one (OpportunityId)
      const updateBoards: Bt[] = prevBoards.map((board) => ({
        ...board,
        opportunities: board.opportunities.filter(
          (op) => op._id !== OpportunityId
        ),
      }));

      // Find the moved opportunity by flattening the original Boards into one array of opportunities and then search for the one being Dragged
      const movedOpportunity: Ot | undefined = prevBoards
        .flatMap((board) => board.opportunities) // Insert all the opportunitiesfrom every board into one array.
        .find((op) => op._id === OpportunityId); // find the opportunities that matched the Dragged one (OpportunityId)

      if (!movedOpportunity) return prevBoards;

      // Add it to the new Board
      return updateBoards.map((board) => {
        if (board._id === newStatusId) {
          return {
            ...board, // Clone the board with its properties
            opportunities: [
              ...board.opportunities, // Clone the opportuinites for that board
              { ...movedOpportunity, statusId: newStatusId }, // Append the opportunity and update the statusId of the opportunity that was dragged to the board.
            ],
          };
        }
        return board; // Return all the other boards that did not match the newstatus
      });
    });

    // Call the backend to patch the Opportunity and modify the status
    fetch(`http://localhost:3000/api/opportunity/${OpportunityId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statusId: newStatusId }),
    }).catch((err) => {
      console.error("Failed to update opportunity:", err);
    });
  }

  return (
    <>
      <div className="page">
        <div className="header-wrapper">
          <Header />
        </div>

        <div className="boardWrapper">
          <DndContext onDragEnd={handleDragEnd}>
            {boards.map((board) => {
              return <Board_Card key={board._id} {...board} />;
            })}
          </DndContext>
        </div>
      </div>
    </>
  );
}
