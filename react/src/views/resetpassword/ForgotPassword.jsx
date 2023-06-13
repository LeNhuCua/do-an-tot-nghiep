import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../../API";
import { useForm } from "react-hook-form";
import UseTitle from "../../hook/UseTitle";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";
import logo from '../../assets/images/logo.png';
import logomain from '../../assets/images/logomain.png'


const ForgotPassword = () => {
  UseTitle("Quên mật khẩu");

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    const account = data.account;
    setIsLoading(true); // Đặt isLoading thành true khi bắt đầu submit
    try {
      const response = await axios.post(`${API}/api/forgot-password`, {
        account,
      });
      setMessage(response.data.status);
      if (response.data.status === 200) {
        navigate(`/reset-password/${account}`);
        Swal.fire({
          icon: "success",
          title: "Vui lòng kiểm tra email để lấy mã OTP!",
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
      setMessage("Failed to send password reset link");
    }
    setIsLoading(false); // Đặt isLoading thành false khi kết thúc submit
  };

  return (
    <div>
      {isLoading && <Loading/>}
      <section className="bg-gray-5 bg-green-200">
        <div className="flex gap-6 items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="hidden lg:block w-[18.75rem]">
            <img
              className=""
              src={logomain}
              alt=""
            />
          </div>

          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
            <h1 className="flex items-center justify-center mb-6 text-2xl font-semibold text-gray-900 ">
              <img
                className="h-12 mr-2"
                src={logo}
                alt="logo"
              />
             
            </h1>

            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Quên mật khẩu
              </h1>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 md:space-y-6"
                action="#"
              >
                <div>
                  <label
                    htmlFor="account"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Tài khoản
                  </label>
                  <input
                    type="text"
                    id="account"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  focus:border-yellow-400 block w-full p-2.5 "
                    placeholder="Tài khoản"
                    required=""
                    {...register("account", {
                      required: true,
                    })}
                  />
                  {errors?.account?.type === "required" && (
                    <small className="text-danger before:content-['_⚠']">
                      Vui lòng nhập tài khoản
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

export default ForgotPassword;
