import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { CCol, CForm } from "@coreui/react";
import Swal from "sweetalert2";
import { ToggleButton } from "primereact/togglebutton";

import { API } from "../../../API.js";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataContext } from "../../../context/DataContext.jsx";
import convertNameWithoutAccents from "../../../hook/admin/ConvertNameToAlias.jsx";
import Loading from "../../../components/Loading.jsx";
import { Toast } from "primereact/toast";

import { useNavigate } from "react-router-dom";
import axiosClient from "../../../axios-client.js";
import AppBreadcrumb from "../../../layout/admin/AppBreadcrumb.jsx";

const EditSize = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm({
    mode: "onChange",
  });
  const navigate = useNavigate();
  const toast = useRef(null);
  const [loading, setLoading] = useState(true);
  const { state, dispatch } = useContext(DataContext);

  const getID = useParams().id;

  const [size, setSize] = useState(null);

  useEffect(() => {
    fetchSizes();
  }, []);

  const fetchSizes = async () => {
    await axiosClient.get(`${API}/api/sizes/${getID}`).then(({ data }) => {
      setSize(data.size);
      setLoading(false);
    });
  };

  const fetchSizesAll = async () => {
    await axiosClient.get(`${API}/api/sizes/`).then(({ data }) => {
      dispatch({ type: "FETCH_SIZES", payload: data });
    });
  };

  const [alreadyExistName, setAlreadyExistName] = useState(null);

  const updateSize = async (data) => {
    const formData = {
      _method: "PATCH",
      name: data.name,
    };

    await axiosClient
      .put(`${API}/api/sizes/${getID}`, formData)
      .then((response) => {
        if (response.data.status === 201) {
          Swal.fire({
            icon: "error",
            title: "Giá trị kích thước đã tồn tại",
            showConfirmButton: false,
            timer: 1500,
          });
        } else if (response.data.status === 400) {
          fetchSizesAll();
          navigate("/quantri/kichthuoc");
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
        //   (unit) => unit.name === unit.name
        // );
        // if (alreadyExist) setAlreadyExistName("Tên danh mục đã tồn tại");
      });
  };
  const ListBreadcrumb = [
    {
      name: "Quản lý kích thước",
      link: "/quantri/kichthuoc",
    },
    {
      name: size ? size.sizeValue : "",
    },
  ];
  return (
    <div className="container">
      <AppBreadcrumb ListBreadcrumb={ListBreadcrumb} />
      {loading && <Loading />}
      {size ? (
        <CForm onSubmit={handleSubmit(updateSize)} className="row g-4">
          <CCol md={12}>
            <span className="p-float-label ">
              <InputText
                id="name"
                placeholder="VD: Vàng trắng"
                defaultValue={size.sizeValue}
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

              <label htmlFor="name">Giá trị kích thước</label>
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

export default EditSize;
