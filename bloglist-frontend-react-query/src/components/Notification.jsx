import { useNotifyValue } from "../NotificationContext";

const Notification = () => {
  const notification = useNotifyValue();
  const style = { display: notification ? "block" : "none" };
  return (
    <div style={style} className={notification.status}>
      {notification.message}
    </div>
  );
};

export default Notification;
