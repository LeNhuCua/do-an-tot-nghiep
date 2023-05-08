import React, { useState } from "react";
import { useForm } from "react-hook-form";

import axios from "axios";

import Swal from "sweetalert2";
import { CCol, CForm } from "@coreui/react";

import {API} from "../../../API";

import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

import { Button } from "primereact/button";

export default function CreateUser() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm({
    mode: "onChange",
  });

  const [validationError, setValidationError] = useState([]);

  const CreateCategory = async (data) => {

    
    const formData = new FormData();
    formData.append("alias", data.alias);
    formData.append("name", data.name);
    formData.append("status", statusSelect ? statusSelect.code : 1);
    await axios
      .post(`${API}/api/categories`, formData)
      .then((response) => {
        if (response.data.status === 400) {
          Swal.fire({
            icon: "success",
            text: "Thêm mới thành công",
          });
          reset();
        } else {
          setValidationError(response.data.validation_error);
          Swal.fire({
            icon: "error",
            text: validationError.alias,
          });
        }
      })
      .catch((response) => {
        alert(response.data.status);
      });
  };
  const [statusSelect, setStatusSelect] = useState(null);
  const status = [
    { name: "Hiển thị", code: 1 },
    { name: "Ẩn", code: 0 },
  ];
  return (
    <div className="container">
      <CForm onSubmit={handleSubmit(CreateCategory)} className="row g-4">
        <CCol md={12}>
          <span className="p-float-label ">
            <InputText
              id="danhmuc"
              className={`w-full ${errors.name && "invalid"}`}
              {...register("name", { required: "Vui lòng nhập tên danh mục" })}
              onKeyUp={() => {
                trigger("name");
              }}
              type="text"
              placeholder="Vd: Giày Nam"
            />
            <label htmlFor="danhmuc">Tên danh mục</label>
          </span>

          {errors.name && (
            <small className="cs-text-error">{errors.name.message}</small>
          )}
        </CCol>

        <CCol md={8}>

          <span className="p-float-label block">
            <InputText
              id="alias"
              className={`w-full ${errors.alias && "invalid"}`}
              {...register("alias", { required: "Vui lòng nhập bí danh" })}
              onKeyUp={() => {
                trigger("alias");
              }}
              label="Bí danh"
              placeholder="Vd: giay-nam"
            />
            <label htmlFor="alias">Bí danh</label>
          </span>
          {errors.alias && (
          <small className="cs-text-error">
            {errors.alias.message}
          </small>
        )}
        </CCol>
  
        <CCol md={4}>
          <Dropdown
            value={statusSelect}
            onChange={(e) => setStatusSelect(e.value)}
            options={status}
            optionLabel="name"
            className="w-full md:w-14rem"
            placeholder="Chọn hiển thị"
          />
        </CCol>
        <CCol xs={12}>
          <Button
            label="Xác nhận"
            icon="pi pi-check"
          />

        </CCol>
      </CForm>
    </div>
  );
}
