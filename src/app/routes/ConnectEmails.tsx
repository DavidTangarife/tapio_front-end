import Welcome from "../../components/ui/Welcome";
import "./ConnectEmails.css";
import { useLoaderData, useNavigate, useOutletContext } from "react-router-dom";

import Inbox from "./Inbox";
import { Email } from "../../types/types"
import { useEffect, useState } from "react";
import Spinner from "../../components/ui/Spinner";
import { paginatedEmails } from "../../types/types";


const ConnectEmails = () => {
  const loaderData = useLoaderData() as { inboxConnected: boolean };
  const [showEmailSection, setShowEmailSection] = useState( loaderData.inboxConnected );
  const [loading, setLoading] = useState(false);
  const [unreadEmails, setUnreadEmails] = useState<paginatedEmails | null>(null);
  const [readEmails, setReadEmails] = useState<paginatedEmails | null>(null);
  const [tappedEmails, setTappedEmails] = useState<Email[]>([]);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);
  const [refreshLoadingIcon, setRefreshLoadingIcon] = useState(false);
  const navigate = useNavigate();
  const [unreadPage, setUnreadPage] = useState(1);
  const [readPage, setReadPage] = useState(1);
  const [tappedPage, setTappedPage] = useState(1);

  const { currentProjectId } = useOutletContext<{ currentProjectId: string | null }>();

  /**
   * function to fetch new emails from Gmail and show new emails in database
   * It triggers when user clicks Refresh Inbox button
   */
  const handleRefreshInbox = async () => {
    try {
      setRefreshLoadingIcon(true);
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
      setRefreshLoadingIcon(false);

      setRefreshMessage(count > 0 ? `You have ${count} new emails to filter` : "No new emails");
      setTimeout(() => {
        setRefreshMessage(null);
      }, 3000)
    } catch (err) {
      console.error("Error refreshing inbox:", err);
    }
  };

  /**
   * helper function to fetch paginated read and unread emails and
   * tapped emails
   * Fetch emails when component mounts and when refreshTrigger or projectId changes
  */
  const fetchEmails = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/getemails?unread=${unreadPage}&read=${readPage}`, {
        credentials: "include",
      });
      const data = await res.json();

      if (data.error === "Unauthorized access: Please login") {
        navigate("/");
        return;
      }
      if (data.error === "No Project Found") {
        navigate("/setup");
        return;
      }

      setUnreadEmails(data.unread ?? { emails: [], total: 0, page: 1, pages: 1 });
      setReadEmails(data.read ?? { emails: [], total: 0, page: 1, pages: 1 });
      setTappedEmails(data.tapped);
    } catch (err) {
      console.error("Failed to fetch emails:", err);
    }
    };

  
  // Initial fetch on mount
  useEffect(() => {
    fetchEmails();
    
  }, [unreadPage, readPage, navigate, currentProjectId]);
  
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
      await res.json()
      navigate('/filter')
      return
    } catch (err) {
      console.log("Error Connecting email ", err);
    }
  };

  /**
   * Called when a user taps an email (handled in EmailItem)
   * Sends PATCH request to update tap status.
   * sends a GET request to refetch emails 
   */
  const handleTapUpdate = async (emailId: string, newTapped: boolean) => {
    try {
      const res = await fetch(`http://localhost:3000/api/emails/${emailId}/tap`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isTapped: newTapped }),
      });

      if (!res.ok) {
        throw new Error('Failed to update tap-in status');
      }

      await fetchEmails();  // Re-fetch emails after update to keep pagination & state in sync
    } catch (err) {
      console.error("Error updating tap-in:", err);
    }
  };

  const handleUnreadPageChange = (newPage: number) => {
    setUnreadPage(newPage);
  };
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
              <Inbox 
                unreadEmails={unreadEmails}
                readEmails={readEmails}
                tappedEmails={tappedEmails}
                onTapUpdate={handleTapUpdate} 
                onRefreshInbox={handleRefreshInbox}
                refreshMessage={refreshMessage}
                unreadPage={unreadPage}
                setUnreadPage={setUnreadPage}
                readPage={readPage}
                setReadPage={setReadPage}
                tappedPage={tappedPage}
                setTappedPage={setTappedPage}
                refreshLoadingIcon={refreshLoadingIcon}
               />
            )}
          </>
        )}
      </>
    </main>
  );
};
export default ConnectEmails;
