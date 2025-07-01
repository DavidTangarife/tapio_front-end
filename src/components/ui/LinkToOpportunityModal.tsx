import "./LinkToOpportunityModal.css";
import { Opportunity } from "../../types/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const LinkToOppModal = ({
  projectId,
  closeModal,
}: {
  projectId?: string;
  closeModal: () => void;
}) => {
  const [opportunities, setopportunities] = useState<Opportunity[]>([]);
  const { emailId } = useParams();

  useEffect(() => {
    if (!projectId) return;

    const fetchopportunities = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/opportunity?projectId=${projectId}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (res.ok) {
          setopportunities(data);
        } else {
          console.error("Failed to load opportunities:", data.error);
        }
      } catch (err) {
        console.error("Error fetching opportunities", err);
      }
    };
    fetchopportunities();
  }, []);

  const addToOpp = async (oppId: string) => {
    if (!emailId) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/emails/${emailId}/oppo`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ opportunityId: oppId }),
        }
      );

      if (res.ok) {
        const updated = await res.json();
        console.log("Assign to opportunity:", updated);
        closeModal();
      } else {
        const err = await res.json();
        console.error("Failed to assign opportunity:", err.error);
      }
    } catch (err) {
      console.error("Error assigning opportunity:", err);
    }
  };

  return (
    <>
      <div className="modal-backdrop" onClick={closeModal} />
      <aside className="opportunity-modal">
        <h3 className="my-opportunities-title">Opportunities</h3>
        {opportunities.map((opp) => (
          <button
            onClick={() => addToOpp(opp._id)}
            className="opportunity-btns"
          >
            {opp.title}
          </button>
        ))}
      </aside>
    </>
  );
};

export default LinkToOppModal;
