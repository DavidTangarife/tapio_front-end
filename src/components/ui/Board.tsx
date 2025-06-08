import "./Board.css";
import { useEffect, useState } from "react";
import { Board as Bt, Opportunity as Ot } from "../../types/types";
import Opportunity_Card from "./Opportunity";
import { useDroppable } from "@dnd-kit/core";

export default function Board_Card({ _id, title }: Bt) {
  const { setNodeRef } = useDroppable({
    id: _id,
  });

  const [opportunities, setOpportunities] = useState<Ot[]>([]);

  useEffect(() => {
    async function fetchOpportunities() {
      try {
        const res = await fetch(
          `http://localhost:3000/api/opportunity?statusId=${_id}`
        );
        const data = await res.json();
        setOpportunities(data);
      } catch (err) {
        console.error(`Failed to fetch opportunities for ${title}:`, err);
      }
    }

    fetchOpportunities();
  }, [_id]);

  return (
    <div key={_id} className="boardContainer">
      <h2 className="boardTitle">{title}</h2>
      <div ref={setNodeRef} className="opportunityList">
        {opportunities.map((opportunity) => (
          <Opportunity_Card key={opportunity._id} {...opportunity} />
        ))}
      </div>
    </div>
  );
}
