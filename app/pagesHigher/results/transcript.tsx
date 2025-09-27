import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { NodeTranscriptApplications } from "@/utils/schemas/interfaceGraphql";
import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// GraphQL
const GET_TRANSCRIPT = gql`
  query AllTranscriptApplications($userprofileId: ID!) {
    allTranscriptApplications(userprofileId: $userprofileId) {
      edges {
        node {
          id
          status
          approvedAt
        }
      }
    }
  }
`;

const APPLY_TRANSCRIPT = gql`
  mutation ApplyTranscript($userprofileId: ID!) {
    createTranscriptApplication(input: { userprofileId: $userprofileId }) {
      transcriptApplication {
        id
        status
      }
    }
  }
`;

export default function TranscriptScreen() {
  const { t } = useTranslation();
  const { profileId } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  // Fetch current transcript application (if any)
  const { data, loading, refetch } = useQuery(GET_TRANSCRIPT, {
    variables: { userprofileId: profileId },
    skip: !profileId,
    fetchPolicy: "network-only",
  });

  const transcript: NodeTranscriptApplications | null =
    data?.allTranscriptApplications?.edges?.[0]?.node || null;

  const [applyTranscript, { loading: applying }] = useMutation(APPLY_TRANSCRIPT, {
    onCompleted: () => {
      Alert.alert(t("transcript.submitted"), t("transcript.submittedMessage"));
      refetch();
    },
    onError: (err) => {
      console.error(err);
      Alert.alert(t("ui.error"), t("ui.serverError"));
    },
  });

  const handleTranscriptApply = () => {
    if (transcript && transcript.status === "PENDING") return;
    applyTranscript({ variables: { userprofileId: profileId } });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  const isPending = transcript?.status === "PENDING";
  const isApproved = transcript?.status === "APPROVED";

  return (
     <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header fixed at top */}
      <AppHeader showBack showTitle />
    <ScrollView
      contentContainerStyle={{ padding: 16, paddingTop: 70 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      style={{ flex: 1, backgroundColor: COLORS.background }}
    >

      {/* Transcript Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t("transcript.title")}</Text>
        <Text style={styles.cardDescription}>{t("transcript.description")}</Text>

        {transcript ? (
          <View style={{ marginVertical: 12 }}>
            <Text style={{ fontWeight: "600", color: COLORS.textPrimary }}>
              {t("transcript.status")}:{" "}
              <Text
                style={{
                  color: isPending ? "orange" : isApproved ? "green" : COLORS.textSecondary,
                }}
              >
                {transcript.status}
              </Text>
            </Text>
            {transcript.approvedAt && (
              <Text style={{ color: COLORS.textSecondary, marginTop: 4 }}>
                {t("transcript.approvedAt")}: {new Date(transcript.approvedAt).toLocaleString()}
              </Text>
            )}
          </View>
        ) : null}

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isPending ? COLORS.textSecondary : COLORS.primary },
          ]}
          onPress={handleTranscriptApply}
          disabled={isPending || applying}
        >
          <Text style={[styles.buttonText, { color: "#fff" }]}>
            {isPending ? t("transcript.pending") : t("transcript.apply")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Attestation Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t("attestation.title")}</Text>
        <Text style={styles.cardDescription}>{t("attestation.description")}</Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: COLORS.primary }]}
          onPress={() => Alert.alert(t("attestation.submitted"))}
        >
          <Text style={[styles.buttonText, { color: "#fff" }]}>{t("attestation.apply")}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  button: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
  },
});