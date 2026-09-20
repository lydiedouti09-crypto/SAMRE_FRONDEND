import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import ForCandidates from "@/components/ForCandidates";
import ForCompanies from "@/components/ForCompanies";
import International from "@/components/International";
import EventsResources from "@/components/EventsResources";
import AppShowcase from "@/components/AppShowcase";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function HomePage() {
  useEffect(() => {
    document.title = "SAMRE — Connecter les talents aux opportunités";
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <ForCandidates />
        <ForCompanies />
        <International />
        <EventsResources />
        <AppShowcase />
        <About />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
