// FILE: src/lib/store.ts

import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

// --- Reducer Imports ---
import authReducer from "./features/auth/authSlice";
import userReducer from "./features/user/userSlice";
import uploadProgressReducer from "./features/upload/uploadProgressSlice";
import uiReducer from "./features/ui/uiSlice";
import settingsReducer from "./features/settings/settingsSlice";
import marketingReducer from "./features/marketing/marketingSlice";

// --- API Slice Imports ---
import { authApiSlice } from "./features/auth/authApiSlice";
import { userApiSlice } from "./features/user/userApiSlice";
import { adminApiSlice } from "./features/admin/adminApiSlice";
import { emailApiSlice } from "./features/email/emailApiSlice";
import { settingsApiSlice } from "./features/settings/settingsApiSlice";
import { marketingApiSlice } from "./features/marketing/marketingApiSlice";

export const store = configureStore({
  reducer: {
    // Regular Redux slices
    auth: authReducer,
    user: userReducer,
    uploadProgress: uploadProgressReducer,
    ui: uiReducer,
    settings: settingsReducer,
    marketing: marketingReducer,

    // API slice reducers
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [adminApiSlice.reducerPath]: adminApiSlice.reducer,
    [emailApiSlice.reducerPath]: emailApiSlice.reducer,
    [settingsApiSlice.reducerPath]: settingsApiSlice.reducer,
    [marketingApiSlice.reducerPath]: marketingApiSlice.reducer,
  },
  // Middleware configuration to include RTK Query's capabilities
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApiSlice.middleware)
      .concat(authApiSlice.middleware)
      .concat(adminApiSlice.middleware)
      .concat(emailApiSlice.middleware)
      .concat(settingsApiSlice.middleware)
      .concat(marketingApiSlice.middleware),
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
