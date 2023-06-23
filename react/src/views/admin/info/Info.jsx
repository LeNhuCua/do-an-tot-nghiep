import React, { useEffect, useState } from "react";

import { useStateContext } from "../../../context/ContextProvider";
import { AiFillEdit, AiOutlineMail } from "react-icons/ai";
import { API, API_IMAGES } from "../../../API";
import avatar from "../../../assets/images/avatar.png";

import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import Swal from "sweetalert2";
import axiosClient from "../../../axios-client";
import { Calendar } from "primereact/calendar";
import AppBreadcrumb from "../../../layout/admin/AppBreadcrumb";
import FormatDate from "../../../hook/formatDate/FormatDate";

import logo from "../../../assets/images/logo.png";
import { Button } from "primereact/button";

const Info = () => {
  const formatDate = (date) => {
    const year = date.getFullYear();
    // Lấy tháng, nếu là tháng 1-9 thì thêm số 0 ở đầu
    const month =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    // Lấy ngày, nếu là ngày 1-9 thì thêm số 0 ở đầu
    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return `${year}-${month}-${day}`;
  };
  const today = new Date();

  const [info, setInfo] = useState([]);

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    axiosClient.get(`${API}/api/info`).then((res) => {
      setInfo(res.data[0]);
      console.log(res.data);
    });
  };
  const [infoPhone, setInfoPhone] = useState(null);
  const [infoAccountName, setInfoAccountName] = useState(null);
  const [accountNumber, setAccountNumber] = useState(null);
  const [bankName, setBankName] = useState(null);

  // console.log(info ? formatDate(infoAccountName) : "af");
  useEffect(() => {
    if (info) {
      setInfoPhone(info.phone);
      setInfoAccountName(info.accountName);
      setAccountNumber(info.accountNumber);
      setBankName(info.bankName);
    }
  }, [info]);

  console.log(info);

  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingAccountName, setEditingAccountName] = useState(false);
  const [isEditingAccountNumber, setEditingAccountNumber] = useState(false);
  const [isEditingBankName, setEditingBankName] = useState(false);

  const handleInputPhoneClick = () => {
    setIsEditingPhone(true);
  };

  const handleInputAccountNameClick = () => {
    setEditingAccountName(true);
  };
  const handleInputAccountNumberClick = () => {
    setEditingAccountNumber(true);
  };
  const handleInputBankNamerClick = () => {
    setEditingBankName(true);
  };

  const editUserInfo = async () => {
    const formData = {
      _method: "PATCH",
      unitId: 1,
      phone: infoPhone,
      accountName: infoAccountName,
      accountNumber: accountNumber,
      bankName: bankName,
    };

    await axiosClient.put(`${API}/api/info/${1}`, formData).then((response) => {
      if (response.data.status === 400) {
        Swal.fire({
          icon: "success",
          title: "Cập nhật thông tin thành công!",
          showConfirmButton: false,
          timer: 1500,
        });
        fetchInfo();
        // navigate("/quantri/sanpham");
      } else {
        Swal.fire({
          icon: "error",
          text: "Vui lòng kiểm tra lại thông tin!",
        });
      }
    });
  };

  const ListBreadcrumb = [
    // {
    //   name: "Tỉ giá vàng 1",
    //   link: "fsdf",
    // },
    {
      name: "Thông tin cửa hàng",
    },
  ];

  return (
    <div>
      <AppBreadcrumb ListBreadcrumb={ListBreadcrumb} />
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500  xl:p-9">
        <div className="p-8 bg-white shadow mt-24">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative">
              <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
                <input
                  type="file"
                  accept="image/*"
                  // onChange={changeHandler}
                  id="fileInput"
                  style={{ display: "none" }}
                />

                <div
                  className=""
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <div className="flex justify-between items-center  p-3 rounded-md">
                    <img
                      className="h-full w-full rounded-full object-cover"
                      // src={`${API_IMAGES}/${imageCurrent}`}
                      src={logo}
                      alt="ảnh bìa"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-x-8 flex justify-center mt-32 md:mt-0 ">
              <Button
                className="text-white py-2 px-4 uppercase no-underline rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
                onClick={editUserInfo}
              >
                <AiFillEdit className="inline" /> Cập nhật thông tin
              </Button>

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
              {isEditingPhone ? (
                <InputText
                  onBlur={() => setIsEditingPhone(false)}
                  defaultValue={info ? info.phone : ""}
                  value={infoPhone}
                  onChange={(e) => setInfoPhone(e.target.value)}
                />
              ) : (
                <h1
                  className="text-4xl font-medium text-gray-700"
                  onClick={handleInputPhoneClick}
                >
                  {info
                    ? info.phone
                    : "Chưa cập nhật số điện thoại"}
                </h1>
              )}
              
            </div>
            <div className="bg-blue-200 p-4 relative">
              <h3 className="absolute">Ngân hàng</h3>
              <p className="mt-8 text-gray-500">
                <span className="font-bold">Ngân hàng: </span>

                {isEditingBankName ? (
                  <InputText
                    onBlur={() => setEditingBankName(false)}
                    defaultValue={info ? info.bankName : ""}
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                ) : (
                  <span
                    className=" text-gray-700"
                    onClick={handleInputBankNamerClick}
                  >
                    {info ? info.bankName : "Chưa cập nhật"}
                  </span>
                )}
              </p>






              <p className="mt-8 text-gray-500">
                <span className="font-bold">Tài khoản: </span>

                {isEditingAccountNumber ? (
                  <InputText
                    onBlur={() => setEditingAccountNumber(false)}
                    defaultValue={info ? info.accountNumber : ""}
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                ) : (
                  <span
                    className=" text-gray-700"
                    onClick={handleInputAccountNumberClick}
                  >
                    {info ? info.accountNumber : "Chưa cập nhật tài khoản"}
                  </span>
                )}
              </p>

              <p className="mt-8 text-gray-500">
                <span className="font-bold">Tên chủ thẻ: </span>

                {isEditingAccountName ? (
                  <InputText
                    onBlur={() => setEditingAccountName(false)}
                    defaultValue={info ? info.accountName : ""}
                    value={infoAccountName}
                    onChange={(e) => setInfoAccountName(e.target.value)}
                  />
                ) : (
                  <span
                    className=" text-gray-700"
                    onClick={handleInputAccountNameClick}
                  >
                    {info ? info.accountName : "Chưa cập nhật tài khoản"}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
