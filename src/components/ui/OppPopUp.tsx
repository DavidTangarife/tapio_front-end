import { useEffect, useState } from "react";
import Button from "./Button";
import { Opportunity, Board } from "../../types/types";
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
  onEdit: (opportuinityId: string, newdata: Opportunity) => void;
  onClose: () => void;
  boards: Board[];
}) {
  const [editing, setEditing] = useState(false);
  const [editableData, setEditableData] = useState(opportunity);
  const statusTitle =
    boards.find((b) => b._id === editableData.statusId)?.title || "Unknown";

  const LOGO_PUB = import.meta.env.VITE_LOGO_PUB;

  useEffect(() => {
    setEditableData(opportunity);
  }, [opportunity]);

  // WORKING IN PROGRESS
  // useEffect (() => {
  //   const fetchEmails = async () => {
  //     const res = await fetch("http://localhost:3000/api/getemails", {
  //       credentials: "include",
  //     });
  //     const data = await res.json();
  // }, [])

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
  function SnippetsChange(value: string) {
    const arr = value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    setEditableData((prev) => ({
      ...prev,
      snippets: arr,
    }));
  }

  function onDeleteOpp() {
    const sure = confirm("Are you sure you want to Selete this opportunity");
    if (sure) {
      onDelete(opportunity._id);
      onClose();
    }
  }

  function handleSave() {
    onEdit(opportunity._id, editableData);
    setEditing(false);
    onClose();
  }

  return (
    <div className="popupOverlay">
      <div className="popupContent">
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

            <div className="popupBox">
              <span className="label">Snippets / Keywords:</span>
              {editing ? (
                <textarea
                  rows={3}
                  value={editableData.snippets?.join(", ")}
                  onChange={(e) => SnippetsChange(e.target.value)}
                  placeholder="Please add your Keywords seprated by a ,"
                />
              ) : (
                <p>{editableData.snippets?.join(", ") || "-"}</p>
              )}
            </div>
          </div>

          <div className="popup right">
            <div className="popupEmails">
              <p>Emails from this company (scrollable)</p>
              <div className="emailList">
                {/* example static list */}
                <p>Email 1 content...</p>
                <p>Email 2 content...</p>
                <p>Email 3 content...</p>
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
            onClick={onDeleteOpp}
            buttonText="Delete"
          />
        </div>
      </div>
    </div>
  );
}

//Main tasks:

// Create the delete/patch (Services, Controller, routes) on the back end -> to play and save the opportunities -------------> Completed
// (Modify Popup when deleting opportunity - Make sure the save button Works) -------------> Completed
// Fetch emails
// -> Fix the Creation of an opportunity to assign that oppotunity ID to the email -------------> Completed
// -> Email backend should have an opportunity id parameter so when user taps on an email he can selected opportunity from dropdown -------------> Completed
// -> fetch opportunities on the emailview section (or get the opportunitys pass from that project, either prop or fetch) -------------> Completed
// -> Back end to patch that email to have that opportunity ID when a selection was confirmed -------------> Completed
// Fix Dropdown of oppotunitys to go up instead of down on email view -------------> Completed

// Changing Dropdown CSS to match the projects one for opportunities
// From save it closes the pop up, but i want to click outsie and also close the popup

// Create call to backend to fetch emails from that specific ID opprotunity (PopUp) (scrollable on the side + Go to emailbody Navigate)

// Fix Dragg and Dropp Functionality on Kanban
// Fix the snippets to save information as well
