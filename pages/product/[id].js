import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

const ProductDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const product = useSelector((state) => state.products.find((p) => p.id === parseInt(id)));

  if (!product) return <div>Loading...</div>;

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'decimal', maximumFractionDigits: 0 }).format(number);
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail">
        <div className="product-image">
          <img src={product.variances[0].image} alt={`${product.name} Image`} />
        </div>
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="product-price">Rp.{formatRupiah(product.price)}</p>
          <div className="product-desc">
            {product.desc.map((d, index) => (
              <p key={index}>{d}</p>
            ))}
          </div>
          <button onClick={() => router.back()} className="back-button">Back to Home</button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
