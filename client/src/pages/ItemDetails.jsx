import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/items/${id}`);
        const data = await response.json();
        setItem(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#0f0c29] flex justify-center items-center text-white">Loading...</div>;
  if (!item) return <div className="min-h-screen bg-[#0f0c29] flex justify-center items-center text-white">Item not found!</div>;

  return (
    <div className="min-h-screen bg-[#0f0c29] p-8 flex justify-center items-center">
      <div className="max-w-5xl w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row">
        <div className="md:w-1/2 h-[500px]">
          <img 
            src={`http://localhost:5000/uploads/${item.image}`} 
            alt={item.title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="md:w-1/2 p-12 flex flex-col justify-center">
          <span className={`w-fit px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 ${item.type === 'Lost' ? 'bg-neon-pink' : 'bg-bright-cyan'} text-white`}>
            {item.type}
          </span>
          
          <h1 className="text-5xl font-black text-white uppercase italic mb-4 tracking-tighter leading-none">
            {item.title}
          </h1>
          
          <div className="flex items-center text-bright-cyan font-bold mb-8 uppercase tracking-widest text-xs">
            <span className="mr-2 text-xl">📍</span> {item.location}
          </div>
          
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-8">
            <p className="text-gray-300 leading-relaxed font-medium">
              {item.description}
            </p>
          </div>

          <button 
            onClick={() => navigate('/discovery')}
            className="w-full py-4 bg-white/10 border border-white/20 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-white hover:text-royal-blue transition-all"
          >
            Go Back to Discovery
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;