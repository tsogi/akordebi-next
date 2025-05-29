import React from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from '@/styles/Shop.module.css';
import ProductCard from '@/components/ProductCard';
import shopProducts from '@/data/shopProducts';

export default function Shop() {
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
        <meta name="description" content="მაღალი ხარისხის გიტარები და აქსესუარები. შეიძინეთ კლასიკური და აკუსტიკური გიტარები." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <Header />
      
      <main className={styles.shopMain}>
        <div className={`page_container ${styles.shopContainer}`}>
          <p className={styles.productsDescription}>
            Akordebi.ge გთავაზობთ საგულდაგულოდ შერჩეულ და გატესტილ ყველაზე გაყიდვად გიტარებს და აქსესუარებს
          </p>
          
          <section className="flex flex-wrap justify-center gap-2 my-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-2 py-1 rounded-lg shadow-md flex items-center text-xs">
              <span className="mr-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="font-medium">იმავე დღეს მიწოდება</span>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-2 py-1 rounded-lg shadow-md flex items-center text-xs">
              <span className="mr-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V8a1 1 0 00-.293-.707l-2-2A1 1 0 0017 5h-1V4a1 1 0 00-1-1H3z" />
                </svg>
              </span>
              <span className="font-medium">რეგიონებში გაგზავნა</span>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-2 py-1 rounded-lg shadow-md flex items-center text-xs">
              <span className="mr-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="font-medium">ადგილზე გადახდა</span>
            </div>
          </section>
          
          {Object.entries(productsByCategory).map(([category, products]) => (
            <section key={category} className={styles.productsSection}>
              <h2 className={styles.categoryTitle}>
                {category}
              </h2>
              <div className={styles.productsGrid}>
                {products.map(product => (
                  <div key={product.id} className={styles.productCardWrapper}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      
      <Footer />
    </>
  );
} 