import React, { useContext, useEffect, useState, useRef } from "react";
import { Controller, useForm } from "react-hook-form";

import Swal from "sweetalert2";
import { CCol, CForm } from "@coreui/react";
import { API } from "../../../API.js";

import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

import { Button } from "primereact/button";
import { DataContext } from "../../../context/DataContext.jsx";
import { Toast } from "primereact/toast";
import axiosClient from "../../../axios-client.js";
import AppBreadcrumb from "../../../layout/admin/AppBreadcrumb.jsx";
import { Link, useNavigate } from "react-router-dom";
import { classNames } from "primereact/utils";
import Loading from "../../../components/Loading.jsx";

export default function CreateUser() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    control,
    formState: { errors },
  } = useForm();
  const toast = useRef(null);

  const [roles, setRoles] = useState([]);

  const [selectedRole, setSelectedRole] = useState("");
  const fetchRoles = async () => {
    await axiosClient.get(`${API}/api/roles/role`).then(({ data }) => {
      setRoles(data);
    });
  };
  useEffect(() => {
    fetchRoles();
  }, []);

  const { dispatch } = useContext(DataContext);

  const fetchUsers = async () => {
    await axiosClient.get(`${API}/api/users/`).then(({ data }) => {
      dispatch({ type: "FETCH_USERS", payload: data });
    });
  };

  const [validationError, setValidationError] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const CreateUser = async (data) => {
    const formData = new FormData();
    formData.append("account", data.account);
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("c_password", data.c_password);
    formData.append("role", data.role.id);
    setLoading(true);
    axiosClient
      .post(`${API}/api/users`, formData)
      .then(({ data }) => {
        console.log(data);
        if (data.status === 422) {
          setValidationError(data.validation_error);
         
        } else {
          // setUser(data.user);
          // setError(null);
          // setToken(data.token);
          Swal.fire({
            icon: "success",
            text: "Đăng kí tài khoản thành công, Vui lòng vào email để xác nhận",
          });
          fetchUsers()

          // reset();
          navigate("/quantri/quantrivien");
        }
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  };
  const [statusSelect, setStatusSelect] = useState(null);

  const [selectedCategoryItem, setSelectedCategoryItem] = useState(null);

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

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className="cs-text-error">{errors[name].message}</small>
    ) : (
      <small className="">&nbsp;</small>
    );
  };
  return (
    <div className="container">
      {loading && <Loading />}
      <Toast ref={toast} />
      <AppBreadcrumb ListBreadcrumb={ListBreadcrumb} />
      <CForm
        onSubmit={handleSubmit(CreateUser)}
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
          {validationError && validationError.account ? (
            <small className="text-danger before:content-['_⚠']">
              Tài khoản đã tồn tại, vui lòng chọn tài khoản khác
            </small>
          ) : (
            ""
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
              id="fullName"
              className={`w-full ${errors.fullName && "invalid"}`}
              {...register("fullName", {
                required: "Vui lòng nhập họ và tên ",
                maxLength: {
                  value: 50,
                  message: "Giới hạn chỉ 50 kí tự",
                },
                // validate: (value) =>
                //   IsName(value) || "Vui lòng nhập họ tên hợp lệ",
              })}
              onKeyUp={() => {
                trigger("fullName");
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

          {errors.fullName && (
            <small className="cs-text-error">{errors.fullName.message}</small>
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
              className={`w-full ${errors.password && "invalid"}`}
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
              id="c_password"
              className={`w-full ${errors.c_password && "invalid"}`}
              {...register("c_password", {
                required: "Vui lòng nhập xác nhận",
                maxLength: {
                  value: 50,
                  message: "Giới hạn chỉ 50 kí tự",
                },
              })}
              onKeyUp={() => {
                trigger("c_password");
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

          {errors.c_password && (
            <small className="cs-text-error">{errors.c_password.message}</small>
          )}

          {validationError && validationError.c_password ? (
            <small className="text-danger before:content-['_⚠']">
              Xác nhận mật khẩu không chính xác
            </small>
          ) : (
            ""
          )}
        </CCol>
        <CCol xl={6}>
          <Controller
            name="role"
            control={control}
            rules={{ required: "Chức vụ trống." }}
            render={({ field, fieldState }) => (
              <Dropdown
                id={field.name}
                value={field.value}
                optionLabel="name"
                placeholder="Chọn chức vụ"
                options={roles}
                focusInputRef={field.ref}
                onChange={(e) => field.onChange(e.value)}
                className={classNames({
                  "p-invalid": fieldState.error,
                  "w-full": true,
                })}
              />
            )}
          />
          {getFormErrorMessage("role")}
        </CCol>
        {/* <CCol xl={6}>
          <Dropdown
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.value)}
            options={roles}
            optionLabel="name"
            showClear
            placeholder="Chọn quyền"
            className="w-full md:w-14rem"
          />
        </CCol> */}
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
