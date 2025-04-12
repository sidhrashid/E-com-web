import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../context/Cart";

const BASE_URL = import.meta.env.VITE_API_BASE_URL; // Use environment variable for base URL

const ProductsDetail = () => {
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();

  const isInCart = cart.some((item) => item.id === Number(id));
  const isOutOfStock = product?.status === "inactive";

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getproductsbyid/${id}`);
      setProduct(res.data[0] || null);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Loading...</span> {/* You can replace this with a spinner */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full bg-white rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Product Image */}
        <div className="md:w-1/2 bg-gray-200 flex items-center justify-center p-6">
          <img
            src={product.image ? `/uploads/productImage/${product.image}` : "/default-product-image.jpg"} // Default image fallback
            alt={product.name}
            className="sm:object-contain sm:h-96 rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-sm text-gray-500 mt-1 uppercase">by James Anderson</p>

            {/* Pricing Section */}
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 line-through text-xl">
                  {formatPrice(Number(product.price) + 100)} {/* Example of original price */}
                </span>
                <span className="text-green-600 font-bold text-2xl">
                  {formatPrice(product.price)} {/* Final price */}
                </span>
              </div>
              <div className="mt-4">
                {isOutOfStock ? (
                  <p className="text-sm text-red-600 font-semibold">🔴 Out of Stock</p>
                ) : (
                  <p className="text-sm text-green-600 font-semibold">🟢 In Stock</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mt-4">
              <h3 className="font-semibold text-gray-800 mb-1">Description : </h3>
              <p
                className="text-gray-600 text-sm"
                dangerouslySetInnerHTML={{ __html: product.description }}
              ></p>
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            {/* Action Buttons */}
            <div className="flex gap-3">
              {isOutOfStock ? (
                <button className="bg-gray-400 text-white px-5 py-2 rounded-md w-full cursor-not-allowed">
                  Out of Stock
                </button>
              ) : isInCart ? (
                <button
                  onClick={() => navigate("/cart")}
                  className="bg-green-600 text-white px-5 py-2 rounded-md w-full"
                >
                  Go to Cart
                </button>
              ) : (
                <button
                  onClick={() => addToCart(product)}
                  className="border border-gray-400 text-gray-600 px-5 py-2 rounded-md w-full"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsDetail;
