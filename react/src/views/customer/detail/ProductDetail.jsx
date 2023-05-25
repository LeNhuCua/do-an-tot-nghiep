import React, { Fragment, useContext, useEffect, useState } from "react";
import { BsArrowBarRight, BsCartPlusFill } from "react-icons/bs";

import { useNavigate, useParams } from "react-router-dom";
import { Galleria } from "primereact/galleria";
import { InputNumber } from "primereact/inputnumber";

import Loading from "../../../components/Loading";
import axios from "axios";
import { API, API_IMAGES } from "../../../API";
import { Rating } from "primereact/rating";
import { TabPanel, TabView } from "primereact/tabview";
import { Editor } from "primereact/editor";
import TextHeading from "../../../components/customer/textHeading/TextHeading";
import { SlideContext } from "../../../context/customer/SlideContext";
import { DataContext } from "../../../context/DataContext";
import { AiOutlineLeft, AiOutlineRight, AiOutlineSend } from "react-icons/ai";
import ProductSlide from "../../../components/customer/products/ProductSlide";
import { useStateContext } from "../../../context/ContextProvider";
import Swal from "sweetalert2";
import axiosClient from "../../../axios-client-customer";
import UseTitle from "../../../hook/UseTitle";

const ProductDetail = () => {
  const { alias } = useParams();

  const [numberBuy, setNumberBuy] = useState(1);
  const [voteRating, setVoteRating] = useState(5);
  const { tokenCustomer, user } = useStateContext();
  const [detailProduct, setDetailProduct] = useState([]);
  const [detailImagesProduct, setDetailImagesProduct] = useState([]);
  const [detailSizesProduct, setDetailSizesProduct] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const handleClick = (size) => {
    setSelectedSize(size);
  };

  const { swiperRef, swiperRef1 } = useContext(SlideContext);
  const { state, dispatch } = useContext(DataContext);
  const { hotProducts } = state;
  const [loading, setLoading] = useState(true);
  const [loadingCart, setLoadingCart] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedSize(detailSizesProduct[0]);
  }, [detailSizesProduct]);

  // const fetchHotProducts = async () => {
  //   await axios.get(`${API}/api/cus-products/hotProducts`).then(({ data }) => {
  //     dispatch({ type: "FETCH_HOTPRODUCTS", payload: data });
  //     setLoading(false);
  //   });
  // };
  const fetchTotalCart = async () => {
    axiosClient.get(`${API}/api/cart/totalCart`).then((res) => {
      dispatch({
        type: "FETCH_TOTAL_CART",
        payload: res.data[0].total_cart,
      });
    });
  };
  const relatedProducts = async () => {
    await axios
      .get(`${API}/api/cus-products/relatedProducts?alias=${alias}`)
      .then(({ data }) => {
        dispatch({ type: "FETCH_HOTPRODUCTS", payload: data.relatedProduct });
        setLoading(false);
      });
  };
  useEffect(() => {
    relatedProducts();
  }, [alias]);

  const addToCart = async () => {
    if (!tokenCustomer || !user) {
      const isConfirm = await Swal.fire({
        title: `Bạn cần phải đăng nhập để sử dụng chức năng này ?`,
        text: "Chuyển đến trang đăng nhập!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Xác nhận!",
        cancelButtonText: "Huỷ bỏ!",
      }).then((result) => {
        return result.isConfirmed;
      });
      if (!isConfirm) {
        return;
      }
      navigate("/dangnhap");
    } else {
      setLoadingCart(true);
      const formData = new FormData();
      formData.append("quantity", numberBuy);
      formData.append("selectedSize", JSON.stringify(selectedSize));
      // formData.append(
      //   "productId",
      //   detailProduct[0] ? detailProduct[0].productId : ""
      // );

      await axiosClient.post(`${API}/api/cart`, formData).then((response) => {
        setLoadingCart(false);

        if (response.data.status === 400) {
          const resData = response.data.cart;

          // Thêm loại sản phẩm mới vào danh sách loại sản phẩm trong context
          // dispatch({ type: "ADD_PRODUCTS", payload: createProducts });
          Swal.fire({
            icon: "success",
            title: "Sản phẩm đã được thêm vào giỏ hàng!",
            showConfirmButton: false,
            timer: 1500,
          });

          fetchTotalCart();
        } else {
          Swal.fire({
            icon: "error",
            text: "Vui lòng kiểm tra lại thông tin!",
          });
        }
      });
    }
  };

  const responsiveOptions = [
    {
      breakpoint: "991px",
      numVisible: 4,
    },
    {
      breakpoint: "767px",
      numVisible: 3,
    },
    {
      breakpoint: "575px",
      numVisible: 2,
    },
  ];
  const itemTemplate = (item) => {
    return (
      <div className="item-navigation my-3">
        <img
          src={`${API_IMAGES}/${item.image}`}
          alt={"ảnh"}
          style={{ width: "100%", display: "block" }}
        />
      </div>
    );
  };

  const thumbnailTemplate = (item) => {
    return (
      <div className="bg-gray-300">
        <img
          src={`${API_IMAGES}/${item.image}`}
          alt={"ảnh"}
          style={{ display: "block" }}
        />
      </div>
    );
  };

  useEffect(() => {
    const fetchDetailProduct = async () => {
      try {
        const { data } = await axios.get(
          `${API}/api/cus-products/showDetail?alias=${alias}`
        );
        setDetailProduct(data.productDetail);
        setDetailImagesProduct(data.productDetail[0].product_image);
        setDetailSizesProduct(data.productDetail[0].product_size);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDetailProduct();
  }, [alias]);

  // if(detailProduct.length > 0) {
  //   UseTitle(detailProduct[0].name);
  // }

  if (detailProduct.length <= 0) {
    return <Loading />;
  }
  console.log(detailSizesProduct);

  //   const [position, setPosition] = useState('bottom');
  return (
    <div className="cs-container mt-5 flex flex-col gap-16">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
        <div className="">
          {detailProduct && detailImagesProduct.length > 0 ? (
            <>
              <div className="card flex justify-center items-center py-3">
                <Galleria
                  value={detailImagesProduct}
                  responsiveOptions={responsiveOptions}
                  numVisible={5}
                  circular
                  style={{ maxWidth: "640px" }}
                  showItemNavigators
                  showItemNavigatorsOnHover
                  item={itemTemplate}
                  thumbnail={thumbnailTemplate}
                />
              </div>
            </>
          ) : (
            ""
          )}
        </div>
        <div className="flex flex-col gap-4 px-5">
          <div className="flex flex-col gap-3">
            <h1 className="text-[1.875rem] font-bold text-[#313131] uppercase ">
              {detailProduct[0] ? detailProduct[0].name : ""}
            </h1>
            <h1 className="text-[1.275rem] font-semibold text-[#313131]  ">
              Mã:{" "}
              <span className="text-gray-500">
                {" "}
                {detailProduct[0] ? detailProduct[0].productId : ""}
              </span>
            </h1>
            <div className="flex gap-2">
              <Rating
                value={detailProduct[0] ? detailProduct[0].rating : ""}
                readOnly
                cancel={false}
              />
              <span className="text-yellow-600">
                ({detailProduct[0] ? detailProduct[0].numberRate : ""} lượt đánh
                giá)
              </span>
            </div>
            <div className="flex gap-3 border-t py-4">
              {detailSizesProduct.map((size) => (
                <Fragment key={size.size[0].sizeValue}>
                  <div className="flex gap-3">
                    <button
                      className={`px-4 font-bold shadow-2xl  border-2 rounded-lg h-12 relative ${
                        selectedSize === size ? "border-2 border-black" : ""
                      }`}
                      onClick={() => handleClick(size)}
                    >
                      {size.size[0].sizeValue}
                    </button>
                  </div>
                </Fragment>
              ))}
            </div>
            <div className="flex ">
              {detailSizesProduct.map((size) => (
                <div key={size.size[0].sizeValue}>
                  {selectedSize === size && (
                    <h2 className="text-red-500  text-3xl font-bold">
                      {new Intl.NumberFormat({
                        style: "currency",
                        currency: "JPY",
                      }).format(size.price)}
                      <span> VNĐ</span>
                    </h2>
                  )}
                </div>
              ))}
            </div>
            {/* <div className="flex gap-3">
              <h2 className="text-red-500  text-3xl font-bold">
                {new Intl.NumberFormat({
                  style: "currency",
                  currency: "JPY",
                }).format(detailProduct[0] ? detailProduct[0].price : "")}
                <span> VNĐ</span>
              </h2>
            </div> */}
          </div>
          <div className="flex  items-center border-t border-b py-2">
            <ol className="flex flex-col gap-3 list-decimal">
              <li className="text-lg px-2 py-1   ">
                Giá sản phẩm thay đổi tuỳ trọng lượng vàng và đá quý
              </li>
              <li className="text-lg px-2 py-1   ">
                Hỗ trợ trả góp 0% qua thẻ tín dụng
              </li>{" "}
              <li className="text-lg px-2 py-1   ">
                Hỗ trợ đổi sản phẩm trong 24h tại cửa hàng Kim Huy ( sản phẩm
                sai ni , size ).
              </li>{" "}
              <li className="text-lg px-2 py-1   ">
                Giao nhanh nội thành Nha Trang trong 3h
              </li>
            </ol>
          </div>
          <div className=" flex items-center  pt-2">
            <div className="card flex justify-content-center">
              <InputNumber
                value={numberBuy}
                onValueChange={(e) => setNumberBuy(e.value)}
                showButtons
                min="1"
                max="10"
                buttonLayout="horizontal"
                inputStyle={{ width: "3rem", textAlign: "center" }}
                decrementButtonClassName="p-button-secondary"
                incrementButtonClassName="p-button-secondary"
                incrementButtonIcon="pi pi-plus"
                decrementButtonIcon="pi pi-minus"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-3">
            <button
              onClick={addToCart}
              className="xl:w-72 flex justify-center items-center gap-2 py-2   border rounded-3xl bg-yellow-400 shadow-2xl hover:bg-gray-600 hover:text-yellow-400 transition-all duration-500"
            >
              <BsCartPlusFill />
              <h1 className="uppercase font-bold  text-xl translate-y-1">
                Thêm vào giỏ
              </h1>
            </button>
            <button className="xl:w-72 flex justify-center items-center gap-2 py-2 text-white  border rounded-3xl bg-red-600 shadow-3xl hover:bg-gray-600 hover:text-yellow-400 transition-all duration-500">
              <h1 className="uppercase font-bold text-xl translate-y-1">
                Mua ngay
              </h1>
              <BsArrowBarRight />
            </button>
          </div>
          <div className="flex flex-col gap-3 py-2">
            <div>
              <h1 className="inline text-gray-700 text-xl">Liên hệ: </h1>
              <span className="text-2xl text-red-600 font-bold">
                0909300746
              </span>{" "}
              <h2 className="text-gray-700 text-xl inline">
                ( để được tư vấn)
              </h2>
            </div>
          </div>
          <div className="card">
            <TabView>
              <TabPanel
                header="NỘI DUNG CHI TIẾT"
                leftIcon="pi pi-calendar mr-2"
              >
                <div className="m-0">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-red-600 text-2xl text-center font-bold">
                      Thông số và mô tả sản phẩm
                    </h2>
                    <div className="border-b-2">
                      <h3 className="text-red-600 text-lg">
                        Trọng lượng tham khảo:{" "}
                        <span className="text-gray-400">
                          {detailProduct[0].weight} {detailProduct[0].unit.name}
                        </span>
                      </h3>
                      <h3 className="text-red-600 text-lg">
                        Loại vàng:{" "}
                        <span className="text-gray-400">
                          {detailProduct[0].product_type.name}
                        </span>
                      </h3>
                      <h3 className="text-red-600 text-lg">
                        Size:{" "}
                        <span className="text-gray-400">
                          Liên hệ 0345 802 983 hoặc 02838 754 350 để được tư vấn
                          hoặc quý khách có thể tham khảo đo size trang sức tại
                          đây{" "}
                        </span>
                      </h3>
                    </div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: detailProduct[0].description,
                      }}
                    />
                  </div>
                </div>
              </TabPanel>
              <TabPanel header="ĐÁNH GIÁ" rightIcon="pi pi-calendar ml-2">
                <div
                  className=" flex justify-content-center"
                  style={{ minHeight: "20rem" }}
                >
                  <div className="">
                    <Rating
                      value={voteRating}
                      onChange={(e) => setVoteRating(e.value)}
                    />
                    <button className="xl:w-40 mt-4 flex justify-center items-center gap-2 py-2   border rounded-3xl bg-green-200 shadow-2xl hover:bg-gray-600 hover:text-yellow-400 transition-all duration-500">
                      <AiOutlineSend />
                      <h1
                        className="uppercase font-bold text-xl translate-y-1"
                        //   onClick={() => addToCart(findP, findP.id)}
                      >
                        Gửi
                      </h1>
                    </button>
                  </div>
                </div>
              </TabPanel>
            </TabView>
          </div>
        </div>
      </div>
      <div>
        <section className="flex flex-col gap-20 cs-container ">
          <div className="flex justify-between items-center">
            <TextHeading after="products">Sản phẩm liên quan</TextHeading>
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
      </div>

      {loadingCart && <Loading />}
    </div>
  );
};

export default ProductDetail;
