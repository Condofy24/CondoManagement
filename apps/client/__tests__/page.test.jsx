import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "../app/page";

describe("Page", () => {
  it("renders main element", () => {
    render(<Home />);

    const main = screen.getByRole("main");

    expect(main).toBeInTheDocument();
  });
});
