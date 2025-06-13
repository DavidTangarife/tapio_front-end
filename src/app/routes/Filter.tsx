import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Filter.css";

type SenderData = {
  id: number;
  name: string;
  email: string;
  allowed: boolean;
  subject: string;
}

const Senders: SenderData[] = [
    {id: 123, name: "John Doe", email: "John.Doe@example.com", allowed: true, subject: "Thank you for your application"},
    {id: 456, name: "Jane Doe", email: "Jane.Doe@example.com", allowed: true, subject: "I want to connect"},
    {id: 789, name: "Jim Doe", email: "Jim.Doe@example.com", allowed: true, subject: "Congratulations on your offer"},
  ]

  const Filter = () => {
  
  const [senderState, setSenderState] = useState(Senders);
  const [filteredSenders, setFilteredSenders] = useState<"all" | "allowed" | "blocked">("all")
  const [menuOpen, setMenuOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();

  //To toggle tap in tap out state for allowed and blocked senders
  const handleToggle = (SenderId: number) => 
    setSenderState(senderState.map(sender => {
      if (sender.id === SenderId) {
        return { ...sender, allowed: !sender.allowed }
      } else {
        return sender;
      }
    })
  );

  //Filter senders by allowed and blocked
  const getFilteredSenders = () => {
    if (filteredSenders === "allowed") { 
        return senderState.filter(sender => sender.allowed)
    }
    if (filteredSenders === "blocked") {
        return senderState.filter(sender => !sender.allowed)
    }
    return senderState;
  }

  //Get user data for the user button
  useEffect(() => {
      const fetchUser = async () => {
        try {
          const res = await fetch("http://localhost:3000/api/full-name", {
            credentials: "include",
          });
          const data = await res.json();
          if (res.ok && data.fullName) {
            setFullName(data.fullName);
          }
        } catch (err) {
          console.error("Failed to fetch user", err)
        }
      };
      fetchUser();
    }, []);
  

    const getInitials = (name: string) => {
      const names = name.trim().split(" ");
      if (names.length === 1) return names[0][0].toUpperCase();
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
  
    const userInitials = getInitials(fullName || "U");
  
    const toggleMenu = () => {
      setMenuOpen(prev => !prev);
    };
  
    const handleSettings = () => {
      // navigate to settings page
      navigate("/settings");
      setMenuOpen(false);
    };
  
    const handleLogout = () => {
      // logout logic
      console.log("Logging out...");
      setMenuOpen(false);
    };

  return (
    <>
    <main>
      <section className="header-container">
        <h1 className="logo">Tapio</h1>
        <h1 className="filter-title">Email Filter</h1>
           <div className="user-menu">
        <button className="user-btn" onClick={toggleMenu}>
          {userInitials}
        </button>
        {menuOpen && (
          <div className="dropdown">
            <button onClick={handleSettings}>Settings</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
        </div>
      </section>
      <section className="filter-container">
        <div className="filter-btn-container">
          <button 
          className={`filter-btn all ${filteredSenders === "all" ? "active" : ""}`} 
          onClick={() => setFilteredSenders("all")} >All</button>
          <button 
            onClick={() => setFilteredSenders("allowed")}
            className={`filter-btn allowed ${filteredSenders === "allowed" ? "filter-btn-allowed active" : "filter-btn-allowed"}`}>Allowed</button>
            
          <button 
          className={`filter-btn blocked ${filteredSenders === "blocked" ? "active" : ""}`}
          onClick={() => setFilteredSenders("blocked")}>Blocked</button>
        </div>
        
        <div className="sender-container">
            <ul className="sender-list">
            {getFilteredSenders().map((sender) => (
                <li className="sender-list-item">
                <div>
                  <div className="sender-subject-flex">
                    <h4 className="filter-sender-name">{sender.name}</h4>
                    <p className="filter-sender-subject">{sender.subject}</p>
                  </div>
                  <p className="filter-sender-email">{sender.email}</p>
                </div>
                <div className="filter-status-container">
                  <p 
                    className={`allowed-vs-blocked ${sender.allowed ? "set-allowed" : "set-blocked"}`}>
                      {sender.allowed ? "Allowed" : "Blocked"}
                  </p>
                  <button className="tapin-tapout-btn" onClick = {() => handleToggle(sender.id)}>
                  { sender.allowed ? "Tap Out" : "Tap in" }
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