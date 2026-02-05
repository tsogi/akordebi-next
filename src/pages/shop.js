import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from '@/styles/Shop.module.css';
import ProductCard from '@/components/ProductCard';
import shopProducts from '@/data/shopProducts';

export default function Shop() {
  const [timeLeft, setTimeLeft] = useState('');
  const [canDeliverToday, setCanDeliverToday] = useState(true);

  // Calculate time until 6 PM cutoff for same-day delivery
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const cutoff = new Date();
      cutoff.setHours(17, 0, 0, 0); // 5 PM cutoff
      
      if (now > cutoff) {
        setCanDeliverToday(false);
        setTimeLeft('');
        return;
      }
      
      const diff = cutoff - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}:${minutes.toString().padStart(2, '0')}`);
      setCanDeliverToday(true);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(interval);
  }, []);

  // Group products by category
  const productsByCategory = Object.values(shopProducts).reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <>
      <Head>
        <title>გიტარის მაღაზია | აკორდები.გე</title>
        <meta name="description" content="მაღალი ხარისხის გიტარები და აქსესუარები. შეიძინეთ კლასიკური და აკუსტიკური გიტარები საუკეთესო ფასად თბილისში." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <Header />
      
      <main className={styles.shopMain}>
        <div className={`page_container ${styles.shopContainer}`}>
          
          {/* Same-day delivery countdown banner */}
          {canDeliverToday && timeLeft && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg mb-6 flex items-center justify-center gap-3 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-bold text-sm md:text-base">
                შეუკვეთე <span className="bg-white/20 px-2 py-1 rounded font-mono">{timeLeft}</span> საათში და მიიღე დღესვე საღამოს!
              </span>
            </div>
          )}
          
          {!canDeliverToday && (
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 rounded-xl shadow-lg mb-6 flex items-center justify-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-bold text-sm md:text-base">
                შეუკვეთე ახლა და მიიღე ხვალ საღამოს 21:00-23:00
              </span>
            </div>
          )}

          {/* Hero intro */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
              ოფიციალური <span className="text-amber-500">Yamaha</span> გიტარები
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
              მსოფლიოში #1 ბრენდი დამწყებებისთვის — საუკეთესო ფასად, უფასო მიტანით თბილისში
            </p>
          </div>
          
          {/* Trust badges section */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
            {/* Free same-day delivery */}
            <div className="bg-gradient-to-br from-emerald-500/20 to-green-600/20 border border-emerald-500/30 text-white px-3 py-3 rounded-xl flex flex-col items-center text-center gap-2 hover:scale-105 transition-transform">
              <div className="bg-emerald-500 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <span className="font-semibold text-xs leading-tight">უფასო მიტანა<br/>თბილისში</span>
            </div>
            
            {/* Evening delivery */}
            <div className="bg-gradient-to-br from-purple-500/20 to-violet-600/20 border border-purple-500/30 text-white px-3 py-3 rounded-xl flex flex-col items-center text-center gap-2 hover:scale-105 transition-transform">
              <div className="bg-purple-500 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <span className="font-semibold text-xs leading-tight">საღამოს მიტანა<br/>21:00-23:00</span>
            </div>
            
            {/* Cash on delivery */}
            <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 text-white px-3 py-3 rounded-xl flex flex-col items-center text-center gap-2 hover:scale-105 transition-transform">
              <div className="bg-amber-500 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="font-semibold text-xs leading-tight">ადგილზე<br/>გადახდა</span>
            </div>
            
            {/* Try on site */}
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border border-blue-500/30 text-white px-3 py-3 rounded-xl flex flex-col items-center text-center gap-2 hover:scale-105 transition-transform">
              <div className="bg-blue-500 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-semibold text-xs leading-tight">მოსინჯე<br/>ადგილზე</span>
            </div>
            
            
          </section>
          
          
          {Object.entries(productsByCategory).map(([category, products]) => (
            <section key={category} className="mb-12">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-lg font-medium text-gray-300 tracking-wide">
                  {category}
                </h2>
                <div className="flex-grow h-px bg-gradient-to-r from-gray-700 to-transparent"></div>
              </div>
              <div className={styles.productsGrid}>
                {products.map(product => (
                  <div key={product.id} className={styles.productCardWrapper}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Why buy from Akordebi section */}
          <section className="mt-16 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-white">რატომ აკორდები.გე?</h2>
              <div className="flex-grow h-px bg-gradient-to-r from-amber-500/50 to-transparent"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-500/20 p-3 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">საუკეთესო ფასი</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      პირდაპირი კონტაქტი ოფიციალურ დისტრიბუტორთან გვაძლევს საშუალებას შემოგთავაზოთ საუკეთესო ფასი ბაზარზე, ხარისხზე კომპრომისის გარეშე.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/20 p-3 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">მხოლოდ Yamaha</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      ჩვენ ვყიდით მხოლოდ Yamaha-ს გიტარებს - მსოფლიოში ნომერ პირველ ბრენდს სასწავლო გიტარებში. არანაირი ჩინური ასლი ან უცნობი ბრენდი.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-500/20 p-3 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">მოხერხებული მიტანა</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      მიტანა საღამოს 21:00-23:00 საათზე - როცა სახლში ხარ. აღარ გჭირდება სამსახურიდან გამოსვლა ან შაბათის დახარჯვა მაღაზიებში სიარულში.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="mt-12 mb-8 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-2xl p-6 md:p-8 text-center">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3">გაქვს შეკითხვა?</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              მოგვწერე ნებისმიერ დროს და სიამოვნებით გიპასუხებთ!
            </p>
            <a href="https://m.me/61587416465705" target="_blank" rel="noopener noreferrer" className="inline-flex bg-[#0084FF] hover:bg-[#0073E6] text-white font-bold py-3 px-8 rounded-xl transition-colors items-center gap-2 text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.936 1.444 5.544 3.7 7.257v3.5l3.258-1.787c.916.252 1.885.387 2.892.387h.15c5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.076 12.429l-2.54-2.712-4.96 2.712 5.456-5.79 2.602 2.712 4.897-2.712-5.455 5.79z"/>
              </svg>
              მოგვწერე Messenger-ზე
            </a>
          </section>

        </div>
      </main>
      
      <Footer />
    </>
  );
} 