import { useState } from "react";
import "./Kanban.css";
import type { Board_Type, Opportunity_type } from "../../types/types";
import Board from "../../components/ui/Board";
import Header from "../../components/ui/Header"
import { DndContext, DragEndEvent } from "@dnd-kit/core";

const Boards: Board_Type[] = [
  { board_id: "APPLIED", title: "Applied", opportunities: [] },
  { board_id: "INTERVIEWING", title: "Interviewing", opportunities: [] },
  { board_id: "FUCKERS", title: "Fuckers", opportunities: [] },
  { board_id: "OTHER", title: "Other", opportunities: [] }
];

const mock_Opportunities: Opportunity_type[] = [
  {
    oppor_id: "1",
    company: "Seek",
    color: "navy",
    image: "logo.png",
    board: "APPLIED",
  },
  {
    oppor_id: "2",
    company: "Indeed",
    color: "blue",
    image: "logo2.png",
    board: "APPLIED",
  },
  {
    oppor_id: "3",
    company: "Domain",
    color: "green",
    image: "logo3.png",
    board: "APPLIED",
  },
  {
    oppor_id: "4",
    company: "REA",
    color: "red",
    image: "logo4.png",
    board: "INTERVIEWING",
  },
  {
    oppor_id: "5",
    company: "Crown Casino",
    color: "gold",
    image: "logo5.png",
    board: "OTHER",
  },
  {
    oppor_id: "6",
    company: "CBA",
    color: "gold",
    image: "logo6.png",
    board: "OTHER",
  },
  {
    oppor_id: "7",
    company: "CBA",
    color: "gold",
    image: "logo6.png",
    board: "OTHER",
  },
];

export default function Kanban() {
  const [Oppor, setOppor] = useState<Opportunity_type[]>(mock_Opportunities);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const OpporID = active.id as string; // We gotta manually typecast this two as there ir no way Dragevent can tell
    const newBoard = over.id as Opportunity_type["board"]; // We gotta manually typecast this two as there ir no way Dragevent can tell

    setOppor(() =>
      Oppor.map((op) =>
        op.oppor_id === OpporID ? { ...op, board: newBoard } : op
      )
    );
  }

  return (
   <>
   <div className="page">
      <div className="header-wrapper"><Header /></div>
    
      <div className="boardWrapper">
        <DndContext onDragEnd={handleDragEnd}>
          {Boards.map((board) => {
            return (
              <Board
                key={board.board_id}
                board_id={board.board_id}
                title={board.title}
                opportunities={Oppor.filter(
                  (op) => op.board === board.board_id
                )}
              />
            );
          })}
        </DndContext>
      </div>
    </div>

    </>
  );
}

// in production thi is not the best solution
//  opportunities={mock_Opportunities.filter(
//                 (mock_oppor) => mock_oppor.board === board.id
//               )}

// As we would be rendering every task eveyr column when it changes which is not a good perfromance
// instead ideally, you would go to the baord component and fetch the data inside that component, and only fetch the data
// for that specific column

//
