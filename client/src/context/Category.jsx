/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create the context
const CategoryContext = createContext();

// Custom hook to use the category context
export const useCategories = () => {
    return useContext(CategoryContext);
};

// API URL from environment variable
const GetCategoryAPI = import.meta.env.VITE_CATEGORY_API;

export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);

    // Function to fetch categories
    const fetchCategories = async () => {
        try {
            const res = await axios.get(GetCategoryAPI);
            setCategories(res.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <CategoryContext.Provider value={{ categories }}>
            {children}
        </CategoryContext.Provider>
    );
};
