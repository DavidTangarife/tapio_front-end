import { useEffect, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import EmailItem from "../../components/ui/EmailItem";
import Header from "../../components/ui/Header";
//import TapUpModal from "./TapUpModal";
import "./Inbox.css";

interface Email {
  _id: string;
  from: string;
  subject: string;
  senderAddress: string;
  body: string;
  isRead: boolean;
  isTapped: boolean;
  date: Date;
}

interface InboxProps {
  emails: Email[]
}

const Inbox: React.FC<InboxProps> = (props) => {
  const initialEmails: Email[] = props.emails ?? [];
  const [emails, setEmails] = useState<Email[]>(initialEmails);
  const { projectId } = useParams();

  useEffect(() => {
    if (projectId) {
      fetch(`http://localhost:3000/api/projects/${projectId}/last-login`, {
        method: "PATCH",
        credentials: "include",
      }).catch((err) => console.error("Failed to update lastLogin:", err));
    }
  }, [projectId, props.emails]);
  if (!emails.length) return <p>No emails found</p>;

  const readEmails = emails.filter(email =>
    email.isRead && !email.isTapped)
  const unreadEmails = emails.filter(email =>
    !email.isRead && !email.isTapped)
  const tappedEmails = emails.filter(email => email.isTapped)

  const handleTapUpdate = async (emailId: string, newTapped: boolean) => {
    try {
      const res = await fetch(`http://localhost:3000/api/emails/${emailId}/tap`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isTapped: newTapped })
      });
      if (!res.ok) {
        throw new Error('Failed to update tap-in status')
      }
      const updatedEmail = await res.json();

      // Update local email state
      setEmails(prevEmails =>
        prevEmails.map(email =>
          email._id === emailId ? { ...email, isTapped: updatedEmail.isTapped } : email
        )
      );
    } catch (err) {
      console.error("Error updating tap-in:", err);
    }
  }

  return (
    <>
      <div className="email-section">
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
                  onTapUpdate={handleTapUpdate}
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
              onTapUpdate={handleTapUpdate}
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
                  onTapUpdate={handleTapUpdate}
                />
              ))}
            </div>
          </>)}
      </div>
    </>
  )
};
export default Inbox;
