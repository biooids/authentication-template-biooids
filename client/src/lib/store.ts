// FILE: src/lib/store.ts

import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

// --- Reducer Imports ---
import authReducer from "./features/auth/authSlice";
import userReducer from "./features/user/userSlice";
import uploadProgressReducer from "./features/upload/uploadProgressSlice";
import uiReducer from "./features/ui/uiSlice";
import settingsReducer from "./features/settings/settingsSlice";

// --- API Slice Imports ---
import { authApiSlice } from "./features/auth/authApiSlice";
import { userApiSlice } from "./features/user/userApiSlice";
import { adminApiSlice } from "./features/admin/adminApiSlice";
import { emailApiSlice } from "./features/email/emailApiSlice";
import { settingsApiSlice } from "./features/settings/settingsApiSlice";

export const store = configureStore({
  reducer: {
    // Regular Redux slices
    auth: authReducer,
    user: userReducer,
    uploadProgress: uploadProgressReducer,
    ui: uiReducer,
    settings: settingsReducer,

    // API slice reducers
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [adminApiSlice.reducerPath]: adminApiSlice.reducer,
    [emailApiSlice.reducerPath]: emailApiSlice.reducer,
    [settingsApiSlice.reducerPath]: settingsApiSlice.reducer,
  },
  // Middleware configuration to include RTK Query's capabilities
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApiSlice.middleware)
      .concat(authApiSlice.middleware)
      .concat(adminApiSlice.middleware)
      .concat(emailApiSlice.middleware)
      .concat(settingsApiSlice.middleware),
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
