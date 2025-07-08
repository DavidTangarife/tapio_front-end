import { useState, useEffect, useRef } from "react";
import "./snippets.css";
export default function SnippetButton({
  selection,
  position,
  opportunityId,
}: {
  selection: string;
  position: Record<string, number>;
  opportunityId: string;
}) {
  const [addingState, setAddingState] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!addingState && inputRef.current) {
      inputRef.current.focus();
    }
  }, [addingState]);

  if (!selection || !position || !isVisible) return null;

  const style = {
    transform: `translate3d(${position.x + position.width / 2}px, ${
      position.y - 45
    }px, 0) translateX(-50%)`,
  };

  function saveSnippets(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      const snipp = inputRef.current?.value.trim();
      if (!snipp) return;

      console.log("Sending PATCH for ID:", opportunityId);
      fetch(`http://localhost:3000/api/opportunity/${opportunityId}/full`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ snippets: [{ [snipp]: selection }] }),
      }).catch((err) => {
        console.error("Failed to update snippets:", err);
      });
      setIsVisible(false);
    }
  }

  return (
    <div className="snippets-wrapper" style={style}>
      {addingState ? (
        <button
          className="snippets-button"
          onClick={() => setAddingState(false)}
        >
          Snapiooooo !!!
        </button>
      ) : (
        <input
          className="snip"
          type="text"
          placeholder="Name it & hit enter"
          required
          ref={inputRef}
          onKeyDown={saveSnippets}
        />
      )}
    </div>
  );
}

// work on the snippets CSS to allow scroll up and down to display all of them (make it look like key : value pari with X to delete when editing is on)

// Posible errors -> user selecting a different text when editing already (try to reestart whole procces when user does this)
// Do not allow the snippets functionality to happen if and opportunity hasnt been created
// this email domain is already an oppotunity would you like to link it
// not giving a name to the opportunity should throw an error
