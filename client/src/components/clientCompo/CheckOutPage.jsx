import { useState, useEffect } from "react";
import { useCart } from "../../context/Cart";
import axios from "axios";

const BackendUrl = "https://e-com-web-n1aw.onrender.com";

const CheckoutPage = () => {
  const { cart, totalAmount } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    state: "",
    address: "",
    city: "",
    zip: "",
    paymentMethod: "razorpay",
  });

  const userInfo = JSON.parse(localStorage.getItem("user_Id"));

  useEffect(() => {
    if (userInfo) {
      setFormData((prev) => ({
        ...prev,
        name: userInfo.username || "",
        email: userInfo.email_or_phone || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const checkoutHandler = async (amount) => {
    try {
      // 1. Create Razorpay Order & Save Order Data to DB
      const {
        data: { razorpayOrder, order_id },
      } = await axios.post(`${BackendUrl}/checkout`, {
        user_id: userInfo,
        amount,
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      const options = {
        key: "rzp_test_sXWDKsuDaX1kkN", // Razorpay Key ID
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "E-com",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          address: formData.address,
        },
        theme: {
          color: "#121212",
        },
        handler: async function (response) {
          // 2. Verify Payment on Backend
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            response;

          await axios.post(`${BackendUrl}/payment-verification`, {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            user_id: userInfo,
            order_id,
            amount,
          });

          alert("Payment Successful! 🎉");
          window.location.href = `/paymentsuccess?reference=${razorpay_payment_id}`;
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function (response) {
        console.error("Payment Failed:", response.error);
        alert("Payment Failed. Please try again.");
      });
    } catch (error) {
      console.error("Checkout Error:", error.message);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.paymentMethod === "razorpay") {
      checkoutHandler(totalAmount);
    } else {
      alert("Order Placed Successfully! 🎉");
      console.log("User Details:", formData);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 flex justify-center">
      <div className="max-w-6xl w-full bg-white rounded-xl shadow-xl overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="md:col-span-2 p-4 sm:p-6 md:p-8 border-r border-gray-200 bg-gray-50">
              <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800">
                🛒 Checkout
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                {/* Personal Info */}
                <div className="sm:col-span-2">
                  <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                    Personal Information
                  </h3>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="123-456-7890"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Shipping Address */}
                <div className="sm:col-span-2 mt-8">
                  <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                    Shipping Address
                  </h3>
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="House No. Street Name, Area, Building Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    required
                    placeholder="10001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="New York"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    placeholder="Your State"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Payment Method */}
                <div className="sm:col-span-2 mt-8">
                  <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                    Payment Method
                  </h3>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="razorpay">Razorpay</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="cod">Cash on Delivery</option>
                  </select>
                </div>
              </div>
            </div>

            {cart.length > 0 && (
              <div className="p-4 sm:p-6 bg-white">
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg sticky top-10 border border-gray-200">
                  <h2 className="text-xl sm:text-base lg:text-2xl font-bold text-gray-800 border-b pb-3 mb-4">
                    💰 Price Details
                  </h2>

                  <div className="flex justify-between font-medium lg:text-lg mb-3">
                    <span>Price ({cart.length} items)</span>
                    <span className="font-semibold">
                      ₹
                      {cart.reduce(
                        (acc, item) => acc + item.price * item.quantity,
                        0
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-green-600 font-medium lg:text-lg mb-3">
                    <span>Tax</span>
                    <span>₹0</span>
                  </div>

                  <div className="flex justify-between font-medium lg:text-lg mb-3">
                    <span>Delivery Charges</span>
                    <span className="text-green-600">Free</span>
                  </div>

                  <div className="flex justify-between font-medium lg:text-lg mb-3 border-t pt-3">
                    <span>Total Amount</span>
                    <span>₹{totalAmount}</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 sm:mt-5 py-2 sm:py-3 bg-orange-500 text-white rounded-lg font-semibold text-lg hover:bg-orange-600 transition "
                  >
                    ✅ Continue to Pay
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
