import React from "react";

import { TabView, TabPanel } from "primereact/tabview";
import StatisticalByYear from "../../../components/admin/totalrevenue/StatisticalByYear";

const StatisticalByDay = React.lazy(() =>
  import("../../../components/admin/totalrevenue/StatisticalByDay")
);
const StatisticalByMonth = React.lazy(() =>
  import("../../../components/admin/totalrevenue/StatisticalByMonth")
);

const SalesReport = () => {
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
          <TabPanel
            header="Theo năm"
            rightIcon="pi pi-calendar-plus ml-2"
          >

<StatisticalByYear/>
          </TabPanel>
        </TabView>
      </div>
    </>
  );
};

export default SalesReport;
