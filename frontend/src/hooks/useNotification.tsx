import { useContext } from "react";
import { NotificationProps } from "../components/Notification";
import { NotificationContext } from "../contexts/NotificationContext";

export function useNotification() : React.Dispatch<React.SetStateAction<NotificationProps | undefined>> {
  return useContext(NotificationContext).setNotificationProps;
}