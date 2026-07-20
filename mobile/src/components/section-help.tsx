import { CheckCircle2, HelpCircle } from "lucide-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { ActionButton } from "@/components/action-button";
import { Card } from "@/components/card";
import { Text } from "@/components/text";
import { colors } from "@/constants/theme";
import { hasSeenSectionTutorial, markSectionTutorialSeen } from "@/services/storage";

type SectionHelpProps = {
  bullets: string[];
  description?: string;
  storageKey: string;
  title: string;
};

export function SectionHelp({ bullets, description, storageKey, title }: SectionHelpProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let mounted = true;

    hasSeenSectionTutorial(storageKey).then((seen) => {
      if (mounted) setVisible(!seen);
    });

    return () => {
      mounted = false;
    };
  }, [storageKey]);

  const close = async () => {
    await markSectionTutorialSeen(storageKey);
    setVisible(false);
  };

  if (!visible) {
    return (
      <View style={styles.reopen}>
        <ActionButton icon={HelpCircle} variant="secondary" onPress={() => setVisible(true)}>
          Ver ayuda
        </ActionButton>
      </View>
    );
  }

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.icon}>
          <HelpCircle color={colors.secondary} size={20} />
        </View>
        <View style={styles.body}>
          <Text style={styles.title}>{title}</Text>
          {description ? (
            <Text muted style={styles.description}>
              {description}
            </Text>
          ) : null}
          {bullets.slice(0, 3).map((item) => (
            <Text key={item} muted style={styles.bullet}>
              - {item}
            </Text>
          ))}
        </View>
      </View>
      <View style={styles.actions}>
        <ActionButton icon={CheckCircle2} variant="secondary" onPress={close}>
          Entendido
        </ActionButton>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12
  },
  reopen: {
    alignItems: "flex-start"
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12
  },
  icon: {
    alignItems: "center",
    backgroundColor: "rgba(20, 184, 166, 0.16)",
    borderColor: "rgba(153, 246, 228, 0.22)",
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  body: {
    flex: 1,
    gap: 5
  },
  title: {
    fontSize: 16,
    fontWeight: "900"
  },
  description: {
    fontSize: 13,
    lineHeight: 19
  },
  bullet: {
    fontSize: 13,
    lineHeight: 19
  },
  actions: {
    alignItems: "flex-start"
  }
});
