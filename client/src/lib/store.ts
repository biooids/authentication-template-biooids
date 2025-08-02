//src/lib/store.ts

import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

// Reducers
import authReducer from "./features/auth/authSlice";
import userReducer from "./features/user/userSlice";
import uploadProgressReducer from "./features/upload/uploadProgressSlice";
import uiReducer from "./features/ui/uiSlice";

// API Slices
import { authApiSlice } from "./features/auth/authApiSlice";
import { userApiSlice } from "./features/user/userApiSlice";
import { adminApiSlice } from "./features/admin/adminApiSlice";
import { emailApiSlice } from "./features/email/emailApiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    uploadProgress: uploadProgressReducer,
    ui: uiReducer,

    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [adminApiSlice.reducerPath]: adminApiSlice.reducer,
    [emailApiSlice.reducerPath]: emailApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApiSlice.middleware)
      .concat(authApiSlice.middleware)
      .concat(adminApiSlice.middleware)
      .concat(emailApiSlice.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
