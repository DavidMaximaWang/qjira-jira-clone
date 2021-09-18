import { configureStore } from "@reduxjs/toolkit";
import { projectListSlice } from "screens/ProjectListScreen/project-list.slice";
import { authSlice } from "./auth.slice";

export const rootReducer = {
  auth: authSlice.reducer,
  projectList: projectListSlice.reducer,
};
export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;