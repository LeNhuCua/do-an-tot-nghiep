import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import "./styles.css";
import { FreeMode, Navigation } from "swiper";
import Product from "./Product";

export default function ProductSlide({ swiperRef, data }) {
  if (!data) {
    return <p>Đang tai</p>;
  }

  return (
    <div className="flex flex-1 z-30">
      <Swiper
        className="flex flex-1"
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        modules={[FreeMode, Navigation]}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 50,
          },
        }}
      >
        {data.map((product, i) => (
          <SwiperSlide className="flex flex-col justify-center" key={i}>
            <div className="flex flex-1 justify-center">
              <Product className="bg-black product-slide" data={product} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
