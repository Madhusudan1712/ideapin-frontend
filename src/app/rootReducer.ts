import { combineReducers } from "@reduxjs/toolkit";
import appReducer from "../features/app/appSlice";
import authReducer from "../features/auth/authSlice";
import notesReducer from "../features/notes/notesSlice";

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  notes: notesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
