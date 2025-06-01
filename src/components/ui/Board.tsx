import { BoardProps } from "../../types/types";
import Opportunity from "./Opportunity";

export default function Board({ title, opportunities }: BoardProps) {
  return (
    <div>
      <h2>{title}</h2>
      <div className="opportunities">
        {opportunities.map((opportunity) => (
          <Opportunity key={opportunity.id} {...opportunity} />
        ))}
      </div>
    </div>
  );
}
