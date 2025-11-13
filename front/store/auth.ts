import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "@/types/auth.type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const auth = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth`,

    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),

  tagTypes: ["Auth"],
  endpoints: (b) => ({
    register: b.mutation<AuthResponse, RegisterRequest>({
      query: (data) => ({
        url: "register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    login: b.mutation<AuthResponse, LoginRequest>({
      query: (data) => ({
        url: "login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("user", JSON.stringify(data.user));
        } catch (err) {
          console.error("Login failed:", err);
        }
      },
    }),

    logout: b.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          localStorage.removeItem("user");
          localStorage.removeItem("accessToken");
        } catch (err) {
          console.error("Logout failed:", err);
        }
      },
    }),

    getMe: b.query<User, void>({
      query: () => "/@me",
      providesTags: ["Auth"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
  useLogoutMutation,
} = auth;
