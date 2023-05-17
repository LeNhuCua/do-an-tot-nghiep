import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";

import { API, API_IMAGES } from "../../../API.js";

import { Chart } from "primereact/chart";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";

const StatisticalByMonth = () => {
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

  const [date, setDate] = useState(today);
  const [salesData, setSalesData] = useState([]);

  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const [detailData, setDetailData] = useState([]);
  const [bestSellProduct, setBestSellProduct] = useState([]);

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
    axios
      .get(
        `${API}/api/statistical/sales-data-month?month=${formatMonth(
          date
        )}&&year=${formatYear(date)}`
      )
      .then((response) => {
        setSalesData(response.data);

        setChartData(response.data.chartDataByMonth);
        setDetailData(response.data.detailByMonth);
        setBestSellProduct(response.data.getBestSellProductByMonth);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [date]);

  const [visible, setVisible] = useState(false);

  const avatarTemplate = (rowData) => {
    return rowData.avatar ? (
      <img
        className="w-20 border"
        src={`${API_IMAGES}/${rowData.avatar}`}
        alt={rowData.name}
      />
    ) : (
      <p className="bg-red-200 p-2 inline rounded-lg font-semibold">Chưa có</p>
    );
  };
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    invoiceId: { value: null, matchMode: FilterMatchMode.CONTAINS },
    fullName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    phoneNumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
    total_quantity: { value: null, matchMode: FilterMatchMode.CONTAINS },
    total_Amount: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;

    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
  };
  const renderHeader = useCallback(() => {
    return (
      <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            onChange={onGlobalFilterChange}
            placeholder="Tìm kiếm..."
          />
        </span>
      </div>
    );
  }, [onGlobalFilterChange]);
  const header = useMemo(() => renderHeader(), [renderHeader]);
  const totalTemplate = (total) => {
    return (
      <p>
        {new Intl.NumberFormat({
          style: "currency",
          currency: "JPY",
        }).format(total.total_Amount)}{" "}
        đồng
      </p>
    );
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <Calendar
          value={date}
          onChange={(e) => setDate(e.value)}
          showButtonBar
          maxDate={today}
          showIcon
          view="month"
          dateFormat="mm/yy"
        />
      </div>

      <div className="my-3 card p-8 grid grid-cols-2">
        <div className="col-span-1">
          <h5 className="mb-4 text-center text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
            Tháng{" "}
            <span className="text-blue-600 dark:text-blue-500">
              {" "}
              {salesData.totalSalesByMonth
                ? salesData.totalSalesByMonth.month + "/" + formatYear(date)
                : ""}
            </span>{" "}
          </h5>

          <h3 className="text-lg font-medium">
            Tổng tiền bán:{" "}
            <span className="text-purple-500 font-medium">
              {new Intl.NumberFormat({
                style: "currency",
                currency: "JPY",
              }).format(
                salesData.totalSalesByMonth
                  ? salesData.totalSalesByMonth.total_sales
                  : ""
              )}{" "}
              đồng
            </span>
          </h3>
          <h3 className="text-lg font-medium">
            Số lượng sản phẩm bán:{" "}
            <span className="text-purple-500 font-medium">
              {salesData.totalQuantityByMonth
                ? salesData.totalQuantityByMonth
                : ""}{" "}
              sản phẩm
            </span>
          </h3>
          <h3 className="text-lg font-medium mb-3">
            Top 3 sản phẩm bán chạy nhất trong tháng
          </h3>

          {bestSellProduct.length > 0 ? (
            <DataTable
              value={bestSellProduct}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column
                field="avatar"
                body={avatarTemplate}
                header="Ảnh bìa"
              ></Column>

              <Column field="name" header="Sản phẩm"></Column>
              <Column field="so_luong_ban" header="Số lượng bán"></Column>
            </DataTable>
          ) : (
            <div className="text-gray-500 text-lg">Không có dữ liệu</div>
          )}
        </div>

        <div className="col-span-1 flex items-center justify-end">
          <Button
            label="Chi tiết đơn hàng bán được"
            icon="pi pi-external-link"
            onClick={() => setVisible(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
          />
        </div>
      </div>

      {detailData ? (
        <Dialog
          header={`Chi tiết đơn hàng tháng ${formatMonth(
            date
          )} năm ${formatYear(date)}`}
          visible={visible}
          maximizable
          className="w-[90%] xl:w-2/3"
          onHide={() => setVisible(false)}
        >
          <div className="card">
            <DataTable
              filters={filters}
              paginator
              scrollable
              rows={5}
              header={header}
              value={detailData}
              emptyMessage="Không có dữ liệu"
              sortMode="multiple"
              tableStyle={{ minWidth: "50rem" }}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              rowsPerPageOptions={[5, 10, 25, 50]}
              currentPageReportTemplate="Hiển thị: {first} - {last} / {totalRecords}"
            >
              <Column field="invoiceId" header="Số hoá đơn" sortable></Column>

              <Column
                field="fullName"
                header="Tên khách hàng"
                sortable
              ></Column>
              <Column
                field="phoneNumber"
                header="Số điện thoại"
                sortable
              ></Column>
              <Column
                field="total_quantity"
                header="Số lượng bán"
                sortable
              ></Column>
              <Column
                // field="total_Amount"
                header="Tiền thu được"
                body={totalTemplate}
                sortable
              ></Column>
            </DataTable>
          </div>
        </Dialog>
      ) : (
        ""
      )}

      <div className="card p-2">
        <h4 className="text-center">
          Biểu đồ doanh thu các tháng trước trong năm {formatYear(date)}
        </h4>
        <Chart type="bar" data={chartData} options={chartOptions} />
      </div>
      <div>
        {/* Hiển thị biểu đồ với thư viện React-Chartjs-2 */}
        {/* <Line data={chartData} /> */}
      </div>
    </div>
  );
};

export default StatisticalByMonth;
