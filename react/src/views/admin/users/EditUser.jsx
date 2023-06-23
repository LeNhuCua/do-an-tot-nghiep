import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";


import { CCol, CForm } from "@coreui/react";
import Swal from "sweetalert2";
import { ToggleButton } from "primereact/togglebutton";
import { Toast } from "primereact/toast";

import { API } from "../../../API.js";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataContext } from "../../../context/DataContext.jsx";

import { AiOutlinePlus } from "react-icons/ai";
import convertNameWithoutAccents from "../../../hook/admin/ConvertNameToAlias.jsx";
import Loading from "../../../components/Loading.jsx";
import axiosClient from "../../../axios-client.js";
import AppBreadcrumb from "../../../layout/admin/AppBreadcrumb.jsx";

const EditUser = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm({
    mode: "onChange",
  });

  const toast = useRef(null);

  const [loading, setLoading] = useState(true);

  const { state, dispatch } = useContext(DataContext);

  const { categories, typeCategories } = state;

  const getID = useParams().id;

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchTyCategory = async () => {
      try {
        const { data } = await axiosClient.get(`${API}/api/users/${getID}`);
        setUser(data.user);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchCategories = async () => {
      try {
        const { data } = await axiosClient.get(`${API}/api/categories/`);
        dispatch({ type: "FETCH_CATEGORIES", payload: data });
      } catch (error) {
        console.log(error);
      }
    };

    fetchTyCategory();
    if (categories.length === 0) {
      fetchCategories();
    }
  }, []);



  const [validationError, setValidationError] = useState([]);
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchUsersAll = async () => {
    await axiosClient.get(`${API}/api/users/`).then(({ data }) => {
      dispatch({ type: "FETCH_USERS", payload: data });
    });
  };
  const [alreadyExistName, setAlreadyExistName] = useState(null);

  //tìm kiếm loại sản phẩm được chọn dựa vào bí danh và lấy lại dữ liệu nếu dữ liệu chưa tồn tại
  const updateData = async (data) => {

    const formData = {
      _method: "PATCH",
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      gender: checked ? 1 : 0,
    };

    await axiosClient
      .put(`${API}/api/users/${getID}`, formData)
      .then((response) => {
         if (response.data.status === 400) {
            fetchUsersAll();
          navigate("/quantri/quantrivien");
          Swal.fire({
            icon: "success",
            title: "Thông tin đã được cập nhật",
            showConfirmButton: false,
            timer: 1500,
          });

          setValidationError([]);
        } else {
          setValidationError(response.data.validation_error);
          Swal.fire({
            icon: "error",
            text: "Kiểm tra lại thông tin",
          });
        }
      })
      .catch((response) => {
        // alert(response.status);
      });
  };

  let currentStatus = null;
  if (user) {
    currentStatus =
      user.gender && user.gender === 1 ? true : false;
  }
  const [checked, setChecked] = useState(null);
  useEffect(() => {
    setChecked(currentStatus);
  }, [currentStatus]);

  //dữ liệu hiên thị trong dropdown danh mục cha
  const categoryOptionTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <AiOutlinePlus />
        <div>{option.name}</div>
      </div>
    );
  };
  const ListBreadcrumb = [
    {
      name: "Quản lý nhân viên",
      link: "/quantri/quantrivien",
    },
    {
      name: user ? user.account : "",
    },
  ];

  return (
    <div className="container">
      <Toast ref={toast} />
      <AppBreadcrumb ListBreadcrumb={ListBreadcrumb} />
      {loading && <Loading />}
      {user ? (
        <CForm onSubmit={handleSubmit(updateData)} className="row g-4">
          <div className=" flex justify-content-end">
            <ToggleButton
              onLabel="Nam"
              offLabel="Nữ"
              onIcon="pi pi-check"
              offIcon="pi pi-times"
              checked={checked}
              className={checked ? "bg-success" : "bg-danger"}
              onChange={(e) => {
                setChecked(e.value);
              }}
            />
          </div>
{/* 
          <CCol md={12}>
            <span className="p-float-label ">
              <InputText
                id="id"
                defaultValue={user ? user.userId : null}
                className={`w-full ${errors.userId && "invalid"}`}
                {...register("userId", {
                  required: "Vui lòng Mã nhân viên",
                  maxLength: {
                    value: 20,
                    message: "Giới hạn chỉ 20 kí tự",
                  },
                })}
                onKeyUp={() => {
                  trigger("userId");
                }}
              />
              <label htmlFor="id">Mã nhân viên</label>
            </span>
            {errors.userId && (
              <small className="cs-text-error">
                {errors.userId.message}
              </small>
            )}
          </CCol> */}

          <CCol md={12}>
            <span className="p-float-label ">
              <InputText
                id="fullName"
                // value={name}
                defaultValue={user ? user.fullName : null}
                className={`w-full ${errors.fullName && "invalid"}`}
                {...register("fullName", {
                  required: "Vui lòng nhập tên danh mục",
                  maxLength: {
                    value: 50,
                    message: "Giới hạn chỉ 50 kí tự",
                  },
                })}
                onKeyUp={() => {
                  trigger("fullName");
                }}
              />

              <label htmlFor="fullName">Họ và tên</label>
            </span>
            {errors.fullName && (
              <small className="cs-text-error">{errors.fullName.message}</small>
            )}

            {alreadyExistName ? (
              <small className="cs-text-error">{alreadyExistName}</small>
            ) : (
              ""
            )}
          </CCol>
      
          <CCol md={12}>
            <span className="p-float-label ">
              <InputText
                id="phoneNumber"
                // value={name}
                defaultValue={user ? user.phoneNumber : null}
                className={`w-full ${errors.phoneNumber && "invalid"}`}
                {...register("phoneNumber", {
                  required: "Vui lòng nhập tên danh mục",
                  maxLength: {
                    value: 50,
                    message: "Giới hạn chỉ 50 kí tự",
                  },
                })}
                onKeyUp={() => {
                  trigger("phoneNumber");
                }}
              />

              <label htmlFor="phoneNumber">Số điện thoại</label>
            </span>
            {errors.phoneNumber && (
              <small className="cs-text-error">{errors.phoneNumber.message}</small>
            )}

      
          </CCol>


          <CCol xs={12}>
            <Button className="youtube p-0 w-full justify-center">
              <i className="pi pi-check"></i>
              <span className="p-3">Xác nhận</span>
            </Button>
          </CCol>
        </CForm>
      ) : (
        ""
      )}
    </div>
  );
};

export default EditUser;
