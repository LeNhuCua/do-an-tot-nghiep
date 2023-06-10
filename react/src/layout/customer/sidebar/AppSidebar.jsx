import React, { useContext, useEffect, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { SidebarContext } from "../../../context/customer/SideBarContext";
import { DataContext } from "../../../context/DataContext";
import { MenusContext } from "../../../context/customer/MenuContext";
import axios from "axios";
import CustomLink_Mobile from "../../../components/customer/navigation/CustomLink_Mobile";
import CustomLink_Children_Mobile from "../../../components/customer/navigation/CustomLink_Children_Mobile";
import { AiOutlineSearch } from "react-icons/ai";
import { API } from "../../../API";

export default function AppSidebar() {
  const { isOpenSidebar, setIsOpenSidebar } = useContext(SidebarContext);
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
    <div className="card flex justify-content-center">
      <Sidebar
        visible={isOpenSidebar}
        onHide={() => setIsOpenSidebar(false)}
        className="w-full md:w-40rem lg:w-90rem"
      >
        <div className="">
          <div className="bg-gray-600 py-1 rounded-lg flex justify-center">
            
            <h1 className="text-white">Kim Huy</h1>
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
                        <ul className="relative z-9999  top-bottom1 w-[280px] bg-white shadow-xl transition-all duration-300">
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
                <CustomLink_Mobile to="/xemtigia">Giá vàng</CustomLink_Mobile>
                <CustomLink_Mobile to="/tinnhan">Liên hệ</CustomLink_Mobile>


                
              </ul>{" "}
            </div>
          </ul>
        </div>
      </Sidebar>
    </div>
  );
}
