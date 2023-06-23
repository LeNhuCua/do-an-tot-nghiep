import React from 'react'

import AppBreadcrumb from '../../../layout/admin/AppBreadcrumb'
import SalesReportOnline from './SalesReportOnline ';

const TotalRevenueOnline = () => {
  const ListBreadcrumb = [
    // {
    //   name: "Tỉ giá vàng 1",
    //   link: "fsdf",
    // },
    {
      name: "Thống kê doanh thu online",
    },
  ];
  return (
    <div>
       <AppBreadcrumb ListBreadcrumb={ListBreadcrumb} />
        <SalesReportOnline />
    </div>
  )
}

export default TotalRevenueOnline;
