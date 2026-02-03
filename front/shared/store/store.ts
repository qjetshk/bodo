import { configureStore } from "@reduxjs/toolkit";
import { auth } from "../../features/auth/api/auth.slice";
import navReducer from "../../widgets/sidebar-nav-header/model/nav-main.slice";
import sidebarReducer from '../../widgets/sidebar-nav-header/model/sidebar.slice'

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
