import { createApi } from "@reduxjs/toolkit/query/react";;
import { AuthResponse, LoginRequest, RegisterRequest, User } from "@/features/auth/model/auth.type";
import baseQueryWithRefresh from "@/shared/lib/base-query.util";

export const auth = createApi({
  reducerPath: "auth",
  baseQuery: baseQueryWithRefresh,
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
        credentials: 'include',
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
      query: () => ({ url: "/logout", method: "POST" }),
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

export const { useRegisterMutation, useLoginMutation, useGetMeQuery, useLogoutMutation } = auth;
