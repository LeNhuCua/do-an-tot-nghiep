import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { ScrollPanel } from "primereact/scrollpanel";
import React, { useState, useRef, Fragment, useEffect, useMemo } from "react";
import { API_IMAGES } from "../../../API";
import removeAccents from "../../../hook/admin/RemoAccents";
import Pagination from "./Pagination";
let PageSize = 10;
const SearchProducts = (props) => {
  const { products, addToInvoice } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [focused, setFocused] = useState(false); // thêm state cho việc kiểm tra focus
  const inputRef = useRef(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const handleClick = (size) => {
    setSelectedSize(size);
  };

  console.log(selectedSize);
  const filteredProducts = products.filter(
    (product) =>
      removeAccents(product.name.toLowerCase()).includes(
        removeAccents(searchTerm.toLowerCase())
      ) ||
      removeAccents(product.productId.toLowerCase()).includes(
        removeAccents(searchTerm.toLowerCase())
      )
  );

  console.log(
    filteredProducts ? filteredProducts.map((p) => p.product_size[0]) : ""
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
  const [currentPage, setCurrentPage] = useState(1);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return products.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, products]);
  console.log(products);
  return (
    <div className="w-full">
      <div className="p-inputgroup relative">
        <InputText
          placeholder={focused ? "" : "Nhập tên hoặc mã sản phẩm"} // chỉ hiển thị placeholder khi ô input không được focus
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
                  className="flex  flex-wrap w-full  p-3 align-items-center gap-3 hover:cursor-pointer hover:bg-blue-100 rounded-lg"
                >
                  <img
                    className="w-16 shadow-2 flex-shrink-0 border-round"
                    src={`${API_IMAGES}/${product.avatar}`}
                    alt={product.name}
                  />

                  <div className="flex-1 flex flex-column gap-2 xl:mr-8">
                    <span className="font-bold">{product.name}</span>
                    <div className="flex align-items-center gap-2">
                      <i className="pi pi-tag text-sm"></i>
                      <span>{product.productId}</span>
                    </div>
                    <div className="flex gap-3 border-t py-4">
                      {product.product_size.map((size) => (
                        <Fragment key={size.size[0].sizeValue}>
                          <div className="flex gap-3">
                            <button
                              className={`px-4 font-bold shadow-2xl  border-2 rounded-lg h-12 relative ${
                                selectedSize === size
                                  ? "border-2 border-black"
                                  : ""
                              }`}
                              onClick={() => handleClick(size)}
                              onDoubleClick={() => {
                                addToInvoice(product, product.productId, size);
                              }}
                            >
                              {size.size[0].sizeValue}
                            </button>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex ">
                      {product.product_size.map((size) => (
                        <div key={size.size[0].sizeValue}>
                          {selectedSize === size && (
                            <div>
                              <h2 className="text-red-500  text-xl font-bold">
                                {new Intl.NumberFormat({
                                  style: "currency",
                                  currency: "JPY",
                                }).format(size.price)}
                                <span> VNĐ</span>
                              </h2>
                              <div>
                                <span>Hàng tồn: {size.number}</span>
                              </div>
                              <span>{size.weight} </span>
                              <span>{size.unit.name}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* <span className="font-bold text-900">
                    ${" "}
                    {new Intl.NumberFormat({
                      style: "currency",
                      currency: "JPY",
                    }).format(product.price)}{" "}
                    VNĐ
                  </span> */}
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
      <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 mt-2 gap-3">
        {currentTableData.map((product) => (
          <div
            key={product.productId}
            className="flex relative flex-col min-h-[15.75rem] border p-2 rounded-lg"
          >
            <div className="flex flex-col flex-1">
              <div className="text-sm">
                <p>{product.productId}</p>
              </div>
              <div className="flex-1 text-sm">
                <p className="font-bold">{product.name}</p>
              </div>
              <div className="flex flex-col flex-1 mt-auto min-h-[6.25rem]">
                <div className="flex gap-3 flex-1 border-t py-2">
                  {product.product_size.map((size) => (
                    <Fragment key={size.size[0].sizeValue}>
                      <div className="flex gap-3">
                        <button
                          className={`px-2 font-bold shadow-2xl  border-2 rounded-lg h-8 relative ${
                            selectedSize === size ? "border-2 border-black" : ""
                          }`}
                          onClick={() => handleClick(size)}
                          onDoubleClick={() => {
                            addToInvoice(product, product.productId, size);
                          }}
                        >
                          {size.size[0].sizeValue}
                        </button>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <div className="">
                  <div className="flex flex-1 ">
                    {product.product_size.map((size) => (
                      <div key={size.size[0].sizeValue}>
                        {selectedSize === size && (
                          <div className="flex flex-col flex-1 absolute bottom-0 right-1">
                            <h2 className="text-red-500 text-sm font-bold">
                              {new Intl.NumberFormat({
                                style: "currency",
                                currency: "JPY",
                              }).format(size.price)}
                              <span> VNĐ</span>
                            </h2>
                            <div className="text-sm">
                              <span>{size.weight} </span>
                              <span>{size.unit.name}</span>
                              {/* <span>{size.number}</span> */}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-5">
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={products.length}
          pageSize={PageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default SearchProducts;
