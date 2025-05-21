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

  const handleToggle = (SenderId: number) => 
    setSenderState(senderState.map(sender => {
      if (sender.id === SenderId) {
        return { ...sender, allowed: !sender.allowed }
      } else {
        return sender;
      }
    })
  );
  
  return (
    <>
      <h1>Email Filter</h1>
      <button >All</button>
      <button >Allowed</button>
      <button >Blocked</button>
      
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