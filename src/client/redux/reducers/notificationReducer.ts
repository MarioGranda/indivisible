import { Reducer } from "redux";
import { ActionType } from "../actions/notification/index";
import { Notification } from "@/shared/models/index";

export interface notificationState {
  notification: Notification | null;
}

const initialState: notificationState = {
  notification: null,
};

const notificationReducer: Reducer<notificationState, ActionType> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notification: action.payload,
      };
    case "CLOSE_NOTIFICATION":
      return {
        ...state,
        notification: action.payload,
      };
    default:
      return state;
  }
};

export default notificationReducer;
