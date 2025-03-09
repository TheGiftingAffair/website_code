import Navbar from "./components/Ṇavbar/Navbar";
import Hero from "./components/Hero/Hero";
import Footer from "./components/Footer";
import WhatsappRedirect from "./components/WhatsappRedirect";
import Testimonials from "./components/Testimonials/Testimonials";
import WhyChooseUs from "./components/WhyChooseUs/WhyChooseUs";
import Personalized from "./components/Personalized/Personalized";
import Categories from "./components/Redirect/Redirect";
import Festives from "./components/Festives/Festives";
import BestSellers from "./components/BestSellers/BestSellers";
import ShopByCategories from "./components/ShopByCategories/ShopByCategories";
import ShopByPrice from "./components/ShopByPrice/ShopByPrice";
import ShopByOccasion from "./components/ShopByOccasion/ShopByOccasion";
import HomeCategories from "./components/ShopByCategories/HomeCategories";
import HomeOccasion from "./components/ShopByOccasion/HomeOccasion";
import HomePrice from "./components/ShopByPrice/HomePrice";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <div className="">
          <Categories />
          <Festives />
          {/* 
          <ShopByCategories />
          <ShopByOccasion />
          <ShopByPrice /> */}

          <HomeCategories />
          <HomeOccasion />
          <HomePrice />

          <section className="min-h-[calc(100vh - 50px)] md:h-[calc(100vh - 50px)]">
            <Personalized />
            <WhyChooseUs />
          </section>

          <Testimonials />
        </div>
      </main>
      <Footer />
      <WhatsappRedirect />
    </div>
  );
}
