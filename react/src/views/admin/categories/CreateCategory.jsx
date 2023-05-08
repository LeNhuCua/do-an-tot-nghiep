import React, { useContext, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import axios from "axios";

import Swal from "sweetalert2";
import { CCol, CForm } from "@coreui/react";

import { API } from "../../../API.js";

import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

import { Button } from "primereact/button";
import convertNameWithoutAccents from "../../../hook/admin/ConvertNameToAlias";
import { DataContext } from "../../../context/DataContext";

import { Toast } from "primereact/toast";

export default function CreateCategory() {
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
  const regexPattern =
    /^[^\s\u0103\u0105\u1EA1\u1EAD\u00E2\u00E0\u00E1\u1EA3\u1EA7\u1EA5\u1EAB\u1EA9\u0103\u0105\u1EA3\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u00E2\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u00E0\u00E1\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u00EA\u00E8\u00E9\u1EC1\u1EBF\u1EC5\u1EC3\u1EC7\u00EA\u1EC1\u1EBF\u1EC3\u1EC5\u1EC7\u00E8\u00E9\u1EC1\u1EBF\u1EC3\u1EC5\u1EC7]+$/;
  const [validationError, setValidationError] = useState([]);
  const { dispatch } = useContext(DataContext);

  const CreateData = async (data) => {
    const formData = new FormData();

    if (data.categoryId !== undefined) {
      formData.append("categoryId", data.categoryId.toUpperCase());
      formData.append("name", data.name);
      formData.append("alias", convertNameWithoutAccents(data.name));
      formData.append("status", statusSelect ? statusSelect.code : 1);
    }
    await axios.post(`${API}/api/categories`, formData).then((response) => {
      if (response.data.status === 400) {
        const createCategory = {
          categoryId: data.categoryId.toUpperCase(),
          name: data.name,
          alias: convertNameWithoutAccents(data.name),
          status: statusSelect ? statusSelect.code : 1,
        };

        // Thêm loại sản phẩm mới vào danh sách loại sản phẩm trong context

        dispatch({ type: "ADD_CATEGORY", payload: createCategory });
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

  return (
    <div className="container">
      <Toast ref={toast} />

      <CForm onSubmit={handleSubmit(CreateData)} className="row g-4">
        <CCol xl={6}>
          <span className="p-float-label ">
            <InputText
              id="categoryId"
              className={`w-full ${errors.categoryId && "invalid"}`}
              {...register("categoryId", {
                required: "Vui lòng nhập mã sản phẩm",
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
              type="text"
              placeholder="Vd: VTN"
            />
            <label htmlFor="categoryId">Mã danh mục</label>
          </span>

          {errors.categoryId && (
            <small className="cs-text-error">{errors.categoryId.message}</small>
          )}
          {validationError.categoryId && (
            <small className="cs-text-error">Mã danh mục đã tồn tại</small>
          )}
        </CCol>

        {/* <CCol md={6}>
          <span className="p-float-label ">
            <InputText
              id="categoryId"
              className={`w-full ${errors.categoryId && "invalid"}`}
              {...register("categoryId", {
                required: "Vui lòng nhập mã danh mục",
                maxLength: {
                  value: 20,
                  message: "Giới hạn chỉ 20 kí tự",
                },
              })}
              onKeyUp={() => {
                trigger("categoryId");
              }}
              type="text"
              placeholder="Vd: TSN"
            />
            <label htmlFor="categoryId">Mã danh mục</label>
          </span>

          {errors.categoryId && (
            <small className="cs-text-error">{errors.categoryId.message}</small>
          )}
          {validationError.categoryId && (
            <small className="cs-text-error">Mã danh mục đã tồn tại</small>
          )}
        </CCol> */}

        <CCol md={6}>
          <span className="p-float-label ">
            <InputText
              id="danhmuc"
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
              type="text"
              placeholder="Vd: Trang sức nữ"
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

        <CCol md={4}>
          <Dropdown
            value={statusSelect}
            onChange={(e) => setStatusSelect(e.value)}
            options={status}
            optionLabel="name"
            className="w-full md:w-14rem"
            placeholder="Chọn hiển thị (Mặc định: Hiển thị)"
          />
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
