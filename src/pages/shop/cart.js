import React, { useState } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useShoppingCart } from '@/context/ShoppingCartContext';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/Shop.module.css';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useRouter } from 'next/router';

export default function ShoppingCart() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, getTotalPrice, isMounted, clearCart } = useShoppingCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    comment: ''
  });
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setShowErrorDialog(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          products: cart,
          totalAmount: getTotalPrice()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }
      
      // Show success message
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error submitting order:', error);
      setShowErrorDialog(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    // Clear cart and form
    clearCart();
    setFormData({
      name: '',
      phone: '',
      address: '',
      comment: ''
    });
    // Redirect to home page
    router.push('/');
  };

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
            
            <div className="space-y-4 mb-6 mxedruli">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  სახელი <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                  მობილური <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
                  მისამართი <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-1">კომენტარი</label>
                <textarea
                  id="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                ></textarea>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting || cart.length === 0}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'მიმდინარეობს...' : 'შეკვეთის გაგზავნა'}
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
      
      <ConfirmDialog
        open={showErrorDialog}
        setOpen={setShowErrorDialog}
        message="სახელის, მობილურის და მისამართის ჩაწერა სავალდებულოა"
        type="error"
        onConfirm={() => setShowErrorDialog(false)}
      />

      <ConfirmDialog
        open={showSuccessDialog}
        setOpen={setShowSuccessDialog}
        message="თქვენი შეკვეთა მიღებულია, დაგიკავშირდებით რამდენიმე წუთში"
        type="success"
        onConfirm={handleSuccessDialogClose}
      />
      
      <Footer />
    </>
  );
} 