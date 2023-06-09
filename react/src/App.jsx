import React, { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./scss/style.scss";
import "./index.css";
import "tippy.js/dist/tippy.css"; // optional
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./hook/autoscrolltotop/ScrollToTop";
import ForgotPassword from "./views/resetpassword/ForgotPassword";
import ResetPasswordPage from "./views/resetpassword/ResetPasswordPage ";


import ForgotPasswordAdmin from "./views/admin/resetpassword/ForgotPassword";
import ResetPasswordPageAdmin from "./views/admin/resetpassword/ResetPasswordPage ";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const DefaultLayout = React.lazy(() => import("./layout/admin/DefaultLayout"));
const CustomerDefaultLayout = React.lazy(() =>
  import("./layout/customer/CustomerDefaultLayout")
);

const Login = React.lazy(() => import("./views/admin/login/Login"));
const Register = React.lazy(() => import("./views/admin/register/Register"));

const LoginCustomer = React.lazy(() => import("./views/customer/login/Login"));
const RegisterCustomer = React.lazy(() =>
  import("./views/customer/register/Register")
);

const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));

function App() {
  return (
    <BrowserRouter>
      <Suspense>
        <ScrollToTop>
          <Routes>
            <Route
              exact
              path="/quantri/dangnhap"
              name="Login Page"
              element={<Login />}
            />

            <Route exact path="/quantri/forgot-password" element={<ForgotPasswordAdmin />} />
            <Route
              exact
              path="/quantri/reset-password/:account"
              element={<ResetPasswordPageAdmin />}
            />

            {/* <Route
              exact
              path="/quantri/dangki"
              name="Register Page"
              element={<Register />}
            /> */}

            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            <Route
              path="/quantri/*"
              name="Trang chủ"
              exact
              element={<DefaultLayout />}
            />

            <Route
              path="/quantri"
              element={<Navigate to="/quantri/dashboard" />}
            />

            <Route
              path="/*"
              exact
              name="Trang chủ"
              element={<CustomerDefaultLayout />}
            />
            <Route
              exact
              path="/dangnhap"
              name="Login Page"
              element={<LoginCustomer />}
            />
            <Route
              exact
              path="/dangky"
              name="Đăng ký"
              element={<RegisterCustomer />}
            />

            <Route exact path="/forgot-password" element={<ForgotPassword />} />
            <Route
              exact
              path="/reset-password/:account"
              element={<ResetPasswordPage />}
            />

            {/* <Route  path="*" element={<LoginCustomer />} /> */}
            {/* <Route
              exact
              path=""
              name="Login Page"
              element={<LoginCustomer />}
            /> */}
          </Routes>
        </ScrollToTop>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
