import { NavLink, useNavigate } from "react-router";

function AdminSidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
    },
    {
      name: "User Management",
      path: "/admin/users",
    },
    {
      name: "Product Management",
      path: "/admin/products",
    },
    {
      name: "Category Management",
      path: "/admin/categories",
    },
    {
      name: "Order Management",
      path: "/admin/orders",
    },
    {
      name: "Inventory",
      path: "/admin/inventory",
    },
    {
      name: "Coupon Management",
      path: "/admin/coupons",
    },
    {
      name: "Return Management",
      path: "/admin/returns",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");

    setIsOpen(false);

    navigate("/admin/login", { replace: true });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-red-900/10 backdrop-blur-[1px] z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed
          top-0
          left-0
          z-50
          h-screen
          w-64
          bg-white
          border-r
          border-red-100
          text-gray-800
          flex
          flex-col
          shadow-sm
          transition-transform
          duration-300
          ease-in-out
          lg:translate-x-0
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Logo */}
        <div className="px-6 py-7 border-b border-red-100">
          <h1 className="text-2xl font-bold tracking-wide">
            <span className="text-[#d90416]">
              J
            </span>

            <span className="text-gray-900">
              - HUB
            </span>
          </h1>

          <p className="text-xs text-[#d90416] mt-1 tracking-widest font-medium">
            ADMIN PANEL
          </p>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <p className="text-xs uppercase tracking-widest text-gray-400 px-3 mb-3">
            Management
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `
                  block
                  px-4
                  py-3
                  rounded-lg
                  text-sm
                  font-medium
                  transition
                  ${
                    isActive
                      ? "bg-[#d90416] text-white shadow-sm"
                      : "text-gray-600 hover:bg-red-50 hover:text-[#d90416]"
                  }
                  `
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Account */}
          <p className="text-xs uppercase tracking-widest text-gray-400 px-3 mt-8 mb-3">
            Account
          </p>

          <NavLink
            to="/admin/profile"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `
              block
              px-4
              py-3
              rounded-lg
              text-sm
              font-medium
              transition
              ${
                isActive
                  ? "bg-[#d90416] text-white shadow-sm"
                  : "text-gray-600 hover:bg-red-50 hover:text-[#d90416]"
              }
              `
            }
          >
            Profile
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-red-100">
          <button
            type="button"
            onClick={handleLogout}
            className="
              w-full
              px-4
              py-3
              rounded-lg
              text-sm
              font-medium
              text-gray-600
              hover:bg-red-50
              hover:text-[#d90416]
              transition
              text-left
            "
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;