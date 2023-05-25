import React, { useEffect } from "react";

import { BiMap } from "react-icons/bi";
import { Link, useActionData } from "react-router-dom";

import { useStateContext } from "../../../context/ContextProvider";
import { AiFillEdit, AiOutlineMail } from "react-icons/ai";
import { API_IMAGES } from "../../../API";
import avatar from "../../../assets/images/avatars/avatar.png";
import axiosClient from "../../../axios-client-customer";
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

  return (
    <div className="bg-gradient-to-r from-cyan-500 to-blue-500  xl:p-9">
      <div className="p-8 bg-white shadow mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
            <div>
              <p className="font-bold text-gray-700 text-xl">22</p>
              <p className="text-gray-400">Friends</p>
            </div>
            <div>
              <p className="font-bold text-gray-700 text-xl">10</p>
              <p className="text-gray-400">Photos</p>
            </div>
            <div>
              <p className="font-bold text-gray-700 text-xl">89</p>
              <p className="text-gray-400">Comments</p>
            </div>
          </div> */}
          <div className="relative">
            <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
              {user && user.avatar ? (
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
              )}
            </div>
          </div>

          <div className="space-x-8 flex justify-center mt-32 md:mt-0 ">
            <Link
              to="/thongtincanhan/chinhsua"
              className="text-white py-2 px-4 uppercase no-underline rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
            >
              <AiFillEdit className="inline" /> Chỉnh sửa thông tin
            </Link>
          </div>
        </div>

        <div className="mt-20 text-center border-b pb-12">
          <h1 className="text-4xl font-medium text-gray-700">
            {user ? user.fullName : ""}
            <span className="font-light text-gray-500">
              {" "}
              {user && user.role ? user.role.name : ""}
            </span>
          </h1>
          <div className="text-sm flex justify-center items-center leading-normal mt-0 mb-2 text-blueGray-400 font-bold ">
            <AiOutlineMail className="mr-2 text-lg text-blueGray-400" />

            <p className="font-light text-gray-600 mt-3">
              {user ? user.email : ""}
            </p>
          </div>

          <p className="mt-8 text-gray-500">
            <span className="font-bold">Điện thoại: </span>
            {user.phoneNumber
              ? user.phoneNumber
              : "Chưa cập nhật số điện thoại"}
          </p>
          <p className="mt-8 text-gray-500">
            <span className="font-bold">Ngày sinh: </span>

            {user.birthday ? user.birthday : "Chưa cập nhật ngày sinh"}
          </p>
          <p className="mt-8 text-gray-500">
            <span className="font-bold">Giới tính : </span>

            {user.gender
              ? user.gender === 1
                ? "Nam"
                : "Nữ"
              : "Chưa cập nhật giới tính"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
