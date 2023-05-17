import React from "react";
import ReactDOM from "react-dom/client";
import "react-app-polyfill/stable";
import "core-js";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";
import { ContextProvider } from "./context/ContextProvider.jsx";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";

//icons
import "primeicons/primeicons.css";

// import 'bootstrap/dist/css/bootstrap.min.css'
import "@coreui/coreui/dist/css/coreui.min.css";

import "sweetalert2/src/sweetalert2.scss";

import { StyledEngineProvider } from "@mui/material/styles";

import DataProvider from "./context/DataContext";
import SidebarProvider from "./context/customer/SideBarContext";
import MenusProvider from "./context/customer/MenuContext";
import SlideProvider from "./context/customer/SlideContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ContextProvider>
      <Provider store={store}>
        <StyledEngineProvider injectFirst>
          <DataProvider>
            <MenusProvider>
              <SidebarProvider>
                <SlideProvider>
                  <App />
                </SlideProvider>
              </SidebarProvider>
            </MenusProvider>
          </DataProvider>
        </StyledEngineProvider>
      </Provider>
    </ContextProvider>
  </React.StrictMode>
);
