import { CategoryMenu } from "./CategoryMenu";
import SearchbarSmall from "../../pages/client/home/SearchbarSmall";
import ProductCard from "./ProductCard";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const getProductsByCategoryAPI = import.meta.env.VITE_GET_PRO_BY_CATEGORY_API;

const AllCategoryProducts = () => {
  const [categories, setCategories] = useState([]);
  const { category_id } = useParams();

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await axios.get(`${getProductsByCategoryAPI}${category_id}`);
        console.log(res.data);

        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else if (Array.isArray(res.data.data)) {
          setCategories(res.data.data);
        } else {
          console.error("Unexpected response format:", res.data);
          setCategories([]);
        }
      } catch (error) {
        console.log("Error fetching products:", error);
        setCategories([]);
      }
    };
    fetchAllProducts();
  }, [category_id]);

  return (
    <>
      <SearchbarSmall />
      <div className="flex flex-col md:flex-row lg:mb-4">
        {/* Sidebar */}
        <CategoryMenu />

        {/* Product Section */}
        <div className="w-full md:w-4/5 p-4">
          {/* Product Grid */}
          <div className="w-h-screen flex flex-wrap justify-center gap-x-3 gap-y-7">
            {categories.length === 0 ? (
              <p>No products found.</p>
            ) : (
              categories.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  status={product.status}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllCategoryProducts;
