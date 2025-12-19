import React, { useState } from 'react';

const PostItem = () => {
  // 'Lost' aur 'Found' ko Capital rakha hai taake MongoDB Enum se match ho
  const [type, setType] = useState('Lost'); 
  const [formData, setFormData] = useState({ title: '', location: '', description: '' });
  const [image, setImage] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!image) {
      alert("Please upload an image first! 📸");
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('location', formData.location);
    data.append('description', formData.description);
    data.append('type', type); // Ab ye 'Lost' ya 'Found' bhejega
    data.append('image', image);

    try {
      const response = await fetch('http://localhost:5000/api/items/post-item', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        alert(`🎉 Success! Your ${type.toUpperCase()} report has been submitted.`);
        window.location.reload(); 
      } else {
        const errorResult = await response.json();
        // Agar ab bhi error aaye, to alert mein wajah likhi aayegi
        alert("❌ Server Error: " + (errorResult.message || "Something went wrong"));
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      alert("📡 Connection Error! Please check if your backend server is running.");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-royal-blue via-[#1a1a4b] to-[#2d1b4d] flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl p-10 relative overflow-hidden mt-10">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-neon-pink to-bright-cyan"></div>

        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-royal-blue italic uppercase tracking-tighter">Report an Item</h2>
          <p className="text-gray-400 text-xs font-bold uppercase mt-2 tracking-widest">Help the community by providing accurate details</p>
        </div>

        {/* Toggle Buttons with Capitalized Logic */}
        <div className="flex bg-gray-100 rounded-2xl p-2 mb-10">
          <button 
            type="button"
            onClick={() => setType('Lost')}
            className={`flex-1 py-4 rounded-xl font-black uppercase text-xs transition-all ${type === 'Lost' ? 'bg-royal-blue text-white shadow-xl scale-105' : 'text-gray-400'}`}
          >
            I Lost Something
          </button>
          <button 
            type="button"
            onClick={() => setType('Found')}
            className={`flex-1 py-4 rounded-xl font-black uppercase text-xs transition-all ${type === 'Found' ? 'bg-neon-pink text-white shadow-xl scale-105' : 'text-gray-400'}`}
          >
            I Found Something
          </button>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-black text-royal-blue uppercase mb-2 ml-1 tracking-widest italic text-black">Item Name</label>
              <input name="title" type="text" placeholder="e.g. Silver Ring" className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 text-black font-bold outline-none focus:border-neon-pink transition" required onChange={handleInputChange} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-royal-blue uppercase mb-2 ml-1 tracking-widest italic text-black">Location</label>
              <input name="location" type="text" placeholder="e.g. Library" className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 text-black font-bold outline-none focus:border-bright-cyan transition" required onChange={handleInputChange} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-royal-blue uppercase mb-2 ml-1 tracking-widest italic text-black">Detailed Description</label>
            <textarea name="description" rows="4" placeholder="Describe it..." className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 text-black font-bold outline-none focus:border-neon-pink transition" required onChange={handleInputChange}></textarea>
          </div>

          <div>
            <label className="block text-[10px] font-black text-royal-blue uppercase mb-2 ml-1 tracking-widest italic text-black">Upload Photo</label>
            <label className="border-4 border-dashed border-gray-100 rounded-[30px] p-10 text-center cursor-pointer bg-gray-50/50 flex flex-col items-center hover:border-bright-cyan transition-all">
              <span className="text-3xl mb-2">📸</span>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {image ? image.name : "Click to upload image"}
              </p>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            </label>
          </div>

          <button type="submit" className={`w-full text-white py-5 rounded-2xl font-black uppercase text-sm tracking-[0.5em] shadow-2xl transition-all ${type === 'Lost' ? 'bg-royal-blue' : 'bg-neon-pink'}`}>
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostItem;