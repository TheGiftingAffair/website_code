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
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-headline text-center">
              <span className="relative">
                About Us
                <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary/60 rounded-full"></span>
              </span>
            </h1>
            <h1 className="text-xl md:text-3xl font-semibold italic text-bg4 mb-12 text-center">
              <span className="relative">
                Unwrap Happiness
                <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary/60 rounded-full"></span>
              </span>
            </h1>

            <div className="bg-white/90 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-xl font-mont">
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-4 text-headline">
                    Welcome to The Gifting Affair!
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    We're a Singapore-based online business dedicated to
                    spreading joy and fostering connections through the art of
                    gifting. We believe that a thoughtfully curated hamper can
                    brighten someone's day, celebrate a special occasion, or
                    simply show you care.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-primary mb-4 text-headline">
                    Our Philosophy
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    At The Gifting Affair, we're passionate about creating
                    moments of happiness. We carefully select high- quality
                    products, source locally where possible, and beautifully
                    arrange them to create memorable gifts. Our tagline, 'Unwrap
                    Happiness,' encapsulates our mission: to deliver joy and
                    create lasting impressions with every hamper.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-primary mb-4 text-headline">
                    Our Hampers
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    We offer a diverse range of hampers to suit every taste and
                    occasion. Whether you're looking for a gourmet food basket,
                    a pampering spa set, or a festive gift for the holidays, we
                    have something for everyone. We also offer custom hamper
                    options, allowing you to create a truly personalized gift
                    that reflects your unique style and sentiment.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-primary mb-4 text-headline">
                    Why Choose Us?
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>
                        <span className="font-semibold">
                          Curated Selection:
                        </span>{" "}
                        We hand-pick each item for its quality and appeal.
                      </li>
                      <li>
                        <span className="font-semibold">Local Focus:</span> We
                        prioritize sourcing from Singaporean suppliers.
                      </li>
                      <li>
                        <span className="font-semibold">
                          Beautiful Presentation:
                        </span>{" "}
                        Our hampers are meticulously arranged and elegantly
                        packaged.
                      </li>
                    </ul>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>
                        <span className="font-semibold">
                          Personalized Options:
                        </span>{" "}
                        Create a custom hamper to suit your specific needs.
                      </li>
                      <li>
                        <span className="font-semibold">
                          Reliable Delivery:
                        </span>{" "}
                        We ensure your gift arrives on time and in perfect
                        condition.
                      </li>
                      <li>
                        <span className="font-semibold">
                          Exceptional Service:
                        </span>{" "}
                        We're committed to providing a seamless and enjoyable
                        gifting experience.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-gray-700 leading-relaxed">
                    Thank you for choosing The Gifting Affair. We look forward
                    to helping you create unforgettable moments through the joy
                    of gifting!
                  </p>
                  <p className="text-primary font-semibold mt-4 text-headline">
                    Contact us today to discuss your gifting needs!
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
