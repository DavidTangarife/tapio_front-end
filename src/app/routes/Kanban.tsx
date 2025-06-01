import Board from "../../components/ui/Board";
import { BoardProps } from "../../types/types";

const mockBoards: BoardProps[] = [
  {
    title: "Applied",
    opportunities: [
      { id: "1", company: "Seek", color: "navy", image: "logo.png" },
      { id: "2", company: "Indeed", color: "blue", image: "logo2.png" },
      { id: "3", company: "Domain", color: "green", image: "logo3.png" },
    ],
  },
  {
    title: "Interviewing",
    opportunities: [
      { id: "4", company: "REA", color: "red", image: "logo4.png" },
    ],
  },
  {
    title: "Fuckers",
    opportunities: [
      { id: "5", company: "Crown Casino", color: "gold", image: "logo5.png" },
    ],
  },
];

export default function Kanban() {
  return (
    <div className="kanban">
      {mockBoards.map((board) => (
        <Board key={board.title} {...board} />
      ))}
    </div>
  );
}
