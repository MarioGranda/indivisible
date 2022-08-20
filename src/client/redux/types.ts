import { ActionCreator, Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "./reducers";

export type ThunkActionCreator = ActionCreator<
  ThunkAction<void, RootState, never, Action>
>;
