import axios from "axios";
import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

const GetCategoryApi = import.meta.env.VITE_CATEGORY_API;

export const CategoryMenu = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
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

  const navigateProducts = (id) => {
    navigate(`/categoryproducts/${id}`);
  };

  return (
    <div className="w-full md:w-1/5 p-4 md:sticky">
      <div className="flex justify-between items-center md:block">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold hidden md:block">Categories</h2>
          <NavLink to="/"> 
            <i className="fa-solid fa-house text-xl"></i>
          </NavLink>
        </div>

        <FaBars
          className="cursor-pointer md:hidden text-xl"
          onClick={() => setDropdownOpen(!isDropdownOpen)}
        />
      </div>

      <ul
        className={`space-y-2 ${
          isDropdownOpen ? "block" : "hidden"
        }  md:min-h-screen  h-full lg:border-r  md:block mt-4 `}
      >
        {categories.map((category) => (
          <li
            onClick={() => navigateProducts(category.id)}
            key={category.id}
            className="  py-2 px-3 border-b   border-gray-300 cursor-pointer hover:bg-gray-200 rounded"
          >
            <span> {category.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
