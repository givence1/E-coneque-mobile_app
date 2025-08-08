import { View, ActivityIndicator, Text } from 'react-native';

export default function BootingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* Replace with your app logo or animation if you like */}
      <Text style={{ marginBottom: 20, fontSize: 20 }}>Loading...</Text>
      <ActivityIndicator size="large" />
    </View>
  );
}
