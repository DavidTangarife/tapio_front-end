
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./ViewEmail.css"
import Button from "../../components/ui/Button"
import ViewEmailActionButton from "../../components/ui/ViewEmailActionButton"
import AddToBoardModal from "../../components/ui/AddToBoardModal";
import { ViewKanbanOutlined, TouchAppOutlined, Reply, DeleteOutlined } from '@mui/icons-material';
import TapioLogoDesktop from "../../assets/tapio-desktop-logo.svg?react"

interface EmailDetails {
  subject?: string;
  from?: string;
  isTapped?: boolean;
}

const ViewEmail = () => {
  const [openModal, setOpenModal] = useState(false);
  const { projectId, emailId } = useParams();
  const [emailDetails, setEmailDetails] = useState<EmailDetails | null>(null);
  const [emailBodyHtml, setEmailBodyHtml] = useState<string>("");
  const modalData = "";
  const [confirmTappedUp, setConfirmTappedUp] = useState(false);
  const [tapMessage, setTapMessage] = useState<string>("")

  useEffect(() => {
    const fetchEmailInfo = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/emails/${emailId}`, {
          credentials: 'include',
        });
        const data = await res.json();
        setEmailDetails(data);
      } catch (err) {
        console.error("Failed to fetch email info:", err);
      }
    };
    const fetchEmail = async () => {
      try {
        const res1 = await fetch(`http://localhost:3000/api/emails/${emailId}/body`, {
          credentials: 'include',
        });
        const data = await res1.json();
        const body = data.body;
        setEmailBodyHtml(body);

      } catch (err) {
        console.error("Failed to fetch email body:", err);
      }
    };
    fetchEmail();
    fetchEmailInfo();
  }, [emailId]);

  const handleTapUp = async () => {
    try {
      if (!emailDetails?.isTapped) {
        const res = await fetch(`http://localhost:3000/api/emails/${emailId}/tap`, {
          method: "PATCH",
          credentials: "include",
          body: JSON.stringify({ emailId, isTapped: true }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to update tap status");
        setConfirmTappedUp(true);
        setTapMessage("Tapped up!")
        setEmailDetails((prev) => ({...prev, isTapped: true }));
      } else {
        setConfirmTappedUp(true);
        setTapMessage("Already tapped up")
      }
        setTimeout(() => {
        setConfirmTappedUp(false);
         }, 1000);

    } catch (err) {
      console.error("Failed to tap up:", err);
      setConfirmTappedUp(true);
      setTapMessage("Error tapping up");
      setTimeout(() => {
        setConfirmTappedUp(false);
    }, 1000);
    }
  };
  return (
    <>
      <main>
        <section className="header-container">
          <Link to={`/inbox`} className="back-btn">Back</Link>
          <TapioLogoDesktop className="logo" />
          <Button className="user-btn" buttonText="MJ" />
        </section>
        <section className="email-view-container">
          <div className="email-view-sender-details">
            <h3 className="email-view-subject">{emailDetails?.subject}</h3>
            <h4 className="email-view-sender">{emailDetails?.from}</h4>
          </div>
          <section className="email-view-body">
            <iframe
              title="email-content"
              style={{ width: "100%", height: "600px", border: "none" }}
              srcDoc={emailBodyHtml}
            />
          </section>
          {/* <section className="email-view-body" dangerouslySetInnerHTML={{ __html: emailBodyHtml }} /> */}
          <div className="email-view-btn-panel">
            <ViewEmailActionButton
              icon={Reply}
              text="Reply"
              value={modalData}
            //onClick={handleReply}
            />
            <ViewEmailActionButton
              icon={Reply}
              text="Forward"
              value={modalData}
              iconSx={{ transform: 'scaleX(-1)' }}
            //onClick={handleForward}
            />
            <div className="tapup-btn-modal-container">
              <ViewEmailActionButton
                icon={TouchAppOutlined}
                text="Tap up"
                value={modalData}
                onClick={handleTapUp}
            /> 
           {confirmTappedUp && <div className="tapup-confirmation-msg">{tapMessage}</div>}
            </div>
          
            <div className="add-to-board-container">
              <ViewEmailActionButton
                icon={ViewKanbanOutlined}
                text="Add to Board"
                value={modalData}
                onClick={() => setOpenModal(true)}
              />
              {openModal && <AddToBoardModal closeModal={() => setOpenModal(false)} />}
            </div>
            <ViewEmailActionButton
              icon={DeleteOutlined}
              text="Delete"
              value={modalData}
            //onClick={handleDelete}
            />

          </div>

        </section>
      </main>

    </>
  )
};

export default ViewEmail;
