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
                <p className={`${styles.descriptionText} mtavruli`}>{product.description}</p>
              </div>
              
              {product.characteristics && product.characteristics.length > 0 && (
                <div className={styles.characteristics}>
                  <div className={styles.characteristicsGrid}>
                    {product.characteristics.map((char, index) => (
                      <div key={index} className={styles.characteristicItem}>
                        <span className={styles.characteristicName}>{char.name}</span>
                        <span className={`${styles.characteristicValue} mxedruli`}>{char.value}</span>
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

          {/* FAQ Section */}
          <section className="mt-12 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-white">ხშირად დასმული კითხვები</h2>
              <div className="flex-grow h-px bg-gradient-to-r from-amber-500/50 to-transparent"></div>
            </div>
            
            <div className="space-y-4">
              <details className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden group">
                <summary className="px-5 py-4 cursor-pointer text-white font-medium flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                  <span>როგორ ხდება მიტანა?</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-4 text-gray-400 text-sm leading-relaxed">
                  თბილისში მიტანა უფასოა და ხდება იმავე დღეს საღამოს 21:00-23:00 საათზე (თუ შეკვეთა გაკეთდა 17:00-მდე). რეგიონებში გზავნა ხდება კურიერით, ღირებულება დამოკიდებულია ადგილმდებარეობაზე.
                </div>
              </details>
              
              <details className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden group">
                <summary className="px-5 py-4 cursor-pointer text-white font-medium flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                  <span>შემიძლია ადგილზე გიტარის მოსინჯვა?</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-4 text-gray-400 text-sm leading-relaxed">
                  რა თქმა უნდა! მიტანისას შეგიძლია გიტარის მოსინჯვა და თუ რაიმე არ მოგეწონება, არ ხარ ვალდებული შეიძინო. გადახდა ხდება მხოლოდ ადგილზე, გიტარის ნახვის შემდეგ.
                </div>
              </details>
              
              <details className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden group">
                <summary className="px-5 py-4 cursor-pointer text-white font-medium flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                  <span>რომელი გიტარა შევარჩიო დამწყებისთვის?</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-4 text-gray-400 text-sm leading-relaxed">
                  დამწყებებისთვის საუკეთესო არჩევანია <strong>Yamaha C40</strong> (კლასიკური) ან <strong>Yamaha F310</strong> (აკუსტიკური). ორივე იდეალურია სწავლისთვის და შესანიშნავი ფასი აქვს. მოგვწერე და დაგეხმარებით არჩევანში!
                </div>
              </details>
              
              <details className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden group">
                <summary className="px-5 py-4 cursor-pointer text-white font-medium flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                  <span>როგორ გადავიხადო?</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-4 text-gray-400 text-sm leading-relaxed">
                  გადახდა ხდება მხოლოდ ადგილზე, გიტარის მიღებისას. ვიღებთ ნაღდ ფულს და საბანკო გადარიცხვას.
                </div>
              </details>
            </div>
          </section>

        </div>
      </main>
      
      <Footer />
    </>
  );
} 