import { useLoaderData, useParams } from "react-router-dom";
import "../../components/ui/EmailItem.css";
import { EmailItemProps } from "../../types/types";
import { useEffect } from "react";

const TestEmails = () => {
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
    <div className="email-item-flex">
      {emails.length && emails.map((email: EmailItemProps) => (
        <div className="email-content-date-flex">
          <div className="email-content">
            <div className="email-sender-subject-flex">
              <p className="email-sender">{email.from}</p>
              <p className="email-subject">{email.subject}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default TestEmails;
