import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  isOpened: true,
  isMobile: false
};

export type SidebarState = {
  isOpened: boolean,
  isMobile: boolean
}

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setIsSidebarOpened: (state, action: PayloadAction<boolean>) => {
      state.isOpened = action.payload
    },
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload
    }
  },
});

export const { setIsSidebarOpened, setIsMobile } = sidebarSlice.actions;
export default sidebarSlice.reducer;
