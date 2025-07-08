import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./ViewEmail.css";
import ViewEmailActionButton from "../../components/ui/ViewEmailActionButton";
import AddToBoardModal from "../../components/ui/AddToBoardModal";
import LinkToOppModal from "../../components/ui/LinkToOpportunityModal";
import {
  ViewKanbanOutlined,
  TouchAppOutlined,
  Reply,
  DeleteOutlined,
  AddLink
} from "@mui/icons-material";
import TapioLogoDesktop from "../../assets/tapio-desktop-logo.svg?react";

interface EmailDetails {
  subject?: string;
  from?: string;
  isTapped?: boolean;
  projectId?: string;
  opportunityId?: string;
}

const ViewEmail = () => {
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const { emailId } = useParams();
  const [emailDetails, setEmailDetails] = useState<EmailDetails | null>(null);
  const [emailBodyHtml, setEmailBodyHtml] = useState<string>("");
  const modalData = "";
  const [confirmTappedUp, setConfirmTappedUp] = useState(false);
  const [tapMessage, setTapMessage] = useState<string>("");
  const [buttonTitle, setButtonTitle] = useState<string>("Add to Board");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmailInfo = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/emails/${emailId}`, {
          credentials: "include",
        });
        const data = await res.json();
        setEmailDetails(data);
        setButtonTitle(data.opportunityId ? "Go to Board" : "Add to Board")
      } catch (err) {
        console.error("Failed to fetch email info:", err);
      }
    };
    const fetchEmail = async () => {
      try {
        const res1 = await fetch(
          `http://localhost:3000/api/emails/${emailId}/body`,
          {
            credentials: "include",
          }
        );
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
        const res = await fetch(
          `http://localhost:3000/api/emails/${emailId}/tap`,
          {
            method: "PATCH",
            credentials: "include",
            body: JSON.stringify({ emailId, isTapped: true }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to update tap status");
        setConfirmTappedUp(true);
        setTapMessage("Tapped up!");
        setEmailDetails((prev) => ({ ...prev, isTapped: true }));
      } else {
        setConfirmTappedUp(true);
        setTapMessage("Already tapped up");
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

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const updateHeight = () => {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc && iframeDoc.body) {
        iframe.style.height = iframeDoc.body.scrollHeight + "px";
      }
    };

    // Wait for iframe content to load
    const onLoad = () => {
      updateHeight()
    };

    iframe.addEventListener("load", onLoad);
    return () => iframe.removeEventListener("load", onLoad);
  }, [emailBodyHtml]);

  //Change "Add to Board" to "Go to Board" after submiting opportunity
  const updateButtonTitle = () => {
    setButtonTitle("Go to Board");
  }

  return (
    <>
      <main>
        <section className="header-container">
          <Link to={`/home`} className="back-btn">
            Back to Inbox
          </Link>
          <TapioLogoDesktop className="logo" />
          <Link to={`/board`} className="back-btn">
            Go to Board
          </Link>
        </section>
         
        <section className="email-view-container">
          <div className="email-view-sender-details">
            <h3 className="email-view-subject">{emailDetails?.subject}</h3>
            <h4 className="email-view-sender">{emailDetails?.from}</h4>
          </div>
          <section className="email-view-body">
            <iframe
            ref={iframeRef}
            className="iframe"
              title="email-content"
              style={{ width: "100%", minHeight: "500px", border: "none", overflow: "hidden"  }}
              srcDoc={emailBodyHtml}
            />
          </section>
          {/* <section className="email-view-body" dangerouslySetInnerHTML={{ __html: emailBodyHtml }} /> */}
        </section>
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
              iconSx={{ transform: "scaleX(-1)" }}
              //onClick={handleForward}
            />
            <div className="tapup-btn-modal-container">
              <ViewEmailActionButton
                icon={TouchAppOutlined}
                text="Tap up"
                value={modalData}
                onClick={handleTapUp}
              />
              {confirmTappedUp && (
                <div className="tapup-confirmation-msg">{tapMessage}</div>
              )}
            </div>

            <div className="add-to-board-container">
              <ViewEmailActionButton
                icon={ViewKanbanOutlined}
                text={buttonTitle}
                value={modalData}
                onClick={() => {
                  if (buttonTitle === "Go to Board") {
                    navigate("/board")
                  } else {
                  setOpenModalCreate(true)
                  }
                }}
              />
              {openModalCreate && (
                <AddToBoardModal 
                  closeModal={() => setOpenModalCreate(false)}
                   updateButtonTitle={updateButtonTitle} />
              )}
            </div>
            <div className="add-to-board-container">
              <ViewEmailActionButton
                icon={AddLink}
                text="Link Opp"
                value={modalData}
                onClick={() => setOpenModalAdd(true)}
              />
              {openModalAdd && (
                <LinkToOppModal
                  closeModal={() => setOpenModalAdd(false)}
                  projectId={emailDetails?.projectId}
                />
              )}
            </div>
            <ViewEmailActionButton
              icon={DeleteOutlined}
              text="Delete"
              value={modalData}
              //onClick={handleDelete}
            />
          </div>
      </main>
    </>
  );
};

export default ViewEmail;
