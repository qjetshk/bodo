import { configureStore } from "@reduxjs/toolkit";
import { auth } from "./auth";
import navReducer from "./nav-main";
import sidebarReducer from './sidebar'

export const store = configureStore({
  reducer: {
    [auth.reducerPath]: auth.reducer,
    nav: navReducer,
    sidebar: sidebarReducer
  },
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: false,
    }).concat(auth.middleware),
});


export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
