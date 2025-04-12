import cart from "../../../assets/images/Shopping.jpg";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";


const UserRegisterAPI = import.meta.env.VITE_USER_REGISTER_API;
const SendOTPAPI = import.meta.env.VITE_SEND_OTP_API;


const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    email_or_phone: "",
    password: "",
    otp: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSendOTP = async () => {
    if (!userData.email_or_phone) {
      toast.error("Please enter Email or Phone.");
      return;
    }

    try {
      const res = await axios.post(`${SendOTPAPI}`, { email_or_phone: userData.email_or_phone });

      if (res.status === 200) {
        toast.success("OTP sent successfully!");
        setOtpSent(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${UserRegisterAPI}`, userData);

      if (res.status === 201) {
        setTimeout(() => toast.success(res.data.message), 1000);
      }
      navigate("/login")
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <ToastContainer />
      <div className="bg-white rounded-lg p-2 shadow-md flex w-full max-w-5xl">
        
        {/* Left Image Section */}
        <div className="w-1/2 hidden md:flex">
          <img
            src={cart}
            alt="Signup"
            className="max-w-full h-auto rounded-lg"
          />
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-2">Create an account</h2>
          <p className="text-gray-600 mb-6">Enter your details below</p>

          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleInputChange}
              required
              placeholder="Username"
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-red-500"
            />

            {/* Email / Phone Input + Send OTP Button */}
            <div className="relative w-full mb-4">
              <input
                type="text"
                name="email_or_phone"
                value={userData.email_or_phone}
                onChange={handleInputChange}
                required
                placeholder="Email or Phone"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              />  
              <button
                type="button"
                onClick={handleSendOTP}
                className="absolute right-[2px] top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
              >
                Send
              </button>
            </div>

            {/* OTP Input (Only shows when Send OTP is clicked) */}
            {otpSent && (
              <input
                type="text"
                name="otp"
                value={userData.otp}
                onChange={handleInputChange}
                required
                placeholder="Enter OTP"
                className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            )}

            {/* Password Input */}
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={userData.password}
                onChange={handleInputChange}
                required
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 focus:outline-none border-l-2 border-[#EAE8E8] pl-3"
              >
                {showPassword ? <i className="fa-regular fa-eye-slash"></i> : <i className="fa-regular fa-eye"></i>}
              </button>
            </div>

            <button className="w-full bg-black text-white py-2 mt-4 rounded-lg font-semibold hover:bg-gray-800">
              Sign up
            </button>
          </form>

          <div className="my-4 flex items-center justify-center">
            <hr className="flex-grow border-gray-300" />
          </div>

          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <NavLink to="/login" className="text-blue-500">
              Log in
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
