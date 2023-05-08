import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API } from "../../../API.js";
import { TabView, TabPanel } from "primereact/tabview";
import { Chart } from "primereact/chart";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import StatisticalByDay from "../../../components/admin/totalrevenue/StatisticalByDay.jsx";
const SalesReport = () => {
  return (
    <>
      <h1>Báo cáo doanh thu</h1>
      <div className="card">
        <TabView>
          <TabPanel header="Theo ngày" leftIcon="pi pi-calendar mr-2">
            <StatisticalByDay />
          </TabPanel>
          <TabPanel header="Theo tháng" rightIcon="pi pi-user ml-2"></TabPanel>
          <TabPanel
            header="Theo năm"
            leftIcon="pi pi-search mr-2"
            rightIcon="pi pi-cog ml-2"
          ></TabPanel>
        </TabView>
      </div>
    </>
  );
};

export default SalesReport;
