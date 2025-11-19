import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  description?: string;
  isMain?: boolean;
  items?: NavItem[];
}

interface NavState {
  navMain: NavItem[];
}

const initialState: NavState = {
  navMain: [],
};

const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    setNavMain(state, action: PayloadAction<NavItem[]>) {
      state.navMain = action.payload;
    },
  },
});

export const { setNavMain } = navSlice.actions;
export default navSlice.reducer;
