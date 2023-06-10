import React, { useEffect, useState } from "react";

import { BiMap } from "react-icons/bi";
import { Link, useActionData } from "react-router-dom";

import { useStateContext } from "../../../context/ContextProvider";
import { AiFillEdit, AiOutlineMail } from "react-icons/ai";
import { API, API_IMAGES } from "../../../API";
import avatar from "../../../assets/images/avatar.png";
import axiosClient from "../../../axios-client-customer";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import Swal from "sweetalert2";
const Profile = () => {
  const { user, setUser } = useStateContext();

  useEffect(() => {
    if (user.length === 0) {
      fetchUserLogin();
    }
  }, []);

  const fetchUserLogin = async () => {
    axiosClient.get("/user").then((res) => {
      setUser(res.data.user);
    });
  };
  const [userInput, setUserInput] = useState(user ? user.fullName : "");
  const [userEmail, setUserEmail] = useState(user ? user.email : "");
  const [userPhone, setUserPhone] = useState(user ? user.phoneNumber : "");
  const [userBirthDay, setUserBirthDay] = useState(user ? user.birthday : "");
  const [ingredient, setIngredient] = useState(user ? user.gender : "");

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingEmail, setEditingEmail] = useState(false);
  const [isEditingPhone, setEditingPhone] = useState(false);
  const [isEditingBirthDay, setEditingBirthDay] = useState(false);
  // useEffect(() => {
  //   if (user) {
  //     setIngredient(user.gender);
  //   }
  // }, [user]);
  const handleInputClick = () => {
    setIsEditing(true);
  };
  const handleInputEmailClick = () => {
    setEditingEmail(true);
  };
  const handleInputPhoneClick = () => {
    setEditingPhone(true);
  };
  const handleInputBirthDayClick = () => {
    setEditingBirthDay(true);
  };
  const [imageCurrent, setImageCurrent] = useState(user ? user.avatar : "");

  const [activeAvatar, setActiveAvatar] = useState(false);
  const [image, setImage] = useState([]);
  const changeHandler = (event) => {
    if (event.target.files[0]) {
      setImage(event.target.files[0]);
      setImageCurrent(URL.createObjectURL(event.target.files[0]));
      setActiveAvatar(true);
    } else {
      setActiveAvatar(true);
    }
  };

  const editUserInfo = async () => {
    const formData = new FormData();
    formData.append("fullName", userInput);
    formData.append("email", userEmail);
    formData.append("birthday", userBirthDay);
    formData.append("phoneNumber", userPhone);
    formData.append("gender", ingredient);
    formData.append("avatar", image);

    await axiosClient
      .post(`${API}/api/edit-user`, formData)
      .then((response) => {
        if (response.data.status === 400) {
          Swal.fire({
            icon: "success",
            title: "Cập nhật thông tin thành công!",
            showConfirmButton: false,
            timer: 1500,
          });
          fetchUserLogin();
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
    <div className="bg-gradient-to-r from-cyan-500 to-blue-500  xl:p-9">
      <div className="p-8 bg-white shadow mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative">
            <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
              <input
                type="file"
                accept="image/*"
                onChange={changeHandler}
                id="fileInput"
                style={{ display: "none" }}
              />
              {image && activeAvatar ? (
                <div
                  className=""
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <div className="flex justify-between items-center  p-3 rounded-md">
                    <img
                      className="h-full w-full rounded-full object-cover"
                      key={image.name}
                      src={URL.createObjectURL(image)}
                      alt={image.name}
                    />
                  </div>
                </div>
              ) : imageCurrent ? (
                <div
                  className=""
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <div className="flex justify-between items-center  p-3 rounded-md">
                    <img
                      className="h-full w-full rounded-full object-cover"
                      src={`${API_IMAGES}/${imageCurrent}`}
                      alt="ảnh bìa"
                    />
                  </div>
                </div>
              ) : (
                <div
                  className=""
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <div className="flex justify-between items-center  p-3 rounded-md">
                    <img
                      className="h-full w-full rounded-full object-cover"
                      src={`${avatar}`}
                      alt="ảnh bìa"
                    />

                    {/* <h6>{imageCurrent}</h6> */}
                  </div>
                </div>
              )}

              {/* {user && user.avatar ? (
                <img
                  className="h-full w-full rounded-full object-cover"
                  src={`${API_IMAGES}/${user.avatar}`}
                  alt=""
                  srcSet=""
                />
              ) : (
                <img
                  className="h-full w-full rounded-full object-cover"
                  src={`${avatar}`}
                  alt=""
                  srcSet=""
                />
              )} */}
            </div>
          </div>

          <div className="space-x-8 flex justify-center mt-32 md:mt-0 ">
            <button
              className="text-white py-2 px-4 uppercase no-underline rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
              onClick={editUserInfo}
            >
               <AiFillEdit className="inline" /> Cập nhật  thông tin
            </button>

            {/* <Link
              to="/thongtincanhan/chinhsua"
              className="text-white py-2 px-4 uppercase no-underline rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
            >
              <AiFillEdit className="inline" /> Chỉnh sửa thông tin
            </Link> */}
          </div>
        </div>

        <div className="mt-20 text-center border-b pb-12">
          <div>
            {isEditing ? (
              <InputText
                onBlur={() => setIsEditing(false)}
                defaultValue={user ? user.fullName : ""}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
            ) : (
              // <input
              //   type="text"
              //   value={userInput}
              //   onChange={handleInputNameChange}
              //   onBlur={handleInputBlur}
              // />
              <h1
                className="text-4xl font-medium text-gray-700"
                onClick={handleInputClick}
              >
                {user ? user.fullName : ""}
                <span className="font-light text-gray-500">
                  {" "}
                  {user && user.role ? user.role.name : ""}
                </span>
              </h1>
            )}
          </div>
          <div className="text-sm flex justify-center items-center leading-normal mt-0 mb-2 text-blueGray-400 font-bold ">
            <AiOutlineMail className="mr-2 text-lg text-blueGray-400" />

            <div>
              {isEditingEmail ? (
                <InputText
                  onBlur={() => setEditingEmail(false)}
                  defaultValue={user ? user.email : ""}
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              ) : (
                // <input
                //   type="text"
                //   value={userInput}
                //   onChange={handleInputNameChange}
                //   onBlur={handleInputBlur}
                // />
                <p
                  onClick={handleInputEmailClick}
                  className="font-light text-lg text-gray-600 mt-3"
                >
                  {user ? user.email : ""}
                </p>
              )}
            </div>
          </div>

          <p className="mt-8 text-gray-500">
            <span className="font-bold">Điện thoại: </span>

            {isEditingPhone ? (
              <InputText
                onBlur={() => setEditingPhone(false)}
                defaultValue={user ? user.phoneNumber : ""}
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
              />
            ) : (
              // <input
              //   type="text"
              //   value={userInput}
              //   onChange={handleInputNameChange}
              //   onBlur={handleInputBlur}
              // />
              <span className=" text-gray-700" onClick={handleInputPhoneClick}>
                {user.phoneNumber
                  ? user.phoneNumber
                  : "Chưa cập nhật số điện thoại"}
              </span>
            )}
          </p>
          <p className="mt-8 text-gray-500">
            <span className="font-bold">Ngày sinh: </span>

            {isEditingBirthDay ? (
              <InputText
                onBlur={() => setEditingBirthDay(false)}
                defaultValue={user ? user.birth : ""}
                value={userBirthDay}
                onChange={(e) => setUserBirthDay(e.target.value)}
              />
            ) : (
              // <input
              //   type="text"
              //   value={userInput}
              //   onChange={handleInputNameChange}
              //   onBlur={handleInputBlur}
              // />
              <span
                className=" text-gray-700"
                onClick={handleInputBirthDayClick}
              >
                {user.birthday ? user.birthday : "Chưa cập nhật số ngày sinh"}
              </span>
            )}
          </p>

          <div className="flex flex-wrap gap-3 justify-center  mt-8">
            <span className="font-bold text-gray-500">Giới tính</span>
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
        </div>
      </div>
    </div>
  );
};

export default Profile;
