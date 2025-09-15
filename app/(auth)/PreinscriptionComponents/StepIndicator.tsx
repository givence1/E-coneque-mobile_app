import COLORS from "@/constants/colors";
import React from "react";
import { useTranslation } from "react-i18next"; // ✅ hook for translations
import { Text, View } from "react-native";

const StepIndicator = ({ idx }: { idx: number }) => {
  const { t } = useTranslation();

  // ✅ Map translation keys instead of hardcoded English
  const stepKeys = [
    "steps.personalInfo",
    "steps.roleDept",
    "steps.specialty",
    "steps.confirm",
  ];

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
      {stepKeys.map((key, index) => {
        const isActive = index === idx;
        return (
          <View key={key} style={{ alignItems: "center", flex: 1 }}>
            <View
              style={{
                width: 32,
                height: 32,
                backgroundColor: isActive ? COLORS.primary : COLORS.border,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 4,
                borderRadius: 16, // ✅ make it circular
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: isActive ? "#fff" : COLORS.textSecondary,
                  textAlign: "center",
                }}
              >
                {index + 1}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 12,
                color: isActive ? COLORS.primary : COLORS.textSecondary,
                textAlign: "center",
              }}
            >
              {t(key)} {/* ✅ translated step label */}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default StepIndicator;
