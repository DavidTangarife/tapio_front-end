import "./Board.css";
import { Board_Type } from "../../types/types";
import Opportunity from "./Opportunity";
import { useDroppable } from "@dnd-kit/core";

export default function Board({ board_id, title, opportunities }: Board_Type) {
  const { setNodeRef } = useDroppable({
    id: board_id,
  });

  return (
    <div key={board_id} className="boardContainer">
      <h2 className="boardTitle">{title}</h2>
      <div ref={setNodeRef} className="opportunityList">
        {opportunities.map((opportunity) => (
          <Opportunity key={opportunity.oppor_id} {...opportunity} />
        ))}
      </div>
    </div>
  );
}
