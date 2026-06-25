import type { ReactNode } from "react";
import { StyleSheet, Text as RNText, type StyleProp, type TextStyle } from "react-native";

import { colors } from "@/constants/theme";

type TextProps = {
  children: ReactNode;
  muted?: boolean;
  selectable?: boolean;
  style?: StyleProp<TextStyle>;
};

export function Text({ children, muted = false, selectable = true, style }: TextProps) {
  return (
    <RNText selectable={selectable} style={[styles.text, muted ? styles.muted : null, style]}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  text: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22
  },
  muted: {
    color: colors.muted
  }
});
