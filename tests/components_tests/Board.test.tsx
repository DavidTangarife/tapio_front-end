import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Board from "../../src/components/ui/Board";

describe("Board Component", () => {
  it("Renders a board with a given title", () => {
    render(<Board title="Applied" opportunities={[]} />);
    expect(screen.getByText("Applied")).toBeInTheDocument();
  });

  it("Render Oportunity cards -> as props", () => {
    const opportunities = [
      { id: "1", company: "REA", color: "red", image: "logo.png" },
      { id: "2", company: "Canva", color: "Purple", image: "logo2.png" },
    ];
    render(<Board title="Applied" opportunities={opportunities} />);
    expect(screen.getByText("REA")).toBeInTheDocument();
    expect(screen.getByText("Canva")).toBeInTheDocument();
  });
});
