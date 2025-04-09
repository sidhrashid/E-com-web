import { StrictMode } from "react";
import "flowbite";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { SearchProvider } from "./context/SearchContext.jsx";
import { CartProvider } from "./context/Cart.jsx";
import { CategoryProvider } from "./context/Category.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SearchProvider>
      <CartProvider>
        <CategoryProvider>
          <App />
        </CategoryProvider>
      </CartProvider>
    </SearchProvider>
  </StrictMode>
);
