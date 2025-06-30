import "./Board.css";
import { Board as Bt, Opportunity as Ot } from "../../types/types";
import Opportunity_Card from "./Opportunity";
import { useDroppable } from "@dnd-kit/core";

export default function Board_Card({
  _id,
  title,
  opportunities,
  onOpportunityClick,
}: Bt & { onOpportunityClick: (op: Ot) => void }) {
  const { setNodeRef } = useDroppable({
    id: _id,
  });

  return (
    <div key={_id} className="boardContainer">
      <h2 className="boardTitle">{title}</h2>
      <div ref={setNodeRef} className="opportunityList">
        {opportunities.map((op) => (
          <Opportunity_Card
            key={op._id}
            {...op}
            onClick={() => onOpportunityClick(op)}
          />
        ))}
      </div>
    </div>
  );
}
