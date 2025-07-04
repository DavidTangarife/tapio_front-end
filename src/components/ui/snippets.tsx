import { useEffect, useState } from "react";
import "./snippets.css";

export default function SnippetsTags() {
  const [selection, setSelection] = useState<string>();
  const [position, setPosition] = useState<Record<string, number>>(); //Object where Key -> type String, and Values -> type number

  console.log("position", position);
  useEffect(() => {
    document.addEventListener("selectionchange", () => {
      const activeSelection = document.getSelection();
      if (!activeSelection) return;
      const text = activeSelection?.toString();
      if (!text) return;
      const rect = activeSelection?.getRangeAt(0).getBoundingClientRect();
      setSelection(text);
      setPosition({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      });
    });
  }, []);

  return (
    <div>
      {selection && position && (
        <button
          className="snippets-button"
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          }}
        >
          Snapiooooo !!!
        </button>
      )}
    </div>
  );
}
