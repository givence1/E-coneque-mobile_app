import { client } from '@/utils/graphql/client';
import { JwtPayload } from '@/utils/interfaces';
import { NodeSchoolHigherInfo } from '@/utils/schemas/interfaceGraphql';
import { gql } from '@apollo/client';
import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';




interface AuthStore {
  user: JwtPayload | null;
  token: string | null;
  isCheckingAuth: boolean;
  isLoading: boolean;
  login: (loginData?: any) => Promise<{ token: string, refresh?: string }>;
  logout: () => void;
  checkAuth: () => void;
  schoolInfo: NodeSchoolHigherInfo | null;
  role: "student" | "teacher" | "parent" | "admin" | any;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isCheckingAuth: false,
  isLoading: false,
  schoolInfo: null,
  role: "student",

  login: async (loginData: any) => {
    console.log(loginData);
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
      const school = data?.allSchoolInfos?.edges?.[0]?.node;

      await new Promise((res) => setTimeout(res, 1000)); // ⏱️ delay 1s after fetch

      set({
        schoolInfo: school,
        isCheckingAuth: false,
      });

    } catch (error) {
      console.error("School info fetch failed", error);
      set({ schoolInfo: null, isCheckingAuth: false });
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