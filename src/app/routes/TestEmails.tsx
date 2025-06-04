import { useLoaderData, useParams } from "react-router-dom";
import "../../components/ui/EmailItem.css";
import { EmailItemProps } from "../../types/types";
import { useEffect } from "react";

const TestEmails = () => {
  const emails = useLoaderData();
  const {projectId} = useParams()
  console.log({ emails });
  console.log(emails);
  useEffect(() => {
      if (projectId) {
        fetch(`/api/projects/${projectId}/last-login`, {
          method: "PATCH",
      }).catch((err) => console.error("Failed to update lastLogin:", err));
        }
    }, [projectId]);
    
  return (
    <div className="email-item-flex">
      {emails.map((email: EmailItemProps) => (
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
