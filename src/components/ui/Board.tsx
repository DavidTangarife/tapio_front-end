import "./Board.css";
import OpportunityCard from "./Opportunity";
import { Board as Bt, Opportunity as Ot } from "../../types/types";
import { useDroppable } from "@dnd-kit/core";
import BoardHeading from "./BoardHeading";

type BoardCardProps = {
  _id: string
  title: string
  opportunities: unknown
  currentFocus: HTMLInputElement | null
  setCurrentFocus: (e: HTMLInputElement) => void
  onOpportunityClick: (op: Ot) => void;
  isDraggingRef: React.RefObject<boolean>;
}

export default function BoardCard(props: BoardCardProps) {
  const { _id, title, opportunities, currentFocus, setCurrentFocus, onOpportunityClick, isDraggingRef } = props
  const { setNodeRef } = useDroppable({
    id: props._id,
  });

  return (
    <div key={_id} className="boardContainer">
      <BoardHeading title={title} setCurrentFocus={setCurrentFocus} currentFocus={currentFocus} columnId={_id} />
      <div ref={setNodeRef} className="opportunityList">
        {opportunities.map((opportunity) => (
          <OpportunityCard key={opportunity._id} {...opportunity} 
            isDraggingRef={isDraggingRef}
            onClick={() => onOpportunityClick(opportunity)}/>
      </div>
    </div >
  );
}
