import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import CustomHeader from "../"; // adjust path
import { useNavigation } from "@react-navigation/native";
import authReducer from "../../../state/redux/slice/authSlice";
import homeReducer from "../../../state/redux/slice/homeSlice"; // adjust if needed
import { Routes } from "../../../utils/routes";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

jest.mock("react-native-fast-image", () => "FastImage");

const mockNavigate = jest.fn();

describe("CustomHeader", () => {
  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
    });
  });

  const createStore = (authState, homeState) =>
    configureStore({
      reducer: {
        authReducer: (state = authState) => state,
        homeReducer: (state = homeState) => state,
      },
    });

  it("renders with fallback icon when no image is present", () => {
    const store = createStore({ isSkipHome: false }, { profileData: [{}] });

    const { getByText } = render(
      <Provider store={store}>
        <CustomHeader headerTitle="Dashboard" stackName="MainStack" />
      </Provider>
    );

    expect(getByText("Dashboard")).toBeTruthy();
  });

  it("navigates to Edit Profile when image is clicked and not skipped", () => {
    const profileUrl = "https://mock.image";
    const store = createStore(
      { isSkipHome: false },
      { profileData: [{ Public_Image_Url__c: profileUrl }] }
    );

    const { getAllByRole } = render(
      <Provider store={store}>
        <CustomHeader
          onPress={() => {}}
          headerTitle="Header"
          stackName="TestStack"
        />
      </Provider>
    );

    const pressables = getAllByRole("button");
    fireEvent.press(pressables[0]);

    expect(mockNavigate).toHaveBeenCalledWith(Routes.SETTING_STACK, {
      screen: Routes.EDIT_PROFILE_SCREEN,
      params: { fromStack: "TestStack" },
    });
  });
});
