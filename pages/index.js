import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../slices/productsSlice';
import Navbar from '../components/Navbar'; 
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useRouter } from 'next/router';

export default function Home() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterColor, setFilterColor] = useState('');
  const productsPerPage = 3;

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'decimal', maximumFractionDigits: 0 }).format(number);
  }

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);
  }, []);

  const handleFavoriteClick = (product) => {
    const updatedFavorites = favorites.some((fav) => fav.id === product.id)
      ? favorites.filter((fav) => fav.id !== product.id)
      : [...favorites, product];
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  const handleSort = (order) => {
    setSortOrder(order);
  };

  const handleFilter = (color) => {
    setFilterColor(color);
  };

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const colors = [
    ...new Set(
      products.flatMap((product) =>
        product.variances.map((variance) => variance.color?.toLowerCase())
      )
    ),
  ].filter(Boolean);

  let filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchTerm)
  );

  if (filterColor) {
    filteredProducts = filteredProducts.filter((product) =>
      product.variances?.some((variance) => variance.color?.toLowerCase() === filterColor.toLowerCase())
    );
  }

  filteredProducts.sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const nextPage = () => {
    setCurrentPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : prevPage));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const handleImageClick = (productId) => {
    router.push(`/product/${productId}`);
  };

  return (
    <div className="container">
      <Navbar onSearch={handleSearch} />
      <h1>Product Catalog</h1>
      <div className="sort-filter">
        <label>
          Sort by:
          <select onChange={(e) => handleSort(e.target.value)}>
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>
        </label>
        <label>
          Filter by color:
          <select onChange={(e) => handleFilter(e.target.value)}>
            <option value="">All</option>
            {colors.map((color, index) => (
              <option key={index} value={color}>{color.charAt(0).toUpperCase() + color.slice(1)}</option>
            ))}
          </select>
        </label>
      </div>
      <ul className="product-list">
        {currentProducts.map((product) => (
          <ProductItem 
            key={product.id} 
            product={product} 
            formatRupiah={formatRupiah} 
            handleFavoriteClick={() => handleFavoriteClick(product)} 
            isFavorite={favorites.some((fav) => fav.id === product.id)}
            handleImageClick={() => handleImageClick(product.id)} 
          />
        ))}
      </ul>
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
}

function ProductItem({ product, formatRupiah, handleFavoriteClick, isFavorite, handleImageClick }) {
  const [selectedVariance, setSelectedVariance] = useState(product.variances[0].name);
  const [image, setImage] = useState(product.variances[0].image);

  const handleVarianceClick = (variance) => {
    const varianceObj = product.variances.find((v) => v.name === variance);
    setSelectedVariance(variance);
    setImage(varianceObj.image);
  };

  return (
    <li className="product-item fade-in">
      <div className="favorite-icon" onClick={handleFavoriteClick}>
        {isFavorite ? <FaHeart color="red" /> : <FaRegHeart />}
      </div>
      <h2 className="center-text">{product.name}</h2>
      <hr />
      <div className="image-container" onClick={handleImageClick}>
        <img src={image} alt={`Product Image for ${selectedVariance}`} />
      </div>
      <p className="product-desc">{product.desc[0]}</p>
      <p className="product-price">Rp.{formatRupiah(product.price)}</p>
      <div className="variances">
        {product.variances.map((variance, index) => (
          <button key={index} onClick={() => handleVarianceClick(variance.name)} className={selectedVariance === variance.name ? 'active' : ''}>
            {variance.name}
          </button>
        ))}
      </div>
    </li>
  );
}
