import React, { useState } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from '@/styles/ProductDetail.module.css';
import shopProducts from '@/data/shopProducts';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useShoppingCart } from '@/context/ShoppingCartContext';
import Slider from 'react-slick';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

export default function ProductDetail() {
  const router = useRouter();
  const { productId } = router.query;
  const { addToCart } = useShoppingCart();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Find the product in our data
  const product = Object.values(shopProducts).find(p => p.id === productId);
  
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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        }
      }
    ]
  };

  const slides = product.images && product.images.length > 0 
    ? product.images 
    : [product.thumbnail];
  
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
              {slides.length > 0 ? (
                <>
                  <div className={styles.slider}>
                    <Slider {...sliderSettings}>
                      {slides.map((image, index) => (
                        <div key={index} className={styles.slideContainer}>
                          <Image 
                            src={image} 
                            alt={`${product.name} - სურათი ${index + 1}`}
                            width={500}
                            height={500}
                            className={styles.productImage}
                            priority={index === 0}
                            onClick={() => setLightboxOpen(true)}
                          />
                        </div>
                      ))}
                    </Slider>
                  </div>
                  <div className={styles.lightbox}>
                    <Lightbox
                      open={lightboxOpen}
                      close={() => setLightboxOpen(false)}
                      slides={slides.map(image => ({ src: image }))}
                      index={currentSlide}
                      plugins={[Zoom, Thumbnails]}
                      zoom={{
                        maxZoomPixelRatio: 3,
                        zoomInMultiplier: 2,
                        doubleTapDelay: 300,
                        doubleClickDelay: 300,
                        doubleClickMaxStops: 2,
                        keyboardMoveDistance: 50,
                        wheelZoomDistanceFactor: 100,
                        pinchZoomDistanceFactor: 100,
                        scrollToZoom: true,
                      }}
                    />
                  </div>
                </>
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
                {/* <h2 className={styles.descriptionTitle}>პროდუქტის აღწერა</h2> */}
                <p className={styles.descriptionText}>{product.description}</p>
              </div>
              
              {product.characteristics && product.characteristics.length > 0 && (
                <div className={styles.characteristics}>
                  <h2 className={styles.characteristicsTitle}>მახასიათებლები</h2>
                  <div className={styles.characteristicsGrid}>
                    {product.characteristics.map((char, index) => (
                      <div key={index} className={styles.characteristicItem}>
                        <span className={styles.characteristicName}>{char.name}</span>
                        <span className={styles.characteristicValue}>{char.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
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