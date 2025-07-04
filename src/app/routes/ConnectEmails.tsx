import Welcome from "../../components/ui/Welcome";
import "./ConnectEmails.css";
import { useLoaderData, useNavigate} from "react-router-dom";

import Inbox from "./Inbox";
import { Email } from "../../types/types"
import { useEffect, useState } from "react";
import Spinner from "../../components/ui/Spinner";

const ConnectEmails = () => {
  const loaderData = useLoaderData() as { emails: Email[]; inboxConnected: boolean };

  const [showEmailSection, setShowEmailSection] = useState( loaderData.inboxConnected || loaderData.emails.length > 0);
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState<Email[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // used to re-fetch emails when project changes
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);
  const navigate = useNavigate();


  /**
   * function to fetch new emails from Gmail and show new emails in database
   * It triggers when user clicks Refresh Inbox button
   */
  const handleRefreshInbox = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/direct-emails", {
        method: "POST",
        credentials: "include",
      });
      const { count }= await res.json()
      if (!res.ok) throw new Error("Failed to refresh inbox");

      // Fetch updated inbox from DB
      const getRes = await fetch("http://localhost:3000/api/getemails", {
        credentials: "include",
      });
      const data = await getRes.json();
      setEmails(data.emails || []);

      if (count > 0) {
        setRefreshMessage(`You have ${count} new emails to filter`)
      } else {
        setRefreshMessage("No new emails")
      }
      setTimeout(() => {
        setRefreshMessage(null);
      }, 3000)
    } catch (err) {
      console.error("Error refreshing inbox:", err);
    }
  };

  /**
   * Fetch emails when component mounts or refreshTrigger changes
  */
  useEffect(() => {
    const fetchEmails = async () => {
      const res = await fetch("http://localhost:3000/api/getemails", {
        credentials: "include",
      });
      const data = await res.json();

      if (data.error === "Unauthorized access: Please login") {
        return navigate("/");
      }
      if (data.error === "No Project Found") {
        return navigate("/setup");
      }

      setEmails(data.emails || []);
    };

    fetchEmails();
  }, [navigate, refreshTrigger]);

  /**
   * Called by Header component after user swaps project.
   * Triggers useEffect to refetch emails.
   */
  const handleProjectSwap = () => {
    setRefreshTrigger(Date.now());
  };

  /**
   * Called when user clicks "Connect Emails" button in Welcome screen.
   * Sends request to fetch & save emails, then updates state.
   */
  const handleConnectEmails = async () => {
    setShowEmailSection(true);
    setLoading(true)

    try {
      const res = await fetch("http://localhost:3000/api/direct-emails", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const resData = await res.json()
      // console.log(resData)
      navigate('/filter')
      return
      setEmails(resData.emails || [])
      if (!res.ok) throw new Error("Failed to fetch and save emails");
    } catch (err) {
      console.log("Error Connecting email ", err);
    }
  };

  /**
   * Called when a user taps an email (handled in EmailItem)
   * Sends PATCH request to update tap status and updates local state.
   */
  const handleTapUpdate = async (emailId: string, newTapped: boolean) => {
    try {
      const res = await fetch(`http://localhost:3000/api/emails/${emailId}/tap`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isTapped: newTapped })
      });
      if (!res.ok) {
        throw new Error('Failed to update tap-in status')
      }
      const updatedEmail = await res.json();

      // Update local email state
      setEmails(prevEmails =>
        prevEmails.map(email =>
          email._id === emailId ? { ...email, isTapped: updatedEmail.isTapped } : email
        )
      );
    } catch (err) {
      console.error("Error updating tap-in:", err);
    }
  }

  return (
    <main>
      <>
        {!showEmailSection ? (
          <Welcome onConnectEmails={handleConnectEmails} />
        ) : (
          <>
            {loading ? (
              <Spinner />
            ) : (
              <Inbox emails={emails} 
              onTapUpdate={handleTapUpdate} 
              onRefreshInbox={handleRefreshInbox}
              refreshMessage={refreshMessage}
            
               />
            )}
          </>
        )}
      </>
    </main>
  );
};
export default ConnectEmails;
