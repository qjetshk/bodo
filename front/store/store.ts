import { configureStore } from "@reduxjs/toolkit";
import { auth } from "./auth";

export const store = configureStore({
  reducer: {
    [auth.reducerPath]: auth.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([auth.middleware]),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
