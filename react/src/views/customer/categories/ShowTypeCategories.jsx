import React, {  useEffect, useState } from "react";


import { useParams } from "react-router-dom";

import axios from "axios";
import { API } from "../../../API";
import ProductList from "../../../components/customer/products/ProductList";
import Product from "../../../components/customer/products/Product";
import Loading from "../../../components/Loading";
import ReactPaginate from "react-paginate";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import "./style.css";

const ShowTypeCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { alias } = useParams();
  const [pageCount, setPageCount] = useState(0);

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    
    // update URL with page number
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("page", selectedPage);
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
    fetchProductTypeCategories(selectedPage);

  };
  

  useEffect(() => {
    fetchProductTypeCategories();
  }, [alias]);

  const fetchProductTypeCategories = async (pageNumber = 1) => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get("page") || pageNumber;
    const response = await axios.get(
      `${API}/api/cus-products/showTypeCategories?alias=${alias}&&page=${page}`
    );
    setCategories(response.data.data);
    setPageCount(response.data.last_page);
    setLoading(false);

  };
  

  return (
    <div>
      {loading ? (
        <Loading />
      ) : categories.length > 0 ? (
        <section className="cs-container my-4">
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
      ) : (
        <div>
          <h1 className="text-center mt-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            Hiện tại không có sản phẩm nào
          </h1>
        </div>
      )}
    </div>
  );
  
};

export default ShowTypeCategories;
