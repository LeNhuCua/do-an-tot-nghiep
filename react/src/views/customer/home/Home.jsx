import React, { useContext, useEffect, useMemo, useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { MdNavigateNext } from "react-icons/md";

import Slides from "../../../components/customer/slides/Slides";
import TextHeading from "../../../components/customer/textHeading/TextHeading";

import { features } from "../../../data";

import FeatureList from "../../../components/customer/features/FeatureList";
import Feature from "../../../components/customer/features/Feature";

import ProductList from "../../../components/customer/products/ProductList";
import Product from "../../../components/customer/products/Product";
import ProductSlide from "../../../components/customer/products/ProductSlide";
import { Pagination } from "react-bootstrap";
import "./style.css";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { API } from "../../../API";
import { SlideContext } from "../../../context/customer/SlideContext";
import {
  AiFillAccountBook,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineLeft,
  AiOutlineRight,
} from "react-icons/ai";
import { Paginator } from "primereact/paginator";
import { DataContext } from "../../../context/DataContext";

const Home = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [bestProduct, setBestProduct] = useState([]);

  const { swiperRef, swiperRef1 } = useContext(SlideContext);

  const [pageCount, setPageCount] = useState(0);

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    fetchProducts(selectedPage);
  };

  useEffect(() => {
    if (newProducts.length === 0) {
      fetchProducts();
    }
  }, []);

  const fetchBestProduct = async () => {
    const response = await axios.get(`${API}/api/cus-products/bestProduct`);
    setBestProduct(response.data);
  };

  useEffect(() => {
    fetchBestProduct();
  }, []);

  const fetchProducts = async (pageNumber = 1) => {
    const response = await axios.get(
      `${API}/api/cus-products/newProducts?page=${pageNumber}`
    );
    setNewProducts(response.data.data);
    setPageCount(response.data.last_page);
  };

  const { state, dispatch } = useContext(DataContext);

  const { hotProducts } = state;


  useEffect(() => {
  
      fetchHotProducts();
   
  }, []);
  const fetchHotProducts = async () => {
    await axios.get(`${API}/api/cus-products/hotProducts`).then(({ data }) => {
      dispatch({ type: "FETCH_HOTPRODUCTS", payload: data });
     
    });
  };
  console.log(newProducts);
  return (
    <div className="flex flex-col gap-24">
      <div>
        <Slides />
        <FeatureList>
          {features.map((feature) => (
            <Feature key={feature.id} data={feature} />
          ))}
        </FeatureList>
      </div>

      <div className="cs-container  ">
        <TextHeading after="Products">Sản phẩm mới</TextHeading>
      </div>

      <section className="cs-container">
        <ProductList>
          {newProducts.map((product) => (
            <Product key={product.productId} data={product} />
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
        {/* <div className="card">
          <Paginator
            first={currentPage}
            rows={newProducts}
            totalRecords={totalPages}
            rowsPerPageOptions={[10, 20, 30]}
            onPageChange={handlePageChange}
          />
        </div> */}
      </section>

      <section className="flex flex-col gap-20 cs-container ">
        <div className="flex justify-between items-center">
          <TextHeading after="hot">Sản phẩm hot</TextHeading>
          <div className="flex gap-4">
            <div
              onClick={() => swiperRef.current?.slidePrev()}
              className="cursor-pointer  w-[3.2rem] h-[3rem] bg-[rgba(0,0,0,0.3)] text-gray-950 hover:text-white hover:bg-black transition-all duration-300  flex items-center justify-center border-0"
            >
              <AiOutlineLeft size={20} />
            </div>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="cursor-pointer  w-[3.2rem] h-[3rem] bg-[rgba(0,0,0,0.3)] text-gray-950 hover:text-white hover:bg-black transition-all duration-300  flex items-center justify-center border-0"
            >
              <AiOutlineRight size={20} />
            </button>
          </div>
        </div>
        <div className="">
          <ProductSlide swiperRef={swiperRef} data={hotProducts} />
        </div>
      </section>

      <section className="flex flex-col gap-20 cs-container ">
        <div className="flex justify-between items-center">
          <TextHeading after="Best">Sản phẩm bán chạy</TextHeading>
          <div className="flex gap-4">
            <div
              onClick={() => swiperRef1.current?.slidePrev()}
              className="cursor-pointer  w-[3.2rem] h-[3rem] bg-[rgba(0,0,0,0.3)] text-gray-950 hover:text-white hover:bg-black transition-all duration-300  flex items-center justify-center border-0"
            >
              <AiOutlineLeft size={20} />
            </div>
            <button
              onClick={() => swiperRef1.current?.slideNext()}
              className="cursor-pointer  w-[3.2rem] h-[3rem] bg-[rgba(0,0,0,0.3)] text-gray-950 hover:text-white hover:bg-black transition-all duration-300  flex items-center justify-center border-0"
            >
              <AiOutlineRight size={20} />
            </button>
          </div>
        </div>

        <ProductSlide swiperRef={swiperRef1} data={bestProduct} />
      </section>
    </div>
  );
};

export default Home;
