import React from "react";

import HeroSection from "../components/HeroSection/HeroSection";
import AboutSection from "../components/AboutSection/AboutSection";
import ServicesSection from "../components/ServicesSection/ServicesSection";
import QualitySection from "../components/QualitySection/QualitySection";
import WhyChooseSection from "../components/WhyChooseSection/WhyChooseSection";
import FinalCTA from "../components/FinalCTA/FinalCTA";
import BookNow from "../components/BookNow/BookNow";

import  "./Home.css";

const HomePage = () => {
  return (
    <div>
    
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <QualitySection />
      <WhyChooseSection />
      <FinalCTA />
      <BookNow />
     
    </div>
  );
};

export default HomePage;
