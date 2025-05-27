import { useState } from "react"

type SenderData = {
  id: number;
  name: string;
  email: string;
  allowed: boolean;
}

const Senders: SenderData[] = [
    {id: 123, name: "John Doe", email: "John.Doe@example.com", allowed: true},
    {id: 456, name: "Jane Doe", email: "Jane.Doe@example.com", allowed: true},
    {id: 789, name: "Jim Doe", email: "Jim.Doe@example.com", allowed: true},
  ]

  const Filter = () => {
  
  const [senderState, setSenderState] = useState(Senders);
  const [filter, setFilter] = useState<"all" | "allowed" | "blocked">("all")

  const handleToggle = (SenderId: number) => 
    setSenderState(senderState.map(sender => {
      if (sender.id === SenderId) {
        return { ...sender, allowed: !sender.allowed }
      } else {
        return sender;
      }
    })
  );

  const filterSender= (senderStatus: string) => {
    const applyFilter = senderState.filter(sender => {
      if (senderStatus === "all") return true;
      if (senderStatus === "allowed") return sender.allowed
      if (senderStatus === "blocked") return !sender.allowed
    });
    setFilter(applyFilter);
  }
  
  return (
    <>
      <h1>Email Filter</h1>
      <button onClick={() => filterSender("all")} >All</button>
      <button onClick={() => filterSender("allowed")}>Allowed</button>
      <button onClick={() => filterSender("blocked")}>Blocked</button>
      
      <div>
        <ul>
          {senderState.map((sender) => (
              <li>
            <div>
              <h4>{sender.name}</h4>
              <p>{sender.email}</p>
            </div>
            <div>{sender.allowed ? "Allowed" : "Blocked"}</div>
            <button onClick = {() => handleToggle(sender.id)}>
              { sender.allowed ? "Tap Out" : "Tap in" }
              </button>
          </li>
          ))}
      </ul>
      </div>
    </>
   

  )
}
export default Filter;