import { getUsers, updateUserBlockStatus } from "../../auth/services/adminService";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function UserManagement() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [isUpdatingBlock, setIsUpdatingBlock] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        if (!token) {
          toast.error("Please login as admin");
          return;
        }

        const data = await getUsers(page, 5);

        setUsers(data.users);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Get users error:", error);
        toast.error(error.message || "Failed to fetch users");
      }
    };

    fetchUsers();
  }, [page]);

  const handleClear = () => {
    setSearch("");
  };

  const handleBlockToggle = (user) => {
    setConfirmTarget(user);
  };

  const confirmBlockToggle = async () => {
    if (!confirmTarget) return;
    const user = confirmTarget;
    const action = user.isBlocked ? "unblock" : "block";

    try {
      setIsUpdatingBlock(true);
      await updateUserBlockStatus(
        user._id,
        !user.isBlocked
      );

      setUsers((prevUsers) =>
        prevUsers.map((item) =>
          item._id === user._id
            ? {
                ...item,
                isBlocked: !item.isBlocked,
              }
            : item
        )
      );

      toast.success(
        `User ${user.isBlocked ? "unblocked" : "blocked"} successfully`
      );
      setConfirmTarget(null);
    } catch (error) {
      console.error("Block/Unblock error:", error);
      toast.error(error.message || "Failed to update user status");
    } finally {
      setIsUpdatingBlock(false);
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
    <div className="min-h-screen overflow-auto bg-white text-gray-700">

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
                onChange={(e) =>
                  setSearch(e.target.value)
                }
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

      {/* Confirmation Modal */}
      {confirmTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  confirmTarget.isBlocked
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {confirmTarget.isBlocked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {confirmTarget.isBlocked ? "Unblock Customer" : "Block Customer"}
                </h2>
                <p className="text-xs text-gray-500">
                  {confirmTarget.isBlocked
                    ? "Restore access to this customer account"
                    : "Restrict this customer from logging in and placing orders"}
                </p>
              </div>
            </div>

            <p className="text-gray-600 text-sm mt-4">
              Are you sure you want to{" "}
              <strong className="text-gray-900">
                {confirmTarget.isBlocked ? "unblock" : "block"}
              </strong>{" "}
              customer{" "}
              <strong className="text-gray-900">
                "{confirmTarget.name}"
              </strong>{" "}
              ({confirmTarget.email})?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setConfirmTarget(null)}
                disabled={isUpdatingBlock}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-100 transition disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmBlockToggle}
                disabled={isUpdatingBlock}
                className={`inline-flex items-center gap-2 px-5 py-2 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50 cursor-pointer ${
                  confirmTarget.isBlocked
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-[#d90416] hover:bg-red-700"
                }`}
              >
                {isUpdatingBlock ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>
                    {confirmTarget.isBlocked ? "Unblock Customer" : "Block Customer"}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      </div>

    </div>
  );
}

export default UserManagement;