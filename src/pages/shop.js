import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from '@/styles/Shop.module.css';
import ProductCard from '@/components/ProductCard';
import shopProducts from '@/data/shopProducts';

export default function Shop() {
  const [canDeliverToday, setCanDeliverToday] = useState(true);

  // Check if same-day delivery is still available
  useEffect(() => {
    const checkSameDayDelivery = () => {
      const now = new Date();
      const cutoff = new Date();
      cutoff.setHours(20, 0, 0, 0); // 8 PM cutoff
      
      if (now > cutoff) {
        setCanDeliverToday(false);
        return;
      }
      setCanDeliverToday(true);
    };

    checkSameDayDelivery();
    const interval = setInterval(checkSameDayDelivery, 60000);
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
        <title>გიტარის მაღაზია თბილისში | Yamaha გიტარები | akordebi.ge</title>
        <meta name="description" content="იყიდე ორიგინალი Yamaha კლასიკური და აკუსტიკური გიტარები საუკეთესო ფასად თბილისში. უფასო მიტანა იმავე დღეს, ადგილზე გადახდა და მოსინჯვა. Yamaha C40, CG102, F310, F370 და აქსესუარები." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="keywords" content="გიტარა, გიტარის მაღაზია, yamaha გიტარა, კლასიკური გიტარა, აკუსტიკური გიტარა, გიტარა თბილისში, იაფი გიტარა, Yamaha C40, Yamaha F310, გიტარის ყიდვა, gitara, gitaris maghazia" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="canonical" href="https://akordebi.ge/shop" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="გიტარის მაღაზია | ორიგინალი Yamaha გიტარები თბილისში" />
        <meta property="og:description" content="იყიდე ორიგინალი Yamaha გიტარები საუკეთესო ფასად. უფასო მიტანა იმავე დღეს, ადგილზე გადახდა და მოსინჯვა." />
        <meta property="og:url" content="https://akordebi.ge/shop" />
        <meta property="og:site_name" content="akordebi.ge" />
        <meta property="og:image" content="https://akordebi.ge/images/shop/c40/1.png" />
        <meta property="og:image:width" content="500" />
        <meta property="og:image:height" content="500" />
        <meta property="og:locale" content="ka_GE" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="გიტარის მაღაზია | ორიგინალი Yamaha გიტარები თბილისში" />
        <meta name="twitter:description" content="იყიდე ორიგინალი Yamaha გიტარები საუკეთესო ფასად. უფასო მიტანა იმავე დღეს." />
        <meta name="twitter:image" content="https://akordebi.ge/images/shop/c40/1.png" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              "name": "akordebi.ge გიტარის მაღაზია",
              "description": "ორიგინალი Yamaha კლასიკური და აკუსტიკური გიტარები საუკეთესო ფასად თბილისში",
              "url": "https://akordebi.ge/shop",
              "image": "https://akordebi.ge/images/shop/c40/1.png",
              "priceRange": "₾1 - ₾900",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "თბილისი",
                "addressCountry": "GE"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "გიტარები და აქსესუარები",
                "itemListElement": shopProducts.filter(p => p.inStock).map((product, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "item": {
                    "@type": "Product",
                    "name": product.name,
                    "description": product.description,
                    "image": `https://akordebi.ge${product.thumbnail}`,
                    "url": `https://akordebi.ge/shop/product/${product.id}`,
                    "offers": {
                      "@type": "Offer",
                      "price": product.price,
                      "priceCurrency": "GEL",
                      "availability": "https://schema.org/InStock",
                      "seller": { "@type": "Organization", "name": "akordebi.ge" }
                    }
                  }
                }))
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "როგორ ხდება გიტარის მიტანა?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "თბილისში მიტანა უფასოა და ხდება იმავე დღეს საღამოს 21:00-23:00 საათზე. რეგიონებში გაგზავნა ხდება კურიერით."
                  }
                },
                {
                  "@type": "Question",
                  "name": "შემიძლია ადგილზე გიტარის მოსინჯვა?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "რა თქმა უნდა! მიტანისას შეგიძლია გიტარის მოსინჯვა და თუ არ მოგეწონება, არ ხარ ვალდებული შეიძინო."
                  }
                },
                {
                  "@type": "Question",
                  "name": "რომელი გიტარა შევარჩიო დამწყებისთვის?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "დამწყებებისთვის საუკეთესო არჩევანია Yamaha C40 (კლასიკური) ან Yamaha F310 (აკუსტიკური). ორივე იდეალურია სწავლისთვის."
                  }
                },
                {
                  "@type": "Question",
                  "name": "როგორ გადავიხადო გიტარისთვის?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "გადახდა ხდება მხოლოდ ადგილზე, გიტარის მიღებისას. ვიღებთ ნაღდ ფულს და საბანკო გადარიცხვას."
                  }
                }
              ]
            })
          }}
        />
      </Head>
      <Header />
      
      <main className={styles.shopMain}>
        <div className={`page_container ${styles.shopContainer}`}>
          
          {/* Same-day delivery countdown banner */}
          {canDeliverToday && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg mb-6 flex items-center justify-center gap-3 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-bold text-sm md:text-base">
                შეუკვეთე 20:00 საათამდე და მოგიტანთ დღესვე
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
              მსოფლიოში #1 ბრენდი დამწყებებისთვის — საუკეთესო ფასად
            </p>
          </div>
          
          {/* Trust badges section */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
            {/* Free same-day delivery */}
            <div className="bg-gradient-to-br from-emerald-500/20 to-green-600/20 border border-emerald-500/30 text-white px-3 py-3 rounded-xl flex items-center text-left gap-3 hover:scale-105 transition-transform">
              <div className="bg-emerald-500 p-2 rounded-full shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <span className="font-semibold text-[11px] leading-tight">უფასო მიტანა თბილისში</span>
            </div>
            
            {/* Evening delivery */}
            <div className="bg-gradient-to-br from-purple-500/20 to-violet-600/20 border border-purple-500/30 text-white px-3 py-3 rounded-xl flex items-center text-left gap-3 hover:scale-105 transition-transform">
              <div className="bg-purple-500 p-2 rounded-full shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <span className="font-semibold text-[11px] leading-tight">საღამოს მიტანა 21:00-23:00</span>
            </div>
            
            {/* Cash on delivery */}
            <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 text-white px-3 py-3 rounded-xl flex items-center text-left gap-3 hover:scale-105 transition-transform">
              <div className="bg-amber-500 p-2 rounded-full shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="font-semibold text-[11px] leading-tight">ადგილზე გადახდა</span>
            </div>
            
            {/* Try on site */}
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border border-blue-500/30 text-white px-3 py-3 rounded-xl flex items-center text-left gap-3 hover:scale-105 transition-transform">
              <div className="bg-blue-500 p-2 rounded-full shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-semibold text-[11px] leading-tight">მოსინჯე ადგილზე</span>
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

          {/* FAQ Section */}
          <section className="mt-16 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-white">ხშირად დასმული კითხვები</h2>
              <div className="flex-grow h-px bg-gradient-to-r from-amber-500/50 to-transparent"></div>
            </div>

            <div className="space-y-4">
              <details className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden group">
                <summary className="px-5 py-4 cursor-pointer text-white font-medium flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                  <span className="mxedruli normal-case">როგორ ხდება მიტანა?</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-4 text-gray-400 text-sm leading-relaxed mxedruli normal-case">
                  თბილისში მიტანა უფასოა და ხდება იმავე დღეს საღამოს 21:00-23:00 საათზე. რეგიონებში გაგზავნა ხდება კურიერით, ღირებულება დამოკიდებულია ადგილმდებარეობაზე.
                </div>
              </details>

              <details className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden group">
                <summary className="px-5 py-4 cursor-pointer text-white font-medium flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                  <span className="mxedruli normal-case">შემიძლია ადგილზე გიტარის მოსინჯვა?</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-4 text-gray-400 text-sm leading-relaxed mxedruli normal-case">
                  რა თქმა უნდა! მიტანისას შეგიძლია გიტარის მოსინჯვა და თუ რაიმე არ მოგეწონება, არ ხარ ვალდებული შეიძინო. გადახდა ხდება მხოლოდ ადგილზე, გიტარის ნახვის შემდეგ.
                </div>
              </details>

              <details className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden group">
                <summary className="px-5 py-4 cursor-pointer text-white font-medium flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                  <span className="mxedruli normal-case">რომელი გიტარა შევარჩიო დამწყებისთვის?</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-4 text-gray-400 text-sm leading-relaxed mxedruli normal-case">
                  დამწყებებისთვის საუკეთესო არჩევანია <strong>Yamaha C40</strong> (კლასიკური) ან <strong>Yamaha F310</strong> (აკუსტიკური). ორივე იდეალურია სწავლისთვის და შესანიშნავი ფასი აქვს. მოგვწერე და დაგეხმარებით არჩევანში!
                </div>
              </details>

              <details className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden group">
                <summary className="px-5 py-4 cursor-pointer text-white font-medium flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                  <span className="mxedruli normal-case">როგორ გადავიხადო?</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-4 text-gray-400 text-sm leading-relaxed mxedruli normal-case">
                  გადახდა ხდება მხოლოდ ადგილზე, გიტარის მიღებისას. ვიღებთ ნაღდ ფულს და საბანკო გადარიცხვას.
                </div>
              </details>
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
              მოგვწერე
            </a>
          </section>

        </div>
      </main>
      
      <Footer />
    </>
  );
} 