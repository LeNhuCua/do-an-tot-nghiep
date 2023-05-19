import React, { useContext, useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoCall, IoLogOut } from "react-icons/io5";
import {
  AiFillStar,
  AiOutlineBarChart,
  AiOutlineBars,
  AiOutlineCaretDown,
  AiOutlineClose,
  AiOutlineContacts,
  AiOutlineLogout,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";

import { Link, useLocation } from "react-router-dom";

import { useForm } from "react-hook-form";
import { MenusContext } from "../../context/customer/MenuContext";
import { SidebarContext } from "../../context/customer/SideBarContext";

import { DataContext } from "../../context/DataContext";
import axios from "axios";
import { API } from "../../API";
import CustomLink from "../../components/customer/navigation/CustomLink";

import logo from "../../assets/images/logo.png";
import { useStateContext } from "../../context/ContextProvider";
import { CAvatar, CBadge, CDropdownHeader, CDropdownItem } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { Menu, MenuItem } from "@mui/material";
import { cilBell, cilLockLocked, cilUser } from "@coreui/icons";
import axiosClient from "../../axios-client-customer";
import CustomLink_Children from "../../components/customer/navigation/CustomLink_Children";

const AppHeader = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const location = useLocation();
  const match = location.pathname === "/nhan-nu";
  const { searchOpen, Open, hoverIndex, setHoverIndex } =
    useContext(MenusContext);
  const { isOpenSidebar, Handle } = useContext(SidebarContext);

  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    window.addEventListener("scroll", isSticky);
    return () => {
      window.removeEventListener("scroll", isSticky);
    };
  });

  /* Method that will fix header after a specific scrollable */
  const isSticky = () => {
    const header = document.querySelector(".header-section");
    const scrollTop = window.scrollY;
    scrollTop >= 300
      ? header.classList.add("is-sticky")
      : header.classList.remove("is-sticky");
  };

  const { state, dispatch } = useContext(DataContext);

  const { categories, subcategories } = state;

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    } else {
      setLoading(false);
    }
  }, []);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const fetchCategories = async () => {
    await axios.get(`${API}/api/cus-products/categories/`).then(({ data }) => {
      dispatch({ type: "FETCH_CATEGORIES", payload: data });
      setLoading(false);
    });
  };

  const [totalCart, setTotalCart] = useState(null);
  useEffect(() => {
    axiosClient.get("/cart/totalCart").then((res) => {
      setTotalCart(res.data[0].total_cart);

      console.log(res.data[0].total_cart);
    });
  }, []);

  const { tokenCustomer, user } = useStateContext();

  let Author = "";
  if (!tokenCustomer) {
    Author = (
      <>
        <Link
          to="/dangnhap"
          className="text-sm  flex items-center font-bold uppercase text-gray-500 px-2 cs-hover"
        >
          <FaUser className="inline-block" />
          <span className="ml-1 inline-block ">Đăng nhập</span>
        </Link>
      </>
    );
  }
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  let UserAuth = "";
  if (tokenCustomer) {
    UserAuth = (
      <div>
        <div onClick={handleClick} className="hover:cursor-pointer">
          <div className="flex items-center ">
            <div className="text-sm">Xin chào</div>
            <div className="text-sm  flex items-center font-bold uppercase text-gray-500 px-2 cs-hover">
              <AiOutlineCaretDown className="inline-block" />
              <span className="ml-1 inline-block ">
                {" "}
                {user ? user.account : ""}
              </span>
            </div>
          </div>
        </div>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <CDropdownHeader className="bg-light fw-semibold p-2 ">
            Account
          </CDropdownHeader>

          <div className="hover:bg-gray-300 py-1 px-4">
            <CDropdownItem href="11">
              <CIcon icon={cilBell} className="me-2" />
              Updates
              <CBadge color="info" className="ms-2">
                42
              </CBadge>
            </CDropdownItem>
          </div>

          <div className="hover:bg-gray-300 py-1 px-4">
            <Link to="/quantri/thongtincanhan" className="no-underline">
              <div>
                <CIcon icon={cilBell} className="me-2" />
                Thông tin cá nhân
                <CBadge color="info" className="ms-2">
                  42
                </CBadge>
              </div>
            </Link>
          </div>

          <MenuItem className="border">
            <CIcon icon={cilLockLocked} className="me-2" />
            Đăng xuất
          </MenuItem>
        </Menu>
      </div>
    );
  }
  return (
    <header className="w-full">
      <div className="cs-container py-2 border-b">
        <ul className="flex justify-end items-center h-ful flex-wrap">
          <li className="border-r border-gray-500">{UserAuth}</li>

          <li className=" border-r flex items-center  border-gray-500">
            {Author}
          </li>
          <li className=" px-2">
            <IoCall className="inline" />
            <span className="ml-1">Hotline:</span>
            <a href="##" className="font-bold text-lg ml-1 cs-hover">
              0909300746
            </a>
          </li>
        </ul>
      </div>
      <div className="header-section">
        <div
          className={`flex justify-between items-center relative py-2 lg:py-0 cs-container  `}
        >
          <div className="h-20 w-44">
            <Link to="/">
              <img
                className="w-full h-full object-cover"
                src={logo}
                alt="logo"
              />
            </Link>
          </div>
          <div className="hidden xl:flex justify-end items-center relative  ">
            <ul className="flex items-center gap-5 ">
              <li className="flex gap-1 items-center cs-hover font-[500]">
                <AiFillStar /> Về chúng tôi
              </li>
              <li className="flex gap-1 items-center cs-hover font-[500]">
                <AiOutlineBarChart /> Giá vàng
              </li>
              <li className="flex gap-1 items-center cs-hover font-[500]">
                <AiOutlineContacts /> Liên hệ
              </li>
            </ul>
          </div>
          {/* search search-active */}
          <div
            className={`w-[100%] h-full left-0 absolute bg-white top-0 md:hidden z-50  items-center cs-container ${
              searchOpen ? "flex animation" : "hidden"
            }`}
          >
            <form className="w-full absolute top-0 translate-y-3 left-0 ">
              <div className="border rounded-xl bg-gray-200 px-2 items-center flex  w-full z-50">
                <input
                  className="w-full border-none focus:ring-0 bg-transparent outline-none  placeholder:text-gray-950 placeholder:text-xs "
                  type="text"
                  placeholder="Nhập từ cần tìm"
                />
                <AiOutlineClose
                  className="block text-3xl cs-hover text-red-400"
                  onClick={Open}
                />
              </div>
            </form>
          </div>

          <div className="flex items-center gap-3">
            <form onSubmit={() => handleSubmit(searchItems(searchKey))}>
              <div className="border rounded-full bg-gray-200  py-1 px-4 items-center hidden md:flex">
                <input
                  className="w-full  focus:ring-0 bg-transparent focus:outline-none outline-none active:border-red-700 border-none placeholder:text-black placeholder:text-xs "
                  type="text"
                  placeholder="Nhập từ cần tìm kiếm..."
                />
                <button type="button">
                  <AiOutlineSearch
                    type="submit"
                    className="block text-3xl cs-hover focus:bg-red-400"
                  />
                </button>
              </div>
            </form>
            <div className="p-2 md:hidden rounded-full bg-gray-200 text-yellow-400 flex justify-center items-center">
              <AiOutlineSearch
                className="block text-3xl cs-hover focus:bg-red-400 "
                onClick={Open}
              />
            </div>

            <Link
              to="/giohang"
              className="bg-gray-900 w-12 h-12 rounded-full flex items-center justify-center relative hover:bg-yellow-400 transition-all duration-300 hover:cursor-pointer"
            >
              <AiOutlineShoppingCart className="text-white text-3xl" />
              <span className="flex items-center justify-center w-6 h-6 bg-yellow-500 rounded-full absolute -top-2 -right-2 border-2 text-xs cursor-pointer">
                {totalCart}
              </span>
            </Link>
            {isOpenSidebar ? (
              <div
                className="xl:hidden bg-red-500 w-12 h-12 rounded-full flex items-center justify-center relative hover:bg-yellow-400 transition-all duration-300 hover:cursor-pointer"
                onClick={Handle}
              >
                <AiOutlineClose className="text-white text-3xl" />
              </div>
            ) : (
              <div
                className="xl:hidden bg-yellow-400 w-12 h-12 rounded-full flex items-center justify-center relative  transition-all duration-300 hover:cursor-pointer"
                onClick={Handle}
              >
                <AiOutlineBars className="text-white text-3xl" />
              </div>
            )}
          </div>
        </div>
        <div className="w-full ">
          <div className="cs-container py-2 border-b   flex items-center justify-center shadow">
            <ul className=" xl:flex hidden items-center  w-full justify-center gap-4 py-2">
              <CustomLink to="/">Trang chủ</CustomLink>

              {categories.map((category) => (
                <div key={category.categoryId}>
                  <div className="relative group before:contents-[''] before:absolute before:w-full before:h-[80%] before:bg-transparent before:-bottom-6 before:left-0">
                    <CustomLink
                      to={`danhmuc/${category.alias}`}
                      categoryId={category.categoryId}
                    >
                      {category.name}
                    </CustomLink>
                    {hoverIndex === category.categoryId && (
                      <ul className="absolute z-20 top-[48px] hidden group-hover:block top-bottom w-[280px] bg-white shadow-xl transition-all duration-300">
                        {category.type_category.map((type) => (
                          <CustomLink_Children
                            key={type.typeCategoryId}
                            to={`danhmuccon/${type.alias}`}
                            // categoryId={category.categoryId}
                          >
                            {type.name}
                          </CustomLink_Children>
                          // <li
                          //   key={type.typeCategoryId}
                          //   className="sub-group h-[40px] border-b px-4 flex items-center font-[500] hover:text-white hover:bg-yellow-300 hover:cursor-pointer transition-all duration-100"
                          // >
                          //   <Link
                          //     to={`danhmuc/${type.alias}`}
                          //     className={` transition-all text-gray-950 w-full  no-underline h-full flex items-center duration-300 sub-group-content`}
                          //   >
                          //     {type.name}
                          //   </Link>
                          // </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </ul>{" "}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
