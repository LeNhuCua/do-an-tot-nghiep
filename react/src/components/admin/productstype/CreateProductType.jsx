import { CCol, CForm } from "@coreui/react";
import Tippy from "@tippyjs/react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import React, { useContext, useState } from "react";
import { CategoriesContext } from "../../../CategoriesContext";
import { useForm } from "react-hook-form";
import axios from "axios";
import {API} from "../../../API";
import { Link } from "react-router-dom";


const CreateProductType = ({ visible, setVisible }) => {
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

  const { dispatch } = useContext(CategoriesContext);
  
  const CreateData = async (data) => {
    console.log(data);
    const formData = new FormData();
    if (data.productTypeId !== undefined) {
      formData.append("productTypeId", data.productTypeId.toUpperCase());
      formData.append("name", data.name);
    }
    await axios.post(`${API}/api/productsType`, formData).then((response) => {
      if (response.data.status === 400) {
        const createCategory = {
          ...data,
          productTypeId: data.productTypeId.toUpperCase(),
        };

        // Thêm loại sản phẩm mới vào danh sách loại sản phẩm trong context

        dispatch({ type: "ADD__PRODUCTTYPE", payload: createCategory });

        setValidationError([]);
        setVisible(false);
        reset();
      } else {
        setValidationError(response.data.validation_error);
      }
    });
    // .catch((response) => {
    //   alert("Xin vui long tạo tại");
    // });
  };
  return (
    <>
      <Dialog
        header="Thêm mới loại sản phẩm"
        visible={visible}
        maximizable
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
      >
        <div className="container">
          {/* <div>
            <Link to="/quantri/loaisanpham">fsf</Link>
          </div> */}
          <CForm className="row g-4" onSubmit={handleSubmit(CreateData)}>
            <CCol md={6}>
              <span className="p-float-label ">
                <InputText
                  id="productTypeId"
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
                  type="text"
                  placeholder="Vd: VHONG"
                />
                <label htmlFor="productTypeId">Mã loại sản phẩm</label>
              </span>

              {errors.productTypeId && (
                <small className="cs-text-error">
                  {errors.productTypeId.message}
                </small>
              )}
              {validationError.productTypeId && (
                <small className="cs-text-error">
                  Mã loại sản phẩm đã tồn tại
                </small>
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
                  placeholder="Vd: Vàng hồng"
                />
                <label htmlFor="danhmuc">Tên loại sản phẩm</label>
              </span>

              {errors.name && (
                <small className="cs-text-error">{errors.name.message}</small>
              )}
              {validationError.name && (
                <small className="cs-text-error">
                  Tên loại sản phẩm đã tồn tại
                </small>
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
      </Dialog>
    </>
  );
};

export default CreateProductType;
