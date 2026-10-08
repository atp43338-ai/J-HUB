import { useLocation, useNavigate } from "react-router";

function ProfileSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check active page
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/", {
      replace: true,
    });
  };

  return (
    <aside
      className="
        w-full
        bg-[#171717]
        text-white
        rounded-2xl
        shadow-lg
        overflow-hidden
      "
    >

      <div className="p-5">

        {/* Sidebar Brand */}
        <div className="px-3 pb-5 mb-4 border-b border-white/10">

          <h2 className="text-2xl font-bold tracking-tight">

            <span className="text-white">
              J -
            </span>

            <span className="text-[#d90416]">
              HUB
            </span>

          </h2>

          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">
            My Account
          </p>

        </div>


        {/* Navigation Label */}
        <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">
          Account
        </p>


        {/* Profile */}
        <button
          type="button"
          onClick={() => navigate("/profile")}
          className={`
            w-full
            h-[50px]
            px-4
            rounded-xl
            flex
            items-center
            transition-all
            duration-200
            group
            ${
              isActive("/profile")
                ? "bg-[#d90416] text-white shadow-md"
                : "text-gray-300 hover:bg-white/5 hover:text-white"
            }
          `}
        >

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-5 h-5 mr-3 flex-shrink-0"
          >
            <circle
              cx="12"
              cy="8"
              r="3.5"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 20a7 7 0 0 1 14 0"
            />
          </svg>

          <span className="font-medium text-sm">
            Profile
          </span>

        </button>


        {/* Address */}
        <button
          type="button"
          onClick={() => navigate("/address")}
          className={`
            w-full
            h-[50px]
            px-4
            rounded-xl
            flex
            items-center
            mt-2
            transition-all
            duration-200
            ${
              isActive("/address")
                ? "bg-[#d90416] text-white shadow-md"
                : "text-gray-300 hover:bg-white/5 hover:text-white"
            }
          `}
        >

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-5 h-5 mr-3 flex-shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"
            />

            <circle
              cx="12"
              cy="10"
              r="2.5"
            />
          </svg>

          <span className="font-medium text-sm">
            Address
          </span>

        </button>


        {/* Orders */}
        <button
          type="button"
          onClick={() => navigate("/orders")}
          className={`
            w-full
            h-[50px]
            px-4
            rounded-xl
            flex
            items-center
            mt-2
            transition-all
            duration-200
            ${
              isActive("/orders")
                ? "bg-[#d90416] text-white shadow-md"
                : "text-gray-300 hover:bg-white/5 hover:text-white"
            }
          `}
        >

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-5 h-5 mr-3 flex-shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 7h12l1 13H5L6 7Z"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 7a3 3 0 0 1 6 0"
            />
          </svg>

          <span className="font-medium text-sm">
            Orders
          </span>

        </button>


        {/* Password */}
        <button
          type="button"
          onClick={() => navigate("/change-password")}
          className={`
            w-full
            h-[50px]
            px-4
            rounded-xl
            flex
            items-center
            mt-2
            transition-all
            duration-200
            ${
              isActive("/change-password")
                ? "bg-[#d90416] text-white shadow-md"
                : "text-gray-300 hover:bg-white/5 hover:text-white"
            }
          `}
        >

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-5 h-5 mr-3 flex-shrink-0"
          >
            <rect
              x="5"
              y="10"
              width="14"
              height="10"
              rx="2"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10V7a4 4 0 0 1 8 0v3"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 14v2"
            />
          </svg>

          <span className="font-medium text-sm">
            Password
          </span>

        </button>

       {/* Referral */}
<button
  type="button"
  onClick={() => navigate("/referral")}
  className={`
    w-full
    h-[50px]
    px-4
    rounded-xl
    flex
    items-center
    mt-2
    transition-all
    duration-200
    ${
      isActive("/referral")
        ? "bg-[#d90416] text-white shadow-md"
        : "text-gray-300 hover:bg-white/5 hover:text-white"
    }
  `}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-5 h-5 mr-3 flex-shrink-0"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
    />

    <circle
      cx="9"
      cy="7"
      r="4"
    />

    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 8v6"
    />

    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M22 11h-6"
    />
  </svg>

  <span className="font-medium text-sm">
    Referral
  </span>
</button>

{/* Wallet */}
<button
  type="button"
  onClick={() => navigate("/wallet")}
  className={`
    w-full
    h-[50px]
    px-4
    rounded-xl
    flex
    items-center
    mt-2
    transition-all
    duration-200
    ${
      isActive("/wallet")
        ? "bg-[#d90416] text-white shadow-md"
        : "text-gray-300 hover:bg-white/5 hover:text-white"
    }
  `}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 mr-3"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 13h.01"
    />
  </svg>

  <span className="font-medium text-sm">
    Wallet
  </span>
</button>


        {/* Settings */}
        <button
          type="button"
          className="
            w-full
            h-[50px]
            px-4
            rounded-xl
            flex
            items-center
            mt-2
            text-gray-300
            hover:bg-white/5
            hover:text-white
            transition-all
            duration-200
          "
        >

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-5 h-5 mr-3 flex-shrink-0"
          >
            <circle
              cx="12"
              cy="12"
              r="3"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.05.05-1.7 1.7-.05-.05a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.04 1.56V20h-2.4v-.2a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.88.34l-.05.05-1.7-1.7.05-.05A1.7 1.7 0 0 0 8.4 15a1.7 1.7 0 0 0-1.56-1.04H6.6v-2.4h.24A1.7 1.7 0 0 0 8.4 10a1.7 1.7 0 0 0-.34-1.88l-.05-.05 1.7-1.7.05.05a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 12.68 5.2V5h2.4v.2a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.88-.34l.05-.05 1.7 1.7-.05.05A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.56 1.04h.24v2.4h-.24A1.7 1.7 0 0 0 19.4 15Z"
            />
          </svg>

          <span className="font-medium text-sm">
            Settings
          </span>

        </button>


        {/* Divider */}
        <div className="border-t border-white/10 my-5" />


        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="
            w-full
            h-[50px]
            px-4
            rounded-xl
            flex
            items-center
            text-gray-300
            hover:bg-red-500/10
            hover:text-red-400
            transition-all
            duration-200
          "
        >

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-5 h-5 mr-3 flex-shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 17l5-5-5-5"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12H3"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 19V5a2 2 0 0 0-2-2h-6"
            />
          </svg>

          <span className="font-medium text-sm">
            Logout
          </span>

        </button>

      </div>

    </aside>
  );
}

export default ProfileSidebar;