import AppHeader from '@/components/AppHeader';
import COLORS from '@/constants/colors';
import { EdgeResult } from '@/utils/schemas/interfaceGraphql';
import { gql, useQuery } from '@apollo/client';
import { useRoute } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import StudentResultsUpload from './StudentResultsUpload';

const Index = () => {
  const { t } = useTranslation();
  const route = useRoute();
  const params: any = route.params || {};

  const { data: dataResults, loading: loadingResults } = useQuery(GET_RESULTS, {
    variables: { id: parseInt(params.courseId), courseId: params?.courseId },
  });

  const handleSubmit = (updatedResults: EdgeResult[]) => {
    console.log('Updated results:', updatedResults);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>

      {/* ✅ Fixed header outside the ScrollView */}
            <AppHeader showBack showTitle />
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {loadingResults ? (
        <ActivityIndicator />
      ) : dataResults ? (
        <StudentResultsUpload
          course={dataResults?.allCourses?.edges[0]?.node}
          results={dataResults?.allResults?.edges}
          onSubmit={handleSubmit}
          type={params.type.toLowerCase()}
        />
      ) : (
        <Text>{t("results.noData")}</Text>
      )}
    </ScrollView>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 90, // space for TabsHeader
  },
});

const GET_RESULTS = gql`
  query GetData($id: ID!, $courseId: Decimal!) {
    allCourses(id: $id) {
      edges {
        node {
          id
          semester
          mainCourse {
            courseName
          }
          specialty {
            academicYear
            level {
              level
            }
          }
        }
      }
    }
    allResults(courseId: $courseId) {
      edges {
        node {
          id
          infoData
          student {
            id
            customuser {
              fullName
              matricle
            }
          }
          course {
            courseCode
            semester
            mainCourse {
              courseName
            }
            specialty {
              id
              academicYear
              mainSpecialty {
                specialtyName
              }
              level {
                level
              }
            }
          }
        }
      }
    }
  }
`;
