import axios from "axios";
import React, { useRef, useState } from "react";
import { API, API_IMAGES } from "../../API";
import { InputText } from "primereact/inputtext";
import { AiOutlineSearch } from "react-icons/ai";
import { ScrollPanel } from "primereact/scrollpanel";
import { ProgressSpinner } from "primereact/progressspinner";
import { Link } from "react-router-dom";
import useOnClickOutsideRef from "../../hook/OnClickOutside";

const Search = (props) => {
  const { searchTerm, setSearchTerm } = props;
  const [searchResults, setSearchResults] = useState([]);
  const [focused, setFocused] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasResults, setHasResults] = useState(true); // Thêm state để theo dõi trạng thái có dữ liệu tìm kiếm hay không

  const handleFocus = () => {
    setFocused(true);
  };

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setIsLoading(true);
    setHasResults(true); // Reset trạng thái có dữ liệu tìm kiếm

    setTypingTimeout(
      setTimeout(async () => {
        try {
          const response = await axios.get(
            `${API}/api/cus-products/search?term=${term}`
          );
          const data = response.data;
          console.log(data);
          setSearchResults(data.results);
          setHasResults(data.results.length > 0); // Cập nhật trạng thái có dữ liệu tìm kiếm dựa trên kết quả trả về
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }, 1000)
    );
  };
  const dropdownRef = useOnClickOutsideRef(() => {
    setFocused(false);
  });

  const handleClearSearch = () => {
    setSearchTerm("");
  };
  return (
    <div className="relative" ref={dropdownRef}>
      <div className="border relative rounded-full bg-gray-200  py-1 px-4 items-center hidden md:flex">
        <input
          className="focus:ring-0 bg-transparent focus:outline-none outline-none active:border-red-700 border-none placeholder:text-black placeholder:text-xs "
          type="text"
          placeholder="Nhập từ cần tìm kiếm ..."
          value={searchTerm}
          onChange={handleSearch}
          onFocus={handleFocus}

          //   onBlur={handleBlur}
        />
        {searchTerm && (
          <span className="absolute top-3 cursor-pointer hover:text-green-700 z-50 right-14">
            <i className="pi pi-times" onClick={handleClearSearch}></i>
          </span>
        )}
        <button>
          <AiOutlineSearch
            type="submit"
            className="block text-3xl cs-hover focus:bg-red-400"
          />
        </button>
      </div>
      {focused ? (
        <div className="absolute  w-full  z-[9999]  bg-white shadow-md ">
          {focused && searchTerm === "" && <small>Tìm kiếm thông tin </small>}

          <div className="min-h-[30vh] p-1">
            {isLoading ? (
              <div className=" flex justify-content-center mt-4">
                <ProgressSpinner
                  style={{ width: "50px", height: "50px" }}
                  strokeWidth="8"
                  fill="var(--surface-ground)"
                  animationDuration=".5s"
                />
              </div>
            ) : (
              <div>
                {searchTerm &&
                  searchResults.map((result) => (
                    <Link
                      to={`/sanpham/${result.alias}`}
                      key={result.productId}
                      className="flex relative  no-underline z-[999999999] flex-wrap w-full  p-3 align-items-center gap-3 hover:cursor-pointer hover:bg-blue-100 rounded-lg"
                    >
                      <img
                        className="w-16 shadow-2 flex-shrink-0 border-round"
                        src={`${API_IMAGES}/${result.avatar}`}
                        alt={result.name}
                      />
                      <div className="flex-1 flex flex-column gap-2 xl:mr-8">
                        <span className="font-bold text-black">
                          {result.name.length > 18
                            ? result.name.substring(0, 23) + "..."
                            : result.name}
                        </span>

                        <div className="flex align-items-center gap-2 text-red-700">
                          <i className="pi pi-dollar text-sm"></i>
                          <span className="">
                            {" "}
                            {new Intl.NumberFormat({
                              style: "currency",
                              currency: "JPY",
                            }).format(result.min_price2)}
                            <span> VNĐ</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                {searchTerm && searchResults.length > 0 && (
                  <div className="border-t text-right ">
                    <Link
                      className="no-underline italic font-semibold"
                      to={`/timkiem/${searchTerm}`}
                    >
                      Xem tất cả
                    </Link>
                  </div>
                )}
              </div>
            )}

            {!isLoading && !hasResults && (
              <small>Không tìm thấy sản phẩm bạn đang tìm kiếm!</small>
            )}
          </div>
          {/* {isLoading && <div>Loading...</div>}

        {!isLoading && !hasResults && <div>Không có dữ liệu tìm kiếm</div>}

        {searchTerm &&
          searchResults.map((result) => (
            <div key={result.id}>{result.name}</div>
          ))} */}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Search;
