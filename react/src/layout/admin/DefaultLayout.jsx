import React, { useEffect } from "react";
import { AppSidebar, AppFooter, AppHeader, AppContent } from "./index";
import { useStateContext } from "../../context/ContextProvider";
import { Navigate, useNavigate } from "react-router-dom";
import axiosClient from "../../axios-client";
import Loading from "../../components/Loading";
import UseTitle from "../../hook/UseTitle";
import ScrollButton from "../../components/scrollbutton/ScrollButton";

const DefaultLayout = () => {
  UseTitle("Quản trị");
  const { setUser ,token} = useStateContext();
  if (!token ) {
    return <Navigate to="/quantri/dangnhap" />;
  }
  useEffect(() => {
    axiosClient.get("/user").then((res) => {
      setUser(res.data.user);
    });
  }, []);

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
      <ScrollButton />
    </div>
  );
};

export default DefaultLayout;
