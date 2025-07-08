import { useLoaderData, useOutletContext } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  DragOverlay,
  DndContext,
  DragStartEvent,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type {
  Board as Bt,
  Opportunity,
  Opportunity as Ot,
} from "../../types/types";
import "./Kanban.css";
import BoardCard from "../../components/ui/Board";
import OpportunityCard from "../../components/ui/Opportunity";
import Opportunity_PopUp from "../../components/ui/OppPopUp";
import { useHorizontalScroll } from "../../hooks/useHorizontalScroll";
import AddBoard from "../../components/ui/AddBoard";

export default function Kanban() {
  const initialData = useLoaderData(); //Initial Data from loader
  const { currentProjectId } = useOutletContext<{ currentProjectId: string | null }>(); //Get the project Id from the Outlet context
  const [boards, setBoards] = useState<Bt[]>([]);
  const [currentFocus, setCurrentFocus] = useState<HTMLInputElement | null>(
    null
  );
  const [selectedOpportunity, setSelectedOpportunity] = useState<Ot | null>(
    null
  );
  const [activeOpportunityId, setActiveOpportunityId] = useState<string | null>(
    ""
  );
  const isDragging = useRef(false);
  const { elementRef, setActivator } = useHorizontalScroll();
  
  //Fetch boards for the current project
  const fetchBoardsForProject = async (projectId: string) => {
    try {
      console.log("Fetch boards for this project:", projectId);
      const response = await fetch(`http://localhost:3000/api/board`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        setBoards(data);
      } else {
        console.error("Failed to fetch boards");
      }
    } catch (err) {
      console.error("Error fetching boards:", err);
    }
  };

  //For initial load
  useEffect(() => {
    setBoards(initialData);
  }, [initialData]);

  //Re-fetch when the project changes from the header
  useEffect(() => {
    if (currentProjectId) {
      fetchBoardsForProject(currentProjectId);
    }
  }, [currentProjectId]);

  useEffect(() => {
    console.log('Updating Boards')
  }, [boards])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 2, // Only start dragging after moving 2px
      },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveOpportunityId(event.active.id as string);
    isDragging.current = true;
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveOpportunityId(null);
    isDragging.current = false; // Reset after drag

    const { active, over } = event; // active -> Draggable Item that was move, over -> droppable board where item was dropped
    if (!over) return; // If dropped in non valid area do nothing

    const OpportunityId = active.id as string; // We gotta manually typecast this two as there ir no way Dragevent can tell -> match opportunity._id
    const newStatusId = over.id as string; // We gotta manually typecast this two as there ir no way Dragevent can tell -> match board._id

    setBoards((prevBoards: Bt[]) => {
      // Remove the opportunity from its board by making a coppy of all the boards and just filtering the one that matched the Dragged one (OpportunityId)
      const updateBoards: Bt[] = prevBoards.map((board) => ({
        ...board,
        opportunities: board.opportunities.filter(
          (op) => op._id !== OpportunityId
        ),
      }));

      // Find the moved opportunity by flattening the original Boards into one array of opportunities and then search for the one being Dragged
      const movedOpportunity: Ot | undefined = prevBoards
        .flatMap((board) => board.opportunities) // Insert all the opportunitiesfrom every board into one array.
        .find((op) => op._id === OpportunityId); // find the opportunities that matched the Dragged one (OpportunityId)

      if (!movedOpportunity) return prevBoards;

      // Add it to the new Board
      return updateBoards.map((board) => {
        if (board._id === newStatusId) {
          return {
            ...board, // Clone the board with its properties
            opportunities: [
              ...board.opportunities, // Clone the opportuinites for that board
              { ...movedOpportunity, statusId: newStatusId }, // Append the opportunity and update the statusId of the opportunity that was dragged to the board.
            ],
          };
        }
        return board; // Return all the other boards that did not match the newstatus
      });
    });

    // Call the backend to patch the Opportunity and modify the status
    fetch(`http://localhost:3000/api/opportunity/${OpportunityId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statusId: newStatusId }),
    }).catch((err) => {
      console.error("Failed to update opportunity:", err);
    });
  }

  const active = boards
    .flatMap((b) => b.opportunities)
    .find((op) => op._id === activeOpportunityId);

  function editOpportunity(
    id: string,
    updatedData: Opportunity,
    afterSave?: (updatedOpp: Opportunity) => void
  ) {
    fetch(`http://localhost:3000/api/opportunity/${id}/full`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((updatedOpp) => {
        setBoards((prevBoards) => {
          // Remove opportunity from all boards first
          const clearedBoards = prevBoards.map((board) => ({
            ...board,
            opportunities: board.opportunities.filter(
              (opp) => opp._id !== updatedOpp._id
            ),
          }));

          // Then add the opportunity to the correct board
          return clearedBoards.map((board) => {
            if (board._id === updatedOpp.statusId) {
              return {
                ...board,
                opportunities: [...board.opportunities, updatedOpp],
              };
            }
            return board;
          });
        });
        // After patching the changes we close the popup by deselecting the selectedopportunity
        setSelectedOpportunity(updatedOpp);
        if (afterSave) afterSave(updatedOpp); //Call back to opportunity pop up to handle the update inside the component (Making a faster changer)
      })
      .catch((err) => {
        console.error("Failed to update opportunity:", err);
      });
  }

  function deleteOpportunity(id: string) {
    fetch(`http://localhost:3000/api/opportunity/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete opportunity");
        }

        setBoards((prevBoards) =>
          prevBoards.map((board) => ({
            ...board,
            opportunities: board.opportunities.filter((opp) => opp._id !== id),
          }))
        );

        return "Opportunity Deleted / Feedback to the user";
      })
      .catch((err) => {
        console.error("Error deleting opportunity:", err.message);
      });
  }

  return (
    <div className="page">
      <div className="boardWrapper" ref={elementRef}>
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {boards.map((board) => {
            return (
              <BoardCard
                key={board._id}
                {...board}
                isDraggingRef={isDragging}
                onOpportunityClick={(opportunity) =>
                  setSelectedOpportunity(opportunity)
                }
                currentFocus={currentFocus}
                setCurrentFocus={setCurrentFocus}
                setActivator={setActivator}
              />
            );
          })}

          <DragOverlay>
            {activeOpportunityId ? (
              <OpportunityCard
                {...(active as Opportunity)}
                isDraggingRef={isDragging}
                onClick={() => {}}
                style={{ opacity: 0.6 }}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
        <AddBoard
          currentFocus={currentFocus}
          setCurrentFocus={setCurrentFocus}
          setBoards={setBoards}
          boards={boards}
        />
      </div>
      {selectedOpportunity && (
        <Opportunity_PopUp
          opportunity={selectedOpportunity}
          boards={boards}
          onClose={() => setSelectedOpportunity(null)}
          onDelete={(id) => {
            deleteOpportunity(id);
            setSelectedOpportunity(null);
          }}
          onEdit={(id, newdata, afterSave) => {
            editOpportunity(id, newdata, afterSave);
          }}
        />
      )}
    </div>
  );
}
