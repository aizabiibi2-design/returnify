import React, { useState } from 'react';

const PostItem = () => {
  const [type, setType] = useState('lost'); // 'lost' ya 'found'
  
  // Form ka data handle karne ke liye state
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
  });
  const [image, setImage] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Filhal hum console pe check karenge ke data aa raha hai ya nahi
    console.log("Submitting:", { ...formData, type, image });
    alert(`${type.toUpperCase()} report submitted successfully!`);
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-royal-blue via-[#1a1a4b] to-[#2d1b4d] flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl p-10 relative overflow-hidden mt-10">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-neon-pink to-bright-cyan"></div>

        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-royal-blue italic uppercase tracking-tighter">Report an Item</h2>
          <p className="text-gray-400 text-xs font-bold uppercase mt-2 tracking-widest">Help the community by providing accurate details</p>
        </div>

        {/* Type Toggle: Lost or Found */}
        <div className="flex bg-gray-100 rounded-2xl p-2 mb-10">
          <button 
            type="button"
            onClick={() => setType('lost')}
            className={`flex-1 py-4 rounded-xl font-black uppercase text-xs transition-all ${type === 'lost' ? 'bg-royal-blue text-white shadow-xl scale-105' : 'text-gray-400'}`}
          >
            I Lost Something
          </button>
          <button 
            type="button"
            onClick={() => setType('found')}
            className={`flex-1 py-4 rounded-xl font-black uppercase text-xs transition-all ${type === 'found' ? 'bg-neon-pink text-white shadow-xl scale-105' : 'text-gray-400'}`}
          >
            I Found Something
          </button>
        </div>

        <form className="space-y-8" onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Item Title */}
            <div>
              <label className="block text-[10px] font-black text-royal-blue uppercase mb-2 ml-1 tracking-widest italic">Item Name / Title</label>
              <input 
                name="title"
                type="text" 
                placeholder="e.g. Silver Ring, Wallet" 
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 focus:border-neon-pink outline-none text-xs font-bold transition" 
                required 
                onChange={handleInputChange}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-[10px] font-black text-royal-blue uppercase mb-2 ml-1 tracking-widest italic">Location</label>
              <input 
                name="location"
                type="text" 
                placeholder="e.g. Library, Cafe" 
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 focus:border-bright-cyan outline-none text-xs font-bold transition" 
                required 
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-black text-royal-blue uppercase mb-2 ml-1 tracking-widest italic">Detailed Description</label>
            <textarea 
              name="description"
              rows="4" 
              placeholder="Describe the item colors, brand, or any unique marks..." 
              className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 focus:border-neon-pink outline-none text-xs font-bold transition"
              onChange={handleInputChange}
            ></textarea>
          </div>

          {/* Photo Upload Area */}
          <div>
            <label className="block text-[10px] font-black text-royal-blue uppercase mb-2 ml-1 tracking-widest italic">Upload Photo</label>
            <label className="border-4 border-dashed border-gray-100 rounded-[30px] p-10 text-center hover:border-bright-cyan transition-all cursor-pointer group bg-gray-50/50 flex flex-col items-center">
              <span className="text-3xl block mb-2 group-hover:scale-125 transition-transform">📸</span>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {image ? image.name : "Click to upload item image"}
              </p>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className={`w-full text-white py-5 rounded-2xl font-black uppercase text-sm tracking-[0.5em] shadow-2xl transition-all active:scale-95 ${type === 'lost' ? 'bg-royal-blue hover:bg-[#1a1a4b]' : 'bg-neon-pink hover:opacity-90'}`}
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostItem;