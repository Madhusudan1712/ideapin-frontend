import { combineReducers } from "@reduxjs/toolkit";
import appReducer from "../features/app/appSlice";

const rootReducer = combineReducers({
  app: appReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
