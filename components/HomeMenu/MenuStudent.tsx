import COLORS from "@/constants/colors";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";


type MenuSection = {
    label: string;
    route: string;
    icon: any;
    display: boolean;
};

export const MenuStudent = (
    { role, section }:
    { role: "parent" | "student", section: "higher" | "secondary" | "primary" | "vocational" | null}
): MenuSection[] => {
    const { t } = useTranslation();
    console.log(role);
    console.log(section);

    return [



        // HIGHER SECTION
        {
            label: t("studentHome.ca"),
            route: "/pagesAll/results/ca",
            icon: <Feather name="file-text" size={24} color={COLORS.primary} />,
            display: (role === "student" || role === "parent") && (section === "higher")
        },
        {
            label: t("studentHome.exam"),
            route: "/pagesAll/results/exam",
            icon: <MaterialIcons name="edit" size={24} color={COLORS.primary} />,
            display: (role === "student" || role === "parent") && (section === "higher")
        },
        {
            label: t("studentHome.resit"),
            route: "/pagesAll/results/resit",
            icon: <Feather name="list" size={24} color={COLORS.primary} />,
            display: (role === "student" || role === "parent") && (section === "higher")
        },
        {
            label: t("studentHome.results"),
            route: "/pagesAll/results/results",
            icon: <MaterialIcons name="school" size={24} color={COLORS.primary} />,
            display: (role === "student" || role === "parent") && (section === "higher")
        },
        {
            label: t("studentHome.fees"),
            route: "/pagesAll/fee/fee",
            icon: <Feather
                    name="credit-card"
                    size={24}
                    color={COLORS.primary}
                />,
            display: (role === "student" || role === "parent") && (section === "higher")
        },
        {
            label: t("studentHome.transcript"),
            route: "/pagesAll/results/transcript",
            icon: <MaterialIcons
                    name="description"
                    size={24}
                    color={COLORS.primary}
                />,
            display: (role === "student" || role === "parent") && (section === "higher")
        },
        {
            label: t("studentHome.complaints"),
            route: "/pagesAll/profile/complaint",
            icon: <Ionicons
                    name="alert-circle-outline"
                    size={24}
                    color={COLORS.primary}
                />,
            display: (role === "student" || role === "parent") && (section === "higher")
        },
        // {
        //     label: t("studentHome.more"),
        //     route: "/pagesAll/results/more",
        //     icon: <Ionicons
        //             name="ellipsis-horizontal"
        //             size={24}
        //             color={COLORS.primary}
        //         />,
        //     display: (role === "student" || role === "parent") && (section === "higher")
        // },






        // SECONDARY SECTION
        {
            label: t("studentHome.ca"),
            route: "/pagesAll/results/ca",
            icon: <Feather name="file-text" size={24} color={COLORS.primary} />,
            display: (role === "student" || role === "parent") && (section === "secondary")
        },
        {
            label: t("studentHome.exam"),
            route: "/pagesAll/results/exam",
            icon: <MaterialIcons name="edit" size={24} color={COLORS.primary} />,
            display: (role === "student" || role === "parent") && (section === "secondary")
        },
        {
            label: t("studentHome.complaints"),
            route: "/pagesAll/profile/complaint",
            icon: <Ionicons
                    name="alert-circle-outline"
                    size={24}
                    color={COLORS.primary}
                />,
            display: (role === "student" || role === "parent") && (section === "secondary")
        },
        {
            label: t("studentHome.more"),
            route: "/pagesAll/results/more",
            icon: <Ionicons
                    name="ellipsis-horizontal"
                    size={24}
                    color={COLORS.primary}
                />,
            display: (role === "student" || role === "parent") && (section === "secondary")
        },
    ]
}