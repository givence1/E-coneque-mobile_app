import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Header from '../../../../components/Header';
import COLORS from '../../../../constants/colors';

const attendanceData = [
  { course: 'Mathematics', present: 18, total: 20 },
  { course: 'Physics', present: 15, total: 20 },
  { course: 'Biology', present: 10, total: 20 },
];

const Attendance = () => {
  return (
    <View style={styles.container}>
      <Header placeholder="Search attendance..." />
      <Text style={styles.header}>Attendance Report</Text>
      <FlatList
        data={attendanceData}
        keyExtractor={(item) => item.course}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => {
          const percentage = ((item.present / item.total) * 100).toFixed(1);
          return (
            <View style={styles.card}>
              <Text style={styles.name}>{item.course}</Text>
              <Text style={styles.details}>
                {item.present}/{item.total} classes • {percentage}%
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111827',
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  course: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  details: {
    marginTop: 4,
    color: '#6B7280',
    fontSize: 14,
  },
});

export default Attendance;