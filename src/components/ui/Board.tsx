import "./Board.css";
import OpportunityCard from "./Opportunity";
import { useDroppable } from "@dnd-kit/core";
import BoardHeading from "./BoardHeading";

type BoardCardProps = {
  _id: string
  title: string
  opportunities: unknown
  currentFocus: HTMLInputElement | null
  setCurrentFocus: (e: HTMLInputElement) => void
}

export default function BoardCard(props: BoardCardProps) {
  const { _id, title, opportunities, currentFocus, setCurrentFocus } = props
  const { setNodeRef } = useDroppable({
    id: props._id,
  });

  return (
    <div key={_id} className="boardContainer">
      <BoardHeading title={title} setCurrentFocus={setCurrentFocus} currentFocus={currentFocus} columnId={_id} />
      <div ref={setNodeRef} className="opportunityList">
        {opportunities.map((opportunity) => (
          <OpportunityCard key={opportunity._id} {...opportunity} />
        ))}
      </div>
    </div >
  );
}
