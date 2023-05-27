import React, { useRef, useState } from "react";

import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";
import { Tag } from "primereact/tag";
import { updateLocaleOptions } from "primereact/api";
import { Button } from "@mui/material";
import { RiFileExcel2Fill } from "react-icons/ri";
import Tippy from "@tippyjs/react";
import { Dropdown } from "primereact/dropdown";
import { BiGridSmall, BiGridVertical } from "react-icons/bi";
import { BsDot } from "react-icons/bs";
import { DeferredContent } from "primereact/deferredcontent";
import { Toast } from "primereact/toast";
updateLocaleOptions({
  startsWith: "Bắt đầu với",
  endsWith: "Kết thúc với",
  contains: "Chứa từ",
  notContains: "Không chứa từ",
  equals: "Bằng",
  notEquals: "Không bằng",
  noFilter: "Đóng",

  //...
});

export default function OrderGrid(props) {
  const { data, col } = props;

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    orderId: { value: null, matchMode: FilterMatchMode.CONTAINS },

    "payment_method.paymentMethodName": {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    },
    "shipping_method.shippingMethodName": {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    },
    // : { value: null, matchMode: FilterMatchMode.CONTAINS },

  });

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;

    let _filters = { ...filters };

    _filters["global"].value = value;
    console.log(_filters);
    setFilters(_filters);
  };
  const dt = useRef(null);
  const exportCSV = () => {
    dt.current.exportCSV();
  };
  const renderHeader = () => {
    return (
      <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
        <Tippy content="Xuất excel">
          <Button
            color="success"
            onClick={exportCSV}
            endIcon={<RiFileExcel2Fill />}
            variant="contained"
            component="label"
          >
            Export
          </Button>
        </Tippy>

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
  };

  const header = renderHeader();
  const [sizeOptions] = useState([
    { label: <BsDot />, value: "small" },
    { label: <BiGridSmall />, value: "normal" },
    { label: <BiGridVertical />, value: "large" },
  ]);
  const [size, setSize] = useState(sizeOptions[1].value);

  //phương thức thanh toán
  const [paymentMethods] = useState([
    "Thanh toán Online",
    "Thanh toán khi nhận hàng",
  ]);
  const getSeverity = (status) => {
    switch (status) {
      case "Thanh toán Online":
        return "primary";

      case "Thanh toán khi nhận hàng":
        return "success";
    }
  };

  const paymentMethodBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.payment_method.paymentMethodName}
        severity={getSeverity(rowData.payment_method.paymentMethodName)}
      />
    );
  };
  const paymentMethodItemTemplate = (option) => {
    console.log(option);
    return (
      <Tag
        value={
          option === "Thanh toán Online"
            ? "Thanh toán Online"
            : "Thanh toán khi nhận hàng"
        }
        severity={getSeverity(option)}
      />
    );
  };
  const statusRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={paymentMethods}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={paymentMethodItemTemplate}
        placeholder="Chọn"
        className="p-column-filter"
        showClear
        optionLabel="code"
        style={{ minWidth: "12rem" }}
      />
    );
  };

  //Phương thức nhận hàng
  const getPaymentSeverity = (status) => {
    switch (status) {
      case "Giao tận nơi":
        return "primary";

      case "Đến cửa hàng lấy":
        return "success";
    }
  };
  const [shippingMethods] = useState(["Giao tận nơi", "Đến cửa hàng lấy"]);

  const shippingMethodBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.shipping_method.shippingMethodName}
        severity={getPaymentSeverity(
          rowData.shipping_method.shippingMethodName
        )}
      />
    );
  };
  const shippingMethodItemTemplate = (option) => {
    console.log(option);
    return (
      <Tag
        value={option === "Giao tận nơi" ? "Giao tận nơi" : "Đến cửa hàng lấy"}
        severity={getPaymentSeverity(option)}
      />
    );
  };
  const paymentRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={shippingMethods}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={shippingMethodItemTemplate}
        placeholder="Chọn"
        className="p-column-filter"
        showClear
        optionLabel="code"
        style={{ minWidth: "12rem" }}
      />
    );
  };

  const totalAmountBodyTemplate = (rowData) => {
    return (
      <span className="">
        {new Intl.NumberFormat({
          style: "currency",
          currency: "JPY",
        }).format(rowData.totalAmount)}
        <span> VNĐ</span>
      </span>
    );
  };

  return (
    <div className="card">
      <div className="flex justify-content-center m-2 ">
        <SelectButton
          value={size}
          onChange={(e) => setSize(e.value)}
          options={sizeOptions}
        />
      </div>

      <DeferredContent>
        <DataTable
          stripedRows
          size={size}
          ref={dt}
          scrollable
          scrollHeight="800px"
          value={data}
          paginator
          rows={10}
          filters={filters}
          filterDisplay="row"
          header={header}
          emptyMessage="Không có dữ liệu"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          rowsPerPageOptions={[5, 10, 25, 50]}
          currentPageReportTemplate="Hiển thị: {first} - {last} / {totalRecords}"
        >
          {/* <Column selectionMode="multiple" exportable={false}></Column> */}

          <Column
            header="#"
            headerStyle={{ width: "3rem" }}
            body={(data, options) => options.rowIndex + 1}
          ></Column>

          <Column filter={true} header="Mã" field="orderId"></Column>
          <Column
            field="totalAmountBodyTemplate"
            header="Thanh toán"
            showFilterMenu={false}
            sortable
            filterMenuStyle={{ width: "14rem" }}
            style={{ minWidth: "12rem" }}
            body={totalAmountBodyTemplate}
            filter
          />

          <Column
            field="payment_method.paymentMethodName"
            header="Thanh toán"
            showFilterMenu={false}
            sortable
            filterMenuStyle={{ width: "14rem" }}
            style={{ minWidth: "12rem" }}
            body={paymentMethodBodyTemplate}
            filter
            filterElement={statusRowFilterTemplate}
          />
          <Column
            field="shipping_method.shippingMethodName"
            header="Giao hàng"
            showFilterMenu={false}
            sortable
            filterMenuStyle={{ width: "14rem" }}
            style={{ minWidth: "12rem" }}
            body={shippingMethodBodyTemplate}
            filter
            filterElement={paymentRowFilterTemplate}
          />
          {col.map((k, i) => (
            <Column
              key={i}
              field={k.field}
              header={k.header}
              sortable
              filter={k.filter}
              filterField={k.field}
              style={{ minWidth: "12rem" }}
              body={k.body}
              filterPlaceholder="Tìm..."
            />
          ))}
        </DataTable>
      </DeferredContent>
    </div>
  );
}
