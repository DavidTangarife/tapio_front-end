import { DndContext, useDroppable } from "@dnd-kit/core"

const DeleteContainer = () => {
  const { setNodeRef, listeners } = useDroppable({
    id: 'delete',
  })
  return (
    <div className="deleteContainer" ref={setNodeRef} {...listeners}>DELETE</div>
  )
}

export default DeleteContainer
