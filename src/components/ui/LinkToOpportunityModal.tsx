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
  const [added, setAdded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
        setAdded(true);
      } else {
        const err = await res.json();
        console.error("Failed to assign opportunity:", err.error);
      }
    } catch (err) {
      console.error("Error assigning opportunity:", err);
    }
  };
  const filteredOpportunities = opportunities.filter((opp) =>
    `${opp.title} ${opp.company.name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="modal-backdrop" onClick={closeModal} />
      <aside className="opportunity-modal">
        {added ? (
          <div>
            <h3 className="add-opp-success-msg">Email linked</h3>
          </div>
        ) : (
          <>
            <h3 className="my-opportunities-title">Opportunities</h3>
             <div className="search">
              <input
                type="text"
                className="search-input-opp"
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {filteredOpportunities.length > 0 ? (
              filteredOpportunities.map((opp) => (
                <button
                  key={opp._id}
                  onClick={() => addToOpp(opp._id)}
                  className="opportunity-btns"
                >
                  {opp.title} - {opp.company.name}
                </button>
              ))
            ) : (
              <p className="no-results-text">No matching opportunities</p>
            )}
          </>
        )}
      </aside>
    </>
  );
};

export default LinkToOppModal;
