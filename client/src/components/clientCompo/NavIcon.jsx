import { useState } from "react";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { useCart } from "../../context/Cart";

function NavIcon() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("user_Id"));
  const { totalItems } = useCart()

  const handleProfile = () => {
    setIsProfileOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("user_Id");
    setIsProfileOpen(false);
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-4 xl:6 relative">
      {/* User Profile Icon */}
      {userInfo ? (
        <img
          src={
            userInfo?.picture ||
            userInfo?.picture_url   //||//
            // "https://i.pravatar.cc/100"
          }
          alt="Profile"
          className="w-8 h-8 rounded-full cursor-pointer"
          onClick={handleProfile}
        />
      ) : (
        <FaUser className="cursor-pointer" onClick={handleProfile} />
      )}

      {/* Profile Dropdown */}
      {isProfileOpen && (
        <div className="absolute -right-2 top-11 sm:-right-9 mt-2 h-auto w-52 sm:w-64 bg-white shadow-lg p-4 z-50">
          {/* Header Section */}
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-bold">Profile</h2>
            <button onClick={() => setIsProfileOpen(false)}>
              <MdCancel className="text-xl" />
            </button>
          </div>

          {/* Profile Content */}
          {userInfo ? (
            <>
              {/* Profile Image */}
              <div className="flex justify-center mt-4">
                <img
                  src={
                    userInfo?.picture ||
                    userInfo?.picture_url  // || //
                    // "https://i.pravatar.cc/1000"
                  }
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-2 border-gray-300"
                />
              </div>
              <div className="mt-4 text-center">
                <p className="text-lg font-semibold w-full break-words">
                  {userInfo?.username}
                </p>
                <p className="text-gray-500 w-full break-words">
                  {userInfo?.email_or_phone}
                </p>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="mt-4 w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mt-4 text-center">
                <p className="text-lg font-semibold text-red-500">
                  Not Logged In
                </p>
                <p className="text-gray-500">
                  Please login to access your profile.
                </p>
              </div>

              <NavLink
                to="/login"
                onClick={() => setIsProfileOpen(false)}
                className="block mt-4 w-full"
              >
                <button className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800">
                  Login
                </button>
              </NavLink>
            </>
          )}
        </div>
      )}

      {/* Cart Icon */}
      <div className="relative cursor-pointer">
        <NavLink to="/cart">
          <FaShoppingCart />

          {totalItems > 0 && (<div className="absolute -top-[11px] -right-[10px] w-4 h-4 p-[10px] bg-SR rounded-full text-white text-[10px] text-center flex items-center justify-center">
            {totalItems}
          </div>

          )}
        </NavLink>
      </div>
    </div>
  );
}

export default NavIcon;