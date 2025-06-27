import EmailItem from "../../components/ui/EmailItem";
import "./Inbox.css";
import { InboxProps } from "../../types/types";



const Inbox: React.FC<InboxProps> = ({ emails, onTapUpdate, onRefreshInbox }) => {
  
  if (!emails.length) return <p>No emails found</p>;

  const readEmails = emails.filter(email =>
    email.isRead && !email.isTapped)
  const unreadEmails = emails.filter(email =>
    !email.isRead && !email.isTapped)
  const tappedEmails = emails.filter(email => email.isTapped)


  return (
    <>
      <div className="inbox-header">
        <h2>Inbox</h2>
        <button onClick={onRefreshInbox} className="refresh-button">Refresh Inbox</button>
      </div>
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
                  onTapUpdate={onTapUpdate}
                />
              ))}
            </div>
          </>
        )}

        <h3 className="email-section-title">UNREAD</h3>
        {unreadEmails.length > 0 ?
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
              onTapUpdate={onTapUpdate}
            />
          ))}
        </div> : <p className="no-new-emails-msg">No new emails</p>
}
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
                  onTapUpdate={onTapUpdate}
                />
              ))}
            </div>
          </>)}
      </div>
    </>
  )
};
export default Inbox;
