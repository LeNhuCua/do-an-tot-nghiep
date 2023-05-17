import React, { useContext } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { Link } from "react-router-dom";




import useOnClickOutsideRef from "../../../hook/OnClickOutside";
import { SidebarContext } from "../../../context/customer/SideBarContext";
import CustomLink_Mobile from "e:/kingshoes-clone/react/src/routes/customlink_mobile";

const AppSidebar = () => {
  //https://dev.to/pbteja1998/easily-detect-outside-click-using-useref-hook-in-react-4035
  const { setIsOpenSidebar } = useContext(SidebarContext);
  const ref = useOnClickOutsideRef(() => setIsOpenSidebar(false));

  return (
    <div
      className="fixed right-0 bg-white top-0 min-w-[250px] min-h-full xl:hidden z-50"
      ref={ref}
    >
      <div className="">
        <div className="bg-gray-600 py-2 flex justify-center">
          <div className="border rounded-full bg-gray-200 px-2 max-w-[240px]  items-center flex">
            <input
              className="w-full bg-transparent outline-none border-none placeholder:text-black placeholder:text-xs  py-2"
              type="text"
              placeholder="Nhập từ cần tìm"
            />
            <AiOutlineSearch className="block text-3xl cs-hover focus:bg-red-400" />
          </div>
        </div>

        <ul className="flex flex-col">
        <CustomLink_Mobile to="/">Trang chủ</CustomLink_Mobile>
        <CustomLink_Mobile to="/introduce">Giới thiệu</CustomLink_Mobile>
        <CustomLink_Mobile to="/adidas">Adidas</CustomLink_Mobile>
        <CustomLink_Mobile to="/nike">Nike</CustomLink_Mobile>
        <CustomLink_Mobile to="/yeezy">Yeezy</CustomLink_Mobile>
        <CustomLink_Mobile to="/spa">Spa giày</CustomLink_Mobile>
        <CustomLink_Mobile to="/contact">Liên hệ</CustomLink_Mobile>
     
     
        </ul>
      </div>
    </div>
  );
};

export default AppSidebar;
