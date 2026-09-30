function AdminHeader({ onMenuClick }) {
  return (
    <header
      className="
        h-20
        bg-white
        border-b
        border-red-100
        flex
        items-center
        justify-between
        px-4
        sm:px-6
        lg:px-8
        sticky
        top-0
        z-30
        shadow-sm
      "
    >

      


      {/* Desktop Title */}
      <div className="hidden lg:block">

        <h2 className="text-xl font-semibold text-gray-900">
          J-HUB Admin
        </h2>

        <p className="text-sm text-gray-500">
          Manage your store
        </p>

      </div>


      {/* Right Side */}
      <div className="flex items-center gap-3 ml-auto">

        <div
          className="
            w-10
            h-10
            rounded-full
            bg-[#d90416]
            text-white
            flex
            items-center
            justify-center
            font-semibold
            shadow-sm
          "
        >
          A
        </div>


        <div className="hidden sm:block">

          <p className="text-sm font-semibold text-gray-900">
            Admin
          </p>

          <p className="text-xs text-gray-500">
            Administrator
          </p>

        </div>

      </div>

    </header>
  );
}

export default AdminHeader;