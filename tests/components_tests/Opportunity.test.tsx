import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Opportunity from "../../src/components/ui/Opportunity";

describe("Opportunity", () => {
  const mockprops = {
    id: "1",
    company: "REA",
    color: "red",
    image: "House.png",
  };

  it("Renders the company name and check the color", () => {
    render(<Opportunity {...mockprops} />);
    expect(screen.getByText("REA")).toBeInTheDocument();
    const opportunityDiv = screen.getByTestId("opportunity");
    expect(opportunityDiv).toHaveStyle({
      "background-color": "rgb(255, 0, 0)",
    });
  });
});
