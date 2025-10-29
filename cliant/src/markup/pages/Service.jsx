import React from "react";
import WhyChooseSection from "../components/WhyChooseSection/WhyChooseSection";
import ServiceSection from "../components/ServicesSection/ServicesSection";
import ContactUs from "../components/ContactUs/ContactUs";
import BookNow from "../components/BookNow/BookNow";
import FinalCTA from "../components/FinalCTA/FinalCTA";

function Service() {
  return (
    <>
      <ContactUs />
      <ServiceSection />
      <WhyChooseSection />
      <FinalCTA/>
      <BookNow/>
    </>
  );
}

export default Service;
