import React, { useState } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from '@/styles/ProductDetail.module.css';
import shopProducts from '@/data/shopProducts';
import Link from 'next/link';
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

export function getStaticPaths() {
  const paths = shopProducts.map(product => ({
    params: { productId: product.id }
  }));
  return { paths, fallback: false };
}

export function getStaticProps({ params }) {
  const product = shopProducts.find(p => p.id === params.productId);
  if (!product) return { notFound: true };
  return { props: { product } };
}

export default function ProductDetail({ product }) {
  const { addToCart } = useShoppingCart();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const slides = product.images && product.images.length > 0
    ? product.images
    : [product.thumbnail];
  const hasMultipleSlides = slides.length > 1;

  const sliderSettings = {
    dots: hasMultipleSlides,
    infinite: hasMultipleSlides,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: hasMultipleSlides,
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

  const baseUrl = 'https://akordebi.ge';
  const productUrl = `${baseUrl}/shop/product/${product.id}`;
  const productImage = `${baseUrl}${product.thumbnail}`;
  const metaTitle = `${product.name} - ${product.category} | akordebi.ge მაღაზია`;
  const metaDescription = `${product.name} - ${product.description} ფასი: ${product.price}₾. უფასო მიტანა თბილისში, ადგილზე გადახდა და მოსინჯვა.`;

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="keywords" content={`${product.name}, ${product.category}, გიტარა, გიტარის ყიდვა, yamaha, akordebi.ge, gitara, ${product.name.toLowerCase()}`} />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="canonical" href={productUrl} />

        <meta property="og:type" content="product" />
        <meta property="og:title" content={`${product.name} - ${product.price}₾ | akordebi.ge`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={productUrl} />
        <meta property="og:site_name" content="akordebi.ge" />
        <meta property="og:image" content={productImage} />
        <meta property="og:image:width" content="500" />
        <meta property="og:image:height" content="500" />
        <meta property="og:locale" content="ka_GE" />
        <meta property="product:price:amount" content={product.price} />
        <meta property="product:price:currency" content="GEL" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} - ${product.price}₾`} />
        <meta name="twitter:description" content={product.description} />
        <meta name="twitter:image" content={productImage} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": product.name,
              "description": product.description,
              "image": product.images.map(img => `${baseUrl}${img}`),
              "url": productUrl,
              "category": product.category,
              "brand": {
                "@type": "Brand",
                "name": "Yamaha"
              },
              "offers": {
                "@type": "Offer",
                "price": product.price,
                "priceCurrency": "GEL",
                "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                "seller": {
                  "@type": "Organization",
                  "name": "akordebi.ge"
                },
                "shippingDetails": {
                  "@type": "OfferShippingDetails",
                  "shippingRate": {
                    "@type": "MonetaryAmount",
                    "value": "0",
                    "currency": "GEL"
                  },
                  "shippingDestination": {
                    "@type": "DefinedRegion",
                    "addressCountry": "GE",
                    "addressRegion": "თბილისი"
                  },
                  "deliveryTime": {
                    "@type": "ShippingDeliveryTime",
                    "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "DAY" },
                    "transitTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 1, "unitCode": "DAY" }
                  }
                }
              },
              ...(product.characteristics && product.characteristics.length > 0 && {
                "additionalProperty": product.characteristics.map(c => ({
                  "@type": "PropertyValue",
                  "name": c.name,
                  "value": c.value
                }))
              })
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "მთავარი", "item": baseUrl },
                { "@type": "ListItem", "position": 2, "name": "გიტარის მაღაზია", "item": `${baseUrl}/shop` },
                { "@type": "ListItem", "position": 3, "name": product.name, "item": productUrl }
              ]
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
                  "acceptedAnswer": { "@type": "Answer", "text": "თბილისში მიტანა უფასოა და ხდება იმავე დღეს საღამოს 21:00-23:00 საათზე." }
                },
                {
                  "@type": "Question",
                  "name": "შემიძლია ადგილზე გიტარის მოსინჯვა?",
                  "acceptedAnswer": { "@type": "Answer", "text": "რა თქმა უნდა! მიტანისას შეგიძლია გიტარის მოსინჯვა და თუ არ მოგეწონება, არ ხარ ვალდებული შეიძინო." }
                },
                {
                  "@type": "Question",
                  "name": "რომელი გიტარა შევარჩიო დამწყებისთვის?",
                  "acceptedAnswer": { "@type": "Answer", "text": "დამწყებებისთვის საუკეთესო არჩევანია Yamaha C40 (კლასიკური) ან Yamaha F310 (აკუსტიკური)." }
                },
                {
                  "@type": "Question",
                  "name": "როგორ გადავიხადო?",
                  "acceptedAnswer": { "@type": "Answer", "text": "გადახდა ხდება მხოლოდ ადგილზე, გიტარის მიღებისას. ვიღებთ ნაღდ ფულს და საბანკო გადარიცხვას." }
                }
              ]
            })
          }}
        />
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

          {/* Contact CTA */}
          <section className="mt-8 mb-8 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-2xl p-6 md:p-8 text-center">
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