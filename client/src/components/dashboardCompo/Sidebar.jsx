/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";
import "../../assets/css/dashboardCss/sidebar.css";
import { useLocation } from "react-router-dom";
import LogoutButton from "../../pages/admin/auth/LogoutButton";

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  return (
    <>
      <section id="sidebar" className={isOpen ? "" : "hide"}>
        <NavLink to="/admin/dashboard" className="brand">
          <i className="bx bxs-smile"></i>
          <span className="text">AdminHub</span>
        </NavLink>
        <ul className="side-menu top">
          <li
            className={location.pathname === "/admin/dashboard" ? "active" : ""}
          >
            <NavLink to="/admin/dashboard">
              <i className="bx bxs-dashboard"></i>
              <span className="text">Dashboard</span>
            </NavLink>
          </li>
          <li
            className={location.pathname === "/admin/products" ? "active" : ""}
          >
            <NavLink to="/admin/products">
              <i className="bx bxs-shopping-bag-alt"></i>
              <span className="text">Product</span>
            </NavLink>
          </li>
          <li
            className={location.pathname === "/admin/category" ? "active" : ""}
          >
            <NavLink to="/admin/category">
              <i className="bx bxs-category"></i>
              <span className="text">Categories</span>
            </NavLink>
          </li>
          <li
            className={
              location.pathname === "/admin/alladminusers" ? "active" : ""
            }
          >
            <NavLink to="/admin/alladminusers">
              <i className="bx bxs-user-badge"></i>
              <span className="text">Admin Users</span>
            </NavLink>
          </li>
        </ul>

        <ul className="side-menu">
          <li
            className={
              location.pathname === "/admin/dashboard4" ? "active" : ""
            }
          >
            <NavLink to="/admin/dashboard">   
              <i className="bx bxs-cog"></i>
              <span className="text">Settings</span>
            </NavLink>
          </li>
          <li className="flex items-center">
            <LogoutButton />
          </li>
        </ul>
      </section>
    </>
  );
};

export default Sidebar;
