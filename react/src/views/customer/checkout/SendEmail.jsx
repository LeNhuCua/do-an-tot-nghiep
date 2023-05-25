import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { API } from "../../../API";
import ReactDOMServer from "react-dom/server";
import axiosClient from "../../../axios-client-customer";
import { useStateContext } from "../../../context/ContextProvider";
const SendEmail = () => {
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
  const { tokenCustomer, user } = useStateContext();

  const CreateProducts = async (data) => {
    const emailData = new FormData();
    emailData.append("to", "cua.ln.61cntt@gmail.com");
    emailData.append("subject", "Đặt hàng thành công tại Kim Huy");
    const content = ReactDOMServer.renderToString(
      <h1 className="font-bold text-xl">Xin chào {user.fullName} </h1>
    );
    emailData.append("body", content);
    await axiosClient
      .post(`${API}/api/send-email`, emailData)
      .then((response) => {
        if (response.data.status === 400) {
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
    <div>
      <form onSubmit={handleSubmit(CreateProducts)}>
        <button>Gửi mail</button>
      </form>
    </div>
  );
};

export default SendEmail;
