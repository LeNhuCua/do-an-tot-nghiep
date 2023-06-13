import React, { useContext, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../../../axios-client.js";

import Swal from "sweetalert2";
import { CCol, CForm } from "@coreui/react";

import { API } from "../../../API.js";

import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

import { Button } from "primereact/button";
import convertNameWithoutAccents from "../../../hook/admin/ConvertNameToAlias.jsx";
import { DataContext } from "../../../context/DataContext.jsx";

import { Toast } from "primereact/toast";

export default function CreateSize() {
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
    formData.append("sizeValue", data.sizeValue);
    await axiosClient.post(`${API}/api/sizes`, formData).then((response) => {
      if (response.data.status === 400) {
        const createType = {
          ...data,
        };

        // Thêm loại sản phẩm mới vào danh sách loại sản phẩm trong context

        dispatch({ type: "ADD_SIZE", payload: createType });
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


  return (
    <div className="container">
      <Toast ref={toast} />

      <CForm onSubmit={handleSubmit(CreateProductType)} className="row g-4">
     

        <CCol md={6}>
          <span className="p-float-label ">
            <InputText
              id="sizeValue"
              className={`w-full ${errors.sizeValue && "invalid"}`}
              {...register("sizeValue", {
                required: "Vui lòng nhập giá trị kích thước",
                maxLength: {
                  value: 50,
                  message: "Giới hạn chỉ 50 kí tự",
                },
              })}
              onKeyUp={() => {
                trigger("sizeValue");
              }}
              type="text"
              placeholder="Vd: 12"
            />
            <label htmlFor="sizeValue">Giá trị kích thước</label>
          </span>

          {errors.sizeValue && (
            <small className="cs-text-error">{errors.sizeValue.message}</small>
          )}
          {validationError.sizeValue && (
            <small className="cs-text-error">Giá trị kích thước đã tồn tại</small>
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
