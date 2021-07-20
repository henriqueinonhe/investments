import React from "react";
import { NotificationProps } from "../components/Notification";

export interface NotificationContextData {
  setNotificationProps : React.Dispatch<React.SetStateAction<NotificationProps | undefined>>;
}

export const NotificationContext = React.createContext<NotificationContextData>({
  setNotificationProps : () => { throw Error("Notification Context value is not set!"); }
});