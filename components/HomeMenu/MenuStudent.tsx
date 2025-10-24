import COLORS from "@/constants/colors";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

/**
 * A helper component to show an icon with a notification dot.
 */
const IconWithNotification = ({
  icon,
  showDot,
}: {
  icon: JSX.Element;
  showDot?: boolean;
}) => {
  return (
    <View style={{ position: "relative" }}>
      {icon}
      {showDot && (
        <View
          style={{
            position: "absolute",
            top: -2,
            right: -2,
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: "green",
          }}
        />
      )}
    </View>
  );
};

type MenuSection = {
  label: string;
  route: string;
  icon: any;
  display: boolean;
};

type NotificationType = {
  ca?: boolean;
  exam?: boolean;
  resit?: boolean;
  results?: boolean;
  fees?: boolean;
  transcript?: boolean;
  complaint?: boolean;
  timetable?: boolean;
};

export const MenuStudent = (
  {
    role,
    section,
    newNotifications,
  }: {
    role: "parent" | "student";
    section: "higher" | "secondary" | "primary" | "vocational" | null;
    newNotifications?: NotificationType;
  }
): MenuSection[] => {
  const { t } = useTranslation();

  return [
    // 🔹 HIGHER SECTION
    {
      label: t("studentHome.ca"),
      route: "/pagesAll/results/ca",
      icon: (
        <IconWithNotification
          icon={<Feather name="file-text" size={24} color={COLORS.primary} />}
          showDot={!!newNotifications?.ca}
        />
      ),
      display:
        (role === "student" || role === "parent") && section === "higher",
    },
    {
      label: t("studentHome.exam"),
      route: "/pagesAll/results/exam",
      icon: (
        <IconWithNotification
          icon={<MaterialIcons name="edit" size={24} color={COLORS.primary} />}
          showDot={!!newNotifications?.exam}
        />
      ),
      display:
        (role === "student" || role === "parent") && section === "higher",
    },
    {
      label: t("studentHome.resit"),
      route: "/pagesAll/results/resit",
      icon: (
        <IconWithNotification
          icon={<Feather name="list" size={24} color={COLORS.primary} />}
          showDot={!!newNotifications?.resit}
        />
      ),
      display:
        (role === "student" || role === "parent") && section === "higher",
    },
    {
      label: t("studentHome.results"),
      route: "/pagesAll/results/results",
      icon: (
        <IconWithNotification
          icon={
            <MaterialIcons name="school" size={24} color={COLORS.primary} />
          }
          showDot={!!newNotifications?.results}
        />
      ),
      display:
        (role === "student" || role === "parent") && section === "higher",
    },
    {
      label: t("studentHome.fees"),
      route: "/pagesAll/fee/fee",
      icon: (
        <IconWithNotification
          icon={
            <Feather name="credit-card" size={24} color={COLORS.primary} />
          }
          showDot={!!newNotifications?.fees}
        />
      ),
      display:
        (role === "student" || role === "parent") && section === "higher",
    },
    {
      label: t("studentHome.transcript"),
      route: "/pagesAll/results/transcript",
      icon: (
        <IconWithNotification
          icon={
            <MaterialIcons
              name="description"
              size={24}
              color={COLORS.primary}
            />
          }
          showDot={!!newNotifications?.transcript}
        />
      ),
      display: role === "student" && section === "higher",
    },
    {
      label: t("studentHome.complaints"),
      route: "/pagesAll/profile/complaint",
      icon: (
        <IconWithNotification
          icon={
            <Ionicons
              name="alert-circle-outline"
              size={24}
              color={COLORS.primary}
            />
          }
          showDot={!!newNotifications?.complaint}
        />
      ),
      display:
        (role === "student" || role === "parent") && section === "higher",
    },
    {
      label: t("ui.timetable"),
      route: "/pagesAll/profile/lecturerTimeTable",
      icon: (
        <IconWithNotification
          icon={
            <Ionicons
              name="calendar-outline"
              size={24}
              color={COLORS.primary}
            />
          }
          showDot={!!newNotifications?.timetable}
        />
      ),
      display:
        (role === "student" || role === "parent") && section === "higher",
    },

    // 🔹 SECONDARY SECTION
    {
      label: t("studentHome.ca"),
      route: "/pagesAll/results/ca",
      icon: (
        <IconWithNotification
          icon={<Feather name="file-text" size={24} color={COLORS.primary} />}
          showDot={!!newNotifications?.ca}
        />
      ),
      display:
        (role === "student" || role === "parent") && section === "secondary",
    },
    {
      label: t("studentHome.exam"),
      route: "/pagesAll/results/exam",
      icon: (
        <IconWithNotification
          icon={<MaterialIcons name="edit" size={24} color={COLORS.primary} />}
          showDot={!!newNotifications?.exam}
        />
      ),
      display:
        (role === "student" || role === "parent") && section === "secondary",
    },
    {
      label: t("studentHome.complaints"),
      route: "/pagesAll/profile/complaint",
      icon: (
        <IconWithNotification
          icon={
            <Ionicons
              name="alert-circle-outline"
              size={24}
              color={COLORS.primary}
            />
          }
          showDot={!!newNotifications?.complaint}
        />
      ),
      display:
        (role === "student" || role === "parent") && section === "secondary",
    },
    {
      label: t("studentHome.more"),
      route: "/pagesAll/results/more",
      icon: (
        <Ionicons
          name="ellipsis-horizontal"
          size={24}
          color={COLORS.primary}
        />
      ),
      display:
        (role === "student" || role === "parent") && section === "secondary",
    },
  ];
};
