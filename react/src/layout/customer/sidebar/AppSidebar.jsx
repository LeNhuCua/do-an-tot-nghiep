import React, { useContext, useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { Link } from "react-router-dom";

import useOnClickOutsideRef from "../../../hook/OnClickOutside";
import { SidebarContext } from "../../../context/customer/SideBarContext";

import CustomLink_Children from "../../../components/customer/navigation/CustomLink_Children";
import { DataContext } from "../../../context/DataContext";
import axios from "axios";
import { MenusContext } from "../../../context/customer/MenuContext";
import CustomLink_Mobile from "../../../components/customer/navigation/CustomLink_Mobile";
import CustomLink_Children_Mobile from "../../../components/customer/navigation/CustomLink_Children_Mobile";

const AppSidebar = () => {
  //https://dev.to/pbteja1998/easily-detect-outside-click-using-useref-hook-in-react-4035
  const { setIsOpenSidebar } = useContext(SidebarContext);
  const ref = useOnClickOutsideRef(() => setIsOpenSidebar(false));
  const { state, dispatch } = useContext(DataContext);

  const { categories, subcategories } = state;
  const { searchOpen, Open, hoverIndex, setHoverIndex } =
    useContext(MenusContext);
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
          {/* <CustomLink_Mobile to="/">Trang chủ</CustomLink_Mobile>
          <CustomLink_Mobile to="/introduce">Giới thiệu</CustomLink_Mobile>
          <CustomLink_Mobile to="/adidas">Adidas</CustomLink_Mobile>
          <CustomLink_Mobile to="/nike">Nike</CustomLink_Mobile>
          <CustomLink_Mobile to="/yeezy">Yeezy</CustomLink_Mobile>
          <CustomLink_Mobile to="/spa">Spa giày</CustomLink_Mobile>
          <CustomLink_Mobile to="/contact">Liên hệ</CustomLink_Mobile> */}

          <div>
            <ul className="">
              <CustomLink_Mobile to="/">Trang chủ</CustomLink_Mobile>

              {categories.map((category) => (
                <div key={category.categoryId}>
                  <div className="relative group before:contents-[''] before:absolute before:w-full before:h-[80%] before:bg-transparent before:-bottom-6 before:left-0">
                    <CustomLink_Mobile
                      to={`danhmuc/${category.alias}`}
                      categoryId={category.categoryId}
                    >
                      {category.name}
                    </CustomLink_Mobile>
                    {hoverIndex === category.categoryId && (
                      <ul className="relative z-9999  hidden group-hover:block top-bottom w-[280px] bg-white shadow-xl transition-all duration-300">
                        {category.type_category.map((type) => (
                          <CustomLink_Children_Mobile
                            key={type.typeCategoryId}
                            to={`danhmuccon/${type.alias}`}
                            // categoryId={category.categoryId}
                          >
                            {type.name}
                          </CustomLink_Children_Mobile>
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
        </ul>
      </div>
    </div>
  );
};

export default AppSidebar;
