import { useState, useEffect } from "react";
import { useLoaderData, useOutletContext } from "react-router-dom";
import "./Filter.css";
import { ThumbUpOutlined, ThumbDownOutlined } from "@mui/icons-material";
import { SenderData } from "../../types/types";
import Spinner from "../../components/ui/Spinner";
import { SearchBar } from "../../components/ui/SearchBar";

const Filter = () => {
  const initialEmails = useLoaderData() as SenderData[];
  const { currentProjectId } = useOutletContext<{ currentProjectId: string | null }>();

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"allowed" | "blocked" | null>(null);
  const [emails, setEmails] = useState<SenderData[] | null>(null);
  const [allEmails, setAllEmails] = useState(initialEmails);
  const [filteredSenders, setFilteredSenders] = useState<"new" | "allowed" | "blocked">("new");
  const [query, setQuery] = useState("");

  function extractEmailAddress(from: string): string {
    if (!from) return "";
    const angleMatch = from.match(/<([^<>]+)>/);
    if (angleMatch) return angleMatch[1].trim().toLowerCase();
    const emailMatch = from.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    return (emailMatch ? emailMatch[0] : "").trim().toLowerCase();
  }

  function getUnprocessedEmails(emails: SenderData[]) {
    return emails.filter((email) => !email.isProcessed);
  }

  async function fetchFilteredEmails(tab: "allowed" | "blocked"): Promise<SenderData[]> {
    const endpoint = tab === "allowed" ? "allowed-emails" : "blocked-emails";

    try {
      const res = await fetch(`http://localhost:3000/api/${endpoint}`, {
        credentials: "include",
      });
      const data = await res.json();
      return data.emails ?? [];
    } catch (err) {
      console.error(`Error fetching ${tab} emails:`, err);
      return [];
    }
  };

  const fetchInitialEmails = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/unprocessed-emails`, {
        credentials: "include",
      });
      const data = await res.json();
      setAllEmails(data);
      setEmails(getUnprocessedEmails(data));
      setFilteredSenders("new");
      setQuery("");
    } catch (err) {
      console.error("Failed to fetch unprocessed emails:", err);
    }
  };
  
  useEffect(() => {
    if (currentProjectId) fetchInitialEmails();
  }, [currentProjectId]);

  useEffect(() => {
    if (filteredSenders === "new") {
      setEmails(getUnprocessedEmails(allEmails));
    } else {
      fetchFilteredEmails(filteredSenders).then(setEmails);
    }
    setQuery("")
  }, [filteredSenders, allEmails, currentProjectId]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setQuery("");
      filteredSenders === "new"
        ? setEmails(getUnprocessedEmails(allEmails))
        : fetchFilteredEmails(filteredSenders).then(setEmails);
    }
  }, [query]);

  // Toggle approval and update filters
  const handleToggle = async (emailId: string, isApproved: boolean) => {
    try {
      const emailObj = emails?.find((email) => email._id === emailId);
      if (!emailObj) throw new Error("Email not found");

      const sender = extractEmailAddress(emailObj.from);
      const affectedEmails = allEmails.filter(
        (email) => extractEmailAddress(email.from) === sender
      );
      const updatedCount = affectedEmails.length;

      await fetch(
        `http://localhost:3000/api/emails/${emailId}/process`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            isApproved,
          }),
        }
      );

      await fetch(
        `http://localhost:3000/api/projects/filters`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender,
            action: isApproved ? "allow" : "block",
          }),
        }
      );
   
      const updatedAllEmails = allEmails.map((email) =>
        extractEmailAddress(email.from) === sender
          ? { ...email, isApproved, isProcessed: true }
          : email
      );
      setAllEmails(updatedAllEmails);

      if (filteredSenders === "new") {
        setEmails(getUnprocessedEmails(updatedAllEmails));
      } else {
        setFilteredSenders((prev) =>
          prev === "allowed" ? "allowed" : "blocked"
        );
      }
      setStatusMessage(
        `${updatedCount} email${updatedCount > 1 ? "s" : ""} from ${sender} ${isApproved ? "allowed" : "blocked"
        }.`
      );
      setStatusType(isApproved ? "allowed" : "blocked");
      setTimeout(() => {
        setStatusMessage(null);
        setStatusType(null);
      }, 3000);
    } catch (err) {
      console.error("Error saving filters:", err);
    }
  };

  //Filter senders by allowed and blocked
  const getFilteredSenders = () => {
    if (!emails) return [];
    if (filteredSenders === "allowed") return emails.filter(e => e.isProcessed && e.isApproved);
    if (filteredSenders === "blocked") return emails.filter(e => e.isProcessed && !e.isApproved);
    return emails.filter(e => !e.isProcessed);
  };

  const handleSearch = async (query: string) => {
   const trimmed = query.trim();
  setQuery(query);

  if (!trimmed) {
    setEmails(allEmails);
    return;
  }

  try {
    const url = new URL("http://localhost:3000/api/search");
    url.searchParams.append("q", trimmed);
    url.searchParams.append("filterType", filteredSenders); // send "new", "allowed", or "blocked"

    const res = await fetch(url.toString(), {
      credentials: "include",
    });
    const data = await res.json();
    setEmails(data.emails ?? []);
  } catch (error) {
    console.error("Search error:", error);
    setEmails([]);
  }
};

  const today = new Date().toLocaleDateString("en-GB");

  return (
    <>
      <main>
        {!emails ? (
          <Spinner />
        ) : (
          <>
            <section className="filter-container">
              <div className="wrapper-filter-btns-status-msg">
                  {statusMessage && (
                    <div className={`status-banner ${statusType}`}>
                      {statusMessage}
                    </div>
                  )}
                <div className="filter-btn-container">
                  <button
                    className={`filter-btn new ${filteredSenders === "new" ? "active" : ""
                      }`}
                    onClick={() => setFilteredSenders("new")}
                  >
                    New
                  </button>
                  <button
                    onClick={() => setFilteredSenders("allowed")}
                    className={`filter-btn allowed ${filteredSenders === "allowed"
                        ? "filter-btn-allowed active"
                        : "filter-btn-allowed"
                      }`}
                  >
                    <ThumbUpOutlined />
                  </button>
                  <button
                    className={`filter-btn blocked ${filteredSenders === "blocked" ? "active" : ""
                      }`}
                    onClick={() => setFilteredSenders("blocked")}
                  >
                    <ThumbDownOutlined />
                  </button>
                  <SearchBar onSearch={handleSearch} inputValue={query} setInputValue={setQuery} variant="minimal" className="search-bar"/>
                </div>
              </div>
              <h3 className="filter-date-title">{today}</h3>
              <div className="sender-container">
                {getFilteredSenders()?.length === 0 &&
                  filteredSenders === "new" ? (
                  <p className="no-emails-msg">No new emails to filter</p>
                ) : (
                  <ul className="sender-list">
                    {getFilteredSenders()?.map((email) => (
                      <li className="sender-list-item" key={email._id}>
                        <div>
                          <div className="sender-subject-flex">
                            <h4 className="filter-sender-name">{email.from}</h4>
                            <p className="filter-sender-subject">
                              {email.subject}
                            </p>
                          </div>
                        </div>
                        <div className="filter-status-date-container">
                          <p className="filter-email-date">
                            {new Date(email.date).toLocaleDateString("en-GB", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })}
                          </p>
                          <button
                            onClick={() => handleToggle(email._id, true)}
                            className={`allowed-vs-blocked set-allowed ${filteredSenders !== "new" && email.isApproved
                                ? "allowed-active"
                                : ""
                              }`}
                          >
                            <ThumbUpOutlined />
                          </button>

                          <button
                            onClick={() => handleToggle(email._id, false)}
                            className={`allowed-vs-blocked set-blocked ${filteredSenders !== "new" && !email.isApproved
                                ? "blocked-active"
                                : ""
                              }`}
                          >
                            <ThumbDownOutlined />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
};
export default Filter;
