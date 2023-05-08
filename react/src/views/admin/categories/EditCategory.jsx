import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import axios from "axios";

import { CCol, CForm } from "@coreui/react";
import Swal from "sweetalert2";
import { ToggleButton } from "primereact/togglebutton";

import { API } from "../../../API.js";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataContext } from "../../../context/DataContext";
import convertNameWithoutAccents from "../../../hook/admin/ConvertNameToAlias";
import Loading from "../../../components/Loading";
import { Toast } from "primereact/toast";

import { useNavigate } from "react-router-dom";

const EditCategory = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    setValue,
    form,
    control,
  } = useForm({
    mode: "onChange",
  });
  const navigate = useNavigate();
  const toast = useRef(null);
  const [loading, setLoading] = useState(true);
  const { state, dispatch } = useContext(DataContext);

  const getID = useParams().id;

  const [category, setCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    await axios.get(`${API}/api/categories/${getID}`).then(({ data }) => {
      setCategory(data.category);
      setLoading(false);
    });
  };

  const fetchCategoriesAll = async () => {
    await axios.get(`${API}/api/categories/`).then(({ data }) => {
      dispatch({ type: "FETCH_CATEGORIES", payload: data });
    });
  };

  const [alreadyExistName, setAlreadyExistName] = useState(null);

  const updateCategory = async (data) => {
    const formData = {
      _method: "PATCH",
      categoryId: data.categoryId.toUpperCase(),
      name: data.name,
      alias: convertNameWithoutAccents(data.name),
      status: checked ? 1 : 0,
    };

    await axios
      .put(`${API}/api/categories/${getID}`, formData)
      .then((response) => {
        if (response.data.status === 201) {
          const alreadyExist = state.categories.find(
            (category) => category.name === data.name
          );
          console.log(category);
          if (alreadyExist) setAlreadyExistName("Tên danh mục đã tồn tại");
        } else if (response.data.status === 400) {
          const updatedCategory = {
            categoryId: data.categoryId.toUpperCase(),
            name: data.name,
            alias: convertNameWithoutAccents(data.name),
            status: checked ? 1 : 0,
            category: {
              name: data.name,
            },
          };
          dispatch({ type: "UPDATE_CATEGORY", payload: updatedCategory });

          if (data.categoryId !== category.categoryId) {
            fetchCategoriesAll();
          }
          navigate("/quantri/danhmuc");
          Swal.fire({
            icon: "success",
            title: "Thông tin đã được cập nhật",
            showConfirmButton: false,
            timer: 1500,
          });
          setAlreadyExistName("");
        } else {
          Swal.fire({
            icon: "error",
            text: "Kiểm tra lại thông tin",
          });
        }
      })
      .catch(() => {
        // const alreadyExist = state.categories.find(
        //   (category) => category.name === category.name
        // );
        // if (alreadyExist) setAlreadyExistName("Tên danh mục đã tồn tại");
      });
  };
  const regexPattern =
    /^[^\s\u0103\u0105\u1EA1\u1EAD\u00E2\u00E0\u00E1\u1EA3\u1EA7\u1EA5\u1EAB\u1EA9\u0103\u0105\u1EA3\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u00E2\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u00E0\u00E1\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u00EA\u00E8\u00E9\u1EC1\u1EBF\u1EC5\u1EC3\u1EC7\u00EA\u1EC1\u1EBF\u1EC3\u1EC5\u1EC7\u00E8\u00E9\u1EC1\u1EBF\u1EC3\u1EC5\u1EC7]+$/;
  let currentStatus = null;
  if (category) {
    currentStatus = category.status && category.status === 1 ? true : false;
  }
  const [checked, setChecked] = useState(null);
  useEffect(() => {
    setChecked(currentStatus);
  }, [currentStatus]);

  return (
    <div className="container">
      {loading && <Loading />}
      {category ? (
        <CForm onSubmit={handleSubmit(updateCategory)} className="row g-4">
          <div className=" flex justify-content-end">
            <ToggleButton
              onLabel="Hiển thị"
              offLabel="Đang ẩn"
              onIcon="pi pi-check"
              offIcon="pi pi-times"
              checked={checked}
              className={checked ? "bg-success" : "bg-danger"}
              onChange={(e) => {
                setChecked(e.value);
              }}
            />
          </div>

          <CCol md={12}>
            <span className="p-float-label ">
              <InputText
                id="id"
                // value={name}
                defaultValue={category.categoryId}
                className={`w-full ${errors.categoryId && "invalid"}`}
                {...register("categoryId", {
                  required: "Vui lòng nhập mã danh mục",
                  maxLength: {
                    value: 20,
                    message: "Giới hạn chỉ 20 kí tự",
                  },
                  pattern: {
                    value: regexPattern,
                    message:
                      "Vui lòng không nhập kí tự khoảng trắng hoặc kí tự có dấu",
                  },
                })}
                onKeyUp={() => {
                  trigger("categoryId");
                }}
              />

              <label htmlFor="id">Mã danh mục</label>
            </span>
            {errors.categoryId && (
              <small className="cs-text-error">
                {errors.categoryId.message}
              </small>
            )}

            {/* {alreadyExistName ? (
              <small className="cs-text-error">{alreadyExistName}</small>
            ) : (
              ""
            )} */}
          </CCol>

          <CCol md={12}>
            <span className="p-float-label ">
              <InputText
                id="name"
                // value={name}
                defaultValue={category.name}
                className={`w-full ${errors.name && "invalid"}`}
                {...register("name", {
                  required: "Vui lòng nhập tên danh mục",
                  maxLength: {
                    value: 50,
                    message: "Giới hạn chỉ 50 kí tự",
                  },
                })}
                onKeyUp={() => {
                  trigger("name");
                }}
              />

              <label htmlFor="name">Tên danh mục</label>
            </span>
            {errors.name && (
              <small className="cs-text-error">{errors.name.message}</small>
            )}

            {alreadyExistName ? (
              <small className="cs-text-error">{alreadyExistName}</small>
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
        </CForm>
      ) : (
        ""
      )}
    </div>
  );
};

export default EditCategory;
