import React from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../reducers/userReducer";
import { setNotification } from "../reducers/notificationReducer";
import { Link } from "react-router-dom";

const Navigation = ({ user }) => {
  const dispatch = useDispatch();
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

  const style = {
    backgroundColor: "grey",
  };

  return (
    <nav style={style}>
      <ul
        style={{
          listStyleType: "none",
          margin: 0,
          padding: 0,
        }}
      >
        <li style={{ display:"inline", marginRight: "10px" }}>
          <Link to="/">blogs</Link>
        </li>
        <li style={{ display:"inline", marginRight: "10px" }}>
          <Link to="/users">users</Link>
        </li>
        <li style={{ display:"inline", marginRight: "10px" }}>
          {user.name} is logged in
        </li>
        <li style={{ display:"inline", marginRight: "10px" }}>
          <button onClick={() => handleLogout()}>logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
