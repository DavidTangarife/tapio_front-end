import EmailItem from "../../components/ui/EmailItem";
import "./Inbox.css";
import { Email, InboxProps } from "../../types/types";
import { SearchBar } from "../../components/ui/SearchBar";
import { useEffect, useRef, useState } from "react";
import { Refresh } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";


const Inbox: React.FC<InboxProps> = ({ emails, onTapUpdate, onRefreshInbox }) => {
  const [searchResults, setSearchResults] = useState<Email[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  
  // if (!emails.length) return <p>No emails found</p>;

  const readEmails = emails.filter(email =>
    email.isRead && !email.isTapped)
  const unreadEmails = emails.filter(email =>
    !email.isRead && !email.isTapped)
  const tappedEmails = emails.filter(email => email.isTapped)

  useEffect(() => {
    const trimmed = inputValue.trim();

    if (trimmed.length === 0) {
      setSearchResults([]);
      setSearchQuery("");
      return;
    }

    const timeout = setTimeout(() => {
      fetchSearchResults(trimmed);
    }, 300);
    // cleanup on unmount
    return () => clearTimeout(timeout);

  }, [inputValue]);

  async function fetchSearchResults(query: string) {
    try {
      const res = await fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(query)}`, {
        credentials: "include",
      });
      const data = await res.json();
      setSearchResults(data.emails ?? []);
      setSearchQuery(query);
    } catch (error) {
      setSearchResults([]);
      setSearchQuery(query);
    }
  }

  useEffect(() => {
    const handleClickOrEscape = (event: MouseEvent | KeyboardEvent) => {
    // Close on outside click
    if (
      event instanceof MouseEvent &&
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target as Node)
    ) {
      setSearchResults([]);
      setSearchQuery("");  
    }
    // Close on Escape key
    if (event instanceof KeyboardEvent && event.key === "Escape") {
      setSearchResults([]);
      setSearchQuery("");
    }
  };
  document.addEventListener("mousedown", handleClickOrEscape);
  document.addEventListener("keydown", handleClickOrEscape);

  return () => {
    document.removeEventListener("mousedown", handleClickOrEscape);
    document.removeEventListener("keydown", handleClickOrEscape);
  };
  }, []);

  
  return (
    <>
      <div className="inbox-header">
        <button onClick={onRefreshInbox} className="refresh-button"><Refresh /></button>
        <div className="search-wrapper" ref={wrapperRef}>
          <SearchBar onSearch={() => fetchSearchResults(inputValue.trim())} inputValue={inputValue} setInputValue={setInputValue}/>
          {searchQuery && (
            <ul className="search-dropdown">
              {searchResults.length > 0 ? (
                <>
                  {searchResults.slice(0, 5).map((email) => (
                    <li
                      key={email._id}
                      className="search-dropdown-item"
                      onClick={() => navigate(`/email/${email._id}`)}
                    >
                      <div className="dropdown-content">
                        <div>
                          <p className="dropdown-subject">{email.subject}</p>
                          <p className="dropdown-from">{email.from}</p>
                        </div>
                        <span className="dropdown-date">
                          {new Date(email.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </li>
                  ))}
                {searchResults.length > 5 && (
                  <li
                    className="search-dropdown-item view-all"
                    onClick={() => navigate(`/emails?q=${searchQuery}`)}
                  >
                    <span className="view-all-text">
                      All search results for <strong>"{searchQuery}"</strong> →
                    </span>
                  </li>
                )}
                </>
            ) : (
              <li className="search-dropdown-item no-result">
                No results for <strong>{searchQuery}</strong>
              </li>
            )}
            </ul>
          )}
        </div>
      </div>

      <div className="email-section">
        {tappedEmails.length > 0 && (
          <>
            <h3 className="email-section-title">TAPPED UP</h3>
            <div className="email-list">
              {tappedEmails.map((email) => (
                <EmailItem
                  key={email._id}
                  _id={email._id}
                  sender={email.from}
                  subject={email.subject}
                  senderAddress={email.from}
                  body={email.body}
                  isRead={email.isRead}
                  date={email.date}
                  isTapped={email.isTapped}
                  onTapUpdate={onTapUpdate}
                />
              ))}
            </div>
          </>
        )}

        <h3 className="email-section-title">UNREAD</h3>
        {unreadEmails.length > 0 ?
        <div className="email-list">
          {unreadEmails.map((email) => (
            <EmailItem
              key={email._id}
              _id={email._id}
              sender={email.from}
              subject={email.subject}
              senderAddress={email.senderAddress}
              body={email.body}
              isRead={email.isRead}
              date={email.date}
              isTapped={email.isTapped}
              onTapUpdate={onTapUpdate}
            />
          ))}
        </div> : <p className="no-new-emails-msg">No new emails</p>
}
        {readEmails.length > 0 && (
          <>
            <h3 className="email-section-title">READ</h3>
            <div className="email-list">
              {readEmails.map((email) => (
                <EmailItem
                  key={email._id}
                  _id={email._id}
                  sender={email.from}
                  subject={email.subject}
                  senderAddress={email.senderAddress}
                  body={email.body}
                  isRead={email.isRead}
                  date={email.date}
                  isTapped={email.isTapped}
                  onTapUpdate={onTapUpdate}
                />
              ))}
            </div>
          </>)}
      </div>
    </>
  )
};
export default Inbox;
