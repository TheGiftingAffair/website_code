"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { BsArrowRight } from "react-icons/bs";
import "./festives.css";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

interface FestiveHamper {
  id: string;
  name: string;
  price: number;
  image: string;
  components: string[];
  description?: string;
  stock?: boolean;
  festive: boolean;
  visibility: boolean;
}

const Festives = () => {
  const [festiveHampers, setFestiveHampers] = useState<FestiveHamper[]>([]);

  useEffect(() => {
    const fetchFestiveHampers = async () => {
      try {
        const q = query(
          collection(db, "Products"),
          where("festive", "==", true),
          where("visibility", "==", true)
        );

        const querySnapshot = await getDocs(q);
        const hampers: FestiveHamper[] = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as FestiveHamper)
        );

        setFestiveHampers(hampers);
      } catch (error) {
        console.error("Error fetching festive hampers from Firestore:", error);
      }
    };

    fetchFestiveHampers();
  }, []);

  // Only render if there are festive hampers
  if (festiveHampers.length === 0) {
    return null;
  }

  return (
    <section
      id="special-hampers"
      className="pt-8 relative bg-gradient-to-r from-bg1/40 to-bg3/10"
    >
      <div className="container mx-auto px-4 z-10">
        <h2 className="text-3xl md:text-5xl 2xl:text-6xl font-alegreya font-bold text-center mb-2 text-headline">
          Exclusive Festive Hampers
        </h2>
        <p className="text-center text-bg4 font-mont font-semibold text-md 2xl:text-lg mb-6 max-w-2xl mx-auto">
          Celebrate the season with these specially curated hampers!
        </p>

        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          pagination={{ clickable: true }}
          className="festive-swiper"
        >
          {festiveHampers.map((hamper, index) => (
            <SwiperSlide key={hamper.id}>
              <div
                className={`flex flex-col md:flex-row md:mx-12 justify-center items-center border border-headline/20  ${
                  index % 2 === 0 ? "" : "md:flex-row-reverse"
                } bg-[#f9f9f9] rounded-xl overflow-hidden shadow-lg`}
              >
                <div className="p-4 relative h-[320px] w-[320px] md:h-[400px] md:w-[400px]">
                  <Link
                    href={`/product/${hamper.id}`}
                    className="cursor-pointer block"
                  >
                    <img
                      src={hamper.image}
                      alt={hamper.name}
                      className="h-[300px] w-[300px] md:h-[360px] md:w-[360px] object-cover rounded-xl"
                    />
                  </Link>
                </div>
                <div
                  className={`md:w-2/3 px-6 py-6 ${
                    index % 2 === 0 ? "text-left" : "text-left flex flex-col"
                  }`}
                >
                  <h3 className="text-3xl 2xl:text-4xl font-bold mb-3 font-domine text-headline">
                    {hamper.name}
                  </h3>
                  <p className="text-2xl 2xl:text-3xl text-primary mb-2 md:mb-4 font-mont text-bg4 font-semibold">
                    ${hamper.price}
                  </p>
                  <ul className="mb-2 md:mb-4 space-y-1 text-sm md:text-md 2xl:text-lg font-semibold text-headline/90">
                    {hamper.components.slice(0, 100).map((component, i) => (
                      <li key={i} className="flex items-center">
                        <span className="mr-2">•</span> {component}
                      </li>
                    ))}
                  </ul>
                  {hamper.description && (
                    <p className="text-xs font-medium text-gray-600 mb-2">
                      {hamper.description}*
                    </p>
                  )}
                  {hamper.stock && (
                    <p
                      className={`text-sm font-bold ${
                        hamper.stock === "Limited Stock Available"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {hamper.stock}
                    </p>
                  )}
                  <Link href={`/product/${hamper.id}`}>
                    <button className="flex items-center gap-2 bg-primary text-[#f9f9f9] bg-green-600 hover:bg-green-700 font-semibold px-4 py-1.5 text-md rounded-full hover:bg-primary-dark transition-all">
                      Shop Now <BsArrowRight />
                    </button>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Festives;
