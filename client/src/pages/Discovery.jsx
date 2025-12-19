import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Discovery = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/items/all-items');
        const data = await response.json();
        setItems(data);
        setFilteredItems(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    let result = items;
    if (filterType !== 'All') result = result.filter(item => item.type === filterType);
    if (searchTerm) {
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredItems(result);
  }, [searchTerm, filterType, items]);

  return (
    <div className="min-h-screen bg-[#0f0c29] p-8">
      {/* Header Section */}
      <div className="text-center mb-12 mt-10">
        <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">
          Recent <span className="text-neon-pink">Reports</span>
        </h1>
        <p className="text-gray-400 text-[10px] font-bold uppercase mt-2 tracking-[0.3em]">Global Network Discovery</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full">
          <input 
            type="text" 
            placeholder="Search by name or location..." 
            className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-bright-cyan transition shadow-2xl pl-12"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
        </div>

        <div className="flex bg-white/5 p-2 rounded-2xl border-2 border-white/10 shadow-2xl backdrop-blur-md">
          {['All', 'Lost', 'Found'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filterType === type ? 'bg-bright-cyan text-royal-blue shadow-lg scale-105' : 'text-white hover:text-neon-pink'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Section */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-64">
           <div className="w-12 h-12 border-4 border-neon-pink border-t-transparent rounded-full animate-spin"></div>
           <p className="text-white font-black uppercase text-[10px] mt-4 tracking-widest">Accessing Database...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item._id} className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-[40px] overflow-hidden hover:border-bright-cyan transition-all duration-500 shadow-2xl flex flex-col h-full">
                
                {/* Image Section with Badge */}
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={`http://localhost:5000/uploads/${item.image}`} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Neon Type Badge */}
                  <div className={`absolute top-6 right-6 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl border-2 ${
                    item.type === 'Lost' 
                    ? 'bg-royal-blue/80 border-bright-cyan text-white backdrop-blur-md' 
                    : 'bg-neon-pink/80 border-white text-white backdrop-blur-md'
                  }`}>
                    {item.type}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 bg-bright-cyan rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{item.location}</span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter group-hover:text-bright-cyan transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mt-4 line-clamp-2 leading-relaxed flex-grow">
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
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white/5 rounded-[40px] border-2 border-dashed border-white/10">
               <p className="text-gray-500 font-black uppercase tracking-[0.4em]">No matching reports found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Discovery;