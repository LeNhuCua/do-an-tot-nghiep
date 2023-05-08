import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { ScrollPanel } from "primereact/scrollpanel";
import React, { useState, useRef } from "react";
import { API_IMAGES } from "../../../API";
import removeAccents from "../../../hook/admin/RemoAccents";

const SearchProducts = (props) => {
  const { products, addToInvoice } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [focused, setFocused] = useState(false); // thêm state cho việc kiểm tra focus
  const inputRef = useRef(null);

  const filteredProducts = products.filter(
    (product) =>
      removeAccents(product.name.toLowerCase()).includes(
        removeAccents(searchTerm.toLowerCase())
      ) ||
      removeAccents(product.productId.toLowerCase()).includes(
        removeAccents(searchTerm.toLowerCase())
      ) ||
      removeAccents(product.type_category.name.toLowerCase()).includes(
        removeAccents(searchTerm.toLowerCase())
      ) ||
      removeAccents(product.unit.name.toLowerCase()).includes(
        removeAccents(searchTerm.toLowerCase())
      ) ||
      removeAccents(product.product_type.name.toLowerCase()).includes(
        removeAccents(searchTerm.toLowerCase())
      )
  );

  const handleSearch = (event) => {
    setSearching(true);
    setSearchTerm(event.target.value);
    setTimeout(() => {
      setSearching(false);
    }, 500); // simulate delay in searching
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    inputRef.current.value = "";
  };

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  return (
    <div>
      <div className="p-inputgroup relative">
        <InputText
          placeholder={focused ? "" : "Nhập thông tin sản phẩm tìm kiếm "} // chỉ hiển thị placeholder khi ô input không được focus
          value={searchTerm}
          onChange={handleSearch}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ref={inputRef}
        />
        <span className="p-inputgroup-addon">
          <i className="pi pi-search"></i>
        </span>
      </div>
      {searchTerm && (
        <span className="absolute top-3 cursor-pointer hover:text-green-700 z-50 right-14">
          <i className="pi pi-times" onClick={handleClearSearch}></i>
        </span>
      )}
      <div className="absolute w-full z-50 bg-white top-14">
        {focused && searchTerm === "" && <p>Tìm kiếm thông tin</p>}
        {searchTerm && (
          <ScrollPanel className="h-[80vh]">
            {searching ? (
              <div className=" flex justify-content-center mt-4">
                <ProgressSpinner
                  style={{ width: "50px", height: "50px" }}
                  strokeWidth="8"
                  fill="var(--surface-ground)"
                  animationDuration=".5s"
                />
              </div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.productId}
                  onClick={() => addToInvoice(product, product.productId)}
                  className="grid lg:grid-cols-6 grid-cols-1  flex-wrap w-full  p-3 align-items-center gap-3 hover:cursor-pointer hover:bg-blue-100 rounded-lg"
                >
                  <img
                    className="w-16 shadow-2 flex-shrink-0 border-round col-span-1 "
                    src={`${API_IMAGES}/${product.avatar}`}
                    alt={product.name}
                  />
                  <div className="flex-1 flex flex-column gap-2 xl:mr-8 col-span-1  lg:col-span-3 ">
                    <span className="font-bold">{product.name}</span>
                    <div className="flex align-items-center gap-2">
                      <i className="pi pi-tag text-sm"></i>
                      <span>{product.productId}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 col-span-2 items-start lg:items-end">
                    <span className="font-bold text-900">
                      ${" "}
                      {new Intl.NumberFormat({
                        style: "currency",
                        currency: "JPY",
                      }).format(product.price)}{" "}
                      VNĐ
                    </span>
                    <span className="text-900">
                      {product.type_category.name}
                    </span>
                    <span className="font-bold text-900">
                    {product.weight} {product.unit.name}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div>
                <h4>Không có sản phẩm nào được tìm thấy</h4>
              </div>
            )}
          </ScrollPanel>
        )}
      </div>
    </div>
  );
};

export default SearchProducts;
