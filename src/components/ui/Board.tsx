import "./Board.css";
import OpportunityCard from "./Opportunity";
import { Board, Opportunity } from "../../types/types";
import BoardHeading from "./BoardHeading";
import { SortableContext } from "@dnd-kit/sortable";
import { Dispatch, memo, SetStateAction, useEffect, useMemo, useState } from "react";

type BoardCardProps = {
  board: Board
  dragging: boolean
  setActivator: Dispatch<SetStateAction<boolean>>
  opportunityList: Opportunity[]
  setOpportunityList: Dispatch<SetStateAction<Opportunity[]>>
};

const BoardCard = memo((props: BoardCardProps) => {
  const { _id, title } = props.board
  const { dragging, setActivator, opportunityList, setOpportunityList } = props
  const [firstMount, setFirstMount] = useState(false)
  const opportunityIds = useMemo(() => opportunityList.map((ele) => ele._id), [opportunityList])

  useEffect(() => {
    console.log('State of opps changed')
    console.log(opportunityList)
    if (firstMount) {
      const updateOrder = opportunityList.map((element) => {
        const currentPosition = Number(opportunityList.findIndex(ele => ele._id === element._id)) + 1
        element.position = currentPosition
        return [element._id, element.position, _id]
      })
      fetch('http://localhost:3000/api/update-opportunity-order', {
        credentials: 'include',
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { updateOrder } })
      })
    } else {
      setFirstMount(true)
    }
  }, [opportunityIds])


  //=====================================================================================
  // Makes the boards themselves sortable.
  // Attach the attributes and listeners to the component to make it grabbable as below:
  // <div {...attributes} {...listeners}>
  //=====================================================================================


  // This is for scrolling
  const mouseEntered = () => {
    if (!dragging) {
      setActivator(false);
    }
  };

  const mouseLeft = () => {
    if (!dragging) {
      setActivator(true);
    }
  };


  return (
    <div key={_id} >
      <BoardHeading
        title={title}
        _id={_id}
        dragging={dragging}
      />
      <div
        className="opportunityList"
        onMouseEnter={mouseEntered}
        onMouseLeave={mouseLeft}
      >
        <SortableContext items={opportunityIds}>
          {opportunityList.map((opportunity) => {
            {
              return (
                < OpportunityCard
                  key={opportunity._id}
                  {...opportunity}
                  opportunityList={opportunityList}
                  setOpportunityList={setOpportunityList}
                />)
            }
          })}
        </SortableContext>
      </div>
    </div>
  );
})

export default BoardCard
