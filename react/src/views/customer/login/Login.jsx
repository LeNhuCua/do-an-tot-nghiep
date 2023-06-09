import React, { createRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import Swal from "sweetalert2";

import UseTitle from "../../../hook/UseTitle";
import { useStateContext } from "../../../context/ContextProvider";

import axiosClient from "../../../axios-client-customer";
import axios from "axios";
import { API } from "../../../API";
import logomain from "../../../assets/images/logomain.png";
import logo from "../../../assets/images/logo.png";
import Loading from "../../../components/Loading";

const Login = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  UseTitle("Đăng nhập");

  const { setUser, setTokenCustomer, tokenCustomer } = useStateContext();

  if (tokenCustomer) {
    return <Navigate to="/" />;
  }
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState([]);
  const navigate = useNavigate();
  const onSubmit = (data) => {
    const payload = {
      account: data.account,
      password: data.password,
    };
    axios.get(`${API}/sanctum/csrf-cookie`).then((response) => {
      setLoading(true);
      axiosClient.post(`${API}/api/logincs`, payload).then((res) => {
        if (res.data.status === 200) {
          setTokenCustomer(res.data.token);
          setUser(res.data.username);
          console.log(res.data);
          navigate("/");
        } else if (res.data.status === 401) {
          setMessage([]);
          Swal.fire({
            icon: "error",
            text: res.data.message,
          });
          setLoading(false);
        } else {
          setMessage(res.data.validation_error);
          Swal.fire({
            text: res.data.message,
            icon: "error",
          });
          setLoading(false);
        }
      });
    });
    setLoading(false);
  };

  return (
    <>
      {loading && <Loading />}
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
                Đăng nhập
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
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Mật khẩu
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
                    Đăng nhập
                  </button>
                </div>
                <div className="flex items-center justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-yellow-600 hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="flex items-center justify-end">
                  <Link
                    to="/dangky"
                    className="text-sm font-medium text-yellow-600 hover:underline"
                  >
                    Đăng kí tài khoản
                  </Link>
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
      {/* <div className="login-signup-form animated fadeInDown">
        <div className="form">
          <form onSubmit={onSubmit}>
            <h1 className="title">Login into your account</h1>

            {message && (
              <div className="alert">
                <p>{message}</p>
              </div>
            )}

            <input ref={emailRef} type="text" placeholder="Email" />
            <input ref={passwordRef} type="password" placeholder="Password" />
            <button className="btn btn-block">Login</button>
            <p className="message">
              Not registered? <Link to="/signup">Create an account</Link>
            </p>
          </form>
        </div>
      </div> */}
    </>
  );
};

export default Login;
