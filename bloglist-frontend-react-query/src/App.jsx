import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import NewBlogForm from "./components/NewBlogForm";
import Notification from "./components/Notification";
import { useNotify } from "./hooks";

const App = () => {
  const notify = useNotify();

  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // useEffect(() => {
  //   if (user) {
  //     blogService
  //       .getAll()
  //       .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)));
  //   }
  // }, [user]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      notify({
        message: `${user.username} succesfully logged in`,
        status: "success",
      });
    } catch {
      notify({ message: "wrong credentials, try again", status: "error" });
    }
  };

  const handleLogout = () => {
    try {
      window.localStorage.removeItem("loggedUser");
      window.location.reload();
    } catch {
      notify({ message: "something went wrong", status: "error" });
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>login to the application</h2>
      <div>
        username
        <input
          id="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login-button" type="submit">
        login
      </button>
    </form>
  );

  return (
    <div>
      <Notification />
      {user === null && loginForm()}
      {user !== null && (
        <div>
          <h1>blogs</h1>
          <p>
            {user.name} is logged in
            <button onClick={() => handleLogout()}>logout</button>
          </p>
          <NewBlogForm />
          <Blog user={user}/>
        </div>
      )}
    </div>
  );
};
export default App;
