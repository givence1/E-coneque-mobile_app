import React, { useState, useEffect, useRef } from "react";
import {
  Animated,
  TextInput,
  StyleSheet,
  View,
  TextInputProps,
  StyleProp,
  TextStyle,
} from "react-native";

type AnimatedInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  inputStyle?: StyleProp<TextStyle>;
};

export default function AnimatedInput({
  value,
  onChangeText,
  placeholder,
  inputStyle,
}: AnimatedInputProps): JSX.Element {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: "absolute" as const,
    left: 10,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -8],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: ["#aaa", "#000"],
    }),
  };

  return (
    <View style={styles.container}>
      <Animated.Text style={labelStyle}>{placeholder}</Animated.Text>
      <TextInput
        style={[styles.input, inputStyle]}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        blurOnSubmit
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 18,
    marginVertical: 12,
  },
  input: {
    height: 40,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#555",
    color: "#000",
  },
});
