import {
  CButton,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormSelect,
} from "@coreui/react";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useStateContext } from "../../../context/ContextProvider";
import { RadioButton } from "primereact/radiobutton";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { API_IMAGES } from "../../../API";
import avatar from "../../../assets/images/avatars/avatar.png";
import axiosClient from "../../../axios-client-customer";

const EditProfile = () => {
  const { user, setUser } = useStateContext();

  useEffect(() => {
    if (user.length === 0) {
      fetchUserLogin();
    }
  }, [user]);

  const fetchUserLogin = async () => {
    axiosClient.get("/user").then((res) => {
      setUser(res.data.user);
    });
  };
  const today = new Date();

  const [date, setDate] = useState(null);
  const [imageCurrent, setImageCurrent] = useState(null);
  const [ingredient, setIngredient] = useState(null);

  useEffect(() => {
    if (user) {
      setImageCurrent(user.avatar);
      setIngredient(user.gender);
      setDate(user.birthday);
    }
  }, [user]);

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

  const [activeAvatar, setActiveAvatar] = useState(false);
  const [image, setImage] = useState([]);
  const [validationError, setValidationError] = useState([]);
  const changeHandler = (event) => {
    if (event.target.files[0]) {
      setImage(event.target.files[0]);
      setImageCurrent(URL.createObjectURL(event.target.files[0]));
      setActiveAvatar(true);
    } else {
      setActiveAvatar(true);
    }
  };
  return (
    <div className="cs-container">
      <div className="my-4">
        <CForm className="row g-3">
          <CCol md={6}>
            <span className="p-float-label ">
              <InputText
                id="name"
                defaultValue={user ? user.fullName : null}
                className={`w-full ${errors.name && "invalid"}`}
                {...register("name", {
                  required: "Vui lòng nhập họ và tên",
                })}
                onKeyUp={() => {
                  trigger("name");
                }}
                type="text"
                placeholder="Vd: Nguyễn Văn An"
              />
              <label htmlFor="name">Họ và tên</label>
            </span>

            {errors.name && (
              <small className="cs-text-error">{errors.name.message}</small>
            )}
          </CCol>
          <CCol md={6}>
            <span className="p-float-label ">
              <InputText
                keyfilter="int"
                id="phone"
                defaultValue={user && user.phoneNumber ? user.phoneNumber : ""}
                className={`w-full ${errors.phone && "invalid"}`}
                {...register("phone", {
                  required: "Vui lòng nhập họ và tên",
                })}
                onKeyUp={() => {
                  trigger("phone");
                }}
                type="text"
                placeholder="Vd: 0567894234"
              />
              <label htmlFor="phone">Số điện thoại</label>
            </span>

            {errors.phone && (
              <small className="cs-text-error">{errors.phone.message}</small>
            )}
          </CCol>
          <CCol xs={3}>
            <div className="flex flex-wrap gap-3">
              <span>Giới tính</span>
              <div className="flex align-items-center">
                <RadioButton
                  inputId="ingredient1"
                  name="pizza"
                  value={1}
                  onChange={(e) => setIngredient(e.value)}
                  checked={ingredient === 1}
                />
                <label htmlFor="ingredient1" className="ml-2">
                  Nam
                </label>
              </div>
              <div className="flex align-items-center">
                <RadioButton
                  inputId="ingredient2"
                  name="pizza"
                  value={0}
                  onChange={(e) => setIngredient(e.value)}
                  checked={ingredient === 0}
                />
                <label htmlFor="ingredient2" className="ml-2">
                  Nữ
                </label>
              </div>
            </div>
          </CCol>
          <CCol xs={3}>
            <Calendar
              className="w-full"
              value={date}
              onChange={(e) => setDate(e.value)}
              showButtonBar
              maxDate={today}
              showIcon
            />
          </CCol>
          <CCol md={6}>
            <div>
              <h6>Ảnh bìa</h6>
              {/* <Button
              outlined
              type="button"
              label="Chọn ảnh"
              icon="pi pi-upload"
              onClick={() => document.getElementById("fileInput").click()}
            /> */}
              <input
                type="file"
                accept="image/*"
                onChange={changeHandler}
                id="fileInput"
                style={{ display: "none" }}
              />

              {image && activeAvatar ? (
                <div
                  className="grid grid-cols-1 xl:grid-cols-2 gap-3 mt-4"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <div className="flex justify-between items-center border p-3 rounded-md">
                    <img
                      className="w-28"
                      key={image.name}
                      src={URL.createObjectURL(image)}
                      alt={image.name}
                    />
                  </div>
                </div>
              ) : imageCurrent ? (
                <div
                  className="grid grid-cols-1 xl:grid-cols-2 gap-3 mt-4"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <div className="flex justify-between items-center border p-3 rounded-md">
                    <img
                      className="w-28"
                      src={`${API_IMAGES}/${imageCurrent}`}
                    />
                  </div>
                </div>
              ) : (
                <div
                  className="grid grid-cols-1 xl:grid-cols-2 gap-3 mt-4"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <div className="flex justify-between items-center border p-3 rounded-md">
                    <img className="w-28" src={`${avatar}`} />

                    {/* <h6>{imageCurrent}</h6> */}
                  </div>
                </div>
              )}

              {validationError.avatar && (
                <small className="cs-text-error">Vui lòng chọn ảnh</small>
              )}
            </div>
          </CCol>
          <CCol xs={12}>
            <Button className="youtube p-0 w-full justify-center">
              <i className="pi pi-check"></i>
              <span className="p-3">Xác nhận</span>
            </Button>
          </CCol>
        </CForm>
      </div>
    </div>
  );
};

export default EditProfile;
