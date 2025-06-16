import { useEffect } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import EmailItem from "./EmailItem";
import Header from "./Header";
//import TapUpModal from "./TapUpModal";
// import Loader from "../../assets/Spinner.svg?react";
import "./EmailSection.css";

interface email {
  _id: string;
  from: string;
  subject: string;
  senderAddress: string;
  body: string;
  isRead: boolean;
  isTapped: boolean;
  date: Date;
}

const EmailSection = () => {
  
  const emails: email[] = useLoaderData() ?? [];
  // console.log(emails)
  const {projectId} = useParams();

  useEffect(() => {
      if (projectId) {
        fetch(`http://localhost:3000/api/projects/${projectId}/last-login`, {
          method: "PATCH",
          credentials: "include",
      }).catch((err) => console.error("Failed to update lastLogin:", err));
        }
    }, [projectId]);
  if (!emails.length) return <p>No emails found</p>;
  
  const readEmails = emails.filter(email =>
    email.isRead && !email.isTapped)
  const unreadEmails = emails.filter(email =>
    !email.isRead && !email.isTapped)
  const tappedEmails = emails.filter(email => email.isTapped)

  return (
    <>
      <div className="email-section">
        <Header />
          {tappedEmails.length > 0 && (
            <>
              <h3 className="email-section-title">TAPPED UP</h3>
              <div className="email-list">
              {tappedEmails.map((email) => (
                <EmailItem
                  key={email._id}
                  _id={email._id}
                  sender={email.from}
                  subject={email.subject}
                  senderAddress={email.from}
                  body={email.body}
                  isRead={email.isRead}
                  date={email.date}
                  isTapped={email.isTapped}
              />
            ))}
          </div>
        </>
        )}
        
        <h3 className="email-section-title">UNREAD</h3>
        <div className="email-list">
            {unreadEmails.map((email) => (
              <EmailItem
                key={email._id}
                _id={email._id}
                sender={email.from}
                subject={email.subject}
                senderAddress={email.senderAddress}
                body={email.body}
                isRead={email.isRead}
                date={email.date}
                isTapped={email.isTapped}
              />
            ))}
        </div>
        
        {readEmails.length > 0 && (
          <>
            <h3 className="email-section-title">READ</h3>
            <div className="email-list">
            {readEmails.map((email) => (
              <EmailItem
                key={email._id}
                _id={email._id}
                sender={email.from}
                subject={email.subject}
                senderAddress={email.senderAddress}
                body={email.body}
                isRead={email.isRead}
                date={email.date}
                isTapped={email.isTapped}
              />
            ))}
            </div>
          </>)}
        </div>
      </>
)};
export default EmailSection;
