import { Route, Routes } from "react-router-dom";
import Home from "../../pages/client/home";
import Layout from "../../components/clientCompo/Layout";
import NotFound from "../../pages/error/NotFound";
import Cart from "../../components/clientCompo/Cart";
import SignUp from "../../pages/client/signUp";
import Login from "../../pages/client/login";
import CheckOutPage from "../../components/clientCompo/CheckOutPage";
import OrderTracking from "../../components/clientCompo/OrderTracking";
import CategoryProducts from "../../components/clientCompo/AllCategoryProducts";
import ProductDetail from "../../components/clientCompo/ProductsDetail";
import AllProducts from "../../components/clientCompo/AllProducts";
import ScrollToTop from "../../components/scrollTop";
function HomeRoutes() {
  return (
    <div>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/categoryproducts/:category_id"
            element={<CategoryProducts />}
          />
          <Route path="/productsdetail/:id" element={<ProductDetail />} />
          <Route path="/allproducts" element={<AllProducts />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckOutPage />} />
          <Route path="/ordertrack" element={<OrderTracking />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default HomeRoutes;
