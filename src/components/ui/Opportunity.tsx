import { OpportunityProps } from "../../types/types";

export default function Opportunity({
  id,
  company,
  color,
  image,
}: OpportunityProps) {
  return (
    <div>
      <div
        key={id}
        data-testid="opportunity"
        className="opportunity"
        style={{ backgroundColor: color }}
      >
        <img src={image} />
        <h3>{company}</h3>
      </div>
    </div>
  );
}
