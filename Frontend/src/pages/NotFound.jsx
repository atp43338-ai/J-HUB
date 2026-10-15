import { useNavigate } from "react-router";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="min-h-[70vh] flex flex-col items-center justify-center max-w-lg w-full">
        {/* Error Code */}
        <span className="text-8xl sm:text-9xl font-black text-[#d90416] tracking-tight select-none">
          404
        </span>

        {/* Heading */}
        <h1 className="mt-4 text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-md leading-relaxed">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-6 py-2.5 rounded-lg bg-[#d90416] text-white font-medium hover:bg-[#b00312] transition shadow-sm active:scale-95 cursor-pointer"
          >
            Go Back Home
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-100 transition active:scale-95 cursor-pointer"
          >
            Back to Previous Page
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
