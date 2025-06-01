import { useLoaderData } from "react-router-dom";
import "../../components/ui/EmailItem.css";
import { EmailItemProps } from "../../types/types";

const TestEmails = () => {
  const emails = useLoaderData();
  console.log({ emails });
  console.log(emails);
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
