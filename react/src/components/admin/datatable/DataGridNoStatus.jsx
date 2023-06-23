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

export default function DataGridNoStatus(props) {
  const { data, col, setSelectedData, selectedData } = props;

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    alias: { value: null, matchMode: FilterMatchMode.CONTAINS },
    categoryId: { value: null, matchMode: FilterMatchMode.CONTAINS },
    productId: { value: null, matchMode: FilterMatchMode.CONTAINS },
    sizeId: { value: null, matchMode: FilterMatchMode.CONTAINS },
    sizeValue: { value: null, matchMode: FilterMatchMode.CONTAINS },
    "category.name": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "subcategory.name": { value: null, matchMode: FilterMatchMode.CONTAINS },
    // : { value: null, matchMode: FilterMatchMode.CONTAINS },
    "country.name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    status: { value: null, matchMode: FilterMatchMode.CONTAINS },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS },
    userId: { value: null, matchMode: FilterMatchMode.CONTAINS },
    "role.name": { value: null, matchMode: FilterMatchMode.CONTAINS },

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

  const [statuses] = useState([0, 1]);
  // function getIds(arr) {
  //   let ids = [];
  //   for (let i = 0; i < arr.length; i++) {
  //     let obj = arr[i];
  //     ids.push(obj.name);
  //   }
  //   return ids;
  // }

  // const [statuses] = useState([
  //   { name: 1, code: "NY" },
  //   { name: 0, code: "RM" },
  // ]);
  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.status ? "Hiển thị" : "Ẩn"}
        severity={getSeverity(rowData.status)}
      />
    );
  };

  const statusRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={statusItemTemplate}
        placeholder="Chọn"
        className="p-column-filter"
        showClear
        optionLabel="code"
        style={{ minWidth: "12rem" }}
      />
    );
  };
  const getSeverity = (status) => {
    switch (status) {
      case 0:
        return "danger";

      case 1:
        return "success";
    }
  };
  const statusItemTemplate = (option) => {
    return (
      <Tag value={option ? "Hiển thị" : "Ẩn"} severity={getSeverity(option)} />
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
          selection={selectedData}
          onSelectionChange={(e) => {
            setSelectedData(e.value);
          }}
        >
          <Column selectionMode="multiple" exportable={false}></Column>

          <Column
            header="#"
            headerStyle={{ width: "3rem" }}
            body={(data, options) => options.rowIndex + 1}
          ></Column>

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
