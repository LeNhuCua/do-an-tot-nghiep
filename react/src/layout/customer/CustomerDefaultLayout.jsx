import React, { useContext, useEffect, useState } from "react";
import { AppFooter, AppHeader, AppContent, AppSidebar } from "./index";
import { useStateContext } from "../../context/ContextProvider";
import { Navigate, useNavigate } from "react-router-dom";
import axiosClient from "../../axios-client-customer";
import Loading from "../../components/Loading";
import UseTitle from "../../hook/UseTitle";
import ScrollButton from "../../components/scrollbutton/ScrollButton";
import { SidebarContext } from "../../context/customer/SideBarContext";
import ForgotPassword from "../../views/resetpassword/ForgotPassword";
import ResetPasswordPage from "../../views/resetpassword/ResetPasswordPage ";

const DefaultLayout = () => {
  UseTitle("Vàng bạc Kim Huy");
  const { setUser, tokenCustomer } = useStateContext();

  useEffect(() => {
    if (tokenCustomer) {
      axiosClient.get("/user").then((res) => {
        setUser(res.data.user);
      });
    }
  }, []);
  const { isOpenSidebar } = useContext(SidebarContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Loading function to load data or
    // fake it using setTimeout;
    const loadData = async () => {
      // Wait for two second
      await new Promise((r) => setTimeout(r, 3000));

      // Toggle loading state
      setLoading(!loading);
    };

    loadData();
  }, []);
  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }
  return (
    <div className="font-sans w-full">
      <div className={`relative`}>
        <div
        // className={`relative xl:left-0 ${
        //   isOpenSidebar ? "-left-[250px]" : ""
        // }`}
        >
          <AppHeader />
          <div>
            <AppSidebar />
          </div>
          <div className={`${isOpenSidebar ? "select-none" : ""}`}>
   
           
            <AppContent />
          </div>
          <div className="mt-8">
            <AppFooter />
          </div>
          {/* <div className="mt-8">
            <Register />
            <Footer />
            <CopyRight />
          </div> */}
        </div>
        {/* {isOpenSidebar ? <AppSidebar /> : ""}
        <div
          className={`absolute xl:w-0 xl:h-0 ${
            isOpenSidebar
              ? "absolute w-[calc(100%-250px)] top-0 h-full bg-[rgba(0,0,0,0.3)] z-50"
              : ""
          } `}
        ></div> */}
      </div>
      <ScrollButton />
    </div>
  );
};

export default DefaultLayout;
