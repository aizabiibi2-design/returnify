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
      <div className="text-center mb-12 mt-10">
        <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">
          Recent <span className="text-neon-pink">Reports</span>
        </h1>
      </div>

      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row gap-6 items-center">
        <input 
          type="text" 
          placeholder="Search by name or location..." 
          className="flex-1 bg-white/5 border-2 border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-bright-cyan transition shadow-2xl"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex bg-white/5 p-2 rounded-2xl border-2 border-white/10 shadow-2xl">
          {['All', 'Lost', 'Found'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filterType === type ? 'bg-bright-cyan text-royal-blue shadow-lg' : 'text-white hover:text-neon-pink'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 text-white">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {filteredItems.map((item) => (
            <div key={item._id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[30px] overflow-hidden hover:scale-105 transition-all duration-300 shadow-2xl">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={`http://localhost:5000/uploads/${item.image}`} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-black text-white uppercase italic truncate">{item.title}</h3>
                <p className="text-gray-300 text-sm mt-4 line-clamp-2">{item.description}</p>
                <div className="mt-6 pt-4 border-t border-white/10">
                  <button 
                    onClick={() => navigate(`/item/${item._id}`)}
                    className="w-full py-3 bg-transparent border-2 border-white/20 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-royal-blue transition-all"
                  >
                    View Full Details
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