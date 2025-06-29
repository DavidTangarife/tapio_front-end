import { useState, useEffect } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import Header from "../../components/ui/Header";
import "./Filter.css";
import Button from "../../components/ui/Button";
import { ThumbUpOutlined, ThumbDownOutlined } from '@mui/icons-material';

type SenderData = {
  _id: number;
  from: string;
  date: Date;
  subject: string;
  isApproved: boolean;
}

const Filter = () => {

  // Return an array of emails  
  const emails: SenderData[] = useLoaderData() ?? [];

  // State to store emails
  const [senderState, setSenderState] = useState(emails);
  const [filteredSenders, setFilteredSenders] = useState<"all" | "allowed" | "blocked">("all")
  const [showSavedMessage, setshowSavedMessage] = useState(false);
  

  //To toggle tap in tap out state for allowed and blocked senders
  const handleToggle = (SenderId: number) =>
    setSenderState(senderState.map(sender => {
      if (sender._id === SenderId) {
        return { ...sender, isApproved: !sender.isApproved }
      } else {
        return sender;
      }
    })
    );

  //Filter senders by allowed and blocked
  const getFilteredSenders = () => {
    if (filteredSenders === "allowed") {
      return senderState.filter(sender => sender.isApproved)
    }
    if (filteredSenders === "blocked") {
      return senderState.filter(sender => !sender.isApproved)
    }
    return senderState;
  }

  function extractEmailAddress(from: string): string {
    const match = from.match(/<(.+)>/);
    return match ? match[1] : from.trim();
  }

  const handleSaveFilters = async () => {
    const allowedSenders = senderState
      .filter(sender => !sender.isApproved)
      .map(sender => extractEmailAddress(sender.from));

    try {
      const res = await fetch(`http://localhost:3000/api/projects/filters`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ filters: allowedSenders })
      });
      console.log(allowedSenders)
      if (!res.ok) throw new Error("Failed to save filters");
      setshowSavedMessage(true);
      setTimeout(() => {
        setshowSavedMessage(false);
      }, 800)
      // TODO: need a message to show filters updated
    } catch (err) {
      console.error("Error saving filters:", err);
    }
  };
  const today = (new Date).toLocaleDateString('en-GB')
  if (!emails.length) return <p>No emails found</p>;

  return (
    <>
      <main>
        <Header />
        <section className="filter-container">
          <div className="filter-btn-save-container">
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
          <div className="filters-btn-msg-container">
          {showSavedMessage && <p className="confirm-filters-saved-msg">Saved</p>}
            <Button
              buttonText="Save Filters"
              onClick={handleSaveFilters}
              className="save-filters-btn" />
              </div>
          </div>
          <h3 className="filter-date-title">{today}</h3>
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
                      className="filter-email-date">{new Date(sender.date).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    </p>
                    <button
                      onClick={() => handleToggle(sender._id)}
                      className={`allowed-vs-blocked ${sender.isApproved ? "set-allowed" : "set-blocked"}`}>
                      {sender.isApproved ? <ThumbUpOutlined /> : <ThumbDownOutlined />}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {/* TODO: need CSS */}
          </div>
        </section>
      

      </main>
    </>


  )
}
export default Filter;
