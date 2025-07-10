import { useDroppable } from "@dnd-kit/core"
import BoardHeading from "./BoardHeading"
import { Opportunity } from "../../types/types"
import { useState } from "react"
import OpportunityCard from "./Opportunity"

const SuccessBoard = () => {

  const [opportunities, setOpportunities] = useState<Opportunity[] | []>([])

  const { setNodeRef } = useDroppable({
    id: 'success',
    data: {
      opportunities: opportunities,
      opportunitiesSetter: ((opportunity: Opportunity) => setOpportunities([...opportunities, opportunity]))
    }
  })

  return (
    <div className="boardContainer" ref={setNodeRef} >
      <BoardHeading title="Success" _id="success" />
      <div className="opportunityList">
        {opportunities.map((opportunity) => {
          {
            return (
              <OpportunityCard
                key={opportunity._id}
                {...opportunity}
                opportunities={opportunities}
                self={opportunity}
              />)
          }
        })}

      </div>
    </div>
  )

}

export default SuccessBoard
