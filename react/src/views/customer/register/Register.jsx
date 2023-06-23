import React, { createRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import Swal from "sweetalert2";

import UseTitle from "../../../hook/UseTitle";
import { useStateContext } from "../../../context/ContextProvider";

import axios from "axios";
import { API } from "../../../API";
import axiosClient from "../../../axios-client";
import IsName from "../../../hook/isName/IsName";
import { InputText } from "primereact/inputtext";
import { CCol, CForm } from "@coreui/react";
import logomain from "../../../assets/images/logomain.png";
import logo from "../../../assets/images/logo.png";
import Loading from "../../../components/Loading";
const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState(null);
  const { setUser, setToken } = useStateContext();

  UseTitle("Đăng ký");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState([]);
  const navigate = useNavigate();
  const onSubmit = (data) => {
    const payload = {
      account: data.account,
      fullName: data.name,
      email: data.email,
      password: data.password,
      c_password: data.passwordConfirmation,
      // role_id: role.current.value,
      // role_id: 1
    };
    setLoading(true);
    axiosClient
      .post(`/cus-products/signupCus`, payload)
      .then(({ data }) => {
        console.log(data);
        if (data.status === 422) {
          setError(data.validation_error);
          console.log(data.validation_error);
        } else {
          setUser(data.user);
          setError(null);
          // setToken(data.token);
          Swal.fire({
            icon: "success",
            text: "Đăng kí tài khoản thành công, Vui lòng vào email để xác nhận",
          });

          reset();
          navigate("/dangnhap");
        }

        // navigate('/admin/home')
      })
      .catch((err) => {}).finally(() => {
        setLoading(false);
      });
    
  };

  return (
    <>
         {loading && <Loading />}
      <section className="bg-gray-5 bg-green-200">
        {/* {error && (
          <div className="alert">
            {Object.keys(error).map((key) => (
              <p key={key}>{error[key][0]}</p>
            ))}
          </div>
        )} */}
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
                Đăng kí tài khoản miễn phí
              </h1>
              <CForm
                onSubmit={handleSubmit(onSubmit)}
                className="row space-y-4 md:space-y-6"
                action="#"
              >
                <CCol xl={12}>
                  <span className="p-float-label">
                    <InputText
                      id="account"
                      className={`w-full ${errors.account && "invalid"}`}
                      {...register("account", {
                        required: "Vui lòng nhập tài khoản ",
                        maxLength: {
                          value: 50,
                          message: "Giới hạn chỉ 50 kí tự",
                        },
                      })}
                      onKeyUp={() => {
                        trigger("account");
                      }}
                      type="text"
                      placeholder="Vd: an"
                    />
                    <label htmlFor="account">Tài khoản</label>
                  </span>

                  {errors.account && (
                    <small className="cs-text-error">
                      {errors.account.message}
                    </small>
                  )}

                  {error && error.account ? (
                    <small className="text-danger before:content-['_⚠']">
                      Tài khoản đã tồn tại, vui lòng chọn tài khoản khác
                    </small>
                  ) : (
                    ""
                  )}
                </CCol>
                <div>
                  <span className="p-float-label ">
                    <InputText
                      id="name"
                      className={`w-full ${errors.name && "invalid"}`}
                      {...register("name", {
                        required: "Vui lòng nhập họ và tên ",
                        maxLength: {
                          value: 50,
                          message: "Giới hạn chỉ 50 kí tự",
                        },
                        // validate: (value) =>
                        //   IsName(value) || "Vui lòng nhập họ tên hợp lệ",
                      })}
                      onKeyUp={() => {
                        trigger("name");
                      }}
                      type="text"
                      placeholder="Vd: Nguyễn Văn An"
                    />
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Họ và tên
                    </label>
                  </span>

                  {errors.name && (
                    <small className="cs-text-error">
                      {errors.name.message}
                    </small>
                  )}
                </div>
                <div>
                  <span className="p-float-label ">
                    <InputText
                      id="email"
                      className={`w-full ${errors.name && "invalid"}`}
                      {...register("email", {
                        required: "Vui lòng nhập email",
                        maxLength: {
                          value: 50,
                          message: "Giới hạn chỉ 50 kí tự",
                        },
                      })}
                      onKeyUp={() => {
                        trigger("email");
                      }}
                      type="text"
                      placeholder="Vd: an@gmail.com"
                    />
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Email
                    </label>
                  </span>

                  {errors.email && (
                    <small className="cs-text-error">
                      {errors.email.message}
                    </small>
                  )}
                </div>
                <div>
                  <div>
                    <span className="p-float-label ">
                      <InputText
                        type="password"
                        id="password"
                        className={`w-full ${errors.name && "invalid"}`}
                        {...register("password", {
                          required: "Vui lòng nhập mật khẩu",
                          maxLength: {
                            value: 50,
                            message: "Giới hạn chỉ 50 kí tự",
                          },
                          minLength: {
                            value: 6,
                            message: "Tối thiểu 6 kí tự",
                          },
                        })}
                        onKeyUp={() => {
                          trigger("password");
                        }}
                       
                        placeholder="* * * * * * *"
                      />
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Mật khẩu
                      </label>
                    </span>

                    {errors.password && (
                      <small className="cs-text-error">
                        {errors.password.message}
                      </small>
                    )}
                  </div>
                </div>
                <div>
                  <div>
                    <span className="p-float-label ">
                      <InputText
                     
                        id="passwordConfirmation"
                        className={`w-full ${errors.name && "invalid"}`}
                        {...register("passwordConfirmation", {
                          required: "Vui lòng nhập xác nhận",
                          maxLength: {
                            value: 50,
                            message: "Giới hạn chỉ 50 kí tự",
                          },
                        })}
                        onKeyUp={() => {
                          trigger("passwordConfirmation");
                        }}
                        type="password"
                        placeholder="* * * * * * *"
                      />
                      <label
                        htmlFor="passwordConfirmation"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Xác nhận
                      </label>
                    </span>

                    {errors.passwordConfirmation && (
                      <small className="cs-text-error">
                        {errors.passwordConfirmation.message}
                      </small>
                    )}
                  </div>

                  {error && error.c_password ? (
                    <small className="text-danger before:content-['_⚠']">
                      Xác nhận mật khẩu không chính xác
                    </small>
                  ) : (
                    ""
                  )}
                </div>

                <div className="flex justify-center items-center  cursor-pointer  bg-yellow-400 rounded-2xl hover:text-yellow-400 hover:bg-gray-400 transition-all duration-300">
                  <button
                    className="p-3 w-full h-full uppercase text-xs font-bold"
                    type="submit"
                  >
                    Đăng ký
                  </button>
                </div>
                <div className="flex items-center justify-end">
                  <span>Bạn đã có tài khoản</span>
                  <Link
                    to="/dangnhap"
                    className="text-sm font-medium text-yellow-400 hover:underline"
                  >
                    Đăng nhập
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
              </CForm>
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

export default Register;
