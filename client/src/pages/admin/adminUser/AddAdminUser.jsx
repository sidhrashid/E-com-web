import { useState } from "react";
import Hoc from "../../../components/dashboardCompo/Hoc";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const addAdminUserAPI = import.meta.env.VITE_ADD_ADMIN_USER_API;

const AddAdminUser = () => {
  const [addAdminUser, setAddAdminUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleAddAdminUser = async (e) => {
    e.preventDefault();
    try {
      const success = await axios.post(`${addAdminUserAPI}`, addAdminUser);
      setTimeout(() => {
        if (success.status === 201) {
          toast.success(success.data.message);
        }
      }, 200);
      navigate("/admin/alladminusers");
    } catch (error) {
      if (error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        console.error("Error adding user:", error);
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setAddAdminUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  return (
    <>
      <Hoc />
      <section id="content">
        <main className="flex-1 flex justify-center items-center bg-gray-100 h-screen ">
          <form
            onSubmit={handleAddAdminUser}
            className="w-full max-w-md bg-white p-6 shadow-lg rounded-lg flex flex-col space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-700 text-center">
              Add Admin
            </h2>

            <label htmlFor="username" className="text-gray-700 font-medium">
              Username :
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="John Doe"
              value={addAdminUser.username}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded-md w-full"
              required
            />
            <label htmlFor="email" className="text-gray-700 font-medium">
              Email :
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="johndoe@gmail.com"
              value={addAdminUser.email}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded-md w-full"
              required
            />
            <label htmlFor="password" className="text-gray-700 font-medium">
              Password :
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="john@123"
              value={addAdminUser.password}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded-md w-full"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              Add Admin
            </button>
          </form>
        </main>
        <ToastContainer position="top-right" autoClose={2000} />
      </section>
    </>
  );
};

export default AddAdminUser;
