import React, { useState } from 'react';
import Link from 'next/link';
import { FaSearch, FaHeart } from 'react-icons/fa';

export default function Navbar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const toggleSearch = () => {
    setShowSearch((prevShowSearch) => !prevShowSearch);
  };

  return (
    <nav className="navbar">
      <Link href="/">
        <img src="https://cdn.techinasia.com/data/images/xMXUDRPVJgwCRHJqN1RfnMTwahsSEnDJF50osXdz.png" alt="Logo" className="navbar-logo" />
      </Link>
      <div className="right-section">
        <div className="search-container">
          <div className="search-icon" onClick={toggleSearch}>
            <FaSearch size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm} 
            onChange={handleSearchChange} 
            className={`search-bar ${showSearch ? 'active' : ''}`}
          />
        </div>
        <Link href="/favorites">
          <FaHeart size={20} />
        </Link>
      </div>
    </nav>
  );
}
