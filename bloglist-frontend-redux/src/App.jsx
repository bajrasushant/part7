import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Blog from "./components/Blog";
import NewBlogForm from "./components/NewBlogForm";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";

import { setNotification } from "./reducers/notificationReducer";
import { setUser } from "./reducers/userReducer";
import { createBlog, initializeBlogs } from "./reducers/blogReducer";

import { Route, Routes, useMatch } from "react-router-dom";
import { getAllUsers } from "./reducers/allUserReducer";
import UserList from "./components/UserList";
import UserDetail from "./components/UserDetail";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const allUsers = useSelector((state) => state.allUsers);
  const [newBlogFormVisible, setNewBlogFormVisible] = useState(false);

  const match = useMatch("users/:id");

  const userById = (id) => allUsers.find((user) => user.id === id);
  const userDetails = match ? userById(match.params.id) : null;

  useEffect(() => {
    if (user) {
      dispatch(initializeBlogs());
      dispatch(getAllUsers());
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
          <p>{user.name} is logged in</p>
          <button onClick={() => handleLogout()}>logout</button>
        </div>
      )}
      <Routes>
        <Route
          path="/"
          element={
            <div>
              {newBlogForm()}
              <Blog signedInUser={user} />
            </div>
          }
        />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:id" element={<UserDetail user={userDetails} />} />
      </Routes>
    </div>
  );
};
export default App;
