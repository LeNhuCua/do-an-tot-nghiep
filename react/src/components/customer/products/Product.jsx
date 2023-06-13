import React, { useEffect, useRef, useState } from "react";
import { AiFillStar, AiOutlineFire } from "react-icons/ai";
import { Link } from "react-router-dom";
import { API_IMAGES } from "../../../API";
import { differenceInDays, parseISO } from "date-fns";
import { Rating } from "primereact/rating";
import Loading from "../../Loading";
import { ProgressSpinner } from "primereact/progressspinner";

const Product = (props) => {
  const { alias, name, avatar, numberBuy, created_at, rating, product_size } =
    props.data;

  const imageRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          observer.unobserve(lazyImage);
        }
      });
    });

    observer.observe(imageRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  function isNew(created_at) {
    const diffInDays = differenceInDays(new Date(), parseISO(created_at));
    return diffInDays <= 30;
  }
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoaded = () => {
    setIsLoading(false);
  };
  return (
    <div className="relative flex flex-col group">
      <div className="absolute z-10 top-0 flex flex-col gap-1 text-[0.8125rem] text-white ">
        {isNew(created_at) ? (
          <div className=" bg-yellow-400 w-[4.6rem] py-2 flex justify-center items-center uppercase font-bold">
            Mới
          </div>
        ) : (
          ""
        )}

        {rating >= 4 ? (
          <div className=" bg-red-400 w-[4.6rem] py-2 flex justify-center items-center uppercase font-bold">
            <AiOutlineFire />
            Hot
          </div>
        ) : (
          ""
        )}
      </div>
      <Link
        className=" w-full  py-2 group-hover:scale-105 rounded-md no-underline h-full border group-hover:border-yellow-800 transition-all duration-500 flex flex-col text-[#5B5B5B]"
        to={`/sanpham/${alias}`}
      >
        <div className="min-h-[19rem] max-h-[19rem] w-full flex-1">
          {isLoading && (
            <div className="flex items-center justify-center w-full h-full">
              <ProgressSpinner
                style={{ width: "50px", height: "50px" }}
                strokeWidth="8"
                fill="var(--surface-ground)"
                animationDuration=".5s"
              />
            </div>
          )}
          <img
            ref={imageRef}
            className="w-full h-full object-fill"
            src={avatar}
            data-src={`${API_IMAGES}/${avatar}`}
            alt={name}
            loading="lazy"
            onLoad={handleImageLoaded}
          />
        </div>
        <div className="flex flex-col gap-5 flex-1 px-3 mt-5">
          <h1 className="cs-hover no-underline  break-all flex-1 text-lg font-bold text-inherit">
            {name}
          </h1>{" "}
          <div className="mb-6 mt-auto">
            <div className="flex text-yellow-500">
              <Rating value={rating} readOnly cancel={false} />
            </div>

            <span className="mt-2 inline-block text-inherit font-[600]">
              {new Intl.NumberFormat({
                style: "currency",
                currency: "JPY",
              }).format(product_size[0].price)}{" "}
              VNĐ
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Product;
