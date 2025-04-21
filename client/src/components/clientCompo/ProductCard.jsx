/* eslint-disable react/prop-types */
import { NavLink, useNavigate } from "react-router-dom"
import { useCart } from '../../context/Cart'

const ProductCard = ({ id, image, name, price, status }) => {
    const { cart, addToCart } = useCart()
    const navigate = useNavigate()

    const product = { id, name, price, image }

    const isInCart = cart.some((item) => item.id === id)

    const isOutOfStock = status === "inactive"
    return (
        <>
            <div

                className="w-[122px] h-[265px] md:w-[160px] rounded-lg p-3 flex flex-col items-center bg-white shadow-lg"
            >

                <NavLink to={`/productsdetail/${id}`}>
                    <img
                        src={image}
                        alt={name}
                        className="w-[150px] h-[150px] object-cover rounded-md"
                    />

                </NavLink>

                <h2 className="mt-2 mb-2 font-medium text-center text-sm w-full truncate">
                    {name}
                </h2>

                <p className="text-gray-600 text-xs">₹{price}</p>

                {isOutOfStock ? (
                    <button
                        className="mt-2 w-full px-3 py-2 bg-gray-400 text-white text-xs rounded-md cursor-not-allowed"
                        disabled
                    >
                        Add To Cart{" "}
                    </button>
                ) : isInCart ? (
                    <button
                        onClick={() => navigate("/cart")}
                        className="mt-2 w-full px-3 py-2 bg-green-600 text-white text-xs rounded-md hover:bg-green-700"
                    >
                        Go to Cart
                    </button>
                ) : (
                    <button
                        onClick={() => addToCart(product)}
                        className="mt-2 w-full px-3 py-2 bg-black text-white text-xs rounded-md hover:bg-gray-800"
                    >
                        Add To Cart
                    </button>
                )}
            </div>
        </>
    )
}

export default ProductCard