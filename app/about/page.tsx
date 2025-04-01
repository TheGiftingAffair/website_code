import React from "react";
import Navbar from "../components/Ṇavbar/Navbar";
import Footer from "../components/Footer";
import WhatsappRedirect from "../components/WhatsappRedirect";
import Image from "next/image";

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-bg1/50 py-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03] z-0">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-8 p-4">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="w-full aspect-square relative">
                <Image
                  src="/images/hamper-silho.png"
                  alt=""
                  fill
                  className={`object-contain transform ${
                    i % 2 === 0 ? "rotate-12" : "-rotate-12"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-headline mb-12 text-center">
              <span className="relative">
                About The Gifting Affair
                <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary/60 rounded-full"></span>
              </span>
            </h1>

            <div className="bg-white/90 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-xl font-mont">
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-4">
                    Our Journey
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Monika's journey from a finance professional to a creative
                    curator of unique hampers is a testament to her passion and
                    dedication. As a proud Singaporean, Monika has spent nearly
                    two decades in Singapore, embracing its rich cultural and
                    racial harmony. She is a chartered accountant, accredited by
                    the Institute of Singapore Chartered Accountants (ISCA), and
                    has over 15 years of experience in the finance industry. As
                    the director of Sequent Solutions Pte Ltd, a recruitment and
                    BPO service provider, Monika has demonstrated her
                    proficiency in finance and leadership.
                  </p>
                </div>

                <div className="border-l-4 border-primary/30 pl-6">
                  <p className="text-gray-700 leading-relaxed italic">
                    Despite her successful career in finance, Monika's childhood
                    dream of indulging in creative pursuits remained close to
                    her heart. This dream led to the inception of The Gifting
                    Affair—a venture where Monika combines her love for
                    creativity with the joy of gifting. Monika's knack for
                    turning simple things into beautiful creations is evident in
                    every hamper she designs.
                  </p>
                </div>

                <div className="bg-primary/5 p-6 rounded-xl">
                  <h2 className="text-2xl font-bold text-primary mb-4">
                    Our Achievement
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    In just a few months since its inception, The Gifting Affair
                    has already curated hundreds of bespoke hampers, each
                    designed by Monika. These hampers have delighted recipients,
                    garnering positive reviews and heartfelt blessings for
                    Monika.
                  </p>
                </div>

                <div className="text-center">
                  <h2 className="text-2xl font-bold text-primary mb-4">
                    Our Vision
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    While The Gifting Affair is still at the beginning of its
                    journey, the foundation built on Monika's hard work,
                    dedication, and passion promises a bright future. Her
                    commitment to creativity and excellence will undoubtedly
                    take The Gifting Affair to new heights, spreading joy and
                    beauty one hamper at a time. Monika's journey is sure to
                    inspire many, proving that it is never too late to follow
                    one's dreams.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsappRedirect />
    </>
  );
};

export default AboutUs;
