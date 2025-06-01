import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Kanban from "../../src/app/routes/Kanban";

describe("Kanban route", () => {
  it("Renders multiple boards with multiple opportunities", () => {});
  render(<Kanban />);

  expect(screen.getByText("Applied")).toBeInTheDocument();
  expect(screen.getByText("Fuckers")).toBeInTheDocument();
  expect(screen.getByText("REA")).toBeInTheDocument();
  expect(screen.getByText("Crown Casino")).toBeInTheDocument();
  expect(screen.getByText("Seek")).toBeInTheDocument();
});
