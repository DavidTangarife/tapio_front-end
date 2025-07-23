import { useEffect, useState, useRef } from "react";
import Button from "./Button";
import EmailItem from "../../components/ui/EmailItem";
import { Opportunity, Board, Email } from "../../types/types";
import "./OppPopUp.css";
import * as chrono from 'chrono-node';

export default function Opportunity_PopUp({
  opportunity,
  onDelete,
  onClose,
  onEdit,
  boards,
}: {
  opportunity: Opportunity;
  onDelete: (opportuinityId: string) => void;
  onEdit: (
    opportuinityId: string,
    newdata: Opportunity & { snippFlag?: boolean },
    afterSave?: (updatedOpp: Opportunity) => void
  ) => void;
  onClose: () => void;
  boards: Board[];
}) {
  const [editing, setEditing] = useState(false);
  const [editableData, setEditableData] = useState(opportunity);
  const [oppoEmails, setOppoEmails] = useState<Email[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [message, setMessage] = useState('')
  const statusTitle =
    boards.find((b) => b._id === editableData.statusId)?.title || "Unknown";
  const LOGO_PUB = import.meta.env.VITE_LOGO_PUB;
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [titleError, setTitleError] = useState<boolean>(false);

  // Retrieve emails from the opportunity
  const fetchEmailsFromOpp = async () => {
    try {
      console.log("fetching emails from ID:", opportunity._id);
      const res = await fetch(
        `http://localhost:3000/api/getemails/${opportunity._id}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      setOppoEmails(data);
    } catch (err) {
      console.error("Failed to fetch the emails for this opportunity", err);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    setEditableData(opportunity);
    fetchEmailsFromOpp();
  }, [opportunity]);

  // Handle change for description fields

  function DescriptionChange(
    field: keyof Opportunity["description"],
    value: string
  ) {
    setEditableData((prev) => ({
      ...prev,
      description: {
        ...prev.description!,
        [field]: value,
      },
    }));
  }

  // Handle Snippets creation and deletion

  function handleAddSnippet(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      const value = (event.target as HTMLInputElement).value.trim();
      if (value.length === 0) return;

      const [key, ...rest] = value.split(":"); // Split my string by the character ":", an creates and array of my values.
      // Then it uses array destructuring to set the first value of my array to the key and the rest of the values in a new array
      const val = rest.join(":").trim(); // joins and trims the spaces of this second array to get the value of my object

      if (!key || !val) return; // Validate that key an value exist

      // Create my object with key and value
      const snippetObj = { [key.trim()]: val };

      setEditableData((prev) => ({
        ...prev,
        snippets: [...(prev.snippets || []), snippetObj],
      }));

      (event.target as HTMLInputElement).value = ""; // Clear input
    }
  }

  function removeSnippet(index: number) {
    setEditableData((prev) => ({
      ...prev,
      snippets: (prev.snippets || []).filter((_, i) => i !== index),
    }));
  }

  function onDeleteOpp() {
    onDelete(opportunity._id);
    onClose();
  }

  function handleSave() {
    const finalSnippets = editableData.snippets?.filter(
      (s) => Object.keys(s).length > 0
    );

    const payload = {
      ...editableData,
      snippFlag: true,
      snippets: finalSnippets,
    };

    if (editableData.title.trim() === "") {
      setTitleError(true);
      setTimeout(() => setTitleError(false), 3000);
      return;
    } else {
      setTitleError(false);
    }

    //So when handle the save my editable data will receive my updated opportunity as a prop to display on editableData
    onEdit(opportunity._id, payload, (updatedOpp) => {
      setEditableData(updatedOpp);
      setEditing(false);
    });
  }

  async function handleAddToCalendar() {
    setMessage("");
    const snippets = opportunity.snippets;

    const getSnippetValue = (keyName: string) => {
      const match = snippets.find(
        (obj) => Object.keys(obj)[0]?.toLowerCase() === keyName.toLowerCase()
      );
      return match ? match[Object.keys(match)[0]] : null;
    };

    const dateString = getSnippetValue("date");
    const location = getSnippetValue("location");

    if (!dateString) {
      setMessage("No valid date found.");
      return;
    }

    // Parse date using chrono
    const parsedDate = chrono.parseDate(dateString);

    if (!parsedDate) {
      setMessage("No valid date found.");
      return;
    }
    const res = await fetch("http://localhost:3000/api/add-to-calendar", {
      method: 'POST',
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: `Interview for ${opportunity.title} at ${opportunity.company.name}`,
        description: opportunity.description?.type,
        start: parsedDate.toISOString(),
        end: new Date(parsedDate.getTime() + 60 * 60 * 1000).toISOString(),
        location: location
      })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("You’re all set!")
    } else {
      console.error("Calendar error:", data);
    }
  }

  return (
    <div className="popupOverlay">
      <div className="popupContent" ref={popupRef}>
        <div className="popupHeader">
          <img
            src={`${opportunity.company.logoUrl}?token=${LOGO_PUB}`}
            className="popupLogo"
          />
          <div className="popupTitleSection">
            {editing ? (
              <div style={{ position: "relative" }}>
                <input
                  value={editableData.title}
                  onChange={(e) =>
                    setEditableData({ ...editableData, title: e.target.value })
                  }
                  placeholder=" Positon / Role"
                  autoFocus
                />
                {titleError && (
                  <div className="warning-msg">
                    <p>Please fill out this field</p>
                  </div>
                )}
              </div>
            ) : (
              <h1>{opportunity.title}</h1>
            )}
            <h2>{opportunity.company.name}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            X
          </button>
        </div>

        <div className="popupMain">
          <div className="popup left">
            <div className="popupBox">
              {editing ? (
                <>
                  <div className="popupRow">
                    <span className="label">Location:</span>
                    <input
                      type="text"
                      value={editableData.description.location}
                      onChange={(e) =>
                        DescriptionChange("location", e.target.value)
                      }
                    />
                  </div>
                  <div className="popupRow">
                    <span className="label">Type:</span>
                    <input
                      type="text"
                      value={editableData.description.type}
                      onChange={(e) =>
                        DescriptionChange("type", e.target.value)
                      }
                    />
                  </div>
                  <div className="popupRow">
                    <span className="label">Salary:</span>
                    <input
                      type="text"
                      value={editableData.description.salary}
                      onChange={(e) =>
                        DescriptionChange("salary", e.target.value)
                      }
                    />
                  </div>
                  <div className="popupRow">
                    <span className="label">Posted:</span>
                    <input
                      type="text"
                      value={editableData.description.posted}
                      onChange={(e) =>
                        DescriptionChange("posted", e.target.value)
                      }
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="popupRow">
                    <span className="label">Location:</span>
                    <span>{editableData.description.location || "-"} </span>
                  </div>
                  <div className="popupRow">
                    <span className="label">Type:</span>
                    <span>{editableData.description.type || "-"}</span>
                  </div>
                  <div className="popupRow">
                    <span className="label">Salary:</span>
                    <span>{editableData.description.salary || "-"}</span>
                  </div>
                  <div className="popupRow">
                    <span className="label">Posted:</span>
                    <span>{editableData.description.posted || "-"}</span>
                  </div>
                </>
              )}
            </div>

            {/* Work on snippets from an email */}
            <div className="popupBox snippets">
              <span className="label">Snippets:</span>
              {editing ? (
                <>
                  <div className="snippet-tags">
                    {editableData.snippets?.map((snippet, index) => {
                      const key = Object.keys(snippet)[0];
                      const value = snippet[key];
                      return (
                        <div className="snippet-tag" key={index}>
                          <span>{`${key} : ${value}`}</span>
                          <span
                            className="delete-x"
                            onClick={() => removeSnippet(index)}
                            title="Remove"
                          >
                            X
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <input
                    type="text"
                    placeholder="Name : Value, & hit enter"
                    onKeyDown={handleAddSnippet}
                    className="snippet-input"
                  />
                </>
              ) : (
                <div className="snippet-tags">
                  {editableData.snippets?.map((snippet, index) => {
                    const key = Object.keys(snippet)[0];
                    const value = snippet[key];
                    return (
                      <div className="snippet-tag" key={index}>
                        <span>
                          <span className="snippet-key">{key}</span> :{" "}
                          <span className="snippet-value">{value}</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="popup right">
            <div className="popupEmails">
              <h2>Emails :</h2>
              <div className="email-list">
                {oppoEmails.map((email) => (
                  <EmailItem
                    key={email._id}
                    sender={email.from}
                    subject={email.subject}
                    date={email.date}
                    _id={email._id}
                    onTapUpdate={() => {}}
                    showTapIn={false}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="popupFooter">
          <div className="calendar-action-wrapper">
          <Button
            className="button calendar"
            onClick={handleAddToCalendar}
            buttonText="Add to Calendar"
          />
          {message && (
            <div className="tapup-confirmation-msg">{message}</div>
          )}
          </div>
          <Button
            className={`button ${editing ? "editing" : ""}`}
            onClick={() => {
              if (editing) {
                handleSave();
              } else {
                setEditing(true);
              }
            }}
            buttonText={editing ? "Save" : "Edit"}
          />

          {editing ? (
            <select
              className="change-opp-status"
              value={editableData.statusId}
              onChange={(e) => {
                setEditableData({
                  ...editableData,
                  statusId: e.target.value,
                });
              }}
            >
              {boards.map((board) => (
                <option key={board._id} value={board._id}>
                  {board.title}
                </option>
              ))}
            </select>
          ) : (
            <h2 className="status">{statusTitle}</h2>
          )}

          <Button
            className="button delete"
            onClick={() => setOpenDeleteModal(true)}
            buttonText="Delete"
          />

          {/* pop up to confirm delete project */}
          {openDeleteModal && (
            <>
              <div className="delete-modal-overlay"></div>
              <aside className="confirm-delete-modal">
                <p className="confirm-delete-msg">
                  Are you sure you want to delete this opportunity
                </p>
                <p className="project-to-delete"> {editableData?.title} ?</p>
                <div className="delete-modal-btn-container">
                  <button
                    className="delete-modal-btn yes"
                    onClick={onDeleteOpp}
                  >
                    Yes
                  </button>
                  <button
                    className="delete-modal-btn no"
                    onClick={() => setOpenDeleteModal(false)}
                  >
                    No
                  </button>
                </div>
              </aside>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
