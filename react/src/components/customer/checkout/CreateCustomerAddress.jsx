import React, { useContext } from "react";
import Address from "../../../components/customer/checkout/Address";
import { InputText } from "primereact/inputtext";
import { CCol, CForm } from "@coreui/react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import axiosClient from "../../../axios-client-customer";
import { API } from "../../../API";
import { DataContext } from "../../../context/DataContext";

const CreateCustomerAddress = (props) => {
  const { parentProvince, parentDistrict, parentWard,handleDataChange,setLoading,setAddAddress } = props;
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

  function isName(str) {
    // Tách chuỗi theo khoảng trắng và kiểm tra số lượng từ
    const words = str.trim().split(/\s+/);
    if (words.length < 2) return false;

    // Kiểm tra từng từ xem có kí tự đặc biệt hay số không
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ']+$/; // Chuỗi chỉ cho phép kí tự chữ và dấu ngoặc đơn
    for (const word of words) {
      if (!regex.test(word)) {
        return false;
      }
    }
    return true;
  }
  const CreateCustomerAddresses = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("recipientName", data.recipientName);
    formData.append("recipientAddress", data.recipientAddress);
    formData.append("recipientPhone", data.recipientPhone);
    formData.append("provinceId", parentProvince.provinceId);
    formData.append("districtId", parentDistrict.districtId);
    formData.append("wardId", parentWard.wardId);
    await axiosClient
      .post(`${API}/api/customerAddresses`, formData)
      .then((response) => {
        setLoading(false);
        if (response.data.status === 400) {
          const resData = response.data.customerAddress;
          const createCustomerAddresses = {
            addressId: resData.addressId,
            recipientName: resData.recipientName,
            alias: resData.alias,
            recipientAddress: resData.recipientAddress,
            recipientPhone: resData.recipientPhone,
            provinceId: resData.provinceId,
            districtId: resData.districtId,
            wardId: resData.wardId,
            userId: resData.userId,
            ward: {
              wardId: resData.wardId,
              name: parentWard.name,
            },
            district: {
              districtId: resData.districtId,
              name: parentDistrict.name,
            },
            province: {
              provinceId: resData.provinceId,
              name: parentProvince.name,
            },
          };
          dispatch({
            type: "ADD_CUSTOMER_ADDRESS",
            payload: createCustomerAddresses,
          });
          setAddAddress(false);
          Swal.fire({
            icon: "success",
            title: "Thêm mới thành công!",
            showConfirmButton: false,
            timer: 1500,
          });
          // navigate("/quantri/sanpham");
        } else {
          Swal.fire({
            icon: "error",
            text: "Vui lòng kiểm tra lại thông tin!",
          });
        }
      });
  };
  return (
    <CForm className="row g-4" onSubmit={handleSubmit(CreateCustomerAddresses)}>
      <CCol md={6}>
        <span className="p-float-label ">
          <InputText
            id="recipientName"
            className={`w-full ${errors.recipientName && "invalid"}`}
            {...register("recipientName", {
              required: "Vui lòng nhập họ và tên người nhận",
              maxLength: {
                value: 50,
                message: "Giới hạn chỉ 50 kí tự",
              },
              validate: (value) =>
                isName(value) || "Vui lòng nhập họ tên hợp lệ",
            })}
            onKeyUp={() => {
              trigger("recipientName");
            }}
            type="text"
            placeholder="Vd: Nguyễn Văn An"
          />
          <label htmlFor="recipientName">Họ và tên</label>
        </span>

        {errors.recipientName && (
          <small className="cs-text-error">
            {errors.recipientName.message}
          </small>
        )}
        {/* {validationError.productTypeId && (
        <small className="cs-text-error">
          Mã loại sản phẩm đã tồn tại
        </small>
      )} */}
      </CCol>

      <CCol md={6}>
        <span className="p-float-label ">
          <InputText
            keyfilter="int"
            id="recipientPhone"
            className={`w-full ${errors.recipientPhone && "invalid"}`}
            {...register("recipientPhone", {
              required: "Vui lòng nhập số điện thoại",
              maxLength: {
                value: 10,
                message: "Giới hạn chỉ 10 kí tự",
              },
            })}
            onKeyUp={() => {
              trigger("recipientPhone");
            }}
            type="text"
            placeholder="Vd: 0989865678"
          />
          <label htmlFor="recipientPhone">Số điện thoại</label>
        </span>

        {errors.recipientPhone && (
          <small className="cs-text-error">
            {errors.recipientPhone.message}
          </small>
        )}
        {/* {validationError.name && (
        <small className="cs-text-error">
          Tên loại sản phẩm đã tồn tại
        </small>
      )} */}
      </CCol>
      <CCol md={12}>
        <Address onDataChange={handleDataChange} />
      </CCol>
      <CCol md={12}>
        <span className="p-float-label ">
          <InputTextarea
            id="recipientAddress"
            className={`w-full ${errors.recipientAddress && "invalid"}`}
            {...register("recipientAddress", {
              required: "Vui lòng nhập địa chỉ nhận hàng",
              maxLength: {
                value: 100,
                message: "Giới hạn chỉ 100 kí tự",
              },
            })}
            onKeyUp={() => {
              trigger("recipientAddress");
            }}
            type="text"
            placeholder="Vd: Thôn Vĩnh Phước, Xã Ninh Phụng, Ninh Hoà, Khánh Hoà"
          />
          <label htmlFor="recipientAddress">Địa chỉ</label>
        </span>

        {errors.recipientAddress && (
          <small className="cs-text-error">
            {errors.recipientAddress.message}
          </small>
        )}
        {/* {validationError.name && (
        <small className="cs-text-error">
          Tên loại sản phẩm đã tồn tại
        </small>
      )} */}
      </CCol>
      <CCol xs={12}>
        <Button className="youtube p-0 w-full justify-center">
          <i className="pi pi-check"></i>
          <span className="p-3">Xác nhận</span>
        </Button>
      </CCol>
    </CForm>
  );
};

export default CreateCustomerAddress;
