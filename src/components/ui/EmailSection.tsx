import { useState, useEffect } from "react";
import EmailItem from "./EmailItem"
import  Loader from "../../assets/Spinner.svg?react"
import "./EmailSection.css"

const testEmails: any = [
  {
    id: 1,
    subject: "Thank you for your application",
    sender: "carsales",
    senderAddress: "recruitment@carsales.com",
    body: "Thank you for your application for our Graduate Program",
    read: "false",
    date: "22-05-2025"
  },
    {
    id: 2,
    subject: "Thank you for your application",
    sender: "CBA HR",
    senderAddress: "recruitment@cba.com",
    body: "Thank you for your application for our Graduate Program",
    read: "false",
    date: "22-05-2025"
  },
    {
    id: 3,
    subject: "Thank you for your application",
    sender: "REA",
    senderAddress: "recruitment@rea.com",
    body: "Thank you for your application for our Graduate Program",
    read: "false",
    date: "22-05-2025"
  },
    {
    id: 4,
    subject: "Thank you for your application",
    sender: "NAB",
    senderAddress: "recruitment@nab.com",
    body: "Thank you for your application for our Graduate Program",
    read: "false",
    date: "22-05-2025"
  }
]

interface EmailSectionProps {
  title: string;
}

const EmailSection = (props: EmailSectionProps) => {
const [emails, setEmails] = useState([]);
const [loadingEmails, setLoadingEmails] = useState(false);

const getEmailsFromBackend = async () => {
  setLoadingEmails(true);
  setTimeout(() => {
    setEmails(testEmails);
    setLoadingEmails(false);
  }, 5000);
}

useEffect(() => {
  getEmailsFromBackend();
}, [emails]);

  return (
    <>
    <div className="email-section">
      {emails.length > 0 && (<h3 className="email-section-title">{props.title}</h3>)}
      <div className="email-list">
    
        {loadingEmails ? (<><h2 className="loader-title">Loading emails</h2><Loader className="spin-loader"/></>) : (
          emails.map((email: any) => (
            <EmailItem
              key={email.id}
              sender={email.sender}
              subject={email.subject}
              senderAddress={email.senderAddress}
              body={email.body}
              read={email.read}
              date={email.date} />
            ))
          )}
      </div>  
    </div>
    </> )
}
export default EmailSection;
