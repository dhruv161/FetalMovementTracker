import { ms } from "react-native-size-matters";

export const Color = {
  TRANSPARENT: "transparent",
  BLACK: "#000",
  WHITE: "#ffffff",
  BLUE: "#0A161B",
  LIGHT_BLUE: "#25A9E0",
  GRAY: "#475467",
  RED: "#FF2323",
  BORDER: "#2F4751",
  LIGHT_GRAY: "#BDBDBD",
};

export const FontFamily = {
  INSTRUMENTSANS_BOLD: "InstrumentSans-Bold",
  INSTRUMENTSANS_MEDIUM: "InstrumentSans-Medium",
  INSTRUMENTSANS_REGULAR: "InstrumentSans-Regular",
};

export const FontSize = {
  SIZE_10: ms(10),
  SIZE_13: ms(13),
  SIZE_12: ms(12),
  SIZE_14: ms(14),
  SIZE_15: ms(15),
  SIZE_16: ms(16),
  SIZE_17: ms(17),
  SIZE_18: ms(18),
  SIZE_20: ms(20),
  SIZE_22: ms(22),
  SIZE_24: ms(24),
  SIZE_26: ms(26),
  SIZE_28: ms(28),
  SIZE_30: ms(30),
  SIZE_32: ms(32),
  SIZE_36: ms(36),
  SIZE_40: ms(40),
  SIZE_48: ms(48),
  SIZE_50: ms(50),
};

type FontFamilyKey = keyof typeof FontFamily;
type ColorKey = keyof typeof Color;
type FontSizeValue = number | keyof typeof FontSize;
type FontWeightValue =
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";

export const desiredFonts = (
  fontFamily: FontFamilyKey,
  fontSize: FontSizeValue,
  color: ColorKey,
  fontWeight?: FontWeightValue
) => {
  const resolvedFontFamily = FontFamily[fontFamily];
  const resolvedFontSize =
    typeof fontSize === "number"
      ? fontSize
      : FontSize[fontSize] || FontSize.SIZE_14;

  const resolvedColor = Color[color];

  return {
    fontFamily: resolvedFontFamily,
    fontSize: resolvedFontSize,
    color: resolvedColor,
    fontWeight: fontWeight,
  };
};
