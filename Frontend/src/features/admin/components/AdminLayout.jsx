import { useState } from "react";
import { Outlet } from "react-router";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fffafa]">

      {/* Sidebar */}
      <AdminSidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />


      {/* Main Area */}
      <div className="lg:ml-64 min-h-screen">

        {/* Header */}
        <AdminHeader
          onMenuClick={() =>
            setIsOpen(true)
          }
        />


        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;