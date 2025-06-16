import "./EmailItem.css"
import { Link, useParams } from "react-router-dom";

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

}
const EmailItem = (props: EmailItemProps) => {
const {projectId} = useParams();
const emailId = props._id;
console.log(emailId)

const getDate = props.date;
const formattedDate = new Date(getDate).toLocaleDateString('en-GB', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

  return (
    <>
    <div
      className="email-item-tapin-flex-wrapper"> 
      {/* tap in dot */}
      <div className="tap-in-wrapper">
        <div className={!props.isTapped ? "tap-in-dot inactive" : "tap-in-dot"}></div>
      </div>
      {/* email item */}
      <Link to={`/${projectId}/email/${emailId}`} className={!props.isRead ? "email-content-date-flex" : "email-content-date-flex inactive"}>
          <div className="email-sender-subject-flex">
            <p className="email-sender">{props.sender}</p>
            <p className="email-subject">{props.subject}</p>
          </div>
        <p className="email-date">{formattedDate}</p>
      </Link>
    </div>
    </>
  )
}
export default EmailItem;