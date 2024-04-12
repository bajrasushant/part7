import { useEffect } from "react";
import Blog from "./components/Blog";
import NewBlogForm from "./components/NewBlogForm";
import Notification from "./components/Notification";
import { useNotify } from "./hooks";
import LoginForm from "./components/LoginForm";
import { useUserDispatch, useUserValue } from "./UserContext";

const App = () => {
  const notify = useNotify();
  const userDispatch = useUserDispatch();
  const user = useUserValue();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const userDetails = JSON.parse(loggedUserJSON);
      userDispatch({ type: "LOGIN", payload: userDetails });
    }
  }, []);

  const handleLogout = () => {
    try {
      userDispatch({ type: "LOGOUT" });
      window.location.reload();
    } catch {
      notify({ message: "something went wrong", status: "error" });
    }
  };

  return (
    <div>
      <Notification />
      {user === null && <LoginForm />}
      {user !== null && (
        <div>
          <h1>blogs</h1>
          <p>
            {user.name} is logged in
            <button onClick={() => handleLogout()}>logout</button>
          </p>
          <NewBlogForm />
          <Blog user={user} />
        </div>
      )}
    </div>
  );
};
export default App;
