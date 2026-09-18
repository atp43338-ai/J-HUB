import { useState } from "react";
import { useNavigate } from "react-router";

function AdminMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div>

      {/* Three Line Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          fixed
          top-6
          left-6
          z-50
          w-10
          h-10
          rounded-lg
          bg-[#1f1f1f]
          text-white
          text-2xl
          flex
          items-center
          justify-center
          hover:bg-[#d90416]
          transition
        "
      >
        ☰
      </button>

      {/* Menu */}
      {isOpen && (
        <div
          className="
            fixed
            top-20
            left-6
            z-50
            w-64
            bg-[#18191b]
            border
            border-gray-700
            rounded-xl
            shadow-xl
            p-3
          "
        >

          {/* Menu Title */}
          <h3 className="px-4 py-3 text-lg font-bold text-white">
            Admin Menu
          </h3>

          {/* User Management */}
          <button
            onClick={() => handleNavigation("/admin/users")}
            className="
              w-full
              text-left
              px-4
              py-3
              rounded-lg
              text-gray-300
              hover:bg-[#d90416]
              hover:text-white
              transition
            "
          >
            User Management
          </button>

          {/* Product Management */}
          <button
            onClick={() => handleNavigation("/admin/products")}
            className="
              w-full
              text-left
              px-4
              py-3
              rounded-lg
              text-gray-300
              hover:bg-[#d90416]
              hover:text-white
              transition
            "
          >
            Product Management
          </button>

          {/* Category Management */}
          <button
            onClick={() => handleNavigation("/admin/categories")}
            className="
              w-full
              text-left
              px-4
              py-3
              rounded-lg
              text-gray-300
              hover:bg-[#d90416]
              hover:text-white
              transition
            "
          >
            Category Management
          </button>

        </div>
      )}

    </div>
  );
}

export default AdminMenu;