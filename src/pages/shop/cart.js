import React from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useShoppingCart } from '@/context/ShoppingCartContext';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/Shop.module.css';

export default function ShoppingCart() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, isMounted } = useShoppingCart();

  // Show loading state during hydration
  if (!isMounted) {
    return (
      <>
        <Head>
          <title>კალათა | აკორდები.გე</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        </Head>
        <Header />
        <main className={styles.shopMain}>
          <div className={`page_container ${styles.shopContainer}`}>
            <div className="text-center py-12">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-700 rounded w-1/4 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (cart.length === 0) {
    return (
      <>
        <Head>
          <title>კალათა | აკორდები.გე</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        </Head>
        <Header />
        <main className={styles.shopMain}>
          <div className={`page_container ${styles.shopContainer}`}>
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-100 mb-4">თქვენი კალათა ცარიელია</h1>
              <Link href="/shop" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                მაღაზიაში დაბრუნება
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>კალათა | აკორდები.გე</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <Header />
      
      <main className={styles.shopMain}>
        <div className={`page_container ${styles.shopContainer}`}>
          <h1 className="text-2xl font-bold text-gray-100 mb-8">კალათა</h1>
          
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="backdrop-blur bg-[#232a44cc] rounded-xl shadow p-4 flex flex-col gap-2 sm:flex-row sm:items-center border border-gray-700/30">
                <div className="flex items-center gap-4 w-full">
                  <div className="flex-shrink-0 w-24 h-24 relative rounded-lg overflow-hidden bg-gray-800">
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl text-gray-500">{item.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-grow min-w-0">
                    <h3 className="font-semibold text-gray-100 truncate">{item.name}</h3>
                    <p className="text-gray-300 text-sm truncate">{item.category}</p>
                    <p className="text-blue-300 font-semibold text-lg mt-1">{item.price}₾</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 mt-2 sm:mt-0 w-full">
                  <div className="flex items-center border border-gray-700 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 text-gray-300 hover:bg-gray-800 rounded-l-lg"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-gray-100 min-w-[2ch] text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 text-gray-300 hover:bg-gray-800 rounded-r-lg"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-600 flex items-center justify-center"
                    aria-label="წაშლა"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 backdrop-blur bg-[#232a44cc] rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-100">ჯამი:</span>
              <span className="text-2xl font-bold text-blue-300">{getTotalPrice()}₾</span>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">სახელი</label>
                <input
                  type="text"
                  id="name"
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">მობილური</label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">მისამართი</label>
                <input
                  type="text"
                  id="address"
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-1">კომენტარი</label>
                <textarea
                  id="comment"
                  rows="3"
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                ></textarea>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                შეკვეთის გაფორმება
              </button>
              <Link href="/shop" className="flex-1">
                <button className="w-full border border-gray-700 py-3 px-6 rounded-lg hover:bg-gray-800 text-gray-100 transition-colors duration-200">
                  მაღაზიაში დაბრუნება
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
} 