import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Discovery = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterCity, setFilterCity] = useState('All');
  
  const { token } = useContext(AuthContext); 
  const navigate = useNavigate();

  const pkCities = ["Rawalpindi", "Islamabad", "Lahore", "Karachi", "Peshawar"];

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/items/all-items');
      const data = await response.json();
      const allItems = Array.isArray(data) ? data : (data.items || []);
      const activeItems = allItems.filter(item => item.status === 'Pending');
      setItems(activeItems);
      setFilteredItems(activeItems);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  useEffect(() => {
    let result = items;
    if (filterType !== 'All') result = result.filter(item => item.type === filterType);
    if (filterCity !== 'All') result = result.filter(item => item.city === filterCity);
    if (searchTerm) {
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredItems(result);
  }, [searchTerm, filterType, filterCity, items]);

  if (loading) return <div className="min-h-screen bg-[#0f0c29] flex items-center justify-center text-white font-black animate-pulse uppercase tracking-widest">Scanning Network...</div>;

  return (
    <div className="min-h-screen bg-[#0f0c29] p-8">
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-5xl font-black text-white uppercase italic mb-4">Discovery <span className="text-pink-500">Portal</span></h1>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-12 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input type="text" placeholder="SEARCH..." className="bg-white/5 border-2 border-white/10 p-4 rounded-2xl text-white outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <select className="bg-white/5 border-2 border-white/10 p-4 rounded-2xl text-white" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="All">All Types</option>
          <option value="Lost">Lost</option>
          <option value="Found">Found</option>
        </select>
        <select className="bg-white/5 border-2 border-white/10 p-4 rounded-2xl text-white" value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
          <option value="All">All Cities</option>
          {pkCities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="bg-cyan-400/10 border-2 border-cyan-400/20 p-4 rounded-2xl text-cyan-400 font-black text-center uppercase flex items-center justify-center">
          {filteredItems.length} Reports Found
        </div>
      </div>

      {/* Items Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div key={item._id} className="bg-[#1a1a4b] border-2 border-white/5 rounded-[40px] overflow-hidden hover:border-pink-500 transition-all">
            <div className="h-64 relative">
              <img src={`http://localhost:5000/uploads/${item.image}`} className="w-full h-full object-cover" alt={item.title} />
              <span className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${item.type === 'Lost' ? 'bg-red-500' : 'bg-green-500'}`}>{item.type}</span>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-black text-white uppercase italic mb-2">{item.title}</h3>
              <p className="text-gray-500 text-[10px] font-bold mb-6 italic">📍 {item.location}, {item.city}</p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => navigate(`/item/${item._id}`)} className="py-4 bg-white/5 border-2 border-white/10 text-white rounded-2xl font-black uppercase text-[9px]">Details</button>
                
                {/* MODIFIED: Navigates to Chat Page */}
                <button 
                  onClick={() => {
                    const receiverId = item.user?._id || item.user;
                    if (!token) { alert("Please login to chat!"); return; }
                    navigate(`/chat/${item._id}/${receiverId}`);
                  }} 
                  className="py-4 bg-pink-500 text-white rounded-2xl font-black uppercase text-[9px]"
                >
                  Chat
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discovery;