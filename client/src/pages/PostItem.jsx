import React, { useState } from 'react';

const PostItem = () => {
  const [formData, setFormData] = useState({ title: '', location: '', description: '' });
  const [type, setType] = useState('Lost');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('location', formData.location);
    data.append('description', formData.description);
    data.append('type', type);
    if (image) data.append('image', image);

    try {
      const response = await fetch('http://localhost:5000/api/items/post-item', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        alert("Report Submitted Successfully!");
        window.location.reload(); // Page refresh taake form reset ho jaye
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">📢 Report Item</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input fields with Black Text */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Item Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              placeholder="e.g. Silver Watch"
              onChange={(e) => setFormData({...formData, title: e.target.value})} 
              required 
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Where did you find/lose it?</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              placeholder="e.g. Library Hall"
              onChange={(e) => setFormData({...formData, location: e.target.value})} 
              required 
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Description</label>
            <textarea 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              rows="3"
              placeholder="Provide some details..."
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
              required 
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-semibold mb-1">Report Type</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-black bg-white"
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Lost">Lost ❌</option>
                <option value="Found">Found ✅</option>
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-gray-700 font-semibold mb-1">Upload Photo</label>
              <input 
                type="file" 
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={(e) => setImage(e.target.files[0])} 
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 transition-transform duration-200"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostItem;