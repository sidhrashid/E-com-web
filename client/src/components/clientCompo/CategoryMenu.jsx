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
    setDropdownOpen(false); // Close dropdown on mobile after selecting
  };

  return (
    <div className="w-full md:w-1/5 p-4 md:sticky top-0 z-10 bg-white md:bg-transparent">
      <div className="flex justify-between items-center md:block">
        <div className="flex justify-between w-full items-center">
          <h2 className="text-lg font-semibold hidden md:block">Categories</h2>
          <NavLink to="/">
            <i className="fa-solid fa-house text-xl text-gray-800 hover:text-black"></i>
          </NavLink>
        </div>

        <FaBars
          className="cursor-pointer md:hidden text-xl mt-2"
          onClick={() => setDropdownOpen(!isDropdownOpen)}
        />
      </div>

      <ul
        className={`space-y-2 ${
          isDropdownOpen ? "block" : "hidden"
        } md:block mt-4 md:min-h-screen h-full lg:border-r`}
      >
        {categories.map((category) => (
          <li
            key={category.id}
            onClick={() => navigateProducts(category.id)}
            className="py-2 px-3 border-b border-gray-300 cursor-pointer hover:bg-gray-200 rounded transition"
          >
            <span>{category.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
