import "./EmailItem.css"
import { Link } from "react-router-dom";

interface EmailItemProps {
  sender: string;
  subject: string;
  senderAddress: string;
  read?: boolean;
  body: string;
  date: string;
  //id: string //use for navigation to emailid

}
const EmailItem = (props: EmailItemProps) => {
  return (
    <>
    <Link to={'/email/:emailid'} //{props.id}
      className="email-item-flex">
          <div className="tap-in-wrapper"><div className="tap-in-dot"></div></div>
          <div className="email-content-date-flex">
            <div className="email-content">
              <div className="email-sender-subject-flex">
                <p className="email-sender">{props.sender}</p>
                <p className="email-subject">{props.subject}</p>
              </div>
              
              <div className="email-sender-address-content-flex">
                <p className="email-sender-address">{props.senderAddress}</p>
                <p className="email-content-">{props.body}</p>
              </div>
            </div>
            <p className="email-date">{props.date}</p>
          </div>
        </Link>
    </>
  )
}
export default EmailItem;