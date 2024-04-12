import { useState } from "react";
import loginService from "../services/login";
import { useNotify } from "../hooks";
import { useUserDispatch, useUserValue } from "../UserContext";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const notify = useNotify();
  const userDispatch = useUserDispatch();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      userDispatch({type: "LOGIN", payload: user});
      notify({
        message: `${user.username} succesfully logged in`,
        status: "success",
      });
    } catch {
      notify({ message: "wrong credentials, try again", status: "error" });
    }
  };

  return (
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
};

export default LoginForm;
