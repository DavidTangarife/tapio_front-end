import "./AddToBoardModal.css";
import { AddToBoardModalProps, Board, Email } from "../../types/types";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const AddToBoardModal = ({
  closeModal,
  updateButtonTitle,
}: AddToBoardModalProps) => {
  const modalInputRef = useRef<HTMLFormElement | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [statuses, setStatuses] = useState<Board[]>([]);
  const [emailData, setEmailData] = useState<Email>();
  const { emailId } = useParams();

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/status/`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setStatuses(data.sort((a, b) => a.order - b.order));
        } else {
          console.error("Failed to load statuses:", data.error);
        }
      } catch (err) {
        console.error("Error fetching statuses", err);
      }
    };

    const fetchEmailById = async () => {
      if (!emailId) return;
      try {
        const res = await fetch(`http://localhost:3000/api/emails/${emailId}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setEmailData(data);
        } else {
          console.error("Failed to fetch email:", data.error);
        }
      } catch (err) {
        console.error("Error fetching email by ID", err);
      }
    };

    fetchStatuses();
    fetchEmailById();
  }, [emailId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!modalInputRef.current || !emailId || !emailData) {
      console.error("Missing form, route params, or email data.");
      return;
    }

    const modalInputData = new FormData(modalInputRef.current);
    const formDataObject = Object.fromEntries(modalInputData);
    const domain = emailData?.from.match(/<([^>]+)>/)?.[1];
    console.log("Domain name:", domain);

    const payload = {
      statusId: formDataObject.board,
      title: formDataObject.role,
      emailId,
      domain,
      company: {
        name: formDataObject.companyname as string,
      },
    };

    try {
      //Create an opportunity
      const res = await fetch(
        "http://localhost:3000/api/opportunity/from-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        const result = await res.json();
        console.log("Opportunity created:", result);
        setIsSubmitted(true);
        //Call this function from ViewEmail
        updateButtonTitle();
        modalInputRef.current.reset();
      } else {
        const err = await res.json();
        console.error("Failed to create opportunity:", err.error);
      }
    } catch (err) {
      console.error("Error creating opportunity:", err);
    }
  };

  return (
    <>
      <div className="modal-backdrop" onClick={closeModal} />

      {isSubmitted ? (
        <aside className="added-to-board-msg-wrapper">
          <h3 className="add-opp-success-msg">Added to Board</h3>
        </aside>
      ) : (
        <aside className="opportunity-modal">
          <h3 className="create-opp-title">Create opportunity</h3>
          <div className="form-container">
            <form ref={modalInputRef} onSubmit={handleSubmit}>
              <label>
                Company Name:
                <input
                  className="opp-modal-txt-input"
                  type="text"
                  name="companyname"
                  autoFocus
                  required
                />
              </label>
              <label>
                Role:
                <input
                  className="opp-modal-txt-input"
                  type="text"
                  name="role"
                  required
                />
              </label>
              <select className="select-board-menu" name="board" required>
                {statuses.map((status) => (
                  <option key={status._id} value={status._id}>
                    {status.title}
                  </option>
                ))}
              </select>
              <button type="submit" className="add-opp-submit-btn">
                Submit
              </button>
            </form>
          </div>
        </aside>
      )}
    </>
  );
};
export default AddToBoardModal;
