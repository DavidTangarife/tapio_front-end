import "./AddToBoardModal.css"
import { AddToBoardModalProps } from "../../types/types";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";


const AddToBoardModal = ({closeModal}: AddToBoardModalProps) => {
  const modalInputRef = useRef<HTMLFormElement | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  // const [statuses, setStatuses] = useState([]);
  // const { emailId } = useParams();
  // const { projectId } = useSession(); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalInputRef.current) {
      const modalInputData = new FormData(modalInputRef.current);
      const formDataObject = Object.fromEntries(modalInputData);
      console.log(formDataObject) //Data Object from the form to POST
      modalInputRef.current.reset();
      setIsSubmitted(true);
      //Call the API here
      
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
            Color:
            <input type="text" name="color" />
          </label>
          <select name="board">
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Fuckers">Fuckers</option>
            <option value="Other">Other</option>
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
