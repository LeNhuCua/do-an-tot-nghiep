import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../axios-client";

const StateContext = createContext({
  loading: false,
  setLoading: () => {},
  token: null,
  notification: null,
  tostStatus: null,
  setTostStatus : () => {},
  setUser: () => {},
  setToken: () => {},
  setNotification: () => {},
});

export const ContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
  const [notification, _setNotification] = useState("");
  const [tostStatus, setTostStatus] = useState(null);

  useEffect(() => {
    if (user.length === 0) {
      fetchUserLogin();
    } 
  }, []);

  const fetchUserLogin = async () => {
    axiosClient.get("/user").then((res) => {
      setUser(res.data.user);
    });
  };

  // useEffect(() => {

  //   axiosClient.get("/user").then((res) => {
  //     setUser(res.data.user);
  //   });
  // }, []);

  const setToken = (token) => {
    _setToken(token);
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  const setNotification = (message) => {
    _setNotification(message);

    setTimeout(() => {
      _setNotification("");
    }, 5000);
  };

  return (
    <StateContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        notification,
        setNotification,
        loading,
        setLoading,
        tostStatus,
         setTostStatus
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
