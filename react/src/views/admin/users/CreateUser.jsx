import React, { useContext, useEffect, useState, useRef } from "react";
import { Controller, useForm } from "react-hook-form";

import Swal from "sweetalert2";
import { CCol, CForm } from "@coreui/react";
import { API } from "../../../API.js";

import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

import { Button } from "primereact/button";
import { DataContext } from "../../../context/DataContext.jsx";
import { AutoComplete } from "primereact/autocomplete";
import convertNameWithoutAccents from "../../../hook/admin/ConvertNameToAlias.jsx";
import { Toast } from "primereact/toast";
import axiosClient from "../../../axios-client.js";
import AppBreadcrumb from "../../../layout/admin/AppBreadcrumb.jsx";
import { Link } from "react-router-dom";

export default function CreateUser() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm();
  const toast = useRef(null);

  const { state, dispatch } = useContext(DataContext);
  const { categories } = state;

  const fetchCategories = async () => {
    await axiosClient.get(`${API}/api/categories/`).then(({ data }) => {
      dispatch({ type: "FETCH_CATEGORIES", payload: data });
    });
  };
  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, []);
  const regexPattern =
    /^[^\s\u0103\u0105\u1EA1\u1EAD\u00E2\u00E0\u00E1\u1EA3\u1EA7\u1EA5\u1EAB\u1EA9\u0103\u0105\u1EA3\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u00E2\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u00E0\u00E1\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u00EA\u00E8\u00E9\u1EC1\u1EBF\u1EC5\u1EC3\u1EC7\u00EA\u1EC1\u1EBF\u1EC3\u1EC5\u1EC7\u00E8\u00E9\u1EC1\u1EBF\u1EC3\u1EC5\u1EC7]+$/;
  const [validationError, setValidationError] = useState([]);
  const CreateTypeCategory = async (data) => {
    const formData = new FormData();
    formData.append("typeCategoryId", data.typeCategoryId);
    formData.append("name", data.name);
    formData.append("alias", convertNameWithoutAccents(data.name));
    formData.append("status", statusSelect ? statusSelect.code : 1);
    formData.append("categoryId", selectedCategoryItem.categoryId);

    await axiosClient
      .post(`${API}/api/typeCategories`, formData)
      .then((response) => {
        if (response.data.status === 400) {
          const createProducts = {
            ...data,
            alias: convertNameWithoutAccents(data.name),
            status: statusSelect ? statusSelect.code : 1,
            category: {
              name: selectedCategoryItem.name,
            },
            // "category.name": selectedCategoryItem.name, // truyền giá trị của categories vào đây
          };

          // Thêm loại sản phẩm mới vào danh sách loại sản phẩm trong context
          dispatch({ type: "ADD_TYPECATEGORY", payload: createProducts });
          toast.current.show({
            severity: "success",
            summary: "Thành công",
            detail: "Thêm mới thành công !",
            life: 3000,
          });
          setValidationError([]);
          reset();
        } else {
          setValidationError(response.data.validation_error);
          Swal.fire({
            icon: "error",
            text: "Kiểm tra lại thông tin",
          });
        }
      });
  };
  const [statusSelect, setStatusSelect] = useState(null);

  const status = [
    { name: "Hiển thị", code: 1 },
    { name: "Ẩn", code: 0 },
  ];

  const [selectedCategoryItem, setSelectedCategoryItem] = useState(null);
  const [filteredItems, setFilteredItems] = useState(null);

  // const items = Array.from({ length: 100000 }).map((_, i) => ({
  //   label: `Item #${i}`,
  //   value: i,
  // }));

  const searchItems = (event) => {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo purposes we filter at client side
    let query = event.query;
    let _filteredItems = [];

    for (let i = 0; i < categories.length; i++) {
      let item = categories[i];
      if (item.name.toLowerCase().includes(query.toLowerCase())) {
        _filteredItems.push(item);
      }
    }
    setFilteredItems(_filteredItems);
  };
  const ListBreadcrumb = [
    {
      name: "Quản lý nhân viên",
      link: "/quantri/quantrivien",
    },
    {
      name: "Thêm nhân viên",
    },
  ];
  const [error, setError] = useState(null);

  return (
    <div className="container">
      <Toast ref={toast} />
      <AppBreadcrumb ListBreadcrumb={ListBreadcrumb} />
      <CForm
        // onSubmit={handleSubmit(onSubmit)}
        className="row g-4 relative"
        action="#"
      >
        <CCol xl={6}>
          <span className="p-float-label">
            <InputText
              id="account"
              className={`w-full ${errors.account && "invalid"}`}
              {...register("account", {
                required: "Vui lòng nhập tài khoản ",
                maxLength: {
                  value: 50,
                  message: "Giới hạn chỉ 50 kí tự",
                },
              })}
              onKeyUp={() => {
                trigger("account");
              }}
              type="text"
              placeholder="Vd: an"
            />
            <label htmlFor="account">Tài khoản</label>
          </span>

          {errors.account && (
            <small className="cs-text-error">{errors.account.message}</small>
          )}

          {error && error.account ? (
            <small className="text-danger before:content-['_⚠']">
              Tài khoản đã tồn tại, vui lòng chọn tài khoản khác
            </small>
          ) : (
            ""
          )}
        </CCol>
        <CCol xl={6}>
          <span className="p-float-label ">
            <InputText
              id="name"
              className={`w-full ${errors.name && "invalid"}`}
              {...register("name", {
                required: "Vui lòng nhập họ và tên ",
                maxLength: {
                  value: 50,
                  message: "Giới hạn chỉ 50 kí tự",
                },
                // validate: (value) =>
                //   IsName(value) || "Vui lòng nhập họ tên hợp lệ",
              })}
              onKeyUp={() => {
                trigger("name");
              }}
              type="text"
              placeholder="Vd: Nguyễn Văn An"
            />
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Họ và tên
            </label>
          </span>

          {errors.name && (
            <small className="cs-text-error">{errors.name.message}</small>
          )}
        </CCol>
        <CCol xl={6}>
          <span className="p-float-label ">
            <InputText
              id="email"
              className={`w-full ${errors.name && "invalid"}`}
              {...register("email", {
                required: "Vui lòng nhập email",
                maxLength: {
                  value: 50,
                  message: "Giới hạn chỉ 50 kí tự",
                },
              })}
              onKeyUp={() => {
                trigger("email");
              }}
              type="text"
              placeholder="Vd: an@gmail.com"
            />
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Email
            </label>
          </span>

          {errors.email && (
            <small className="cs-text-error">{errors.email.message}</small>
          )}
        </CCol>
        <CCol xl={6}>
         
            <span className="p-float-label ">
              <InputText
                type="password"
                id="password"
                className={`w-full ${errors.name && "invalid"}`}
                {...register("password", {
                  required: "Vui lòng nhập mật khẩu",
                  maxLength: {
                    value: 50,
                    message: "Giới hạn chỉ 50 kí tự",
                  },
                })}
                onKeyUp={() => {
                  trigger("password");
                }}
                placeholder="* * * * * * *"
              />
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Mật khẩu
              </label>
            </span>

            {errors.password && (
              <small className="cs-text-error">{errors.password.message}</small>
            )}
        
        </CCol>
        <CCol xl={6}>
        
            <span className="p-float-label ">
              <InputText
                id="passwordConfirmation"
                className={`w-full ${errors.name && "invalid"}`}
                {...register("passwordConfirmation", {
                  required: "Vui lòng nhập xác nhận",
                  maxLength: {
                    value: 50,
                    message: "Giới hạn chỉ 50 kí tự",
                  },
                })}
                onKeyUp={() => {
                  trigger("passwordConfirmation");
                }}
                type="password"
                placeholder="* * * * * * *"
              />
              <label
                htmlFor="passwordConfirmation"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Xác nhận
              </label>
            </span>

            {errors.passwordConfirmation && (
              <small className="cs-text-error">
                {errors.passwordConfirmation.message}
              </small>
            )}
     

          {error && error.c_password ? (
            <small className="text-danger before:content-['_⚠']">
              Xác nhận mật khẩu không chính xác
            </small>
          ) : (
            ""
          )}
        </CCol>

        <CCol xs={12}>
          <Button className="youtube p-0 w-full justify-center">
            <i className="pi pi-check"></i>
            <span className="p-3">Xác nhận</span>
          </Button>
        </CCol>
      

        {/* <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <a
                    href="#"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign up
                  </a>
                </p> */}
      </CForm>
    </div>
  );
}
