import "./AddToBoardModal.css"
import { AddToBoardModalProps } from "../../types/types";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


const AddToBoardModal = ({closeModal}: AddToBoardModalProps) => {
  const modalInputRef = useRef<HTMLFormElement | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const { projectId, emailId } = useParams();
  const navigate = useNavigate();


  useEffect(() => {
  const fetchStatuses = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/status/${projectId}`);
      const data = await res.json();
      if (res.ok) {
        setStatuses(data);
      } else {
        console.error("Failed to load statuses:", data.error);
      }
    } catch (err) {
      console.error("Error fetching statuses", err);
    }
  };

  if (projectId) {
    fetchStatuses();
  }
}, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
 
    if (modalInputRef.current && projectId && emailId) {
    const modalInputData = new FormData(modalInputRef.current);
    const formDataObject = Object.fromEntries(modalInputData);
    const payload = {
      projectId,
      statusId: formDataObject.board,
      title: formDataObject.role,
      emailId, 
      company: {
        name: formDataObject.companyname as string,
      },
    };

    try {
      const res = await fetch("http://localhost:3000/api/opportunity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const result = await res.json();
        console.log("Opportunity created:", result);
        setIsSubmitted(true);
        modalInputRef.current.reset();
        setTimeout(() => {
          navigate(`/projects/${projectId}/emails`);
        }, 1000);
      } else {
        const err = await res.json();
        console.error("Failed to create opportunity:", err.error);
      }
    } catch (err) {
      console.error("Error creating opportunity:", err);
    }
  } else {
    console.error("Missing form or route params.");
  }
  }

  return (
    <>
      <div className="modal-backdrop" onClick={closeModal} />
        <aside>
          {isSubmitted ? ( <div><h3>Added to Board</h3></div>) : (
        <div className="form-container">
          <h3>Create opportunity</h3>
          <form ref={modalInputRef} onSubmit={handleSubmit}>
            <label>
            Company Name:
            <input  type="text" name="companyname" />
          </label>
          <label>
            Role:
            <input type="text" name="role" />
          </label>
          <select name="board" required>
            {statuses.map((status: any) => (
              <option key={status._id} value={status._id}>
                {status.title}
              </option>
            ))}
          </select>
          <button type="submit">Submit</button>
          </form>
        </div>
         )}
          </aside>
      </>
  );
};
export default AddToBoardModal;
