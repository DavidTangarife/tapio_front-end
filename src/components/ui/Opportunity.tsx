import "./Opportunity.css";
import { Opportunity } from "../../types/types";
import { useDraggable } from "@dnd-kit/core";

export default function Opportunity_Card({
  _id,
  title,
  company,
  color,
}: Opportunity) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: _id,
  });

  const observe_drag = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="opportunityContainer"
      data-testid="opportunity"
      style={observe_drag}
    >
      <div
        key={_id}
        className="opportunityInner"
        style={{ backgroundColor: color }}
      >
        <h2 className="companyText">{company.name}</h2>
        <h3 className="titleText">{title}</h3>
        <img src={company.faviconUrl} />
      </div>
    </div>
  );
}
