import React, { useEffect, useState } from "react";

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import { CChartLine } from "@coreui/react-chartjs";
import { getStyle, hexToRgba } from "@coreui/utils";
import CIcon from "@coreui/icons-react";
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from "@coreui/icons";
import axiosClient from "../../axios-client";
import { API } from "../../API";
import { Chart } from "primereact/chart";



const Dashboard = () => {
  const [visible, setVisible] = useState(false)
  const random = (min, max) =>
    Math.floor(Math.random() * (max - min + 1) + min);

  const progressExample = [
    { title: "Khách đăng ký", value: "29" , color: "success" },
    { title: "Tiền", value: "24.093.000 VNĐ", percent: 20, color: "info" },
    {
      title: "Đơn hàng bán được",
      value: "78",
      percent: 60,
      color: "warning",
    },

  ];

  const progressGroupExample1 = [
    { title: "Monday", value1: 34, value2: 78 },
    { title: "Tuesday", value1: 56, value2: 94 },
    { title: "Wednesday", value1: 12, value2: 67 },
    { title: "Thursday", value1: 43, value2: 91 },
    { title: "Friday", value1: 22, value2: 73 },
    { title: "Saturday", value1: 53, value2: 82 },
    { title: "Sunday", value1: 9, value2: 69 },
  ];

  const progressGroupExample2 = [
    { title: "Male", icon: cilUser, value: 53 },
    { title: "Female", icon: cilUserFemale, value: 43 },
  ];

  const progressGroupExample3 = [
    { title: "Organic Search", icon: cibGoogle, percent: 56, value: "191,235" },
    { title: "Facebook", icon: cibFacebook, percent: 15, value: "51,223" },
    { title: "Twitter", icon: cibTwitter, percent: 11, value: "37,564" },
    { title: "LinkedIn", icon: cibLinkedin, percent: 8, value: "27,319" },
  ];



  const formatMonth = (date) => {
    const year = date.getFullYear();
    // Lấy tháng, nếu là tháng 1-9 thì thêm số 0 ở đầu
    const month =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;

    // const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return `${month}`;
  };

  const formatYear = (date) => {
    const year = date.getFullYear();
    // Lấy tháng, nếu là tháng 1-9 thì thêm số 0 ở đầu
    return `${year}`;
  };
  const today = new Date();
  const [chartOptions, setChartOptions] = useState({});

  const [date, setDate] = useState(today);
  const [chartData, setChartData] = useState({});
  useEffect(() => {
    const options = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };
    setChartOptions(options);
  }, []);


  useEffect(() => {
    axiosClient
      .get(
        `${API}/api/statistical/sales-data-month?month=${formatMonth(
          date
        )}&&year=${formatYear(date)}`
      )
      .then((response) => {

        setChartData(response.data.chartDataByMonth);

      })
      .catch((error) => {
        console.log(error);
      });
  }, [date]);

  return (
    <>
    

      <CCard className="mb-4">
      <div className="card p-2">
        <h4 className="text-center">
          Biểu đồ doanh thu các tháng trước trong năm {formatYear(date)}
        </h4>
        <Chart type="bar" data={chartData} options={chartOptions} />
      </div>
        <CCardFooter>
          <CRow xs={{ cols: 1 }} md={{ cols: 5 }} className="text-center flex  justify-center">
            {progressExample.map((item, index) => (
              <CCol className="mb-sm-2 mb-0" key={index}>
                <div className="text-medium-emphasis">{item.title}</div>
                <strong>
                  {item.value}
                </strong>
                {/* <CProgress
                  thin
                  className="mt-2"
                  color={item.color}
                  value={item.percent}
                /> */}
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard>

   


    </>
  );
};

export default Dashboard;


