import { Route, Routes } from "react-router-dom";
import NotFound from "../../pages/error/NotFound";
import Products from "../../pages/admin/products/ShowAllProducts";
import Dashboard from "../../pages/admin/dashboard/Dashboard";
import AddProducts from "../../pages/admin/products/AddProducts";
import UpdateProducts from "../../pages/admin/products/UpdateProducts";
import ShowCategory from "../../pages/admin/categories/ShowCategory";
import AddCategory from "../../pages/admin/categories/AddCategory";
import UpdateCategory from "../../pages/admin/categories/UpdateCategory";
import AdminLogin from "../../pages/admin/auth/AdminLogin";
import AllAdminUsers from "../../pages/admin/adminUser/AllAdminUsers";
import AddAdminUser from "../../pages/admin/adminUser/AddAdminUser";
import UpdateAdminUser from "../../pages/admin/adminUser/UpdateAdminUser";

import ProtectedRoute from "../../pages/admin/auth/ProtectedRoute";
import ScrollToTop from "../../components/scrollTop";

function DashboardRoute() {
  return (  
    <div>
      <ScrollToTop />
      <Routes>
        {/* ------------------ Admin ---------------------- */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/addproduct" element={<AddProducts />} />
          <Route path="/update/:id" element={<UpdateProducts />} />
          <Route path="/category" element={<ShowCategory />} />
          <Route path="/updatecategory/:id" element={<UpdateCategory />} />
          <Route path="/addcategory" element={<AddCategory />} />
          <Route path="/alladminusers" element={<AllAdminUsers />} />
          <Route path="/addadmin" element={<AddAdminUser />} />
          <Route path="/updateadmin/:id" element={<UpdateAdminUser />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default DashboardRoute;
