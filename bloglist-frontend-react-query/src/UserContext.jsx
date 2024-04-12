import { createContext, useContext, useReducer } from "react";
import blogService from "./services/blogs";

const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      window.localStorage.setItem("loggedUser", JSON.stringify(action.payload));
      blogService.setToken(action.payload.token);
      return action.payload;
    case "LOGOUT":
      window.localStorage.removeItem("loggedUser");
      return null;
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
};

const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, null);

  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {props.children}
    </UserContext.Provider>
  );
};

export const useUserValue = () => {
  const userAndDispatch = useContext(UserContext);
  return userAndDispatch[0];
};

export const useUserDispatch = () => {
  const userAndDispatch = useContext(UserContext);
  return userAndDispatch[1];
};

export default UserContext;
