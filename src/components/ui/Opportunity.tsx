import "./Opportunity.css";
import { Opportunity } from "../../types/types";
import { useDraggable } from "@dnd-kit/core";

export default function Opportunity_Card({ _id, title, company }: Opportunity) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: _id,
  });

  const observe_drag = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  const LOGO_PUB = import.meta.env.VITE_LOGO_PUB;
  console.log(LOGO_PUB);

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
        // style={{ backgroundColor: color }}
      >
        <h2 className="companyText">{company.name}</h2>
        <h3 className="titleText">{title}</h3>
        <img
          className="companyLogo"
          src={`${company.logoUrl}?token=${LOGO_PUB}`}
        />
      </div>
    </div>
  );
}
