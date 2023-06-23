import React, { useContext, useEffect, useRef, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./style.css";

import { Pagination, Navigation, Autoplay } from "swiper";
import { IoChevronBackOutline } from "react-icons/io5";
import { MdNavigateNext } from "react-icons/md";

import { DataContext } from "../../../context/DataContext";
import { API, API_SLIDE_IMAGES } from "../../../API";
import axios from "axios";
import { Link } from "react-router-dom";
import axiosClient from "../../../axios-client-customer";
import { ProgressSpinner } from "primereact/progressspinner";

export default function Slides() {
  const swiperRef = useRef();

  const { state, dispatch } = useContext(DataContext);

  const { slides } = state;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slides.length === 0) {
      fetchSlides();
    } else {
      setLoading(false);
    }
  }, []);
  const fetchSlides = async () => {
    await axios.get(`${API}/api/cus-products/slides/`).then(({ data }) => {
      dispatch({ type: "FETCH_SLIDES", payload: data });
      setLoading(false);
    });
  };

  return (
    <div className="relative py-0 lg:py-5">
      {loading && (
        <div
          className="flex items-center justify-center bg-contain bg-center bg-no-repeat h-[200px] md:h-[300px] xl:h-[500px]"
        
        >
            <ProgressSpinner
                style={{ width: "50px", height: "50px" }}
                strokeWidth="8"
                fill="var(--surface-ground)"
                animationDuration=".5s"
              />

        </div>
      )}
      <Swiper
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        loop={true}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.slideId}>
            <Link to="/">
              <div
                className="flex items-center justify-center bg-contain bg-center bg-no-repeat h-[200px] md:h-[300px] xl:h-[500px]"
                style={{
                  backgroundImage: `url(${API_SLIDE_IMAGES}/${slide.image})`,
                }}
              ></div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute left-1 top-1/2 z-10 w-[3.125rem] h-[3.125rem] bg-[rgba(0,0,0,0.3)] text-gray-400 hover:text-white rounded-full flex items-center justify-center border-0"
      >
        <IoChevronBackOutline size={20} />
      </button>
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute   top-1/2 z-10 right-1 w-[3.125rem] h-[3.125rem] bg-[rgba(0,0,0,0.3)] text-gray-400 hover:text-white rounded-full flex items-center justify-center border-0"
      >
        <MdNavigateNext size={30} />
      </button>
    </div>
  );
}
