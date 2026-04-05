import React, { useState, useContext } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 

const PostItem = () => {
  const { token } = useContext(AuthContext); 
  const navigate = useNavigate();

  const [type, setType] = useState('Lost'); 
  const [formData, setFormData] = useState({ 
    title: '', 
    location: '', 
    city: 'Rawalpindi', 
    description: '' 
  });
  const [image, setImage] = useState(null);

  const pkCities = ["Rawalpindi", "Islamabad", "Lahore", "Karachi", "Peshawar"];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      alert("Please login first! 🔒");
      navigate('/login');
      return;
    }

    if (!image) {
      alert("Please upload an image! 📸");
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('location', formData.location);
    data.append('city', formData.city); 
    data.append('description', formData.description);
    data.append('type', type); 
    data.append('image', image);

    try {
      const response = await fetch('http://localhost:5000/api/items/post-item', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}` 
        },
        body: data,
      });

      if (response.ok) {
        alert(`🎉 Success! Your ${type.toUpperCase()} report has been submitted.`);
        navigate('/discovery'); 
      } else {
        const errorResult = await response.json();
        alert("❌ Error: " + (errorResult.message || "Submission failed"));
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      alert("📡 Connection Error! Please check if your server is running.");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-[#0f0c29] flex items-center justify-center font-sans">
      <div className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl p-10 relative overflow-hidden mt-10">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#ff007a] to-[#00d4ff]"></div>

        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-[#1a1a4b] italic uppercase tracking-tighter">Report an Item</h2>
          <p className="text-gray-400 text-xs font-bold uppercase mt-2 tracking-widest italic text-black">Help the community by providing accurate details</p>
        </div>

        <div className="flex bg-gray-100 rounded-2xl p-2 mb-10">
          <button 
            type="button"
            onClick={() => setType('Lost')}
            className={`flex-1 py-4 rounded-xl font-black uppercase text-xs transition-all ${type === 'Lost' ? 'bg-[#1a1a4b] text-white shadow-xl scale-105' : 'text-gray-400'}`}
          >
            I Lost Something
          </button>
          <button 
            type="button"
            onClick={() => setType('Found')}
            className={`flex-1 py-4 rounded-xl font-black uppercase text-xs transition-all ${type === 'Found' ? 'bg-[#ff007a] text-white shadow-xl scale-105' : 'text-gray-400'}`}
          >
            I Found Something
          </button>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-black text-[#1a1a4b] uppercase mb-2 ml-1 tracking-widest italic text-black">Item Name</label>
              <input name="title" type="text" placeholder="e.g. Wallet, Mobile" className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 text-black font-bold outline-none focus:border-[#ff007a] transition" required onChange={handleInputChange} />
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-[#1a1a4b] uppercase mb-2 ml-1 tracking-widest italic text-black">City</label>
              <select 
                name="city" 
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 text-black font-bold outline-none focus:border-[#00d4ff] transition cursor-pointer"
                onChange={handleInputChange}
                value={formData.city}
              >
                {pkCities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#1a1a4b] uppercase mb-2 ml-1 tracking-widest italic text-black">Where did you find/lose it?</label>
            <input name="location" type="text" placeholder="e.g. Near Rawal Lake" className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 text-black font-bold outline-none focus:border-[#00d4ff] transition" required onChange={handleInputChange} />
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#1a1a4b] uppercase mb-2 ml-1 tracking-widest italic text-black">Detailed Description</label>
            <textarea name="description" rows="4" placeholder="Mention specific marks..." className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 text-black font-bold outline-none focus:border-[#ff007a] transition" required onChange={handleInputChange}></textarea>
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#1a1a4b] uppercase mb-2 ml-1 tracking-widest italic text-black">Upload Image</label>
            <label className="border-4 border-dashed border-gray-100 rounded-[30px] p-10 text-center cursor-pointer bg-gray-50/50 flex flex-col items-center hover:border-[#00d4ff] transition-all">
              <span className="text-3xl mb-2">📸</span>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
                {image ? image.name : "Click to select an image"}
              </p>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            </label>
          </div>

          <button type="submit" className={`w-full text-white py-5 rounded-2xl font-black uppercase text-sm tracking-[0.5em] shadow-2xl transition-all ${type === 'Lost' ? 'bg-[#1a1a4b] hover:bg-[#2a2a6b]' : 'bg-[#ff007a] hover:bg-[#d60066]'}`}>
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostItem;