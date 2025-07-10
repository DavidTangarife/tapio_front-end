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
  onOpportunityClick: (opportunity: Opportunity) => void;
};

const BoardCard = memo((props: BoardCardProps) => {
  const { _id, title, opportunities } = props.board
  const { dragging, setActivator, opportunityList, setOpportunityList, board, onOpportunityClick } = props
  const [firstMount, setFirstMount] = useState(false)
  const opportunityIds = useMemo(() => opportunities.map((ele) => ele._id), [opportunities])

  useEffect(() => {
    console.log('Opps Upps', opportunities, opportunityIds)
    if (firstMount) {
      const updateOrder = opportunities.map((element) => {
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
          {opportunities.map((opportunity) => {
            {
              return (
                <OpportunityCard
                  key={opportunity._id}
                  {...opportunity}
                  opportunities={opportunities}
                  opportunityList={opportunityList}
                  board={board}
                  onOpportunityClick={onOpportunityClick}
                  self={opportunity}
                />)
            }
          })}
        </SortableContext>
      </div>
    </div>
  );
})

export default BoardCard
