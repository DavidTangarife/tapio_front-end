import "./Board.css";
import { Board as Bt } from "../../types/types";
import Opportunity_Card from "./Opportunity";
import { useDroppable } from "@dnd-kit/core";

export default function Board_Card({ _id, title, opportunities }: Bt) {
  const { setNodeRef } = useDroppable({
    id: _id,
  });

  return (
    <div key={_id} className="boardContainer">
      <h2 className="boardTitle">{title}</h2>
      <div ref={setNodeRef} className="opportunityList">
        {opportunities.map((opportunity) => (
          <Opportunity_Card key={opportunity._id} {...opportunity} />
        ))}
      </div>
    </div>
  );
}
