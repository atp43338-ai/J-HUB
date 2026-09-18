import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturedProducts from "../components/FeaturedProducts";
import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";


function Home() {
  return (
    <div className="w-full bg-white text-black">
      
      <Navbar />

      <HeroSection />

      <FeaturedProducts />

      <AboutSection />

      <ContactSection />

      <Footer/>

    </div>
  );
}

export default Home;