import { useLoaderData } from "react-router-dom";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useSensor, useSensors, PointerSensor, DragOverEvent, pointerWithin } from "@dnd-kit/core";
import { arrayMove, rectSwappingStrategy, SortableContext } from "@dnd-kit/sortable";
import "../../app/routes/Kanban.css"
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useHorizontalScroll } from "../../hooks/useHorizontalScroll";
import AddBoard from "./AddBoard";
import Opportunity_PopUp from "./OppPopUp";
import { Board, Opportunity } from "../../types/types";
import OpportunityCard from "./Opportunity";
import '../../app/routes/Kanban.css'
import SortableBoardContainer from "./SortableBoardContainer";

const DragTest = () => {
  const [boards, setBoards] = useState<Board[]>(useLoaderData().sort((a: Board, b: Board) => a.order - b.order));
  const [activeColumn, setActiveColumn] = useState(null)
  const [activeOpportunity, setActiveOpportunity] = useState(null)
  const [firstMount, setFirstMount] = useState(false)
  const { elementRef, setActivator } = useHorizontalScroll()
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [dragging, setDragging] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      }
    })
  )

  //=================================================================
  // Keeps track of the on page order of the boards
  //=================================================================
  const columnsId = useMemo(() => boards.map((ele: Board) => ele._id), [boards])


  //=================================================================
  // Used to update the order of the boards when they are rearranged
  //=================================================================
  useEffect(() => {
    if (firstMount) {
      const updateOrder = boards.map((element: Board) => {
        const currentPosition = Number(columnsId.findIndex(ele => ele === element._id)) + 1
        element.order = currentPosition
        return [element._id, element.order]
      })
      fetch('http://localhost:3000/api/update-column-order', {
        credentials: 'include',
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: updateOrder })
      })
    } else {
      setFirstMount(true)
    }
  }, [boards])

  return (
    <div className="page">
      <DndContext onDragStart={dragStart} onDragEnd={dragEnd} onDragOver={dragOver} sensors={sensors} collisionDetection={pointerWithin}>
        <SortableContext items={columnsId} strategy={rectSwappingStrategy}>
          <div className="boardWrapper" ref={elementRef}>
            {boards.map((board) => {
              return (
                <SortableBoardContainer
                  board={board}
                  setActivator={setActivator}
                  dragging={dragging}
                />
              )
            })}
            <AddBoard
              setBoards={setBoards} boards={boards} />
          </div>
        </SortableContext>
        {createPortal(<DragOverlay>
          {activeColumn && <SortableBoardContainer board={activeColumn} />}
          {activeOpportunity && <OpportunityCard {...activeOpportunity} />}
        </DragOverlay>, document.body)}
      </DndContext >
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
      {dragging && <div className={'deleteContainer'}> DELETE </div>}
    </div>
  )

  function dragStart(event: DragStartEvent) {
    setActiveColumn(null)
    setActiveOpportunity(null)
    setDragging(true)

    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current?.board)
      return
    }
    if (event.active.data.current?.type === "Opportunity") {
      setActiveOpportunity(event.active.data.current.opportunity)
      return
    }
  }

  function dragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    setDragging(false)

    if (activeColumn) {
      const activeColumnId = active.id;
      const overColumnId = over.id;

      if (activeColumnId === overColumnId) return;
    }

    if (activeOpportunity) {
      const opportunityListSetter = active.data.current?.opportunity.setOpportunityList
      const opportunities = active.data.current?.opportunity.opportunityList
      const activeOpportunityIndex = opportunities.findIndex(ele => ele._id === active.id)
      if (active.id === over.id) return;

      if (over.data.current?.type === "Column") {
        const opportunity = JSON.parse(JSON.stringify(opportunities[activeOpportunityIndex]))
        opportunity.statusId = over.data.current?.board._id
        opportunities.splice(activeOpportunityIndex, 1)
        console.log(event)
        const destinationOpportunityList = over.data.current?.opportunityList
        const destinationOpportunityListSetter = over.data.current?.opportunityListSetter;
        console.log(destinationOpportunityListSetter)
        const res = destinationOpportunityListSetter(() => {
          return [...destinationOpportunityList, opportunity]
        })
        return
      }


      const overOpportunityIndex = opportunities.findIndex(ele => ele._id === over.id)
      console.log(overOpportunityIndex, activeOpportunityIndex)
      const res = opportunityListSetter(() => {
        return arrayMove(opportunities, activeOpportunityIndex, overOpportunityIndex)
      })
    }
  }

  function dragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    if (active.data.current?.type === "Column") {
      setBoards((boards: Board[]) => {
        const activeIndex = boards.findIndex(ele => ele._id === activeId)
        const overIndex = boards.findIndex(ele => ele._id === overId)
        return arrayMove(boards, activeIndex, overIndex)
      })
    }
    /*if (active.data.current?.type === "Opportunity") {
      const activeOpportunityId = active.id;
      const overOpportunityId = over.id;

      if (activeOpportunityId === overOpportunityId) return;
      const opportunityListSetter = active.data.current?.opportunity.setOpportunityList
      const opportunities = active.data.current?.opportunity.opportunityList

      const activeOpportunityIndex = opportunities.findIndex(ele => ele._id === activeOpportunityId)
      const overOpportunityIndex = opportunities.findIndex(ele => ele._id === overOpportunityId)
      const res = opportunityListSetter(() => {
        return arrayMove(opportunities, activeOpportunityIndex, overOpportunityIndex)
      })
    }*/
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
        const boardId = updatedOpp.statusId
        const boardIndex = boards.findIndex(ele => ele._id === boardId)
        console.log(boards[boardIndex].opportunities)
        console.log(boardId)
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
}

export default DragTest;
