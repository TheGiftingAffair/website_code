import React from "react";
import Navbar from "../components/Ṇavbar/Navbar";
import Footer from "../components/Footer";
import WhatsappRedirect from "../components/WhatsappRedirect";

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <div className=" bg-bg1/50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-headline mb-8 text-center">
            About The Gifting Affair
          </h1>

          <div className="bg-white p-9 rounded-lg shadow-lg font-mont font-semibold">
            <p className="text-gray-700 leading-relaxed">
              Monika's journey from a finance professional to a creative curator
              of unique hampers is a testament to her passion and dedication. As
              a proud Singaporean, Monika has spent nearly two decades in
              Singapore, embracing its rich cultural and racial harmony. She is
              a chartered accountant, accredited by the Institute of Singapore
              Chartered Accountants (ISCA), and has over 15 years of experience
              in the finance industry. As the director of Sequent Solutions Pte
              Ltd, a recruitment and BPO service provider, Monika has
              demonstrated her proficiency in finance and leadership.
            </p>

            <p className="text-gray-700 leading-relaxed mt-6">
              Despite her successful career in finance, Monika's childhood dream
              of indulging in creative pursuits remained close to her heart.
              This dream led to the inception of The Gifting Affair—a venture
              where Monika combines her love for creativity with the joy of
              gifting. Monika's knack for turning simple things into beautiful
              creations is evident in every hamper she designs.
            </p>

            <p className="text-gray-700 leading-relaxed mt-6">
              In just a few months since its inception, The Gifting Affair has
              already curated hundreds of bespoke hampers, each designed by
              Monika. These hampers have delighted recipients, garnering
              positive reviews and heartfelt blessings for Monika.
            </p>

            <p className="text-gray-700 leading-relaxed mt-6">
              While The Gifting Affair is still at the beginning of its journey,
              the foundation built on Monika's hard work, dedication, and
              passion promises a bright future. Her commitment to creativity and
              excellence will undoubtedly take The Gifting Affair to new
              heights, spreading joy and beauty one hamper at a time. Monika's
              journey is sure to inspire many, proving that it is never too late
              to follow one's dreams.
            </p>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsappRedirect />
    </>
  );
};

export default AboutUs;
