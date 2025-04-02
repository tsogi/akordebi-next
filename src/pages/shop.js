import React from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from '@/styles/Shop.module.css';
import ProductCard from '@/components/ProductCard';
import shopProducts from '@/data/shopProducts';

export default function Shop() {
  const { classicGuitars, acousticGuitars, accessories } = shopProducts;
  
  // Combine all products into a single array
  const allProducts = [
    ...classicGuitars,
    ...acousticGuitars,
    ...accessories
  ];
  
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
          <section className={styles.productsSection}>
            <p className={styles.productsDescription}>
              Akordebi.ge გთავაზობთ საგულდაგულოდ შერჩეულ და გატესტილ ყველაზე გაყიდვად გიტარებს და აქსესუარებს
            </p>
            <div className={styles.productsGrid}>
              {allProducts.map(product => (
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