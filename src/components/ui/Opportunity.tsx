import "./Opportunity.css";
import { Opportunity_type } from "../../types/types";
import { useDraggable } from "@dnd-kit/core";

export default function Opportunity({
  oppor_id,
  company,
  color,
  image,
}: Opportunity_type) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: oppor_id,
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
        key={oppor_id}
        className="opportunityInner"
        style={{ backgroundColor: color }}
      >
        <h3 className="companyText">{company}</h3>
        <img src={image} />
      </div>
    </div>
  );
}
