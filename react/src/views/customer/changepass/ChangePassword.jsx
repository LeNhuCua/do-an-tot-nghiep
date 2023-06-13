import React, { useState } from "react";
import axios from "axios";
import axiosClient from "../../../axios-client-customer";
import { API } from "../../../API";
import { Controller, useForm } from "react-hook-form";
import { CCol, CForm } from "@coreui/react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import logo from '../../../assets/images/logo.png'
import logomain from '../../../assets/images/logomain.png'
import Breadcrumb from "../../../components/customer/breadcrumb/Breadcrumb";
function ChangePassword() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    control,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleChangePassword = async (data) => {
    console.log(data.currentPassword);
    if (data.newPassword !== data.confirmPassword) {
      setMessage("Xác nhận mật khẩu không đúng");
      return;
    } else {
      try {
        const response = await axiosClient.post(`${API}/api/changePassword`, {
          current_password: data.currentPassword,
          new_password: data.newPassword,
          confirm_password: data.confirmPassword,
        });

        if (response.data.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Đổi mật khẩu thành công!",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate("/")
          
        } else {
          setMessage( response.data.message);
        }
      } catch (error) {
        setMessage( error.message);
      }
    }
  };

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className="cs-text-error">{errors[name].message}</small>
    ) : (
      <small className="">&nbsp;</small>
    );
  };
  const ListBreadcrumb = [
    // {
    //   name: "Tỉ giá vàng 1",
    //   link: "fsdf",
    // },
    {
      name: "Đổi mật khẩu"
    },
  ];
  return (
    <div>
       <Breadcrumb ListBreadcrumb={ListBreadcrumb} />

      <section className="bg-gray-5 bg-gray-200">
        {/* {error && (
          <div className="alert">
            {Object.keys(error).map((key) => (
              <p key={key}>{error[key][0]}</p>
            ))}
          </div>
        )} */}
        <div className="flex gap-6 items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="hidden lg:block w-[18.75rem] ">
            <img
              className="rounded-xl"
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
                Đổi mật khẩu
              </h1>
              <CForm
                onSubmit={handleSubmit(handleChangePassword)}
                className="row space-y-4 md:space-y-5"
                action="#"
              >
                <CCol xl={12}>
                  <Controller
                    name="currentPassword"
                    control={control}
                    rules={{
                      required: "Vui lòng nhập mật khẩu cũ.",
                    }}
                    render={({ field, fieldState }) => (
                      <div className="w-full">
                        <span className="p-float-label ">
                          <InputText
                            type="password"
                            id={field.name}
                            {...field}
                            inputRef={field.ref}
                            className={classNames({
                              "p-invalid": fieldState.error,
                              "min-w-full": true,
                            })}
                            // className={`w-full`}
                          />

                          <label
                            htmlFor={field.name}
                            className="block mb-2 text-sm font-medium text-gray-900 "
                          >
                            Mật khẩu cũ
                          </label>
                        </span>
                        {getFormErrorMessage(field.name)}
                      </div>
                    )}
                  />
                </CCol>

                <CCol xl={12}>
                  <Controller
                    name="newPassword"
                    control={control}
                    rules={{
                      required: "Vui lòng nhập mật khẩu mới.",
                    }}
                    render={({ field, fieldState }) => (
                      <div className="w-full">
                        <span className="p-float-label ">
                          <InputText
                            type="password"
                            id={field.name}
                            {...field}
                            inputRef={field.ref}
                            className={classNames({
                              "p-invalid": fieldState.error,
                              "min-w-full": true,
                            })}
                            // className={`w-full`}
                          />

                          <label
                            htmlFor={field.name}
                            className="block mb-2 text-sm font-medium text-gray-900 "
                          >
                            Mật khẩu mới
                          </label>
                        </span>
                        {getFormErrorMessage(field.name)}
                      </div>
                    )}
                  />
                </CCol>
                <CCol xl={12}>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    rules={{
                      required: "Vui lòng xác nhận mật khẩu.",
                    }}
                    render={({ field, fieldState }) => (
                      <div className="w-full">
                        <span className="p-float-label ">
                          <InputText
                            type="password"
                            id={field.name}
                            {...field}
                            inputRef={field.ref}
                            className={classNames({
                              "p-invalid": fieldState.error,
                              "min-w-full": true,
                            })}
                            // className={`w-full`}
                          />

                          <label
                            htmlFor={field.name}
                            className="block mb-2 text-sm font-medium text-gray-900 "
                          >
                            Xác nhận mật khẩu
                          </label>
                        </span>
                        {getFormErrorMessage(field.name)}
                      </div>
                    )}
                  />
                </CCol>
                {message && (
                  <small className="cs-text-error">{message && message}</small>
                )}

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
              </CForm>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ChangePassword;
