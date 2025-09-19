import COLORS from '@/constants/colors';
import { ActivityIndicator, Text, View } from 'react-native';

export default function BootingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.cardBackground }}>
      <Text style={{ marginBottom: 20, fontSize: 20 }}>Loading ...</Text>
      <ActivityIndicator size="large" />
    </View>
  );
}
