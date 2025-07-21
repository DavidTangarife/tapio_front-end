import { DndContext, useDroppable } from "@dnd-kit/core"

const DeleteContainer = () => {
  const { setNodeRef, listeners } = useDroppable({
    id: 'delete',
  })
  return (
    <div className="deleteContainer" ref={setNodeRef} {...listeners}></div>
  )
}

export default DeleteContainer
