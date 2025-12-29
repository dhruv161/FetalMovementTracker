import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CustomButton from "../index";

describe("CustomButton", () => {
  it("renders with title text", () => {
    const { getByText } = render(
      <CustomButton title="Submit" onPress={() => {}} />
    );
    expect(getByText("Submit")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const mockPress = jest.fn();
    const { getByRole } = render(
      <CustomButton title="Press Me" onPress={mockPress} />
    );
    fireEvent.press(getByRole("button"));
    expect(mockPress).toHaveBeenCalledTimes(1);
  });

  it("does not call onPress when disabled", () => {
    const mockPress = jest.fn();
    const { getByRole } = render(
      <CustomButton title="Disabled" onPress={mockPress} disabled />
    );
    fireEvent.press(getByRole("button"));
    expect(mockPress).not.toHaveBeenCalled();
  });

  it("applies custom styles when provided", () => {
    const { getByRole } = render(
      <CustomButton
        title="Styled"
        onPress={() => {}}
        containerStyle={{ backgroundColor: "red" }}
      />
    );
    const button = getByRole("button");
    expect(button.props.style).toMatchObject({
      backgroundColor: "red",
    });
  });
});
