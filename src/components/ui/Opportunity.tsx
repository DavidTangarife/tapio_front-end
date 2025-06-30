import "./Opportunity.css";
import { Opportunity } from "../../types/types";
import { useDraggable } from "@dnd-kit/core";
import { useRef } from "react";

export default function Opportunity_Card({
  _id,
  title,
  company,
  onClick,
}: Opportunity & { onClick: () => void }) {
  const holdTimeout = useRef<NodeJS.Timeout>(null); //Used to implement the 300ms hold before enabling drag.
  const pointerDownPos = useRef<{ x: number; y: number }>(null); // Detect how far the pointer moves when user is holding click down
  const dragActivated = useRef(false); // Flag to detect if Dragging has been activated it

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: _id,
  });

  const handlePointerDown = (event: React.PointerEvent) => {
    // user clicks , save the current pointer position, and starts a 300ms delay
    dragActivated.current = false;
    pointerDownPos.current = { x: event.clientX, y: event.clientY };

    holdTimeout.current = setTimeout(() => {
      dragActivated.current = true;
    }, 200);
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    // If the user moves more than 5px before 300ms, cancel the timeout and enable drag
    if (!pointerDownPos.current || dragActivated.current) return;

    const dx = event.clientX - pointerDownPos.current.x;
    const dy = event.clientY - pointerDownPos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 5) {
      if (holdTimeout.current) {
        clearTimeout(holdTimeout.current);
        holdTimeout.current = null;
      }
      dragActivated.current = true;
    }
  };

  const handlePointerUp = () => {
    // Reset everything when pointer interaction ends or if anything interrupts it
    if (holdTimeout.current) {
      clearTimeout(holdTimeout.current);
      holdTimeout.current = null;
    }

    // Reset after a short delay to allow drag to complete
    setTimeout(() => {
      pointerDownPos.current = null;
      dragActivated.current = false;
    }, 50);
  };

  const handleTitleClick = (event: React.MouseEvent) => {
    // Only handle click on title if drag wasn't activated
    event.stopPropagation();
    if (!dragActivated.current) {
      onClick();
    }
  };

  const observe_drag = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  const LOGO_PUB = import.meta.env.VITE_LOGO_PUB;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="opportunityContainer"
      data-testid="opportunity"
      style={observe_drag}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
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
