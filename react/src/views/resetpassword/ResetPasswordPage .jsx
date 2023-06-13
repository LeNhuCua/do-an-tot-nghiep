import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API } from "../../API";
import { useForm } from "react-hook-form";
import Loading from "../../components/Loading";
import Swal from "sweetalert2";
import logo from "../../assets/images/logo.png";
import logomain from "../../assets/images/logomain.png";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [otp, setOtp] = useState("");
  const { account } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    const formData = new FormData();
    setIsLoading(true); // Đặt isLoading thành true khi bắt đầu submit

    formData.append("otp", data.otp);
    formData.append("new_password", data.password);
    try {
      const response = await axios.post(`${API}/api/reset-password`, formData);
      if (response.data.status === 200) {
        navigate(`/dangnhap/`);
        Swal.fire({
          icon: "success",
          title: "Đặt lại mật khẩu thành công",
          // showConfirmButton: false,
          timer: 1500,
        });
      } else if (response.data.status === 201) {
        Swal.fire({
          icon: "error",
          title: "Mã OTP không chính xác!",
          // showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      setMessage("Lỗi trong việc đặt lại mật khẩu");
    }
    setIsLoading(false); // Đặt isLoading thành false khi kết thúc submit
  };
  const sendOtp = async () => {
    setIsLoading(true); // Đặt isLoading thành true khi bắt đầu submit

    try {
      const response = await axios.post(`${API}/api/forgot-password`, {
        account,
      });
      if (response.data.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Gửi lại mã thành công!",
          // showConfirmButton: false,
          timer: 1500,
        });
      } else if (response.data.status === 201) {
        Swal.fire({
          icon: "error",
          title: "Tài khoản không tồn tại!",
          // showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      alert("Lỗi");
    }
    setIsLoading(false); // Đặt isLoading thành false khi kết thúc submit
  };
  return (
    <div>
      {isLoading && <Loading />}

      <section className="bg-gray-5 bg-green-200">
        <div className="flex gap-6 items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="hidden lg:block w-[18.75rem]">
            <img className="" src={logomain} alt="" />
          </div>

          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
            <h1 className="flex items-center justify-center mb-6 text-2xl font-semibold text-gray-900 ">
              <img className="h-12 mr-2" src={logo} alt="logo" />
            </h1>

            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Đặt lai mật khẩu
              </h1>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 md:space-y-6"
                action="#"
              >
                <div>
                  <label
                    htmlFor="otp"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Mã OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    placeholder="Mã OTP"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  focus:border-yellow-400 block w-full p-2.5 "
                    {...register("otp", {
                      required: true,
                    })}
                  />
                  {errors?.otp?.type === "required" && (
                    <small className="text-danger before:content-['_⚠']">
                      Vui lòng nhập mã OTP
                    </small>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    autoComplete="on"
                    id="password"
                    placeholder="Mật khẩu"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  focus:border-yellow-400 block w-full p-2.5 "
                    {...register("password", {
                      required: true,
                    })}
                  />
                  {errors?.password?.type === "required" && (
                    <small className="text-danger before:content-['_⚠']">
                      Vui lòng nhập mật khẩu
                    </small>
                  )}
                </div>
                <div className="flex justify-center items-center  cursor-pointer  bg-yellow-400 rounded-2xl hover:text-yellow-400 hover:bg-gray-400 transition-all duration-300">
                  <button
                    className="p-3 w-full h-full uppercase text-xs font-bold"
                    type="submit"
                  >
                    Xác nhận
                  </button>
                </div>
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={sendOtp}
                    className="text-sm font-medium text-yellow-600 hover:underline"
                  >
                    Gửi lại mã OTP
                  </button>
                </div>

                {/* <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <a
                    href="#"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign up
                  </a>
                </p> */}
              </form>
            </div>
          </div>
        </div>
      </section>

      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPasswordPage;
