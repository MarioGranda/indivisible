import { useSelector } from "react-redux";
import { RootState } from "../reducers";

export const useNotification = () =>
  useSelector((state: RootState) => state.notificationReducer.notification);
