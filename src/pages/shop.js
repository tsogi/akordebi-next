import React from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from '@/styles/Shop.module.css';
import ProductCard from '@/components/ProductCard';
import shopProducts from '@/data/shopProducts';

export default function Shop() {
  const { classicGuitars, acousticGuitars, accessories } = shopProducts;
  
  return (
    <>
      <Head>
        <title>გიტარის მაღაზია | აკორდები.გე</title>
        <meta name="description" content="მაღალი ხარისხის გიტარები და აქსესუარები. შეიძინეთ კლასიკური და აკუსტიკური გიტარები." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <Header />
      
      <main className={styles.shopMain}>
        <div className={`page_container ${styles.shopContainer}`}>
          <p className={styles.productsDescription}>
            Akordebi.ge გთავაზობთ საგულდაგულოდ შერჩეულ და გატესტილ ყველაზე გაყიდვად გიტარებს და აქსესუარებს
          </p>
          
          <section className="flex flex-wrap justify-center gap-4 my-6">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center">
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="font-medium">იმავე დღეს მიწოდება</span>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center">
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V8a1 1 0 00-.293-.707l-2-2A1 1 0 0017 5h-1V4a1 1 0 00-1-1H3z" />
                </svg>
              </span>
              <span className="font-medium">რეგიონებში გაგზავნა</span>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center">
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="font-medium">ადგილზე გადახდა</span>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center">
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="font-medium">ხარისხის გარანტია</span>
            </div>
          </section>
          
          <section className={styles.productsSection}>
            <h2 className={styles.categoryTitle}>კლასიკური გიტარები</h2>
            <div className={styles.productsGrid}>
              {classicGuitars.map(product => (
                <div key={product.id} className={styles.productCardWrapper}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>
          
          <section className={styles.productsSection}>
            <h2 className={styles.categoryTitle}>აკუსტიკური გიტარები</h2>
            <div className={styles.productsGrid}>
              {acousticGuitars.map(product => (
                <div key={product.id} className={styles.productCardWrapper}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>
          
          <section className={styles.productsSection}>
            <h2 className={styles.categoryTitle}>აქსესუარები</h2>
            <div className={styles.productsGrid}>
              {accessories.map(product => (
                <div key={product.id} className={styles.productCardWrapper}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </>
  );
} 