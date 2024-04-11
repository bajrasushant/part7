import { useNotifyDispatch } from "../NotificationContext";

export const useNotify = () => {
  const notifyDispatch = useNotifyDispatch();
  return (payload) => {
    notifyDispatch({ type: "SET", payload: payload });
    setTimeout(() => {
      notifyDispatch({ type: "RESET" });
    }, 5000);
  };
};
