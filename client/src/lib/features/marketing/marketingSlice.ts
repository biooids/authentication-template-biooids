import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { marketingApiSlice } from "./marketingApiSlice";
import { loggedOut } from "../auth/authSlice";
import type { RootState } from "../../store";
import type { MarketingEmail } from "./marketingTypes";

interface MarketingState {
  emails: MarketingEmail[];
  selectedEmail: MarketingEmail | null;
}

const initialState: MarketingState = {
  emails: [],
  selectedEmail: null,
};

const marketingSlice = createSlice({
  name: "marketing",
  initialState,
  reducers: {
    setSelectedEmail: (state, action: PayloadAction<MarketingEmail | null>) => {
      state.selectedEmail = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loggedOut, (state) => {
        state.emails = [];
        state.selectedEmail = null;
      })
      .addMatcher(
        marketingApiSlice.endpoints.getAllMarketingEmails.matchFulfilled,
        (state, action: PayloadAction<MarketingEmail[]>) => {
          state.emails = action.payload;
        }
      )
      .addMatcher(
        marketingApiSlice.endpoints.getMarketingEmailById.matchFulfilled,
        (state, action: PayloadAction<MarketingEmail>) => {
          state.selectedEmail = action.payload;
        }
      );
  },
});

export const { setSelectedEmail } = marketingSlice.actions;

export const selectAllMarketingEmails = (state: RootState) =>
  state.marketing.emails;
export const selectCurrentMarketingEmail = (state: RootState) =>
  state.marketing.selectedEmail;

export default marketingSlice.reducer;
