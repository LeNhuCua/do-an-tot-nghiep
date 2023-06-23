import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../axios-client";

const StateContext = createContext({
  loading: false,
  setLoading: () => {},
  token: null,
  tokenCustomer: null,
  notification: null,
  tostStatus: null,
  setTostStatus : () => {},
  setUser: () => {},
  setToken: () => {},
  setNotification: () => {},
  setInfo: () => {},
});

export const ContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [info, setInfo] = useState({});
  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
  const [tokenCustomer, _setTokenCustomer] = useState(localStorage.getItem("ACCESS_TOKEN_CUSTOMER"));
  // const [tokenCustomer, _setTokenCustomer] = useState("tui");
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



  const setToken = (token) => {
    _setToken(token);
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  const setTokenCustomer = (token) => {
    _setTokenCustomer(token);
    if (token) {
      localStorage.setItem("ACCESS_TOKEN_CUSTOMER", token);
    } else {
      localStorage.removeItem("ACCESS_TOKEN_CUSTOMER");
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
        tokenCustomer,
        setToken,
        setTokenCustomer,
        notification,
        setNotification,
        loading,
        setLoading,
        tostStatus,
        setTostStatus,
        info,
        setInfo
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
