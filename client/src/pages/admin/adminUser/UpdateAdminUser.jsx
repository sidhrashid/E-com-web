import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Hoc from "../../../components/dashboardCompo/Hoc";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const updateAdminUserAPI = import.meta.env.VITE_UPDATE_ADMIN_USER_API;
const getAdminUserByIdAPI = import.meta.env.VITE_GET_ADMIN_USER_BY_ID_API;

const UpdateAdminUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const fetchAdminUser = async () => {
    try {
      const res = await axios.get(`${getAdminUserByIdAPI}/${id}`);
      setAdminUser(res.data[0]);
    } catch (error) {
      console.error("Error fetching admin user details", error);
      toast.error("Failed to fetch admin user details");
    }
  };
  useEffect(() => {
    fetchAdminUser();
  }, [id]);

  // Form input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${updateAdminUserAPI}/${id}`, adminUser, {
        headers: { "Content-Type": "application/json" },
      });
      setTimeout(() => {
        toast.success("Admin User updated successfully!");
      }, 100);
      navigate("/admin/alladminusers");
    } catch (error) {
      console.error(
        "Error updating admin user:",
        error.response?.data || error.message
      );
      toast.error("Failed to update admin user. Please try again.");
    }
  };

  return (
    <>
      <Hoc />
      <section id="content">
        <main className="flex-1 flex justify-center items-center bg-gray-100 h-screen ">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white p-6 shadow-lg rounded-lg flex flex-col space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-700 text-center">
              Update Admin
            </h2>

            <label htmlFor="username" className="text-gray-700 font-medium">
              Username:
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="John Doe"
              value={adminUser.username}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
              required
            />

            <label htmlFor="email" className="text-gray-700 font-medium">
              Email:
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="johndoe@gmail.com"
              value={adminUser.email}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
              required
            />

            <label htmlFor="password" className="text-gray-700 font-medium">
              Password:
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter new password"
              value={adminUser.password}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md w-full"
              required
            />

            <button
              type="submit"
              className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              Update Admin
            </button>
          </form>
        </main>
      </section>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default UpdateAdminUser;
