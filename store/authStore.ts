import { client } from '@/utils/graphql/client';
import { JwtPayload } from '@/utils/interfaces';
import { NodeSchoolHigherInfo, NodeSchoolIdentification } from '@/utils/schemas/interfaceGraphql';
import { gql } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';




interface AuthStore {
  user: JwtPayload | null;
  feesId: number | null;
  profileId: number | null;
  token: string | null;
  isCheckingAuth: boolean;
  isLoading: boolean;
  schoolIdentification: NodeSchoolIdentification | null;
  campusInfo: NodeSchoolHigherInfo | null;
  role: "student" | "teacher" | "parent" | "admin" | any;

  login: (loginData?: any) => Promise<{ token: string, refresh?: string }>;
  logout: () => void;
  checkAuth: () => void;
  storeFeesId: (id: number) => void;
  storeProfileId: (id: number) => void;
  storeRegistrationId: (field: "registration_lec_id" | "registration_hig_id" | "registration_sec_id" | "registration_pri_id", value: number) => void;
  storeCampusInfo: (data: NodeSchoolHigherInfo) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  feesId: null,
  profileId: null,
  token: null,
  isCheckingAuth: false,
  isLoading: false,
  schoolIdentification: null,
  campusInfo: null,
  role: "student",

  storeFeesId: async (feesId: number) => { set({ feesId }) },
  storeProfileId: async (profileId: number) => { set({ profileId }) },
  storeCampusInfo: async (campusInfo: NodeSchoolHigherInfo) => { set({ campusInfo }) },
  storeRegistrationId: (field: "registration_lec_id" | "registration_hig_id" | "registration_sec_id" | "registration_pri_id", value: number) => {
    const currentUser = get().user;
    set({
      [field]: value,
      user: currentUser ? { ...currentUser, [field]: value } : currentUser,
    });
  },
  login: async (loginData: any) => {
    set({ isLoading: true });

    try {
      const { data } = await client.mutate({
        mutation: LOGIN_MUTATION,
        variables: {
          matricle: loginData.matricle,
          password: loginData.password,
          parent: loginData.parent || false,
        },
      });

      const result = data?.login;

      if (result?.token) {
        const user: JwtPayload = jwtDecode(result.token)
        set({
          token: result.token,
          user: user,
          isLoading: false,
          role: loginData.parent ? "parent" : user?.role?.toLowerCase()
        });
        return result;
      } else {
        set({ isLoading: false });
        return { token: "", refresh: "Login failed. No token returned." };
      }
    } catch (error) {
      console.error("Login mutation error:", error);
      set({ isLoading: false });
      return { token: "", refresh: "Login failed due to server error." };
    }
  },

  logout: () => set({ user: null, token: null }),

  checkAuth: async () => {
    set({ isCheckingAuth: true });

    try {
      const { data } = await client.query({
        query: querySchool,
      });
      const school = data?.allSchoolInfos?.edges?.[0]?.node?.schoolIdentification;

      await new Promise((res) => setTimeout(res, 1000)); // ⏱️ delay 1s after fetch

      set({
        schoolIdentification: school,
        isCheckingAuth: false,
      });

    } catch (error) {
      console.error("School info fetch failed", error);
      set({ schoolIdentification: null, isCheckingAuth: false });
    }
  },
}));


const querySchool = gql`
  query {
    allSchoolInfos(first: 1) {
      edges {
        node {
          schoolName
          schoolIdentification {
            name
            logo
            hasHigher hasSecondary hasPrimary hasVocational
          }
        }
      }
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation Login(
    $matricle: String!,
    $password: String!,
    $parent: Boolean!
  ) {
    login(matricle: $matricle, password: $password, parent: $parent) {
      token
      refresh
    }
  }
`