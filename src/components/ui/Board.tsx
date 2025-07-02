import "./Board.css";
import OpportunityCard from "./Opportunity";
import { Opportunity as Ot } from "../../types/types";
import { useDroppable } from "@dnd-kit/core";
import BoardHeading from "./BoardHeading";

type BoardCardProps = {
  _id: string;
  title: string;
  opportunities: Ot[];
  currentFocus: HTMLInputElement | null;
  setCurrentFocus: (e: HTMLInputElement) => void;
  onOpportunityClick: (op: Ot) => void;
  isDraggingRef: React.RefObject<boolean>;
  setActivator: (bool: boolean) => void;
};

export default function BoardCard(props: BoardCardProps) {
  const {
    _id,
    title,
    opportunities,
    currentFocus,
    setCurrentFocus,
    onOpportunityClick,
    isDraggingRef,
    setActivator,
  } = props;
  const { setNodeRef } = useDroppable({
    id: props._id,
  });

  const mouseEntered = () => {
    setActivator(false);
  };

  const mouseLeft = () => {
    setActivator(true);
  };

  return (
    <div key={_id} className="boardContainer" ref={setNodeRef}>
      <BoardHeading
        title={title}
        setCurrentFocus={setCurrentFocus}
        currentFocus={currentFocus}
        columnId={_id}
      />
      <div
        className="opportunityList"
        onMouseEnter={mouseEntered}
        onMouseLeave={mouseLeft}
      >
        {opportunities.map((opportunity: Ot) => (
          <OpportunityCard
            key={opportunity._id}
            {...opportunity}
            isDraggingRef={isDraggingRef}
            onClick={() => onOpportunityClick(opportunity)}
          />
        ))}
      </div>
    </div>
  );
}
