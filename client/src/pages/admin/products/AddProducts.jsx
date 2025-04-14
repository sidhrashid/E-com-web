import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Hoc from "../../../components/dashboardCompo/Hoc";

const AddApi = import.meta.env.VITE_ADD_API;
const CategoryApi = import.meta.env.VITE_CATEGORY_API;

function AddProducts() {
  const [products, setProducts] = useState({
    name: "",
    price: "",
    image: "",
    category_id: "",
    description: "",
  });

  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const res = await axios.get(CategoryApi);
        setData(res.data);
      } catch (error) {
        console.log("Error fetching categories:", error);
      }
    };
    fetchAllData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setProducts({
        ...products,
        image: files[0],
      });
    } else {
      setProducts({ ...products, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(products);
    const formData = new FormData();
    formData.append("name", products.name);
    formData.append("price", products.price);
    formData.append("image", products.image);
    formData.append("category_id", products.category_id);
    formData.append("description", products.description);

    try {
      await axios.post(`${AddApi}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setTimeout(() => {
        toast.success("Product added successfully!");
      }, 1000);
      navigate("/admin/products");
    } catch (error) {
      if (error.response) {
        console.error("Server Error:", error.response.data);
      } else {
        console.error("Request Error:", error.message);
      }
      toast.error("Failed to add product. Please try again.");
    }
  };

  return (
    <>
      <Hoc />
      <section id="content">
        <main>
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Add Product
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={products.name}
                    onChange={handleChange}
                    placeholder="Enter Product Name"
                    className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={products.price}
                    onChange={handleChange}
                    placeholder="Enter Price"
                    onWheel={(e) => e.target.blur()}
                    className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>

                  <select
                    name="category_id"
                    value={products.category_id}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {data.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    required
                    className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <CKEditor
                  required
                  editor={ClassicEditor}
                  data={products.description}
                  onChange={(event, editor) =>
                    setProducts({ ...products, description: editor.getData() })
                  }
                />
              </div>

              <div className="flex sm:justify-end justify-center space-x-3">
                <NavLink to="/admin/products">
                  <button
                    type="button"
                    className="bg-gray-400 text-white px-3 py-1 sm:px-5 sm:py-2 rounded-lg hover:bg-gray-500 transition font-medium"
                  >
                    Cancel
                  </button>
                </NavLink>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-3 py-1 sm:px-5 sm:py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow-lg"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </main>
      </section>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default AddProducts;
