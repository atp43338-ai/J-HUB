import { useState } from "react";

function AdminDashboard() {
  // ==================================================
  // DASHBOARD DATA
  // ==================================================

  const [stats] = useState({
    users: 125,
    products: 48,
    orders: 86,
    revenue: 125000,
  });


  // ==================================================
  // RECENT ORDERS
  // ==================================================

  const [recentOrders] = useState([
    {
      id: "JHUB-20260929-10001",
      customer: "Farhan",
      amount: 2999,
      status: "Delivered",
    },
    {
      id: "JHUB-20260929-10002",
      customer: "Amma",
      amount: 1999,
      status: "Shipped",
    },
    {
      id: "JHUB-20260928-10003",
      customer: "Abi",
      amount: 1199,
      status: "Pending",
    },
    {
      id: "JHUB-20260928-10004",
      customer: "Rahul",
      amount: 3499,
      status: "Out for Delivery",
    },
    {
      id: "JHUB-20260927-10005",
      customer: "Arun",
      amount: 2499,
      status: "Delivered",
    },
  ]);


  // ==================================================
  // SALES DATA
  // ==================================================

  const salesData = [
    {
      day: "Mon",
      value: 4500,
    },
    {
      day: "Tue",
      value: 6200,
    },
    {
      day: "Wed",
      value: 5100,
    },
    {
      day: "Thu",
      value: 7800,
    },
    {
      day: "Fri",
      value: 6900,
    },
    {
      day: "Sat",
      value: 9200,
    },
    {
      day: "Sun",
      value: 8400,
    },
  ];


  // ==================================================
  // STATUS DATA
  // ==================================================

  const orderStatus = [
    {
      name: "Pending",
      count: 12,
    },
    {
      name: "Shipped",
      count: 18,
    },
    {
      name: "Out for Delivery",
      count: 9,
    },
    {
      name: "Delivered",
      count: 42,
    },
    {
      name: "Cancelled",
      count: 5,
    },
  ];


  // ==================================================
  // STATUS STYLE
  // ==================================================

  const getStatusStyle = (status) => {
    if (status === "Delivered") {
      return "bg-green-50 text-green-600";
    }

    if (status === "Shipped") {
      return "bg-blue-50 text-blue-600";
    }

    if (status === "Out for Delivery") {
      return "bg-purple-50 text-purple-600";
    }

    if (status === "Cancelled") {
      return "bg-red-50 text-red-600";
    }

    return "bg-yellow-50 text-yellow-600";
  };


  // ==================================================
  // MAX SALES
  // ==================================================

  const maxSales = Math.max(
    ...salesData.map((item) => item.value)
  );


  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="min-h-screen bg-[#fffafa]">

      {/* ==========================================
          DASHBOARD HEADER
      ========================================== */}

      <div className="mb-8">

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">

          Admin{" "}

          <span className="text-[#d90416]">
            Dashboard
          </span>

        </h1>

        <p className="text-gray-500 mt-2">
          Welcome back, Admin. Here's what's happening
          with your store.
        </p>

      </div>


      {/* ==========================================
          STAT CARDS
      ========================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">


        {/* USERS */}

        <div
          className="
            bg-white
            border
            border-red-100
            rounded-2xl
            p-6
            shadow-sm
            hover:shadow-md
            transition
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Total Users
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {stats.users}
              </h2>

              <p className="text-xs text-green-600 mt-2">
                Registered users
              </p>

            </div>


            <div
              className="
                w-12
                h-12
                rounded-xl
                bg-red-50
                text-[#d90416]
                flex
                items-center
                justify-center
                text-xl
                font-bold
              "
            >
              U
            </div>

          </div>

        </div>


        {/* PRODUCTS */}

        <div
          className="
            bg-white
            border
            border-red-100
            rounded-2xl
            p-6
            shadow-sm
            hover:shadow-md
            transition
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Total Products
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {stats.products}
              </h2>

              <p className="text-xs text-green-600 mt-2">
                Listed products
              </p>

            </div>


            <div
              className="
                w-12
                h-12
                rounded-xl
                bg-red-50
                text-[#d90416]
                flex
                items-center
                justify-center
                text-xl
                font-bold
              "
            >
              P
            </div>

          </div>

        </div>


        {/* ORDERS */}

        <div
          className="
            bg-white
            border
            border-red-100
            rounded-2xl
            p-6
            shadow-sm
            hover:shadow-md
            transition
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Total Orders
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {stats.orders}
              </h2>

              <p className="text-xs text-green-600 mt-2">
                All orders
              </p>

            </div>


            <div
              className="
                w-12
                h-12
                rounded-xl
                bg-red-50
                text-[#d90416]
                flex
                items-center
                justify-center
                text-xl
                font-bold
              "
            >
              O
            </div>

          </div>

        </div>


        {/* REVENUE */}

        <div
          className="
            bg-white
            border
            border-red-100
            rounded-2xl
            p-6
            shadow-sm
            hover:shadow-md
            transition
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Total Revenue
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                ₹{stats.revenue.toLocaleString("en-IN")}
              </h2>

              <p className="text-xs text-green-600 mt-2">
                Total sales
              </p>

            </div>


            <div
              className="
                w-12
                h-12
                rounded-xl
                bg-red-50
                text-[#d90416]
                flex
                items-center
                justify-center
                text-xl
                font-bold
              "
            >
              ₹
            </div>

          </div>

        </div>

      </div>


      {/* ==========================================
          SALES + RECENT ORDERS
      ========================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">


        {/* SALES OVERVIEW */}

        <div
          className="
            bg-white
            border
            border-red-100
            rounded-2xl
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-xl font-bold text-gray-900">
                Sales Overview
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Weekly sales performance
              </p>

            </div>

            <span className="text-sm text-[#d90416] font-semibold">
              This Week
            </span>

          </div>


          {/* Chart */}

          <div className="h-64 flex items-end justify-between gap-3 border-b border-gray-100">

            {salesData.map((item) => {

              const height =
                (item.value / maxSales) * 100;

              return (
                <div
                  key={item.day}
                  className="
                    flex
                    flex-col
                    items-center
                    justify-end
                    h-full
                    flex-1
                    gap-2
                  "
                >

                  <div className="flex items-end h-full">

                    <div
                      className="
                        w-7
                        sm:w-9
                        bg-[#d90416]
                        rounded-t-lg
                        hover:bg-[#b90312]
                        transition
                      "
                      style={{
                        height: `${height}%`,
                      }}
                      title={`₹${item.value.toLocaleString(
                        "en-IN"
                      )}`}
                    />

                  </div>

                  <span className="text-xs text-gray-500 mb-2">
                    {item.day}
                  </span>

                </div>
              );
            })}

          </div>


          <div className="mt-5 flex items-center justify-between">

            <div>

              <p className="text-xs text-gray-500">
                Highest Sales
              </p>

              <p className="font-bold text-gray-900">
                ₹9,200
              </p>

            </div>


            <div>

              <p className="text-xs text-gray-500 text-right">
                Weekly Total
              </p>

              <p className="font-bold text-[#d90416]">
                ₹48,100
              </p>

            </div>

          </div>

        </div>


        {/* RECENT ORDERS */}

        <div
          className="
            bg-white
            border
            border-red-100
            rounded-2xl
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-xl font-bold text-gray-900">
                Recent Orders
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Latest customer orders
              </p>

            </div>

            <button
              type="button"
              className="
                text-sm
                text-[#d90416]
                font-semibold
                hover:underline
              "
            >
              View All
            </button>

          </div>


          <div className="space-y-4">

            {recentOrders.map((order) => (

              <div
                key={order.id}
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  pb-4
                  border-b
                  border-gray-100
                  last:border-b-0
                  last:pb-0
                "
              >

                <div className="min-w-0">

                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {order.id}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {order.customer}
                  </p>

                </div>


                <div className="text-right flex-shrink-0">

                  <p className="font-semibold text-gray-900 text-sm">
                    ₹{order.amount.toLocaleString("en-IN")}
                  </p>

                  <span
                    className={`
                      inline-flex
                      px-2.5
                      py-1
                      rounded-full
                      text-[11px]
                      font-semibold
                      mt-1
                      ${getStatusStyle(order.status)}
                    `}
                  >
                    {order.status}
                  </span>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>


      {/* ==========================================
          ORDER STATUS
      ========================================== */}

      <div
        className="
          bg-white
          border
          border-red-100
          rounded-2xl
          p-6
          shadow-sm
        "
      >

        <div className="mb-6">

          <h2 className="text-xl font-bold text-gray-900">
            Order Status
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Current order status overview
          </p>

        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

          {orderStatus.map((item) => (

            <div
              key={item.name}
              className="
                border
                border-gray-100
                rounded-xl
                p-5
                hover:border-red-100
                transition
              "
            >

              <p className="text-sm text-gray-500">
                {item.name}
              </p>

              <p className="text-2xl font-bold text-gray-900 mt-2">
                {item.count}
              </p>

              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">

                <div
                  className="h-full bg-[#d90416] rounded-full"
                  style={{
                    width: `${
                      (item.count / stats.orders) *
                      100
                    }%`,
                  }}
                />

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;