import { useCart } from "../../context/Cart";
import { NavLink, useNavigate } from "react-router-dom";
import { useCategories } from "../../context/Category";

const Cart = () => {
  const { cart, totalAmount, increaseQty, decreaseQty, removeItem } = useCart();
  const { categories } = useCategories();
  const navigate = useNavigate();
  const user = localStorage.getItem("user_Id");

  return (
    <div className="min-h-screen container mx-auto flex flex-col lg:flex-row gap-6 py-5">
      <div className="w-full lg:w-2/3 bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">🛒 Your Cart</h1>

        {cart.length > 0 ? (
          <div className="max-h-[350px] overflow-y-auto pr-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <style>{`::-webkit-scrollbar { display: none; }`}</style>
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-6 p-4 border-b border-gray-300 bg-white/60 rounded-lg shadow-sm mb-3">
                <NavLink to={`/productsdetail/${item.id}`}>
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl shadow-sm" />
                </NavLink>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-800">{item.name}</span>
                    <span className="text-lg font-bold text-gray-900">₹{item.price * item.quantity}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3">
                      <button className="bg-gray-800 text-white rounded-lg px-3 py-1 hover:bg-gray-900 transition" onClick={() => decreaseQty(item.id)}>
                        <i className="fa-solid fa-minus text-xs"></i>
                      </button>
                      <span className="text-lg font-semibold">{item.quantity}</span>
                      <button className="bg-gray-800 text-white rounded-lg px-3 py-1 hover:bg-gray-900 transition" onClick={() => increaseQty(item.id)}>
                        <i className="fa-solid fa-plus text-xs"></i>
                      </button>
                    </div>
                    <button
                      className="text-red-500 text-xl hover:text-red-700 transition"
                      onClick={() => removeItem(item.id)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-500 text-lg">Your cart is empty 😞</p>
            <button onClick={() => navigate(`/categoryproducts/${categories[0].id}`)} className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
              🛍️ Go To Shopping
            </button>
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="w-full lg:w-1/3">
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg sticky top-20">
            <h2 className="text-2xl font-bold border-b pb-3 mb-4 text-gray-800">💰 Price Details</h2>
            <div className="flex justify-between text-lg font-medium mb-3">
              <span>Price ({cart.length} items)</span>
              <span className="font-semibold">₹{cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}</span>
            </div>
            <div className="flex justify-between text-green-600 font-medium lg:text-lg mb-3">
              <span>Text</span>
              <span>₹0</span>
            </div>

            <div className="flex justify-between font-medium lg:text-lg mb-3">
              <span>Delivery Charges</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between text-2xl font-bold border-t pt-3">
              <span>Total Amount</span>
              <span>₹{totalAmount}</span>
            </div>
            <button
              className="w-full mt-5 py-3 bg-orange-500 text-white rounded-xl font-semibold text-lg hover:bg-orange-600 transition"
              onClick={() => navigate(user ? "/checkout" : "/login")}
            >
              ✅ PLACE ORDER
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;