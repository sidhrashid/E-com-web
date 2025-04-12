import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import SearchbarSmall from "./SearchbarSmall";
import CategoryList from "./Category";
import ProductList from "./ProductsList";
import Banner from "./Banner";
import WhyUs from "./WhyUS";

const slides = [
  {
    id: 1,
    title: "Electronics Sale",
    description: "Huge discounts on electronics! Up to 60% off!",
    img: "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800",
    url: "/electronics",
    bg: "bg-gradient-to-r from-blue-50 to-purple-50",
  },
  {
    id: 2,
    title: "Winter Sale Collections",
    description: "Sale! Up to 50% off!",
    img: "https://images.pexels.com/photos/1457983/pexels-photo-1457983.jpeg?auto=compress&cs=tinysrgb&w=800",
    url: "/",
    bg: "bg-gradient-to-r from-pink-50 to-blue-50",
  },
  {
    id: 3,
    title: "Spring Sale Collections",
    description: "Sale! Up to 50% off!",
    img: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800",
    url: "/",
    bg: "bg-gradient-to-r from-blue-50 to-yellow-50",
  },
];

const Slider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <SearchbarSmall />
      <div className="h-[calc(100vh-80px)] max-h-[800px] overflow-hidden relative">
        {/* Slider Container */}
        <div
          className="w-max h-full bg-red-700 flex transition-all ease-in-out duration-1000"
          style={{ transform: `translateX(-${current * 100}vw)` }}
        >
          {slides.map((slide) => (
            <div
              className={`${slide.bg} w-screen h-full flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-16`}
              key={slide.id}
            >
              {/* Left Content */}
              <div className="min-h-[200px]  flex-1 flex flex-col items-center md:items-center justify-center gap-4 md:gap-8 lg:gap-12 text-center md:text-center p-4 md:p-8">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl mr-7 sm:mr-0">
                  {slide.description}
                </h2>
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mr-7 sm:mr-0">
                  {slide.title}
                </h1>
                <NavLink to={slide.url}>
                  <button className="rounded-md bg-black text-white py-2 px-3 md:py-3 md:px-4 text-sm md:text-base hover:bg-gray-800 transition-colors mr-7 sm:mr-0">
                    SHOP NOW
                  </button>
                </NavLink>
              </div>

              {/* Right Content (Image) */}
              <div className="flex-1 relative min-h-[300px] md:min-h-[400px] flex items-center justify-center">
                <img
                  src={slide.img}
                  alt="Slide Image"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Dots Navigation */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 md:bottom-8 flex gap-2 md:gap-4">
          {slides.map((_, index) => (
            <div
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full cursor-pointer transition-all ${
                current === index ? "bg-black scale-150" : "bg-gray-300"
              }`}
              key={index}
              onClick={() => setCurrent(index)}
            />
          ))}
        </div>
      </div>
      <CategoryList />
      <ProductList />
      <Banner />
      <WhyUs />
    </>
  );
};

export default Slider;
