import { ActivityIndicator, StyleSheet, View } from "react-native";

import { Text } from "@/components/text";
import { colors } from "@/constants/theme";

export function LoadingView({ message = "Cargando..." }: { message?: string }) {
  return (
    <View style={styles.root}>
      <ActivityIndicator color={colors.secondary} size="large" />
      <Text muted style={styles.text}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    flex: 1,
    gap: 12,
    justifyContent: "center",
    minHeight: 260
  },
  text: {
    fontSize: 13,
    fontWeight: "700"
  }
});
