import "./Board.css";
import { Board as Bt, Opportunity as Ot } from "../../types/types";
import Opportunity_Card from "./Opportunity";
import { useDroppable } from "@dnd-kit/core";

export default function Board_Card({
  _id,
  title,
  opportunities,
  onOpportunityClick,
  isDraggingRef,
}: Bt & {
  onOpportunityClick: (op: Ot) => void;
  isDraggingRef: React.RefObject<boolean>;
}) {
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
            isDraggingRef={isDraggingRef}
            onClick={() => onOpportunityClick(op)}
          />
        ))}
      </div>
    </div>
  );
}
