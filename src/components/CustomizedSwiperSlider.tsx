import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

import useProductStore from "../store/useProductStore"
import ProductCard from "./ProductCard"
import { Product } from "../types/types"

const CustomizedSwiperSlider = () => {
  const { products } = useProductStore()

  return (
    <div className="max-auto py-8">
      <h2 className="text-sm md:text-2xl font-bold text-gray-800">Product Section</h2>
      <Swiper
        spaceBetween={50}
        slidesPerView={3}
        allowSlidePrev={true}
        allowSlideNext= {true}
        pagination={{ clickable: true }}
        breakpoints={{
          0: {
            slidesPerView: 2,
            spaceBetween: 5,
          },
          640: {
            slidesPerView: 3,
            spaceBetween: 8,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 10,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 15,
          },
          1280: {
            slidesPerView: 7,
            spaceBetween: 25,
          },
        }}
      >
        {products.map((product:Product) => (
          <SwiperSlide key={product._id}>
            <ProductCard
              _id={product._id}
              productName={product.productName}
              productImages={product.productImages}
              price={product.price}
              discountPrice={product.discountPrice}
              description={product.description}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default CustomizedSwiperSlider

