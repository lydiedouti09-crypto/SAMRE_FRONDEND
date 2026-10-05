import { useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import AppShowcase from '@/components/AppShowcase';
import About from '@/components/About';
import Faq from '@/components/Faq';
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

        {/* 5. À Propos & Vision SAMRE */}
        <About />

        {/* 6. Foire Aux Questions */}
        <Faq />
      </main>

      {/* 8. Footer Institutionnel */}
      <Footer />
    </div>
  );
}
