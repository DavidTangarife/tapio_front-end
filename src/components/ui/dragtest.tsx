import { useLoaderData, useOutletContext } from "react-router-dom";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverEvent,
  pointerWithin,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSwappingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import "../../app/routes/Kanban.css";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useHorizontalScroll } from "../../hooks/useHorizontalScroll";
import AddBoard from "./AddBoard";
import Opportunity_PopUp from "./OppPopUp";
import { Board, Opportunity } from "../../types/types";
import OpportunityCard from "./Opportunity";
import "../../app/routes/Kanban.css";
import SortableBoardContainer from "./SortableBoardContainer";
import DeleteContainer from "./DeleteContainer";
import Confetti from "./Confetti";

const DragTest = () => {
  const [boards, setBoards] = useState<Board[]>(
    useLoaderData().sort((a: Board, b: Board) => a.order - b.order)
  );
  const [activeColumn, setActiveColumn] = useState<Board | null>(null);
  const [activeOpportunity, setActiveOpportunity] =
    useState<Opportunity | null>(null);
  const [firstMount, setFirstMount] = useState(false);
  const { elementRef, setActivator } = useHorizontalScroll();
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);
  const [dragging, setDragging] = useState(false);
  const { currentProjectId } = useOutletContext<{
    currentProjectId: string | null;
  }>(); //Get the project Id from the Outlet context

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  //Fetch boards for the current project
  const fetchBoardsForProject = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/board`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setBoards(data.sort((a: Board, b: Board) => a.order - b.order));
      } else {
        console.error("Failed to fetch boards");
      }
    } catch (err) {
      console.error("Error fetching boards:", err);
    }
  };

  //Re-fetch when the project changes from the header
  useEffect(() => {
    if (currentProjectId) {
      fetchBoardsForProject();
    }
  }, [currentProjectId]);

  //=================================================================
  // Keeps track of the on page order of the boards
  //=================================================================
  const columnsId = useMemo(
    () => boards.map((ele: Board) => ele._id),
    [boards]
  );

  //=================================================================
  // Used to update the order of the boards when they are rearranged
  //=================================================================
  useEffect(() => {
    if (firstMount) {
      const updateOrder = boards.map((element: Board) => {
        const currentPosition =
          Number(columnsId.findIndex((ele) => ele === element._id)) + 1;
        console.log('Board: ', element.title, 'Currently pos: ', element.order, 'Setting to: ', currentPosition)
        element.order = currentPosition;
        return [element._id, element.order];
      });
      fetch("http://localhost:3000/api/update-column-order", {
        credentials: "include",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: updateOrder }),
      });
    } else {
      console.log('Setting first mount')
      setFirstMount(true);
    }
  }, [boards]);

  function dragStart(event: DragStartEvent) {
    setActiveColumn(null);
    setActiveOpportunity(null);
    setDragging(true);

    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current?.board);
      return;
    }
    if (event.active.data.current?.type === "Opportunity") {
      setActiveOpportunity(event.active.data.current.opportunity);
      return;
    }
  }

  function dragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    setDragging(false);

    if (activeColumn) {
      if (over.id === "delete" && activeColumn.deletable) {
        const boardIndex = boards.findIndex(
          (ele) => ele._id === activeColumn._id
        );
        boards.splice(boardIndex, 1);
        deleteColumn(activeColumn._id);
        return;
      }
      const activeColumnId = active.id;
      const overColumnId = over.id;

      if (activeColumnId === overColumnId) return;
      return;
    }

    if (activeOpportunity) {
      const currentOpportunities: Opportunity[] =
        active.data.current!.board.opportunities;
      const activeOpportunityIndex = currentOpportunities.findIndex(
        (ele) => ele._id === active.id
      );
      if (over.id === "success") {
        over.data.current!.opportunitiesSetter(activeOpportunity);
        currentOpportunities.splice(activeOpportunityIndex, 1);
        return;
      }
      const opportunities: Opportunity[] =
        over.data.current?.board.opportunities;
      if (over.id === "delete") {
        currentOpportunities.splice(activeOpportunityIndex, 1);
        deleteOpportunity(activeOpportunity._id);
        return;
      }

      if (active.id === over.id) return;

      if (over.data.current?.type === "Column") {
        const opportunity = JSON.parse(
          JSON.stringify(
            active.data.current?.board.opportunities[activeOpportunityIndex]
          )
        );
        opportunity.statusId = over.data.current?.board._id;
        currentOpportunities.splice(activeOpportunityIndex, 1);
        opportunity.position = opportunities.length + 1;
        over.data.current.board.opportunities = [
          ...over.data.current.board.opportunities,
          opportunity,
        ];
        return;
      }
      if (over.data.current?.type === "Opportunity") {
        const activeOpportunityId = active.id;
        const overOpportunityId = over.id;
        if (activeOpportunityId === overOpportunityId) return;
        const activeOpportunityIndex = opportunities.findIndex(
          (ele) => ele._id === activeOpportunityId
        );
        const overOpportunityIndex = opportunities.findIndex(
          (ele) => ele._id === overOpportunityId
        );
        const newArray = arrayMove(
          opportunities,
          activeOpportunityIndex,
          overOpportunityIndex
        );
        newArray.map((ele, index) => {
          ele.position = index + 1;
          return ele;
        });
        over.data.current.board.opportunities = [...newArray];
        /* console.log(event)
         * 

        const newArray = arrayMove(opportunities, activeOpportunityIndex, overOpportunityIndex)
        over.data.current.board.opportunities = newArray
        console.log(newArray)*/
      }

      return;
    }
  }

  function dragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    console.log(event);

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    if (active.data.current?.type === "Column") {
      setBoards((boards: Board[]) => {
        const activeIndex = boards.findIndex((ele) => ele._id === activeId);
        const overIndex = boards.findIndex((ele) => ele._id === overId);
        return arrayMove(boards, activeIndex, overIndex);
      });
    }
  }

  function editOpportunity(
    id: string,
    updatedData: Opportunity,
    boards: Board[],
    afterSave?: (updatedOpp: Opportunity) => void
  ) {
    fetch(`http://localhost:3000/api/opportunity/${id}/full`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((updatedOpp) => {
        const boardId = updatedOpp.statusId;
        const boardIndex = boards.findIndex((ele) => ele._id === boardId);
        console.log(boards[boardIndex].opportunities);
        console.log(boardId);
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

  function deleteColumn(_id: string) {
    fetch("http://localhost:3000/api/status", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ _id }),
    });
  }
  console.log(boards)
  const length = boards.length - 1;

  return (
    <div className="page">
      <DndContext
        onDragStart={dragStart}
        onDragEnd={dragEnd}
        onDragOver={dragOver}
        sensors={sensors}
        collisionDetection={pointerWithin}
      >
        <SortableContext items={columnsId} strategy={rectSwappingStrategy}>
          <div className="boardWrapper" ref={elementRef}>
            {boards.map((board) => (
              <SortableBoardContainer
                board={board}
                setActivator={setActivator}
                dragging={dragging}
                key={board._id}
                onOpportunityClick={(opportunity) =>
                  setSelectedOpportunity(opportunity)
                }
                length={length}
              />
            ))}
            <AddBoard setBoards={setBoards} boards={boards} />
          </div>
        </SortableContext>
        {createPortal(
          <DragOverlay>
            {activeColumn && <SortableBoardContainer board={activeColumn} />}
            {activeOpportunity && <OpportunityCard {...activeOpportunity} />}
          </DragOverlay>,
          document.body
        )}
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
              editOpportunity(id, newdata, boards, afterSave);
            }}
          />
        )}
        {dragging && <DeleteContainer />}
      </DndContext>

      {boards.map((board) => (
        <div>
          {board.opportunities.map((opp) => (
            <div>{opp.statusId === boards[length]._id && <Confetti />}</div>
          ))}
        </div>
      ))}
    </div>
  );
};
export default DragTest;
