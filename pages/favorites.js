import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
      setFavorites(savedFavorites);
    }
  }, []);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'decimal', maximumFractionDigits: 0 }).format(number);
  }

  if (!favorites.length) {
    return (
      <div className="empty-favorites">
        <p>No favorite products added yet.</p>
        <div className="image-container">
          <img src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/9684f250169305.58c93a19424a3.png" alt="No Favorites" className="empty-favorites-image" />
        </div>
        <Link href="/">
          <button className="back-button-empty">Back to Product Catalog</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Favorite Products</h1>
      <ul className="product-list">
        {favorites.map((product) => (
          <li key={product.id} className="product-item fade-in">
            <h2 className="center-text">{product.name}</h2>
            <hr />
            <div className="image-container">
              <img src={product.variances[0].image} alt={`Product Image`} />
            </div>
            <p className="product-desc">{product.desc[0]}</p>
            <p className="product-price">Rp.{formatRupiah(product.price)}</p>
          </li>
        ))}
      </ul>
      <div className="back-button-container">
        <Link href="/">
          <button className="back-button-full">Back to Product Catalog</button>
        </Link>
      </div>
    </div>
  );
};

export default Favorites;
