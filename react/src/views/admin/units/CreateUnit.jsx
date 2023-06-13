import React, { useContext, useRef, useState } from "react";
import { useForm } from "react-hook-form";



import Swal from "sweetalert2";
import { CCol, CForm } from "@coreui/react";

import { API } from "../../../API.js";

import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

import { Button } from "primereact/button";
import convertNameWithoutAccents from "../../../hook/admin/ConvertNameToAlias.jsx";
import { DataContext } from "../../../context/DataContext.jsx";

import { Toast } from "primereact/toast";
import axiosClient from "../../../axios-client.js";
import AppBreadcrumb from "../../../layout/admin/AppBreadcrumb.jsx";

export default function CreateUnit() {
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
  const toast = useRef(null);

  const [validationError, setValidationError] = useState([]);
  const { dispatch } = useContext(DataContext);

  const CreateProductType = async (data) => {
    const formData = new FormData();

    if (data.unitId !== undefined) {
      formData.append("unitId", data.unitId.toUpperCase());
      formData.append("name", data.name);
    }
    await axiosClient.post(`${API}/api/units`, formData).then((response) => {
      if (response.data.status === 400) {
        const createType = {
          ...data,
          unitId: data.unitId.toUpperCase(),
        };

        // Thêm loại sản phẩm mới vào danh sách loại sản phẩm trong context

        dispatch({ type: "ADD__UNIT", payload: createType });
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
    // .catch((response) => {
    //   alert("Xin vui long tạo tại");
    // });
  };
  const [statusSelect, setStatusSelect] = useState(null);
  const status = [
    { name: "Hiển thị", code: 1 },
    { name: "Ẩn", code: 0 },
  ];
  const regexPattern =
    /^[^\s\u0103\u0105\u1EA1\u1EAD\u00E2\u00E0\u00E1\u1EA3\u1EA7\u1EA5\u1EAB\u1EA9\u0103\u0105\u1EA3\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u00E2\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u00E0\u00E1\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u00EA\u00E8\u00E9\u1EC1\u1EBF\u1EC5\u1EC3\u1EC7\u00EA\u1EC1\u1EBF\u1EC3\u1EC5\u1EC7\u00E8\u00E9\u1EC1\u1EBF\u1EC3\u1EC5\u1EC7]+$/;
  
    const ListBreadcrumb = [
      {
        name: "Quản lý đơn vị tính",
        link: "/quantri/donvitinh",
      },
      {
        name: "Thêm đơn vị tính",
      },
    ];
  
    return (
    <div className="container">
      <Toast ref={toast} />
      <AppBreadcrumb ListBreadcrumb={ListBreadcrumb} />
      <CForm onSubmit={handleSubmit(CreateProductType)} className="row g-4">
        <CCol md={6}>
          <span className="p-float-label ">
            <InputText
              id="unitId"
              className={`w-full ${errors.unitId && "invalid"}`}
              {...register("unitId", {
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
                trigger("unitId");
              }}
              type="text"
              placeholder="Vd: VY"
            />
            <label htmlFor="unitId">Mã loại sản phẩm</label>
          </span>

          {errors.unitId && (
            <small className="cs-text-error">{errors.unitId.message}</small>
          )}
          {validationError.unitId && (
            <small className="cs-text-error">Mã loại sản phẩm đã tồn tại</small>
          )}
        </CCol>

        <CCol md={6}>
          <span className="p-float-label ">
            <InputText
              id="danhmuc"
              className={`w-full ${errors.name && "invalid"}`}
              {...register("name", {
                required: "Vui lòng nhập tên loại sản phẩm",
                maxLength: {
                  value: 50,
                  message: "Giới hạn chỉ 50 kí tự",
                },
              })}
              onKeyUp={() => {
                trigger("name");
              }}
              type="text"
              placeholder="Vd: Vàng ý"
            />
            <label htmlFor="danhmuc">Tên danh mục</label>
          </span>

          {errors.name && (
            <small className="cs-text-error">{errors.name.message}</small>
          )}
          {validationError.name && (
            <small className="cs-text-error">Tên danh mục đã tồn tại</small>
          )}
        </CCol>

        <CCol xs={12}>
          <Button className="youtube p-0 w-full justify-center">
            <i className="pi pi-check"></i>
            <span className="p-3">Xác nhận</span>
          </Button>
        </CCol>
      </CForm>
    </div>
  );
}
