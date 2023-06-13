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

const EditUnit = () => {
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

  const [unit, setUnit] = useState(null);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    await axiosClient.get(`${API}/api/units/${getID}`).then(({ data }) => {
      setUnit(data.unit);
      setLoading(false);
    });
  };

  const fetchUnitsAll = async () => {
    await axiosClient.get(`${API}/api/units/`).then(({ data }) => {
      dispatch({ type: "FETCH_UNITS", payload: data });
    });
  };

  const [alreadyExistName, setAlreadyExistName] = useState(null);

  const updateUnit = async (data) => {
    const formData = {
      _method: "PATCH",
      unitId: data.unitId.toUpperCase(),
      name: data.name,
    };

    await axiosClient
      .put(`${API}/api/units/${getID}`, formData)
      .then((response) => {
        if (response.data.status === 201) {
          const alreadyExist = state.productsType.find(
            (unit) => unit.name === data.name
          );

          if (alreadyExist) setAlreadyExistName("Tên danh mục đã tồn tại");
        } else if (response.data.status === 400) {
          const updatedunit = {
            unitId: data.unitId.toUpperCase(),
            name: data.name,
            unit: {
              name: data.name,
            },
          };
          dispatch({ type: "UPDATE_UNIT", payload: updatedunit });

          if (data.unitId !== unit.unitId) {
            fetchUnitsAll();
          }
          navigate("/quantri/donvitinh");
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
      name: "Quản lý đơn vị tính",
      link: "/quantri/donvitinh",
    },
    {
      name: unit ? unit.name : "",
    },
  ];
  return (
    <div className="container">
      <AppBreadcrumb ListBreadcrumb={ListBreadcrumb} />

      {loading && <Loading />}
      {unit ? (
        <CForm onSubmit={handleSubmit(updateUnit)} className="row g-4">
          <CCol md={12}>
            <span className="p-float-label ">
              <InputText
                id="id"
                placeholder="VD: VT"
                defaultValue={unit.unitId}
                className={`w-full ${errors.unitId && "invalid"}`}
                {...register("unitId", {
                  required: "Vui lòng nhập mã loại sản phẩm",
                  maxLength: {
                    value: 20,
                    message: "Giới hạn chỉ 20 kí tự",
                  },
                })}
                onKeyUp={() => {
                  trigger("unitId");
                }}
              />

              <label htmlFor="id">Mã loại sản phẩm</label>
            </span>
            {errors.unitId && (
              <small className="cs-text-error">{errors.unitId.message}</small>
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
                placeholder="VD: Vàng trắng"
                defaultValue={unit.name}
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

export default EditUnit;
