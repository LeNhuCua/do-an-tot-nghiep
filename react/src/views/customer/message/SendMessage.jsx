import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { SelectButton } from "primereact/selectbutton";
import axios from "axios";
import XMLParser from "react-xml-parser";
import { BsDot } from "react-icons/bs";
import { BiGridSmall, BiGridVertical } from "react-icons/bi";
import { AiFillGold, AiOutlineGold, AiTwotoneGold } from "react-icons/ai";

export default function SizeDemo() {
  const [data, setData] = useState([]);
  const [sizeOptions] = useState([
    { label: <BsDot />, value: "small" },
    { label: <BiGridSmall />, value: "normal" },
    { label: <BiGridVertical />, value: "large" },
  ]);

  const [size, setSize] = useState(sizeOptions[1].value);
  const [updateDay, setUpdateDay] = useState({});
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://cors-anywhere.herokuapp.com/https://sjc.com.vn/xml/tygiavang.xml`
      );
      const xml = new XMLParser().parseFromString(response.data);
      const dataArray = xml.children[2].children;
      setUpdateDay(xml.children[2].attributes);
      setData(dataArray);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="cs-container">
      <div className="my-2">
        <div>
          <h3 className="text-2xl">Giá vàng hôm nay</h3>
          <div className="flex gap-x-6 gap-y-2 flex-wrap">
            <h3 className="text-sm">
              Đơn vị tính <span className="font-bold">{updateDay.unit}</span>
            </h3>
            <h3 className="text-sm">
              Cập nhật lúc{" "}
              <span className="font-bold">{updateDay.updated}</span>
            </h3>
          </div>
          <h3 className="text-lg">
            Nguồn <span className="font-bold">http://www.sjc.com.vn/</span>
          </h3>
        </div>

        <div className="flex justify-content-center mb-4">
          <SelectButton
            value={size}
            onChange={(e) => setSize(e.value)}
            options={sizeOptions}
          />
        </div>
        <DataTable
          selectionMode="single"
          value={data}
          size={size}
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column field="attributes.name" header="Thành phố"></Column>

          <Column
            field="children"
            header="Loại vàng"
            body={(rowData) => (
              <div >
                {rowData.children.map((child, index) => (
                  <p   key={index}>{child.attributes.type}</p>
                ))}
              </div>
            )}
          ></Column>
          <Column
            field="children"
            header="Mua vào"
            body={(rowData) => (
              <div>
                {rowData.children.map((child, index) => (
                  <p key={index}>{child.attributes.buy}</p>
                ))}
              </div>
            )}
          ></Column>
          <Column
            field="children"
            header="Bán ra"
            body={(rowData) => (
              <div>
                {rowData.children.map((child, index) => (
                  <p key={index}>{child.attributes.sell}</p>
                ))}
              </div>
            )}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
