import AppHeader from '@/components/AppHeader';
import COLORS from '@/constants/colors';
import { gql, useQuery } from '@apollo/client';
import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import StudentResultsUpload from './StudentResultsUpload';
import { ApiFactory } from '@/utils/graphql/ApiFactory';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '@/utils/interfaces';
import { useAuthStore } from '@/store/authStore';
import { decodeUrlID } from '@/utils/functions';
import { EdgeSubjectSec } from '@/utils/schemas/interfaceGraphqlSecondary';

const Index = () => {
  const { t } = useTranslation();
  const { token, campusInfo } = useAuthStore();
  const user: JwtPayload | null = token ? jwtDecode(token) : null;
  const route = useRoute();
  const params: any = route.params || {};
  const [dataToSubmit, setDataToSubmit] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { data: dataResults, loading: loadingResults, refetch } = useQuery(GET_RESULTS, {
    variables: {
      id: parseInt(params.subjectId),
      classroomsecId: params?.classroomsecId,
      schoolId: parseInt(decodeUrlID(campusInfo?.id || "") || ""),
      subjectId: params.subjectId
    },
  });

  const handleSubmit = async () => {
    setSubmitting(true);

    const newData = {
      byId: user?.user_id,
      subjectId: parseInt(params.subjectId),
      results: JSON.stringify(dataToSubmit),
    };

    const res = await ApiFactory({
      newData,
      editData: newData,
      mutationName: "bulkCreateUpdateResultsForSubject",
      modelName: "updatedResults",
      successField: "ok",
      query,
      router: null,
      params,
      returnResponseField: false,
      returnResponseObject: true,
      redirect: false,
      reload: false,
      redirectPath: "",
      actionLabel: "processing",
      token
    });

    if (res?.ok) {
      alert("Operation Successful ✅");
      refetch();
    } else {
      alert("Operation Failed ❌ - " + res?.message);
    }
    setSubmitting(false);
    setDataToSubmit([])
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>

      <AppHeader showBack showTitle />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loadingResults || submitting ? (
          <ActivityIndicator />
        ) : dataResults ? (
          <StudentResultsUpload
            subjectsec={dataResults?.allSubjectsSec?.edges.filter((s: EdgeSubjectSec) => decodeUrlID(s.node.id) === params.subjectId)[0].node}
            results={dataResults?.allResultsSec?.edges}
            apiProfiles={dataResults?.allUserprofilesSec?.edges}
            onSubmit={handleSubmit}
            dataToSubmit={dataToSubmit}
            setDataToSubmit={setDataToSubmit}
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
    paddingTop: 90,
  },
});

const GET_RESULTS = gql`
  query GetData(
    $classroomsecId: Decimal!,
    $schoolId: Decimal!,
    $subjectName: String,
    $subjectId: Decimal!,
  ) {
    allSubjectsSec(
      classroomsecId: $classroomsecId
      schoolId: $schoolId
      subjectName: $subjectName
    ){
      edges {
        node {
          id subjectCoefficient hasSubSubjects
          subsubjectList { id name assignedTo { firstName } }
          mainsubject { id subjectName subjectCode }
          classroomsec { id academicYear stream level tuition }
          assignedTo { firstName }
          assignedToTwo { firstName }
        }
      }
    }
    allUserprofilesSec (
      classroomsecId: $classroomsecId
      schoolId: $schoolId
    ){
      edges {
        node {
          id
          customuser { fullName}
        }
      }
    }
    allResultsSec(
      subjectId: $subjectId
      schoolId: $schoolId
    ){
      edges {
        node {
          id
          subjectsec { id mainsubject { subjectName subjectCode }}
          student { id customuser { fullName matricle}}
          infoData
        }
      }
    }
    allAcademicYearsSec
  }
`;


const query = gql`
  mutation BulkResults(
      $byId: Int!
      $subjectId: Int!
      $results: String!
  ) {
    bulkCreateUpdateResultsForSubject(
        byId: $byId
        subjectId: $subjectId
        results: $results
    ) {
        ok
        message
        updatedResults
    }
  }
`;