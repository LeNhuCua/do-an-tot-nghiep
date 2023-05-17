import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import axios from "axios";

import Swal from "sweetalert2";
import { CCol, CForm } from "@coreui/react";
import { Editor } from "primereact/editor";
import { InputNumber } from "primereact/inputnumber";
import { classNames } from "primereact/utils";
// import {API} from "../../../API";
import { API } from "../../../API.js";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

import { Button } from "primereact/button";

import { AutoComplete } from "primereact/autocomplete";
import convertNameWithoutAccents from "../../../hook/admin/ConvertNameToAlias.jsx";

import UploadImage from "../../../components/admin/uploadimages/UploadImage.jsx";
import Tippy from "@tippyjs/react";
import { Dialog } from "primereact/dialog";
import { CreateProductType } from "../../../components/admin/productstype/index.js";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../../context/DataContext.jsx";
import UploadImages from "../../../components/admin/uploadimages/UploadImages.jsx";
import { CascadeSelect } from "primereact/cascadeselect";

export default function CreateSlide() {
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

  const { dispatch } = useContext(DataContext);

  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   fetchTypeCategories();
  // }, []);

  const [validationError, setValidationError] = useState([]);

  const CreateProducts = async (data) => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("status", statusSelect ? statusSelect.code : 1);

    setSubmitted(true);
    await axios.post(`${API}/api/slides`, formData).then((response) => {
      if (response.data.status === 400) {
        const resData = response.data.slide;
        const createProducts = {
          slideId: resData.slideId,
          status: statusSelect ? statusSelect.code : 1,
          image: resData.image,
        };

        // Thêm loại sản phẩm mới vào danh sách loại sản phẩm trong context
        dispatch({ type: "ADD_SLIDE", payload: createProducts });
        Swal.fire({
          icon: "success",
          title: "Thêm mới thành công!",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/quantri/slide");

        // reset();
        setImage(null);
        setValidationError([]);
      } else {
        setValidationError(response.data.validation_error);
        Swal.fire({
          icon: "error",
          text: "Vui lòng kiểm tra lại thông tin!",
        });
      }
    });
  };
  const [statusSelect, setStatusSelect] = useState(null);
  const [visible, setVisible] = useState(false);
  const status = [
    { name: "Hiển thị", code: 1 },
    { name: "Ẩn", code: 0 },
  ];

  const [image, setImage] = useState("");

  return (
    <div className="container">
      <CForm
        encType="multipart/form-data"
        onSubmit={handleSubmit(CreateProducts)}
        className="row g-4 relative"
      >
        <CCol xl={4}>
          <Dropdown
            value={statusSelect}
            onChange={(e) => setStatusSelect(e.value)}
            options={status}
            optionLabel="name"
            className="w-full md:w-14rem"
            placeholder="Chọn hiển thị (Mặc định: Hiển thị)"
          />
        </CCol>

        <div>
          <h6>Ảnh bìa</h6>
          <CCol>
            <UploadImage
              submitted={submitted}
              image={image}
              setImage={setImage}
            />
          </CCol>
          {validationError.avatar && (
            <small className="cs-text-error">Vui lòng chọn ảnh</small>
          )}
        </div>

        <CCol xs={12}>
          <Button className="youtube p-0 w-full justify-center">
            <i className="pi pi-check"></i>
            <span className="p-3">Xác nhận</span>
          </Button>
        </CCol>
      </CForm>
      <CreateProductType visible={visible} setVisible={setVisible} />
    </div>
  );
}
