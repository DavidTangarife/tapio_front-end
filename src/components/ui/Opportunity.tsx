import "./Opportunity.css";
import { CSS } from "@dnd-kit/utilities"
import { useSortable } from "@dnd-kit/sortable";
import { Board, Opportunity } from "../../types/types";

type OpportunityCardProps = {
  _id: string
  title: string
  company: string
  // opportunities: Opportunity[]
  opportunityList: Opportunity[]
  board: Board
  onOpportunityClick: (opportunity: Opportunity) => void;
  self: Opportunity
}

export default function OpportunityCard(props: OpportunityCardProps) {
  const { _id, title, company, onOpportunityClick, board, opportunityList, self } = props

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: _id,
    data: {
      type: "Opportunity",
      opportunity: props,
      opportunityList: opportunityList,
      board: board
    },
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  }
  const handleTitleClick = (event: React.MouseEvent) => {
    // Only handle click on title if drag wasn't activated
    event.stopPropagation();
    onOpportunityClick(self)
  };

  const LOGO_PUB = import.meta.env.VITE_LOGO_PUB;

  if (isDragging) {
    return <div className="draggingOpportunity"
      ref={setNodeRef}
      style={style}
    ></div>
  }

  return (
    <div
      className="opportunityContainer"
      data-testid="opportunity"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div key={_id} className="opportunityInner">
        <h2 className="companyText" onClick={handleTitleClick}>
          {company.name}
        </h2>
        <h3 className="titleText">{title}</h3>
        <img
          className="companyLogo"
          src={`${company.logoUrl}?token=${LOGO_PUB}`}
        />
      </div>
    </div >
  );
}

// By default, @dnd-kit starts a drag immediately on pointer down (like mouse down or touch start).
// But if the drag starts immediately, any small movement can be a drag, and clicks might still fire.

// Setting activationConstraint.distance: 5 means: on kanban
// The drag will only activate if the user moves their opportunity by at least 2 pixels.
// This prevents tiny accidental drags on a normal click keeping the onClick fire correctly when intended.

// isDragging flag to track drag state
// Using a useRef named isDragging that holds whether a drag is happening or not.
// On onDragStart, set isDragging.current = true — meaning: user has started dragging.
// On onDragEnd, reset isDragging.current = false — drag has ended.
// Because React’s onClick event fires after the pointer is released (after drag ends). So even if the user dragged, the onClick event may still fire on release.
// By checking if (!isDraggingRef.current) then do onClick(); we prevent the popup from opening if the user was dragging.
