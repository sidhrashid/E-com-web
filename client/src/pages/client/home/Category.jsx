import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const GetCategoryApi = import.meta.env.VITE_CATEGORY_API;

const Category = () => {
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const res = await axios.get(GetCategoryApi);
      setCategories(res.data);
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const navigateProducts = (id) => {
    navigate(`/categoryproducts/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 relative">
      <h2 className="text-3xl font-bold mb-6 text-center">Categories</h2>

      {/* Scroll Buttons */}
      <button
        onClick={scrollLeft}
        className="absolute left-2 top-44 transform -translate-y-1/2 bg-white p-3 shadow-lg rounded-full z-10 hover:bg-gray-100 transition"
      >
        <FaArrowLeft className="text-gray-600" />
      </button>

      <button
        onClick={scrollRight}
        className="absolute right-2 top-44 transform -translate-y-1/2 bg-white p-3 shadow-lg rounded-full z-10 hover:bg-gray-100 transition"
      >
        <FaArrowRight className="text-gray-600 " />
      </button>

      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide relative scroll-smooth"
      >
        <div className="flex space-x-6">
          {categories.map((category) => (
            <div
              onClick={() => navigateProducts(category.id)}
              key={category.id}
              className="min-w-[165px] bg-white rounded-lg p-4 text-center shadow-md hover:shadow-lg transition"
            >
              <img
                src={`/uploads/categoryImage/${category.image}`}
                alt={category.name}
                className="w-full h-36 object-cover rounded-md"
              />
              <h3 className="mt-3 font-semibold text-lg">{category.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
