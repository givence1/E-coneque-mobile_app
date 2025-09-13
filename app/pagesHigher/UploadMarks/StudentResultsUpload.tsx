import { EdgeResult, NodeCourse } from '@/utils/schemas/interfaceGraphql';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


const StudentResultsUpload = (
  { results, onSubmit, type, course }:
  { results: EdgeResult[], onSubmit: any, type: string, course: NodeCourse }
) => {
  const [studentMarks, setStudentMarks] = useState<Record<string, string>>({});
  const [originalMarks, setOriginalMarks] = useState<Record<string, string>>({});
  const [modifiedEntries, setModifiedEntries] = useState<Set<string>>(new Set());

  // Initialize marks from existing infoData
  useEffect(() => {
    const initialMarks: Record<string, string> = {};
    const originalMarksData: Record<string, string> = {};
    
    results.forEach(({ node }) => {
      try {
        const infoData = node.infoData ? JSON.parse(node.infoData) : {};
        const mark = type === 'ca' ? infoData.ca : 
                    type === 'exam' ? infoData.exam : 
                    type === 'resit' ? infoData.resit : null;
        
        const markValue = mark !== null && mark !== undefined ? String(mark) : '';
        initialMarks[node.id] = markValue;
        originalMarksData[node.id] = markValue;
      } catch (error) {
        console.error('Error parsing infoData:', error);
        initialMarks[node.id] = '';
        originalMarksData[node.id] = '';
      }
    });
    
    setStudentMarks(initialMarks);
    setOriginalMarks(originalMarksData);
    setModifiedEntries(new Set());
  }, [results, type]);

  // Handle mark change
  const handleMarkChange = (resultId: string, value: string) => {
    // Validate input - only numbers and one decimal point allowed
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setStudentMarks(prev => ({ ...prev, [resultId]: value }));
      
      // Check if value is different from original
      const originalValue = originalMarks[resultId] || '';
      const isModified = value !== originalValue;
      
      setModifiedEntries(prev => {
        const newSet = new Set(prev);
        if (isModified) {
          newSet.add(resultId);
        } else {
          newSet.delete(resultId);
        }
        return newSet;
      });
    }
  };

  // Check if any entries are modified
  const isModified = modifiedEntries.size > 0;

  // Submit only modified marks
  const handleSubmit = () => {
    const updatedResults: any[] = [];
    
    results.forEach(({ node }) => {
      if (modifiedEntries.has(node.id)) {
        const currentMark = studentMarks[node.id] || '';
        
        try {
          const existingData = node.infoData ? JSON.parse(node.infoData) : {};
          
          // Update only the relevant field based on type
          const updatedData = {
            ...existingData,
            [type]: currentMark === '' ? null : parseFloat(currentMark)
          };
          
          updatedResults.push({
            ...node,
            infoData: JSON.stringify(updatedData)
          });
        } catch (error) {
          console.error('Error processing result:', error);
          updatedResults.push(node);
        }
      }
    });

    onSubmit(updatedResults);
    setModifiedEntries(new Set());
    Alert.alert('Success', `${updatedResults.length} marks have been saved successfully!`);
  };

  // Sort students alphabetically by name
  const sortedResults = [...results].sort((a, b) => {
    const nameA = a.node.student.customuser.fullName?.toUpperCase() || '';
    const nameB = b.node.student.customuser.fullName?.toUpperCase() || '';
    return nameA.localeCompare(nameB);
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Enter Student Marks</Text>
        <Text style={styles.subtitle}>
          Course:
          <Text style={styles.typeText}>{course?.mainCourse?.courseName?.toUpperCase()}</Text>
        </Text>
        <Text style={styles.subtitle}>
          Level:
          <Text style={styles.typeText}>{course?.specialty?.level?.level}</Text>
          Semester
          <Text style={styles.typeText}>{course?.semester?.toUpperCase()}</Text>
        </Text>
        <Text style={styles.subtitle}>
          Assessment Type: <Text style={styles.typeText}>{type.toUpperCase()}</Text>
        </Text>
        {isModified && (
          <Text style={styles.modifiedText}>
            {modifiedEntries.size} modified entr{modifiedEntries.size === 1 ? 'y' : 'ies'}
          </Text>
        )}
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.nameHeader]}>Student Name</Text>
        <Text style={[styles.headerCell, styles.markHeader]}>Mark</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {sortedResults.map(({node}) => {
          const isModifiedEntry = modifiedEntries.has(node.id);
          
          return (
            <View key={node.id} style={[
              styles.studentRow,
              isModifiedEntry && styles.modifiedRow
            ]}>
              <View style={styles.nameContainer}>
                <Text style={styles.studentName}>
                  {node.student.customuser.fullName}
                </Text>
                <Text style={styles.matricule}>
                  {node.student.customuser.matricle}
                </Text>
              </View>
              
              <TextInput
                style={[
                  styles.markInput,
                  isModifiedEntry && styles.modifiedInput
                ]}
                value={studentMarks[node.id] || ''}
                onChangeText={(value) => handleMarkChange(node.id, value)}
                placeholder="0"
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity 
        style={[styles.submitButton, !isModified && styles.submitButtonDisabled]} 
        onPress={handleSubmit}
        disabled={!isModified}
      >
        <Text style={styles.submitButtonText}>
          {isModified ? `Save ${modifiedEntries.size} Marks` : 'No Changes to Save'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  typeText: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  modifiedText: {
    fontSize: 14,
    color: '#FF9500',
    fontWeight: '500',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerCell: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  nameHeader: {
    width: '66%', // 2/3 of width
  },
  markHeader: {
    width: '33%', // 1/3 of width
    textAlign: 'right',
    paddingRight: 8,
  },
  scrollView: {
    flex: 1,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modifiedRow: {
    backgroundColor: '#FFF9E6',
  },
  nameContainer: {
    width: '66%', // 2/3 of width
    paddingRight: 12,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  matricule: {
    fontSize: 14,
    color: '#666',
  },
  markInput: {
    width: '33%', // 1/3 of width
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    fontWeight: '500',
  },
  modifiedInput: {
    borderColor: '#FF9500',
    backgroundColor: '#FFF4E0',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default StudentResultsUpload;