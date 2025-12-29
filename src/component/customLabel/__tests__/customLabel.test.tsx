import React from "react";
import { render } from "@testing-library/react-native";
import CustomLabel from "../"; // adjust the path

describe("CustomLabel", () => {
  it("renders children text correctly", () => {
    const { getByText } = render(<CustomLabel>Test Label</CustomLabel>);

    expect(getByText("Test Label")).toBeTruthy();
  });

  it("applies default styles", () => {
    const { getByText } = render(<CustomLabel>Styled Label</CustomLabel>);
    const label = getByText("Styled Label");

    // Check if the component has expected default styles
    expect(label.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: expect.any(Number),
          color: expect.any(String),
        }),
      ])
    );
  });

  it("applies custom style overrides", () => {
    const { getByText } = render(
      <CustomLabel customStyle={{ color: "red" }}>Custom Styled</CustomLabel>
    );
    const label = getByText("Custom Styled");

    expect(label.props.style).toEqual(
      expect.arrayContaining([
        expect.any(Object), // default style
        expect.objectContaining({ color: "red" }), // custom override
      ])
    );
  });
});
