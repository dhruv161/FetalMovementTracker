import React from "react";
import {  StyleSheet, Text } from "react-native";
import { ICustomLabel } from "../interface";
import { Color, FontFamily, FontSize } from "../../utils/theme";

export const CustomLabel = ({
  children,
  customStyle,
  ...props
}: ICustomLabel) => {
  return (
    <Text
      {...props}
      style={[styles.labelStyle, customStyle]}
      android_hyphenationFrequency="full"
    >
      {children}
    </Text>
  );
};

export default CustomLabel;

const styles = StyleSheet.create({
  labelStyle: {
    fontSize: FontSize.SIZE_12,
    fontFamily: FontFamily.SATOSHI_REGULAR,
    color: Color.WHITE,
  },
});
