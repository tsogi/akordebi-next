import React from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from '@/styles/ProductDetail.module.css';
import shopProducts from '@/data/shopProducts';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useShoppingCart } from '@/context/ShoppingCartContext';

export default function ProductDetail() {
  const router = useRouter();
  const { productId } = router.query;
  const { addToCart } = useShoppingCart();
  
  // Find the product in our data
  let product = null;
  let allProducts = [
    ...shopProducts.classicGuitars,
    ...shopProducts.acousticGuitars,
    ...shopProducts.accessories
  ];
  
  product = allProducts.find(p => p.id === productId);
  
  // If the product is not found or page is still loading
  if (!product) {
    return (
      <>
        <Head>
          <title>პროდუქტის დეტალები | აკორდები.გე</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        </Head>
        <Header />
        <div className={`page_container ${styles.loadingContainer}`}>
          <div className={styles.loadingSpinner}></div>
        </div>
        <Footer />
      </>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
  };
  
  return (
    <>
      <Head>
        <title>{product.name} | აკორდები.გე</title>
        <meta name="description" content={product.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <Header />
      
      <main className={styles.productDetailMain}>
        <div className={`page_container ${styles.productDetailContainer}`}>
          <div className={styles.breadcrumbs}>
            <Link href="/shop">
              <span className={styles.breadcrumbLink}>გიტარის მაღაზია</span>
            </Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>{product.name}</span>
          </div>
          
          <div className={styles.productDetail}>
            <div className={styles.productImageContainer}>
              {product.thumbnail ? (
                <Image 
                  src={product.thumbnail} 
                  alt={product.name}
                  width={500}
                  height={500}
                  className={styles.productImage}
                  priority
                />
              ) : (
                <div className={styles.fallbackImage}>
                  <div className={styles.fallbackImageContent}>
                    <span className={styles.productNameInitial}>
                      {product.name.charAt(0)}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <div className={styles.productInfo}>
              <h1 className={styles.productName}>{product.name}</h1>
              <p className={styles.productCategory}>{product.category}</p>
              <p className={styles.productPrice}>{product.price}₾</p>
              
              <div className={styles.productDescription}>
                <h2 className={styles.descriptionTitle}>პროდუქტის აღწერა</h2>
                <p className={styles.descriptionText}>{product.description}</p>
              </div>
              
              {/* <div className={styles.deliveryInfo}>
                <div className={styles.deliveryBadge}>
                  იმავე დღეს მიწოდება
                </div>
                <p className={styles.deliveryText}>
                  შეკვეთის განთავსების შემთხვევაში 21:00 საათამდე, მიიღებთ პროდუქტს იმავე დღეს!
                </p>
              </div> */}
              
              <div className={styles.productActions}>
                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 mb-4"
                >
                  კალათაში დამატება
                </button>
                <Link href="/shop" className='flex justify-center'>
                  <button className="w-full border border-gray-300 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    მაღაზიაში დაბრუნება
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
} 