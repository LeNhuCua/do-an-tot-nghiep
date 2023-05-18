import React, { useContext, useEffect } from "react";
import { AppSidebar, AppFooter, AppHeader, AppContent } from "./index";
import { useStateContext } from "../../context/ContextProvider";
import { Navigate, useNavigate } from "react-router-dom";
import axiosClient from "../../axios-client-customer";
import Loading from "../../components/Loading";
import UseTitle from "../../hook/UseTitle";
import ScrollButton from "../../components/scrollbutton/ScrollButton";
import { SidebarContext } from "../../context/customer/SideBarContext";

const DefaultLayout = () => {
  UseTitle("Vàng bạc đá quý Kim Huy");
  const { setUser,tokenCustomer } = useStateContext();

  useEffect(() => {
    if (tokenCustomer) {
      axiosClient.get("/user").then((res) => {
        setUser(res.data.user);
      });
    }
  }, []);
  const { isOpenSidebar } = useContext(SidebarContext);

  return (
    <div className="font-sans w-full">
      <div className={`relative`}>
        <div
          className={`relative xl:left-0 ${
            isOpenSidebar ? "-left-[250px]" : ""
          }`}
        >
          <AppHeader />
          <AppContent />
          <div className="mt-8">
            <AppFooter />
          </div>
          {/* <div className="mt-8">
            <Register />
            <Footer />
            <CopyRight />
          </div> */}
        </div>

        {isOpenSidebar ? <AppSidebar /> : ""}
        <div
          className={`absolute xl:w-0 xl:h-0 ${
            isOpenSidebar
              ? "absolute w-[calc(100%-250px)] top-0 h-full bg-[rgba(0,0,0,0.3)] z-50"
              : ""
          } `}
        ></div>
      </div>
      <ScrollButton />
    </div>
  );
};

export default DefaultLayout;