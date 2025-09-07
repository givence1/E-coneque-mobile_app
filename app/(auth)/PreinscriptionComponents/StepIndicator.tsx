import COLORS from '@/constants/colors';
import React from 'react';
import { Text, View } from 'react-native';

const StepIndicator = (
    { idx }:
    { idx: number }
) => {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
      {["Personal Info", "Role & Dept", "Specialty", "Confirm"].map((label, index) => {
        const isActive = index === idx;
        return (
          <View key={label} style={{ alignItems: "center", flex: 1 }}>
            <View
              style={{
                width: 32,
                height: 32,
                backgroundColor: isActive ? COLORS.primary : COLORS.border,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 4,
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
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export default StepIndicator;
