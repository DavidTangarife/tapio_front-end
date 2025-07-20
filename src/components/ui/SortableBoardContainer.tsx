import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import BoardCard from "./Board";
import { Board, Opportunity } from "../../types/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type SortableBoardContainerProps = {
  board: Board;
  dragging: boolean;
  setActivator: Dispatch<SetStateAction<boolean>>;
  onOpportunityClick: (opportunity: Opportunity) => void;
  length: number;
};

const SortableBoardContainer = (props: SortableBoardContainerProps) => {
  const { board, dragging, setActivator, onOpportunityClick, length } = props;
  const [opportunityList, setOpportunityList] = useState(
    board.opportunities.sort((a, b) => a.position - b.position)
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    node,
  } = useSortable({
    id: board._id,
    data: {
      type: "Column",
      board: board,
      opportunityList,
      opportunityListSetter: (input: Opportunity[]) =>
        setOpportunityList(input),
    },
  });
  const isDraggable = board.order < length + 1;
  /*useEffect(() => {
    console.log(board.title)
    console.log('opplist', opportunityList)
    console.log('boardList', board.opportunities)
    setOpportunityList(board.opportunities.sort((a, b) => a.position - b.position))
  }, [board.opportunities])*/

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };
  if (isDragging) {
    const dragStyle = {
      transition,
      transform: CSS.Transform.toString(transform),
      height: node.current?.clientHeight,
    };
    return (
      <div className="draggingBoard" ref={setNodeRef} style={dragStyle}></div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className={"boardContainer"}>
      {isDraggable ? (
        <div className="dragger" {...attributes} {...listeners}></div>
      ) : (
        <div className="last"></div>
      )}
      <BoardCard
        board={board}
        dragging={dragging}
        setActivator={setActivator}
        opportunityList={opportunityList}
        setOpportunityList={setOpportunityList}
        onOpportunityClick={onOpportunityClick}
      />
    </div>
  );
};

export default SortableBoardContainer;
