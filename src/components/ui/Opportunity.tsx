import "./Opportunity.css";
import { Opportunity } from "../../types/types";
import { useDraggable } from "@dnd-kit/core";

export default function OpportunityCard({
  _id,
  title,
  company,
  onClick,
  isDraggingRef,
}: Opportunity & {
  onClick: () => void;
  isDraggingRef: React.RefObject<boolean>;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: _id,
    });

  const handleTitleClick = (event: React.MouseEvent) => {
    // Only handle click on title if drag wasn't activated
    event.stopPropagation();
    if (!isDraggingRef.current) {
      onClick();
    }
  };

  const observe_drag = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    opacity: isDragging ? 0.6 : 1,
  };

  const LOGO_PUB = import.meta.env.VITE_LOGO_PUB;

  return (
    <div
      ref={setNodeRef}
      className="opportunityContainer"
      data-testid="opportunity"
      style={observe_drag}
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
    </div>
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
