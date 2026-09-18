import { getUsers, updateUserBlockStatus } from "../services/adminService";
import { useEffect, useState } from "react";
import AdminMenu from "../components/AdminMenu";

function UserManagement() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        if (!token) {
          alert("Please login as admin");
          return;
        }

        const data = await getUsers(page, 5);

        setUsers(data.users);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Get users error:", error);
        alert(error.message);
      }
    };

    fetchUsers();
  }, [page]);

  const handleClear = () => {
    setSearch("");
  };

  const handleBlockToggle = async (user) => {
    const action = user.isBlocked ? "unblock" : "block";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this user?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await updateUserBlockStatus(
        user._id,
        !user.isBlocked
      );

      setUsers((prevUsers) =>
        prevUsers.map((item) =>
          item._id === user._id
            ? { ...item, isBlocked: !item.isBlocked }
            : item
        )
      );
    } catch (error) {
      console.error("Block/Unblock error:", error);
      alert(error.message);
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    return (
      user.name.toLowerCase().includes(searchText) ||
      user.email.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="fixed inset-0 z-50 w-screen min-h-screen overflow-auto bg-white text-gray-700">

      {/* Admin Menu */}
      <AdminMenu />

      {/* Header */}
      <div className="w-full border-b border-red-100 bg-white px-5 sm:px-8 lg:px-10 py-7">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              <span className="text-[#d90416]">
                User
              </span>{" "}
              <span className="text-gray-800">
                Management
              </span>
            </h1>

            <p className="text-gray-500 text-sm mt-2">
              Manage registered users
            </p>
          </div>

          <div
            className="
              text-sm
              text-gray-500
              border
              border-red-100
              bg-red-50
              rounded-lg
              px-4
              py-2
            "
          >
            Total Users:{" "}
            <span className="text-[#d90416] font-bold">
              {users.length}
            </span>
          </div>

        </div>

      </div>

      {/* Main Content */}
      <div className="p-5 sm:p-8 lg:p-10">

        {/* Search Section */}
        <div
          className="
            bg-white
            border
            border-red-100
            rounded-2xl
            p-5
            mb-6
            shadow-sm
          "
        >

          <div className="flex flex-col sm:flex-row gap-3">

            <div className="relative flex-1">

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users by name or email"
                className="
                  w-full
                  h-[48px]
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  px-4
                  text-gray-700
                  text-sm
                  placeholder-gray-400
                  outline-none
                  focus:border-[#d90416]
                  focus:ring-1
                  focus:ring-red-100
                "
              />

            </div>

            <button
              onClick={handleClear}
              className="
                h-[48px]
                px-6
                rounded-lg
                border
                border-[#d90416]
                bg-white
                text-[#d90416]
                text-sm
                font-semibold
                hover:bg-[#d90416]
                hover:text-white
                transition
              "
            >
              Clear
            </button>

          </div>

        </div>

        {/* Users Table */}
        <div
          className="
            bg-white
            border
            border-red-100
            rounded-2xl
            overflow-hidden
            shadow-sm
          "
        >

          {/* Desktop Table */}
          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px]">

              <thead>
                <tr className="border-b border-red-100 bg-red-50">

                  <th className="text-left px-6 py-4 text-[#d90416] text-sm font-semibold">
                    #
                  </th>

                  <th className="text-left px-6 py-4 text-[#d90416] text-sm font-semibold">
                    User
                  </th>

                  <th className="text-left px-6 py-4 text-[#d90416] text-sm font-semibold">
                    Email
                  </th>

                  <th className="text-left px-6 py-4 text-[#d90416] text-sm font-semibold">
                    Phone
                  </th>

                  <th className="text-left px-6 py-4 text-[#d90416] text-sm font-semibold">
                    Status
                  </th>

                  <th className="text-center px-6 py-4 text-[#d90416] text-sm font-semibold">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredUsers.map((user, index) => (

                  <tr
                    key={user._id}
                    className="
                      border-b
                      border-red-50
                      last:border-b-0
                      hover:bg-red-50/50
                      transition
                    "
                  >

                    {/* Number */}
                    <td className="px-6 py-5 text-gray-500 text-sm">
                      {index + 1}
                    </td>

                    {/* User */}
                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div
                          className="
                            w-[40px]
                            h-[40px]
                            rounded-full
                            bg-red-50
                            border
                            border-red-100
                            flex
                            items-center
                            justify-center
                            text-[#d90416]
                            font-bold
                          "
                        >
                          {user.name.charAt(0)}
                        </div>

                        <span className="text-gray-800 text-sm font-semibold">
                          {user.name}
                        </span>

                      </div>

                    </td>

                    {/* Email */}
                    <td className="px-6 py-5 text-gray-600 text-sm">
                      {user.email}
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-5 text-gray-600 text-sm">
                      {user.phone}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">

                      <span
                        className={`
                          inline-flex
                          px-3
                          py-1
                          rounded-full
                          text-xs
                          font-semibold
                          ${
                            !user.isBlocked
                              ? "bg-red-50 text-[#d90416]"
                              : "bg-red-100 text-[#b90312]"
                          }
                        `}
                      >
                        {user.isBlocked
                          ? "Blocked"
                          : "Active"}
                      </span>

                    </td>

                    {/* Action */}
                    <td className="px-6 py-5">

                      <div className="flex justify-center">

                        {!user.isBlocked ? (

                          <button
                            onClick={() =>
                              handleBlockToggle(user)
                            }
                            className="
                              px-5
                              h-[38px]
                              rounded-lg
                              border
                              border-[#d90416]
                              bg-white
                              text-[#d90416]
                              hover:bg-[#d90416]
                              hover:text-white
                              text-xs
                              font-semibold
                              transition
                            "
                          >
                            Block
                          </button>

                        ) : (

                          <button
                            onClick={() =>
                              handleBlockToggle(user)
                            }
                            className="
                              px-5
                              h-[38px]
                              rounded-lg
                              bg-[#d90416]
                              hover:bg-[#b90312]
                              text-white
                              text-xs
                              font-semibold
                              transition
                            "
                          >
                            Unblock
                          </button>

                        )}

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* Pagination */}
          <div
            className="
              border-t
              border-red-100
              px-5
              sm:px-6
              py-4
              flex
              flex-col
              sm:flex-row
              items-center
              justify-between
              gap-4
              bg-white
            "
          >

            <p className="text-gray-500 text-sm">
              Showing 1–{filteredUsers.length} of{" "}
              {filteredUsers.length} users
            </p>

            <div className="flex items-center gap-2">

              {/* Previous */}
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="
                  w-[38px]
                  h-[38px]
                  rounded-lg
                  border
                  border-red-100
                  bg-white
                  text-[#d90416]
                  hover:border-[#d90416]
                  hover:bg-red-50
                  disabled:text-gray-300
                  disabled:border-gray-200
                  disabled:cursor-not-allowed
                  transition
                "
              >
                ←
              </button>

              {/* Current Page */}
              <button
                className="
                  w-[38px]
                  h-[38px]
                  rounded-lg
                  bg-[#d90416]
                  text-white
                  text-sm
                  font-semibold
                "
              >
                {page}
              </button>

              {/* Next */}
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="
                  w-[38px]
                  h-[38px]
                  rounded-lg
                  border
                  border-red-100
                  bg-white
                  text-[#d90416]
                  hover:border-[#d90416]
                  hover:bg-red-50
                  disabled:text-gray-300
                  disabled:border-gray-200
                  disabled:cursor-not-allowed
                  transition
                "
              >
                →
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default UserManagement;