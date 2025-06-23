import { useState } from "react";
import "./EmailItem.css"
import { useNavigate, useParams } from "react-router-dom";

interface EmailItemProps {
  sender: string;
  subject: string;
  senderAddress: string;
  isRead: boolean;
  body: string;
  date: Date;
  _id: string //use for navigation to emailid
  className?: string;
  isTapped: boolean;
  onTapUpdate: (emailId: string, newIsTapped: boolean) => void
}
const EmailItem = (props: EmailItemProps) => {
  const [tapped, setTapped] = useState(props.isTapped);
  const { projectId } = useParams();
  const navigate = useNavigate()
  const emailId = props._id;

  const getDate = props.date;
  const formattedDate = new Date(getDate).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const handleTapIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    const newTapped = !tapped;
    // Update UI immediately
    setTapped(newTapped);
    // Send actual API call to parent
    props.onTapUpdate(emailId, newTapped);
  };

  const handleEmailClick = async () => {
    if (!props.isRead) {
      try {
        const res = await fetch(`http://localhost:3000/api/emails/${emailId}/read`, {
          method: 'PATCH',
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({ emailId })
        });
        if (!res.ok) {
          throw new Error("Failed to update email as read");
        }
      } catch (err) {
        console.error("Erro making email as read", err);
      }
    }
    navigate(`/email/${emailId}`);
  }

  return (
    <>
      <div
        className="email-item-tapin-flex-wrapper">
        {/* tap in dot */}
        <div className="tap-in-wrapper">
          <div
            onClick={handleTapIn}
            className={!tapped ? "tap-in-dot inactive" : "tap-in-dot"}
          ></div>
        </div>
        {/* email item */}
        <div
          onClick={handleEmailClick}
          className={!props.isRead ? "email-content-date-flex" : "email-content-date-flex inactive"}
        >
          <div className="email-sender-subject-flex">
            <p className="email-sender">{props.sender}</p>
            <p className="email-subject">{props.subject}</p>
          </div>
          <p className="email-date">{formattedDate}</p>
        </div>
      </div>
    </>
  )
}
export default EmailItem;
