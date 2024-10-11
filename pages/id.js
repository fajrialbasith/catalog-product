import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const product = useSelector((state) => state.products.find((p) => p.id === parseInt(id)));

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'decimal', maximumFractionDigits: 0 }).format(number);
  }

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container product-detail fade-in">
      <h1>{product.name}</h1>
      <p>Price: Rp.{formatRupiah(product.price)}</p>
      {product.images.map((url, index) => (
        <img key={index} src={url} alt={`Product Image ${index}`} />
      ))}
      <p className="variances">Variances: {product.variances.join(', ')}</p>
    </div>
  );
}
