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

const EditProductType = () => {
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

  const [productType, setProductType] = useState(null);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    await axios.get(`${API}/api/productsType/${getID}`).then(({ data }) => {
      setProductType(data.productType);
      setLoading(false);
    });
  };

  const fetchProductsTypeAll = async () => {
    await axios.get(`${API}/api/productsType/`).then(({ data }) => {
      dispatch({ type: "FETCH_PRODUCTSTYPE", payload: data });
    });
  };

  const [alreadyExistName, setAlreadyExistName] = useState(null);

  const updateProductType = async (data) => {
    const formData = {
      _method: "PATCH",
      productTypeId: data.productTypeId.toUpperCase(),
      name: data.name,
    };

    await axios
      .put(`${API}/api/productsType/${getID}`, formData)
      .then((response) => {
        if (response.data.status === 201) {
          const alreadyExist = state.productsType.find(
            (productType) => productType.name === data.name
          );

          if (alreadyExist) setAlreadyExistName("Tên danh mục đã tồn tại");
        } else if (response.data.status === 400) {
          const updatedproductType = {
            productTypeId: data.productTypeId.toUpperCase(),
            name: data.name,
            product_type: {
              name: data.name,
            },
          };
          dispatch({ type: "UPDATE_PRODUCTTYPE", payload: updatedproductType });

          if (data.productTypeId !== productType.productTypeId) {
            fetchProductsTypeAll();
          }
          navigate("/quantri/loaisanpham");
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
        //   (productType) => productType.name === productType.name
        // );
        // if (alreadyExist) setAlreadyExistName("Tên danh mục đã tồn tại");
      });
  };

  return (
    <div className="container">
      {loading && <Loading />}
      {productType ? (
        <CForm onSubmit={handleSubmit(updateProductType)} className="row g-4">
          <CCol md={12}>
            <span className="p-float-label ">
              <InputText
                id="id"
                placeholder="VD: VT"
                defaultValue={productType.productTypeId}
                className={`w-full ${errors.productTypeId && "invalid"}`}
                {...register("productTypeId", {
                  required: "Vui lòng nhập mã loại sản phẩm",
                  maxLength: {
                    value: 20,
                    message: "Giới hạn chỉ 20 kí tự",
                  },
                })}
                onKeyUp={() => {
                  trigger("productTypeId");
                }}
              />

              <label htmlFor="id">Mã loại sản phẩm</label>
            </span>
            {errors.productTypeId && (
              <small className="cs-text-error">
                {errors.productTypeId.message}
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
                placeholder="VD: Vàng trắng"
                defaultValue={productType.name}
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

export default EditProductType;
