import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import axios from "axios";
import { API } from "../../../API";
import ProductList from "../../../components/customer/products/ProductList";
import Product from "../../../components/customer/products/Product";
import Loading from "../../../components/Loading";
import ReactPaginate from "react-paginate";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import "./style.css";
import { Dropdown } from "primereact/dropdown";
import { CCol } from "@coreui/react";
import Breadcrumb from "../../../components/customer/breadcrumb/Breadcrumb";

const ShowCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { alias } = useParams();
  const [pageCount, setPageCount] = useState(0);

  const [fillPrice, setFillPrice] = useState("");
  const fillPriceOption = [
    { name: "Tất cả", code: "" },

    { name: "Dưới 2 triệu", code: "lessTwo" },
    { name: "Từ 2 đến 6 triệu", code: "betweenTwoAndSix" },
    { name: "Từ 6 đến 10 triệu", code: "betweenSixAndTen" },
    { name: "Từ 10 đến 20 triệu", code: "betweenTenAndTwenty" },
    { name: "Trên 20 triệu", code: "greaterTwenty" },
  ];

  const [sort, setSort] = useState("");
  const sortOption = [
    { name: "Giá thấp đến cao", code: "price-asc" },
    { name: "Giá cao đến thấp", code: "price-desc" },
    { name: "Tên A-Z", code: "name-asc" },
    { name: "Tên Z-A", code: "name-desc" },
    { name: "Bán chạy", code: "best-selling" },
  ];
  useEffect(() => {
    if (sortOption) {
      setSort(sortOption[1]);
    }
    if (fillPriceOption) {
      setFillPrice(fillPriceOption[0]);
    }
  }, []);

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;

    // update URL with page number
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("page", selectedPage);
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
    fetchProductCategories(selectedPage);
  };

  useEffect(() => {
    fetchProductCategories();
  }, [alias, sort.code, fillPrice.code]);
  const [pageName,setPageName] = useState("")
  const [parentPageName,setParentPageName] = useState({})
  
  const fetchProductCategories = async (pageNumber = 1) => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get("page") || pageNumber;
    // const response = await axios.get(
    //   `${API}/api/cus-products/showCategories?alias=${alias}&&page=${page}&&sortRating=${sortRating}&&sortPrice=${sortPrice}`
    // );
    const response = await axios.get(
      `${API}/api/cus-products/showTypeCategories?alias=${alias}&&page=${page}&&sort=${sort.code}&&fillPrice=${fillPrice.code}`
    );
    setCategories(response.data.data.data);
    setPageCount(response.data.data.last_page);
    setPageName(response.data.typeCategoryName[0])
    
    setParentPageName(response.data.categoryName[0])

    console.log(response.data.categoryName[0]);
    setLoading(false);

  };
  const ListBreadcrumb = [
    {
      name: parentPageName.name,
      link:`/danhmuc/${parentPageName.alias}`,
    },
    {
      name: pageName
    },
  ];
  // console.log(parentPageName.name);
  return (
    <div className="">
            <Breadcrumb ListBreadcrumb={ListBreadcrumb} />

      <div className="row container">
        <CCol xl={6}>
          <span>Sắp xếp theo</span>
          <Dropdown
            filter
            value={sort}
            onChange={(e) => setSort(e.value)}
            options={sortOption}
            optionLabel="name"
            placeholder={sortOption[1].name}
            className="w-full md:w-14rem"
          />
        </CCol>
        <CCol xl={6}>
          {/* <label for="fill-price">Khoảng giá</label>
              <select
                id="fill-price"
                value={fillPrice}
                onChange={(e) => setFillPrice(e.target.value)}
              >
                <option value="">Chọn giá tiền</option>
                <option value="nho">Nhỏ hơn 1 triệu</option>
                <option value="lon">Lớn hơn 1 triệu</option>
              </select> */}
          <span>Mức giá</span>
          <Dropdown
            filter
            value={fillPrice}
            onChange={(e) => setFillPrice(e.value)}
            options={fillPriceOption}
            optionLabel="name"
            placeholder="Tất cả"
            className="w-full md:w-14rem"
          />
        </CCol>
      </div>
      {loading ? (
        <Loading />
      ) : categories.length > 0 ? (
        <section className="cs-container my-4 flex flex-col gap-4">
          {/* <label for="sort">Sắp xếp theo</label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="price-asc">Giá Thấp tới thấp</option>
            <option value="price-desc">Giá Cao tới thấp</option>
            <option value="name-asc">Tên A-Z</option>
            <option value="name-desc">Tên Z-A</option>
            <option value="best-selling">Bán chạy</option>
          </select> */}

          <ProductList>
            {categories.map((category) => (
              <Product key={category.productId} data={category} />
            ))}
          </ProductList>
          <ReactPaginate
            previousLabel={<AiOutlineArrowLeft />}
            nextLabel={<AiOutlineArrowRight />}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
        </section>
      )  : (
        <div>
          <h1 className="text-center mt-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            Hiện tại không có sản phẩm nào
          </h1>
        </div>
      )}
    </div>
  );
};

export default ShowCategories;
