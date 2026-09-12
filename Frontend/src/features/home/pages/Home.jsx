import { Link } from "react-router";
import HomeImage from "../asset/Home-bg.png";

function Home() {
  const token = localStorage.getItem("token");

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">

      <img
        src={HomeImage}
        alt="J-HUB Home"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Navigation */}
      <div className="absolute top-8 right-10 z-20 flex items-center gap-4">

        {/* Login Button */}
        {!token && (
          <Link
            to="/login"
            className="
              px-7
              py-3
              rounded-[12px]
              bg-[#d90416]
              hover:bg-[#b90312]
              text-white
              text-[15px]
              font-semibold
              transition
            "
          >
            Login
          </Link>
        )}

        {/* Profile Icon */}
        {token && (
          <Link
            to="/profile"
            className="
              w-[48px]
              h-[48px]
              rounded-full
              bg-white
              flex
              items-center
              justify-center
              text-black
              hover:bg-gray-200
              transition
            "
          >
            <span className="text-2xl">👤</span>
          </Link>
        )}

      </div>

    </div>
  );
}

export default Home;