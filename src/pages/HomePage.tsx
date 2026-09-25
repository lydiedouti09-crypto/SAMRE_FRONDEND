import { useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import AppShowcase from '@/components/AppShowcase';
import International from '@/components/International';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import Faq from '@/components/Faq';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function HomePage() {
  useEffect(() => {
    document.title = 'SAMRE — Stages & Closed Testing Google Play 14 Jours';
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      {/* 1. Header Navigation Principal SAMRE */}
      <Header />

      {/* 2. Hero Section SAMRE avec diaporama interactif et couleurs de marque */}
      <Hero />

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        {/* 3. Nos Piliers & Services */}
        <Services />

        {/* 4. Expérience Mobile & Closed Testing */}
        <AppShowcase />

        {/* 5. Campus & Hubs Régionaux */}
        <International />

        {/* 6. À Propos & Vision SAMRE */}
        <About />

        {/* 7. Témoignages & Preuve Sociale */}
        <Testimonials />

        {/* 8. Foire Aux Questions */}
        <Faq />

        {/* 9. Contact & Support Direct */}
        <Contact />
      </main>

      {/* 10. Footer Institutionnel */}
      <Footer />
    </div>
  );
}
