import React, { useCallback } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { CustomLabel } from "..";
import { Color, FontFamily, FontSize } from "../../utils/theme";
import { CustomButtonProps } from "../interface";
import { s, vs } from "react-native-size-matters";

const CustomButton = ({
  onPress,
  title = "",
  login,
  disabled,
  isLoading,
  iconName,
  customIconStyle,
  cloudinarySvgName,
  customSvgIconStyle,
  disableLoading = false,
  rightIconName,
  rightIconCustomStyle,
  customLoadingIndicatorColor = Color.WHITE,
  titleFlag,
  ...props
}: CustomButtonProps) => {
  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      onPress(event);
    },
    [onPress]
  );

  return (
    <TouchableOpacity
      {...props}
      disabled={disabled}
      onPress={handlePress}
      accessibilityRole="button"
      style={[
        styles.button,
        {
          backgroundColor: Color.LIGHT_BLUE,
        },
        props.containerStyle,
      ]}
    >
      <CustomLabel
        customStyle={[
          styles.label,
          {
            color: Color.WHITE,
          },
          props.labelStyle,
        ]}
      >
        {title}
      </CustomLabel>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    height: vs(38),
    borderRadius: s(100),
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: FontSize.SIZE_16,
    fontFamily: FontFamily.SATOSHI_BOLD,
    textAlign: "center",
  },
});
