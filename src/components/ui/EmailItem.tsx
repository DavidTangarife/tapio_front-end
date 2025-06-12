import "./EmailItem.css"
import { Link, useLoaderData, useParams } from "react-router-dom";
import { useEffect } from "react";

interface EmailItemProps {
  sender: string;
  subject: string;
  senderAddress: string;
  read?: boolean;
  body: string;
  date: string;
  id: string //use for navigation to emailid

}
const EmailItem = () => {

  const emails = useLoaderData() ?? [];
  // console.log(emails)
  const {projectId} = useParams()

  useEffect(() => {
      if (projectId) {
        fetch(`http://localhost:3000/api/projects/${projectId}/last-login`, {
          method: "PATCH",
          credentials: "include",
      }).catch((err) => console.error("Failed to update lastLogin:", err));
        }
    }, [projectId]);
  if (!emails.length) return <p>No emails found</p>;

  return (
    <>
    <Link to={'/email/:emailid'} //{props.id}
      className="email-item-flex">
        {emails.length && emails.map((email: EmailItemProps) => (
          <>
           <div className="tap-in-wrapper"><div className="tap-in-dot"></div></div>
          <div className="email-content-date-flex">
            <div className="email-content">
              <div className="email-sender-subject-flex">
                <p className="email-sender">{email.sender}</p>
                <p className="email-subject">{email.subject}</p>
              </div>
              
              <div className="email-sender-address-content-flex">
                <p className="email-sender-address">{email.senderAddress}</p>
                <p className="email-content-">{email.body}</p>
              </div>
            </div>
            <p className="email-date">{email.date}</p>
          </div>
          </>))}
      </Link>
    </>
  )
}
export default EmailItem;