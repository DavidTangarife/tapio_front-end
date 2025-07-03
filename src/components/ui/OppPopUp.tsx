import { useEffect, useState, useRef } from "react";
import Button from "./Button";
import EmailItem from "../../components/ui/EmailItem";
import { Opportunity, Board, Email } from "../../types/types";
import "./OppPopUp.css";

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
    newdata: Opportunity,
    afterSave?: (updatedOpp: Opportunity) => void
  ) => void;
  onClose: () => void;
  boards: Board[];
}) {
  const [editing, setEditing] = useState(false);
  const [editableData, setEditableData] = useState(opportunity);
  const [oppoEmails, setOppoEmails] = useState<Email[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const statusTitle =
    boards.find((b) => b._id === editableData.statusId)?.title || "Unknown";
  const LOGO_PUB = import.meta.env.VITE_LOGO_PUB;
  const popupRef = useRef<HTMLDivElement | null>(null);

  // Retrieve emails from the opportunity
  const fetchEmailsFromOpp = async () => {
    try {
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

  // Handle snippets editing - for simplicity, let's make it a textarea with comma-separated values
  // function SnippetsChange(value: string) {
  //   const arr = value
  //     .split(",")
  //     .map((s) => s.trim())
  //     .filter((s) => s.length > 0);
  //   setEditableData((prev) => ({
  //     ...prev,
  //     snippets: arr,
  //   }));
  // }

  function onDeleteOpp() {
    onDelete(opportunity._id);
    onClose();
  }

  function handleSave() {
    //So when handle the save my editable data will receive my updated opportunity as a prop to display on editableData
    onEdit(opportunity._id, editableData, (updatedOpp) => {
      setEditableData(updatedOpp);
      setEditing(false);
    });
  }

  return (
    <div className="popupOverlay">
      <div className="popupContent" ref={popupRef}>
        <div className="popupHeader">
          <div className="popupTitleSection">
            {editing ? (
              <input
                value={editableData.title}
                onChange={(e) =>
                  setEditableData({ ...editableData, title: e.target.value })
                }
                autoFocus
              />
            ) : (
              <h1>{opportunity.title}</h1>
            )}
            <h2>{opportunity.company.name}</h2>
          </div>
          <img
            src={`${opportunity.company.logoUrl}?token=${LOGO_PUB}`}
            className="popupLogo"
          />
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
            {/* <div className="popupBox">
              <span className="label">Snippets:</span>
              {editing ? (
                <textarea
                  rows={3}
                  value={editableData.snippets?.join(", ")}
                  onChange={(e) => SnippetsChange(e.target.value)}
                  placeholder="Please add your Keywords seprated by a ,"
                />
              ) : (
                <p>{editableData.snippets?.join(", ") || ""}</p>
              )}
            </div> */}
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
                  Are you sure you want to delete
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

// Fix the snippets to save information as well (work on the snippets of Opportunity)
// fix the title so the space where clicking is smaller (cause now you can click on empty space and stil popup will show up)

// Changing Dropdown CSS to match the projects one for opportunities (max)
// jumpin into an email start the scroll form the bottom, when it should start from the top
// Maybe functionality of alredady added to the board
// this email domain is already an oppotunity would you like to link it

// when swapping projects -> Board and filter should re render as well
// redirect to fiter page (jacob)
