import { useEffect, useState } from "react";
import { type Email } from "./types.d"; // it has to have the brackets as im not using Export Default on the types file

function App() {
  const [emails, setEmails] = useState<Email[]>([]); // Specify the useState array to be of type Email

  useEffect(() => {
    fetch("http://localhost:5000/api/emails")
      .then((res) => res.json())
      .then(setEmails);
  }, []); // The empty Array is call the dependency array

  // useEffect hook lets you run code after the component renders, use for side effects
  // like Fetching data from an API, Setting up event listeners, Manually updating the DOM
  // The second argument, the [] (dependency array), controls when the effect runs

  // [] ->	Run once after initial render
  // [var] ->	Run whenever var changes
  // No array ->	Run after every render (I dont want this)

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Email Info</h1>
      <ul>
        {emails.map((email) => (
          <li key={email.id}>
            <p>
              <strong>From:</strong>
              {email.from}
            </p>
            <p>
              <strong>Subject:</strong>
              {email.subject}
            </p>
            <p>
              <strong>Date:</strong>
              {new Date(email.date).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );

  // Outer {} means: “This is JavaScript.”
  // Inner {} is the actual style object:
  // {2 + 2}       // 4
  // {email.from}  // string
  // {emails.map()} // JSX list
}

export default App;
