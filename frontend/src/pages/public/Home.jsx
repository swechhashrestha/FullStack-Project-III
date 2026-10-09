import React, { useState } from 'react';
import Hero from '../../components/Hero.jsx';
import Recipes from '../../components/Recipes.jsx';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveSearch(searchQuery);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      <Hero 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onSearchSubmit={handleSearchSubmit}
      />

      <main className="max-w-6xl mx-auto px-6 py-12 lg:px-0">
        <Recipes searchQuery={activeSearch} />
      </main>
    </div>
  );
}