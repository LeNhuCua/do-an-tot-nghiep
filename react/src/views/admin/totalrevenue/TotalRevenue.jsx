import React from 'react'
import SalesReport from './SalesReport '
import AppBreadcrumb from '../../../layout/admin/AppBreadcrumb'

const TotalRevenue = () => {
  const ListBreadcrumb = [
    // {
    //   name: "Tỉ giá vàng 1",
    //   link: "fsdf",
    // },
    {
      name: "Thống kê doanh thu tại cửa hàng",
    },
  ];
  return (
    <div>
       <AppBreadcrumb ListBreadcrumb={ListBreadcrumb} />
        <SalesReport />
    </div>
  )
}

export default TotalRevenue
