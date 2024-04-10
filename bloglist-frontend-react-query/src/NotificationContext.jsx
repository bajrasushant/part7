import { createContext, useContext, useReducer } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
  case "SET":
    return action.payload;
  case "RESET":
    return "";
  default:
    return "";
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    "",
  );
  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export const useNotifyValue = () => {
  const notifyAndDispatch = useContext(NotificationContext);
  return notifyAndDispatch[0];
};

export const useNotifyDispatch = () => {
  const notifyAndDispatch = useContext(NotificationContext);
  return notifyAndDispatch[1];
};

export default NotificationContext;
