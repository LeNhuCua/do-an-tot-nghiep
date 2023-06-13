import React, { createRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axiosClient from "../../../axios-client";
import { useStateContext } from "../../../context/ContextProvider";
import { API } from "../../../API";

const Register = () => {
  const navigate = useNavigate();
  const nameRef = createRef();
  const accountRef = createRef();
  const emailRef = createRef();
  const passwordRef = createRef();
  const isManagerRef = createRef();
  const role = createRef();

  const passwordConfirmationRef = createRef();
  const { setUser, setToken } = useStateContext();
  const [errors, setErrors] = useState(null);
  const onSubmit = (ev) => {
    ev.preventDefault();
    const payload = {
      account: accountRef.current.value,
      fullName: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      c_password: passwordConfirmationRef.current.value,

      role_id: role.current.value,
      // role_id: 1
    };
    axiosClient
      .post(`${API}/api/users`, payload)
      .then(({ data }) => {
        setUser(data.user);
        // setToken(data.token);
        Swal.fire({
          icon: "success",
          text: data.message,
        });
        // navigate('/admin/home')
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className="title">Signup for Free 11</h1>
          {errors && (
            <div className="alert">
              {Object.keys(errors).map((key) => (
                <p key={key}>{errors[key][0]}</p>
              ))}
            </div>
          )}
          <input ref={accountRef} type="text" placeholder="Tài khoản" />
          <input ref={nameRef} type="text" placeholder="Họ và tên" />
          <input ref={emailRef} type="email" placeholder="Email Address" />
          <input ref={passwordRef} type="password" placeholder="Password" />
          <input
            ref={passwordConfirmationRef}
            type="password"
            placeholder="Repeat Password"
          />

          <label htmlFor="cars">Choose a car:</label>

          <label htmlFor="cars1">Role:</label>

          <select ref={role}>
            <option value={1}>Quản trị viên</option>
            <option value={2}>Khách hàng/</option>
            <option value={3}>Quản lí</option>

          </select>
          <button className="btn btn-block">Signup</button>
          <p className="message">
            Already registered? <Link to="/admin/login">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
