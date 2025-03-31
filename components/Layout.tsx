import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 xl:px-8 2xl:px-16 max-w-[1920px]">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
