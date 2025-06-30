import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import Header from "../../components/ui/Header";
import "./Filter.css";
import { ThumbUpOutlined, ThumbDownOutlined } from '@mui/icons-material';

type EmailObject = {
  emails: SenderData[];
}
type SenderData = {
  _id: string;
  from: string;
  date: Date;
  subject: string;
  isApproved?: boolean;
  isProcessed?: boolean;
}

const Filter = () => {

  // Return an array of emails  
  const initialEmails: SenderData[] = useLoaderData() ?? {};
  
  // console.log(initialEmails);


  // State to store emails
  const [emails, setEmails] = useState(initialEmails);
  const [allEmails, setAllEmails] = useState(initialEmails);

  const [filteredSenders, setFilteredSenders] = useState<"new" | "allowed" | "blocked">("new")
 
 function extractEmailAddress(from: string): string {
    const match = from.match(/<(.+)>/);
    return match ? match[1] : from.trim();
  }

  function getUnprocessedEmails(emails: SenderData[]) {
  return emails.filter(email => !email.isProcessed);

}
  useEffect(() => {
    if (filteredSenders === "new"){
      setEmails(getUnprocessedEmails(allEmails));
      return;
    }
    const fetchByTab = async () => {
      let endpoint = "";
      if (filteredSenders === "allowed") {
        endpoint = "allowed-emails";
      } else if (filteredSenders === "blocked") {
        endpoint = "blocked-emails";
      }
      try {
        const res = await fetch(`http://localhost:3000/api/${endpoint}`, {
          credentials: "include",
        });
        const data = await res.json()
        setEmails(data.emails ?? []);
      } catch (err) {
        console.error("Error fetching emails in tabs", err)
      }
    };

    fetchByTab();
  }, [filteredSenders, allEmails])

 // Toggle approval and update filters
  const handleToggle = async (emailId: string, isApproved: boolean) => {
    try {
      console.log("Sending PATCH for emailId:", emailId, "isApproved:", isApproved);
      const res = await fetch(`http://localhost:3000/api/emails/${emailId}/process`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          isApproved: isApproved })
      });

      if (!res.ok) {
        throw new Error("Failed to update email properties");
      }
      
      const emailObj = emails.find(email => email._id === emailId);
      if (!emailObj) throw new Error("Email not found");
      const sender = extractEmailAddress(emailObj.from);
      console.log(sender)

      const filterRes = await fetch(`http://localhost:3000/api/projects/filters`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ sender, action: isApproved ? "allow" : "block" })
      });

      if (!filterRes.ok)  {
        throw new Error("Failed to save filters");
      }

      console.log("Filter array updated successfully")
      
    //   setEmails(prevEmails => 
    //     prevEmails.map(email => 
    //       extractEmailAddress(email.from) === sender
    //       ? { ...email, isApproved: isApproved, isProcessed: true }
    //       : email
    //   )
    // )
    const updatedAllEmails = allEmails.map(email =>
  extractEmailAddress(email.from) === sender
    ? { ...email, isApproved, isProcessed: true }
    : email
);

setAllEmails(updatedAllEmails);

// Update visible emails if in "new" tab
if (filteredSenders === "new") {
  setEmails(getUnprocessedEmails(updatedAllEmails));
} else {
  // re-fetch allowed/blocked
  setFilteredSenders(prev => (prev === "allowed" ? "allowed" : "blocked"));
}

    } catch (err) {
      console.error("Error saving filters:", err);
    }
  };

    
     
 
  //Filter senders by allowed and blocked
  const getFilteredSenders = () => {
    if (filteredSenders === "allowed") {
      return emails.filter(email => email.isProcessed && email.isApproved)
    }
    if (filteredSenders === "blocked") {
      return emails.filter(email => email.isProcessed && !email.isApproved)
    }
    return emails.filter(email => !email.isProcessed);
  }

  const today = (new Date).toLocaleDateString('en-GB')
  

  return (
    <>
      <main>
        <Header />
        <section className="filter-container">
          <div className="filter-btn-save-container">
            <div className="filter-btn-container">
            <button
              className={`filter-btn new ${filteredSenders === "new" ? "active" : ""}`}
              onClick={() => setFilteredSenders("new")}>New</button>
            <button
              onClick={() => setFilteredSenders("allowed")}
              className={`filter-btn allowed ${filteredSenders === "allowed" ? "filter-btn-allowed active" : "filter-btn-allowed"}`}><ThumbUpOutlined /></button>
            <button
              className={`filter-btn blocked ${filteredSenders === "blocked" ? "active" : ""}`}
              onClick={() => setFilteredSenders("blocked")}><ThumbDownOutlined /></button>
          </div>
        </div>
          <h3 className="filter-date-title">{today}</h3>
          <div className="sender-container">
            {getFilteredSenders().length === 0 && filteredSenders === "new" ? (
              <p className="no-emails-msg">No new emails to filter</p>
            ) : (
              <ul className="sender-list">
              {getFilteredSenders().map((email) => (
                <li className="sender-list-item"
                    key={email._id}>
                  <div>
                    <div className="sender-subject-flex">
                      <h4 className="filter-sender-name">{email.from}</h4>
                      <p className="filter-sender-subject">{email.subject}</p>
                    </div>

                  </div>
                  <div className="filter-status-date-container">
                    <p
                      className="filter-email-date">{new Date(email.date).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    </p>
                    <button
                      onClick={() => handleToggle(email._id, true)}
                      className={`allowed-vs-blocked set-allowed ${filteredSenders !== 'new' && email.isApproved ? "allowed-active" : ""}`}>
                      <ThumbUpOutlined />
                    </button>
                    
                    <button
                      onClick={() => handleToggle(email._id, false)}
                      className={`allowed-vs-blocked set-blocked ${filteredSenders !== 'new' && !email.isApproved ? "blocked-active" : ""}`}>
                      <ThumbDownOutlined />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            )}
          </div>
        </section>
      

      </main>
    </>


  )
}
export default Filter;
