import React from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useShoppingCart } from '@/context/ShoppingCartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function ShoppingCart() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useShoppingCart();

  if (cart.length === 0) {
    return (
      <>
        <Head>
          <title>კალათა | აკორდები.გე</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        </Head>
        <Header />
        <main className="min-h-screen bg-gray-50 py-8">
          <div className="page_container">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">თქვენი კალათა ცარიელია</h1>
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
      
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="page_container">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">კალათა</h1>
          
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-24 h-24 relative">
                  {item.thumbnail ? (
                    <Image
                      src={item.thumbnail}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-2xl text-gray-500">{item.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-gray-600">{item.category}</p>
                  <p className="text-blue-600 font-semibold">{item.price}₾</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                    >
                      -
                    </button>
                    <span className="px-3 py-1">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">ჯამი:</span>
              <span className="text-2xl font-bold text-blue-600">{getTotalPrice()}₾</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop" className="flex-1">
                <button className="w-full border border-gray-300 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  მაღაზიაში დაბრუნება
                </button>
              </Link>
              <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                შეკვეთის გაფორმება
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
} 