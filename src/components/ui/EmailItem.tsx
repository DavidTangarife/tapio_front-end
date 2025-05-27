import "./EmailItem.css"

interface EmailItemProps {
  sender: string;
  subject: string;
  senderAddress: string;
  read?: boolean;
  body: string;
  date: string;
}
const EmailItem = (props: EmailItemProps) => {
  return (
    <>
    <div className="email-item-flex">
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
        </div>
    </>
  )
}
export default EmailItem;