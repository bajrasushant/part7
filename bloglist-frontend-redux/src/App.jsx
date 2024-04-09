import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Blog from "./components/Blog";
import NewBlogForm from "./components/NewBlogForm";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";

import { setNotification } from "./reducers/notificationReducer";
import { setUser } from "./reducers/userReducer";
import { createBlog, initializeBlogs } from "./reducers/blogReducer";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [newBlogFormVisible, setNewBlogFormVisible] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(initializeBlogs());
    }
  }, [user]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
    }
  }, []);

  const handleLogout = () => {
    try {
      window.localStorage.removeItem("loggedUser");
      window.location.reload();
      dispatch(setUser(null));
    } catch {
      dispatch(
        setNotification({ message: "something went wrong", status: "error" }),
      );
    }
  };

  const addBlog = (blogObject) => {
    try {
      dispatch(createBlog(blogObject));
      dispatch(
        setNotification({
          message: `a new blog ${blogObject.title} by ${blogObject.author} added`,
          status: "success",
        }),
      );
    } catch (error) {
      dispatch(
        setNotification({ message: "Something went wrong", status: "error" }),
      );
    } finally {
      setNewBlogFormVisible(false);
    }
  };

  const newBlogForm = () => {
    const hideWhenVisible = { display: newBlogFormVisible ? "none" : "" };
    const showWhenVisible = { display: newBlogFormVisible ? "" : "none" };
    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setNewBlogFormVisible(true)}>new form</button>
        </div>
        <div style={showWhenVisible}>
          <NewBlogForm createBlog={addBlog} />
          <button onClick={() => setNewBlogFormVisible(false)}>cancel</button>
        </div>
      </div>
    );
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
          {newBlogForm()}
          <Blog signedInUser={user} />
        </div>
      )}
    </div>
  );
};
export default App;
