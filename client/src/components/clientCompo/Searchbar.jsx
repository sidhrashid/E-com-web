// import { FaSearch } from "react-icons/fa";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSearchCart } from "../../context/SearchContext";

// function Searchbar() {
//   const { setSearchQuery } = useSearchCart();
//   const [query, setQuery] = useState("");
//   const navigate = useNavigate();

//   const handleSearch = (e) => {
//     e.preventDefault();
//     const trimmedQuery = query.trim();
//     setSearchQuery(trimmedQuery);
//     navigate("/allproducts");
//   };

//   return (
//     <form
//       onSubmit={handleSearch}
//       className="hidden sm:hidden md:flex items-center justify-between gap-4 bg-gray-100 p-2 rounded-md w-full sm:w-[200px] md:w-[300px] lg:w-[400px] xl:w-[500px] 2xl:w-[600px]"
//     >
//       <input
//         type="text"
//         placeholder="Search"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         className="bg-transparent outline-none w-full"
//       />
//       <button type="submit" className="cursor-pointer p-1 hover:bg-gray-200 rounded-md">
//         <FaSearch className="text-gray-600" />
//       </button>
//     </form>
//   );
// }

// export default Searchbar;