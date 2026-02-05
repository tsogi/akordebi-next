import React from 'react';
import styles from './ProductCard.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useShoppingCart } from '@/context/ShoppingCartContext';

export default function ProductCard({ product, compact = true }) {
  const { addToCart } = useShoppingCart();

  function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  }

  return (
    <div className={`${styles.productCard} ${compact ? styles.compactCard : ''} relative`}>
      <Link href={`/shop/product/${product.id}`}>
        <div className={styles.productImageContainer}>
          <div className={styles.productImageWrapper}>
            <Image 
              src={product.thumbnail} 
              alt={product.name}
              width={300}
              height={300}
              className={styles.productImage}
            />
          </div>
        </div>
      </Link>
      <div className={styles.productInfo}>
        <Link href={`/shop/product/${product.id}`}>
          <h3 className={`${styles.productName} hover:text-amber-500 transition-colors cursor-pointer`}>{product.name}</h3>
        </Link>
        {!compact && <p className={styles.productCategory}>{product.category}</p>}
        {/* Price and add-to-cart icon in a row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className={styles.productPrice}>{product.price} ₾</p>
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center relative"
            aria-label="კალათაში დამატება"
            style={{ minWidth: 36, minHeight: 36 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">+</span>
          </button>
        </div>
        <div className={styles.productActions}>
          <Link href={`/shop/product/${product.id}`}>
            <button className={styles.viewDetailsButton}>
              {compact ? 'დეტალები' : 'დეტალების ნახვა'}
            </button>
          </Link>
          {!compact && (
            <button className={styles.addToCartButton}>კალათაში დამატება</button>
          )}
        </div>
      </div>
    </div>
  );
} 