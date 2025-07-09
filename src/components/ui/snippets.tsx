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
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
      <input
        className="snip"
        type="text"
        placeholder="Name it & hit enter"
        required
        ref={inputRef}
        onKeyDown={saveSnippets}
      />
    </div>
  );
}
