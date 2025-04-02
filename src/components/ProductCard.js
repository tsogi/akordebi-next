import React from 'react';
import styles from './ProductCard.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ product, compact = true }) {
  return (
    <div className={`${styles.productCard} ${compact ? styles.compactCard : ''}`}>
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
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{product.name}</h3>
        {!compact && <p className={styles.productCategory}>{product.category}</p>}
        <p className={styles.productPrice}>{product.price} ₾</p>
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