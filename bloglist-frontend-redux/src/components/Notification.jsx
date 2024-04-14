import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector((state) => state.notification);

  const style = {
    display: notification ? "block" : "none",
  };

  return (
    <div style={style} className={notification.status}>
      {notification.message}
    </div>
  );
};

export default Notification;
