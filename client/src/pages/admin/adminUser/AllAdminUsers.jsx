import { NavLink } from "react-router-dom";
import Hoc from "../../../components/dashboardCompo/Hoc";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteModal from "../../../components/Modal/DeleteModal";

const getAdminUserAPI = import.meta.env.VITE_GET_ADMIN_USER_API;
const adminDeleteAPI = import.meta.env.VITE_DELETE_ADMIN_USER_API;
const adminStatusAPI = import.meta.env.VITE_UPDATE_ADMIN_STATUS_API;


const AllAdminUsers = () => {
  const [adminUsersData, setAdminUsersData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(getAdminUserAPI);
      setAdminUsersData(res.data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = (id) => {
    setSelectedUserId(id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${adminDeleteAPI}/${selectedUserId}`);
      toast.success("User deleted successfully!");
      setModalOpen(false);
      setSelectedUserId(null);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      await axios.put(`${adminStatusAPI}/${id}`,{ status: newStatus });

      setAdminUsersData((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, status: newStatus } : user
        )
      );
      toast.success(`User status updated to ${newStatus}!`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
    }
  };

  return (
    <>
      <Hoc />
      <section id="content">
        <main>
          <div className=" flex items-center justify-between pb-4 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800">All Admins</h2>
            <NavLink to="/admin/addadmin" className="mt-2 sm:mt-0">
              <button className="bg-blue-500 text-white px-4 py-2 text-sm rounded-lg shadow-md hover:bg-blue-600 transition">
                + Add Admin
              </button>
            </NavLink>
          </div>

          <div
            className="overflow-y-auto max-h-[500px] border border-gray-300 rounded-lg shadow-md 
              [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[rgba(231,229,229,0.64)] [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:rounded-lg [&::-webkit-scrollbar-thumb]:rounded-lg"
          >
            <table className="min-w-full table-fixed">
              <thead className="sticky top-0 bg-gray-100 shadow-md z-10">
                <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                  <th className="px-4 py-3">Id</th>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {adminUsersData.map((user) => (
                  <tr
                    key={user.id}
                    className="border border-gray-300 odd:bg-[#EEEEEE] even:bg-[#F9FAFB] transition"
                  >
                    <td className="px-4 py-3 text-center">{user.id}</td>
                    <td className="px-4 py-3 flex justify-center">
                      <img
                        src={`/uploads/${user.image}`}
                        alt={user.username}
                        className="w-10 h-10 rounded-full border border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3 text-center truncate max-w-[150px]">
                      {user.username}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <label className="relative inline-block w-8 h-4">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={user.status === "active"}
                          onChange={() => toggleStatus(user.id, user.status)}
                        />
                        <span className="block w-full h-full bg-gray-300 rounded-full peer-checked:bg-blue-500 transition-colors duration-300"></span>
                        <span className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-md transform peer-checked:translate-x-4 transition-transform duration-300"></span>
                      </label>
                    </td>

                   
                    <td className="text-center space-x-1">
                      <NavLink to={`/admin/updateadmin/${user.id}`}>
                        <button className="px-2 py-1 border text-blue-600 rounded-md hover:bg-gray-100 transition duration-300">
                          <i className="fa-solid fa-pencil text-sm"></i>
                        </button>
                      </NavLink>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="px-2 py-1 text-red-600 rounded-md border hover:bg-gray-100 transition duration-300"
                      >
                        <i className="fa-solid fa-trash text-sm"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </section>
      <DeleteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        fieldName="admin"
      />

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default AllAdminUsers;
