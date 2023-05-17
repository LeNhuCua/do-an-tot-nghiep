import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CContainer, CSpinner } from "@coreui/react";

// routes config
import routes from "../../routes";
import ScrollToTop from "../../hook/autoscrolltotop/ScrollToTop";

const AppContent = () => {
  return (
    <main className="min-h-[100vh]">
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            );
          })}
          {/* <Route
            path="/quantri"
            element={<Navigate to="dashboard" replace />}
          /> */}
        </Routes>
      </Suspense>
    </main>
  );
};

export default React.memo(AppContent);
