import React from "react";

import { TabView, TabPanel } from "primereact/tabview";
import StatisticalByYear from "../../../components/admin/totalrevenueonline/StatisticalByYear";
import StatisticalByDay from "../../../components/admin/totalrevenueonline/StatisticalByDay";


const StatisticalByMonth = React.lazy(() =>
  import("../../../components/admin/totalrevenueonline/StatisticalByMonth")
);

const SalesReportOnline = () => {
  return (
    <>
      <div className="card">
        <TabView>
          <TabPanel header="Theo ngày" leftIcon="pi pi-calendar mr-2">
            <StatisticalByDay />
          </TabPanel>
          <TabPanel header="Theo tháng" rightIcon="pi pi-calendar-minus ml-2">
            <StatisticalByMonth />
          </TabPanel>
          <TabPanel header="Theo năm" rightIcon="pi pi-calendar-plus ml-2">
            <StatisticalByYear />
          </TabPanel>
        </TabView>
      </div>
    </>
  );
};

export default SalesReportOnline;
