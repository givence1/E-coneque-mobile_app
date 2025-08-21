import { View, ActivityIndicator, Text } from 'react-native';

export default function BootingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ marginBottom: 20, fontSize: 20 }}>Starting App...</Text>
      <ActivityIndicator size="large" />
    </View>
  );
}
