import Navbar from "../../home/components/Navbar";
import Footer from "../../home/components/Footer";
import ProfileSidebar from "./ProfileSidebar";

function ProfileLayout({
  children,
  title,
  highlight,
  description,
}) {
  return (
    <div className="min-h-screen bg-[#f7f7f7] text-black">

      {/* Navbar */}
      <Navbar />

      {/* Main Profile Area */}
      <main className="pt-[100px] px-5 md:px-8 lg:px-10 pb-12">

        <div className="max-w-[1400px] mx-auto">

          {/* Page Heading */}
          <div className="mb-8">

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">

              <span className="text-black">
                {title}
              </span>

              {highlight && (
                <span className="text-[#d90416] ml-2">
                  {highlight}
                </span>
              )}

            </h1>

            {description && (
              <p className="mt-2 text-gray-500 text-sm md:text-base">
                {description}
              </p>
            )}

          </div>


          {/* Main Dashboard */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* Sidebar */}
            <div className="w-full lg:w-[260px] lg:flex-shrink-0 lg:sticky lg:top-[105px]">

              <ProfileSidebar />

            </div>


            {/* Content Area */}
            <section
              className="
                flex-1
                min-w-0
                w-full
                bg-white
                rounded-2xl
                border
                border-gray-200
                shadow-sm
                p-6
                md:p-8
                lg:p-10
              "
            >
              {children}
            </section>

          </div>

        </div>

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default ProfileLayout;