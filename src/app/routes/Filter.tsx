import { useState, useEffect } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import Header from "../../components/ui/Header";
import "./Filter.css";
import { ThumbUpOutlined, ThumbDownOutlined } from '@mui/icons-material';

type SenderData = {
  _id: number;
  from: string;
  date: Date;
  subject: string;
  isBlocked: boolean;
}

  const Filter = () => {

  // Return an array of emails  
  const emails: SenderData[] = useLoaderData() ?? [];

  // Grab projectId from URL params
   const { projectId } = useParams();
  
  // State to store emails
  const [senderState, setSenderState] = useState(emails);
  const [filteredSenders, setFilteredSenders] = useState<"all" | "allowed" | "blocked">("all")

  // Fetch emails from backend
   useEffect(() => {
      if (projectId) {
        fetch(`http://localhost:3000/api/projects/${projectId}/last-login`, {
          method: "PATCH",
          credentials: "include", }
        ).catch((err) => console.error("Failed to update lastLogin:", err));

        fetch (`http://localhost:3000/api/projects/${projectId}`, {
          method: "GET",
          credentials: "include", 
        }).catch((err) => console.error("Failed to get project", err));
        }
    }, [projectId]);
    
  if (!emails.length) return <p>No emails found</p>;

  //To toggle tap in tap out state for allowed and blocked senders
  const handleToggle = (SenderId: number) => 
    setSenderState(senderState.map(sender => {
      if (sender._id === SenderId) {
        return { ...sender, isBlocked: !sender.isBlocked }
      } else {
        return sender;
      }
    })
  );

  //Filter senders by allowed and blocked
  const getFilteredSenders = () => {
    if (filteredSenders === "allowed") { 
        return senderState.filter(sender => !sender.isBlocked)
    }
    if (filteredSenders === "blocked") {
        return senderState.filter(sender => sender.isBlocked)
    }
    return senderState;
  }

  return (
    <>
    <main>
      <Header />
      <section className="filter-container">
        <div className="filter-btn-container">
          <button 
          className={`filter-btn all ${filteredSenders === "all" ? "active" : ""}`} 
          onClick={() => setFilteredSenders("all")} >All</button>
          <button 
            onClick={() => setFilteredSenders("allowed")}
            className={`filter-btn allowed ${filteredSenders === "allowed" ? "filter-btn-allowed active" : "filter-btn-allowed"}`}><ThumbUpOutlined /></button>
          <button 
          className={`filter-btn blocked ${filteredSenders === "blocked" ? "active" : ""}`}
          onClick={() => setFilteredSenders("blocked")}><ThumbDownOutlined /></button>
        </div>
         <h3 className="filter-date-title">14/06/2025</h3>
        <div className="sender-container">
            <ul className="sender-list">
            {getFilteredSenders().map((sender) => (
                <li className="sender-list-item">
                <div>
                  <div className="sender-subject-flex">
                    <h4 className="filter-sender-name">{sender.from}</h4>
                    <p className="filter-sender-subject">{sender.subject}</p>
                  </div>
                  
                </div>
                <div className="filter-status-date-container">
                  <p 
                  className="filter-email-date">{new Date(sender.date).toLocaleDateString ('en-GB', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })}
                  </p>
                  <button 
                    onClick={() => handleToggle(sender._id)}
                    className={`allowed-vs-blocked ${!sender.isBlocked ? "set-allowed" : "set-blocked"}`}>
                      {!sender.isBlocked ? <ThumbUpOutlined /> : <ThumbDownOutlined />}
                  </button>
                </div>
            </li>
            ))}
        </ul>
        </div>
       </section>
      </main>
    </>
   

  )
}
export default Filter;