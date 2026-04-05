import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Discovery = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterCity, setFilterCity] = useState('All'); // Naya city filter
  const navigate = useNavigate();

  // Cities list as per your documentation
  const pkCities = ["Rawalpindi", "Islamabad", "Lahore", "Karachi", "Peshawar"];

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/items/all-items');
        const data = await response.json();
        setItems(data);
        setFilteredItems(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching items:", err);
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    let result = items;
    
    // Type Filter (Lost/Found)
    if (filterType !== 'All') result = result.filter(item => item.type === filterType);
    
    // City Filter (Documentation Requirement)
    if (filterCity !== 'All') result = result.filter(item => item.city === filterCity);
    
    // Search Term
    if (searchTerm) {
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredItems(result);
  }, [searchTerm, filterType, filterCity, items]);

  return (
    <div className="min-h-screen bg-[#0f0c29] p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-4 italic">
          Discovery <span className="text-neon-pink">Portal</span>
        </h1>
        <p className="text-gray-400 uppercase tracking-[0.3em] text-xs">Search through lost and found reports</p>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto mb-12 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input 
          type="text" 
          placeholder="SEARCH ITEMS..." 
          className="bg-white/5 border-2 border-white/10 p-4 rounded-2xl text-white font-bold placeholder:text-gray-600 focus:border-bright-cyan outline-none transition-all uppercase text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select 
          className="bg-white/5 border-2 border-white/10 p-4 rounded-2xl text-white font-bold focus:border-neon-pink outline-none transition-all uppercase text-sm cursor-pointer"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="Lost">Lost Items</option>
          <option value="Found">Found Items</option>
        </select>

        <select 
          className="bg-white/5 border-2 border-white/10 p-4 rounded-2xl text-white font-bold focus:border-bright-cyan outline-none transition-all uppercase text-sm cursor-pointer"
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
        >
          <option value="All">All Cities</option>
          {pkCities.map(city => <option key={city} value={city}>{city}</option>)}
        </select>

        <div className="bg-bright-cyan/10 border-2 border-bright-cyan/20 p-4 rounded-2xl text-bright-cyan font-black text-center uppercase text-xs flex items-center justify-center">
          {filteredItems.length} Reports Found
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="text-center py-20 text-white font-black animate-pulse uppercase tracking-widest">Loading Reports...</div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div key={item._id} className="group relative bg-[#1a1a4b] border-2 border-white/5 rounded-[40px] overflow-hidden hover:border-neon-pink transition-all duration-500">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${item.type === 'Lost' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                    {item.type}
                  </span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{item.city}</span>
                </div>
                
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter group-hover:text-bright-cyan transition-colors mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-[10px] font-bold uppercase mb-4">Posted By: {item.user?.name || 'Anonymous'}</p>
                
                <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed h-12">
                  {item.description}
                </p>
                
                <div className="mt-8 pt-6 border-t border-white/5">
                  <button 
                    onClick={() => navigate(`/item/${item._id}`)}
                    className="w-full py-4 bg-white/5 border-2 border-white/10 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-white hover:text-royal-blue hover:-translate-y-1 transition-all active:scale-95"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Discovery;