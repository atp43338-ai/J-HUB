import { getUsers, updateUserBlockStatus } from "../services/adminService";
import { useEffect, useState } from "react";

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
  <div className="fixed inset-0 z-50 w-screen min-h-screen overflow-auto bg-[#0f1012] text-white">

    {/* Header */}

    <div className="w-full border-b border-[#292a2d] bg-[#141518] px-5 sm:px-8 lg:px-10 py-5">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            <span className="text-[#d90416]">User</span>{" "}
            Management
          </h1>

          <p className="text-gray-400 text-sm mt-1">
            Manage registered users
          </p>
        </div>

        <div className="text-sm text-gray-400">
          Total Users:{" "}
          <span className="text-white font-semibold">
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
          bg-[#181a1d]
          border border-[#2d2e31]
          rounded-[16px]
          p-5
          mb-6
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
                rounded-[10px]
                border border-[#3a3b3f]
                bg-[#111214]
                px-4
                text-white
                text-sm
                placeholder-gray-500
                outline-none
                focus:border-[#d90416]
              "
            />

          </div>

          <button
            onClick={handleClear}
            className="
              h-[48px]
              px-6
              rounded-[10px]
              border border-[#444]
              bg-[#222326]
              hover:border-[#d90416]
              hover:text-[#d90416]
              text-gray-300
              text-sm
              font-semibold
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
          bg-[#181a1d]
          border border-[#2d2e31]
          rounded-[16px]
          overflow-hidden
        "
      >

        {/* Desktop Table */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[800px]">

            <thead>
              <tr className="border-b border-[#303136] bg-[#1d1f22]">

                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">
                  #
                </th>

                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">
                  User
                </th>

                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">
                  Email
                </th>

                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">
                  Phone
                </th>

                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">
                  Status
                </th>

                <th className="text-center px-6 py-4 text-gray-400 text-sm font-medium">
                  Action
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredUsers.map((user, index) => (

                <tr
                  key={user._id}
                  className="
                    border-b border-[#292a2d]
                    last:border-b-0
                    hover:bg-[#1d1f22]
                    transition
                  "
                >

                  <td className="px-6 py-5 text-gray-400 text-sm">
                    {index + 1}
                  </td>

                  <td className="px-6 py-5">

                    <div className="flex items-center gap-3">

                      <div
                        className="
                          w-[40px]
                          h-[40px]
                          rounded-full
                          bg-[#d90416]/15
                          flex
                          items-center
                          justify-center
                          text-[#d90416]
                          font-semibold
                        "
                      >
                        {user.name.charAt(0)}
                      </div>

                      <span className="text-white text-sm font-medium">
                        {user.name}
                      </span>

                    </div>

                  </td>

                  <td className="px-6 py-5 text-gray-300 text-sm">
                    {user.email}
                  </td>

                  <td className="px-6 py-5 text-gray-300 text-sm">
                    {user.phone}
                  </td>

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
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }
                      `}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>

                  </td>

                  <td className="px-6 py-5">

                    <div className="flex justify-center">

                      {!user.isBlocked ? (

                        <button
                          onClick={() => handleBlockToggle(user)}
                          className="
                            px-4
                            h-[38px]
                            rounded-[9px]
                            border border-[#d90416]
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
                          onClick={() => handleBlockToggle(user)}
                          className="
                            px-4
                            h-[38px]
                            rounded-[9px]
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
            border-t border-[#303136]
            px-5 sm:px-6
            py-4
            flex
            flex-col sm:flex-row
            items-center
            justify-between
            gap-4
          "
        >

          <p className="text-gray-500 text-sm">
            Showing 1–{filteredUsers.length} of {filteredUsers.length} users
          </p>

          <div className="flex items-center gap-2">

            <button
  onClick={() => setPage(page - 1)}
  disabled={page === 1}
  className="
    w-[38px]
    h-[38px]
    rounded-[8px]
    border border-[#3a3b3f]
    text-gray-400
    hover:border-[#d90416]
    hover:text-[#d90416]
    disabled:text-gray-600
    disabled:cursor-not-allowed
  "
>
  ←
</button>

            <button
              className="
                w-[38px]
                h-[38px]
                rounded-[8px]
                bg-[#d90416]
                text-white
                text-sm
                font-semibold
              "
            >
              {page}
            </button>

            <button
  onClick={() => setPage(page + 1)}
  disabled={page === totalPages}
  className="
    w-[38px]
    h-[38px]
    rounded-[8px]
    border border-[#3a3b3f]
    text-gray-400
    hover:border-[#d90416]
    hover:text-[#d90416]
    disabled:text-gray-600
    disabled:cursor-not-allowed
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