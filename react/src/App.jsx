import React, { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./scss/style.scss";
import "./index.css";
import 'tippy.js/dist/tippy.css'; // optional
import 'react-toastify/dist/ReactToastify.css';
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const DefaultLayout = React.lazy(() => import("./layout/admin/DefaultLayout"));

const Login = React.lazy(() => import("./views/admin/login/Login"));
const Register = React.lazy(() => import("./views/admin/register/Register"));

const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={loading}>
        <Routes>
          <Route
            exact
            path="/quantri/dangnhap"
            name="Login Page"
            element={<Login />}
          />
          <Route
            exact
            path="/quantri/dangki"
            name="Register Page"
            element={<Register />}
          />

          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route
            path="/quantri/*"
            name="Trang chủ"
            element={<DefaultLayout />}
          />

          <Route
            path="/quantri"
            element={<Navigate to="/quantri/dashboard" />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
