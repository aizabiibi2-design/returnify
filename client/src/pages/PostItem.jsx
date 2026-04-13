import React, { useState, useContext, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 
// Map imports
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';

// Marker Icon Fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// 1. Search Bar Component (With Final Popup Kill Switch)
function SearchField({ setCoords }) {
  const map = useMap();
  
  useEffect(() => {
    const provider = new OpenStreetMapProvider({
      params: {
        'accept-language': 'en',
        countrycodes: 'pk', // Focus on Pakistan
        limit: 15,
      },
    });

    const searchControl = new GeoSearchControl({
      provider: provider,
      style: 'bar', 
      autoClose: true,
      keepResult: true,
      showMarker: false, 
      showPopup: false,
      marker: { draggable: false },
      searchLabel: 'Search (e.g. Arid University, Rawalpindi)',
    });

    // Kill popups
    map.openPopup = () => map; 
    map.addControl(searchControl);
    
    map.on('geosearch/showlocation', (result) => {
      const newCoords = { lat: result.location.y, lng: result.location.x };
      setCoords(newCoords);
      map.setView([newCoords.lat, newCoords.lng], 16);
    });

    return () => map.removeControl(searchControl);
  }, [map, setCoords]);
  
  return null;
}

// 2. Updated Marker (Drag & Click)
function LocationMarker({ setCoords, currentCoords }) {
  useMapEvents({
    click(e) {
      setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return (
    <Marker 
      position={[currentCoords.lat, currentCoords.lng]} 
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          setCoords({ lat: position.lat, lng: position.lng });
        },
      }}
    />
  );
}

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
  const [coords, setCoords] = useState({ lat: 33.6844, lng: 73.0479 }); 
  const [image, setImage] = useState(null);

  const pkCities = ["Rawalpindi", "Islamabad", "Lahore", "Karachi", "Peshawar"];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) { alert("Please login first! 🔒"); navigate('/login'); return; }
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('location', formData.location);
    data.append('city', formData.city); 
    data.append('description', formData.description);
    data.append('type', type); 
    if (image) data.append('image', image);
    data.append('latitude', coords.lat);
    data.append('longitude', coords.lng);

    try {
      const response = await fetch('http://localhost:5000/api/items/post-item', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data,
      });

      if (response.ok) {
        alert(`🎉 Success! Your ${type.toUpperCase()} report has been submitted.`);
        navigate('/discovery'); 
      }
    } catch (err) {
      alert("📡 Connection Error!");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-[#0f0c29] flex items-center justify-center font-sans text-black">
      <div className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl p-10 relative overflow-visible mt-10">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#ff007a] to-[#00d4ff]"></div>

        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-[#1a1a4b] italic uppercase tracking-tighter">Report an Item</h2>
          <p className="text-gray-400 text-xs font-bold uppercase mt-2 tracking-widest italic">Provide accurate details for matching</p>
        </div>

        <div className="flex bg-gray-100 rounded-2xl p-2 mb-10">
          <button type="button" onClick={() => setType('Lost')} className={`flex-1 py-4 rounded-xl font-black uppercase text-xs transition-all ${type === 'Lost' ? 'bg-[#1a1a4b] text-white shadow-xl scale-105' : 'text-gray-400'}`}>I Lost Something</button>
          <button type="button" onClick={() => setType('Found')} className={`flex-1 py-4 rounded-xl font-black uppercase text-xs transition-all ${type === 'Found' ? 'bg-[#ff007a] text-white shadow-xl scale-105' : 'text-gray-400'}`}>I Found Something</button>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-black text-[#1a1a4b] uppercase mb-2 ml-1 tracking-widest italic">Item Name</label>
              <input name="title" type="text" placeholder="e.g. Wallet, Mobile" className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 font-bold outline-none focus:border-[#ff007a] transition" required onChange={handleInputChange} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-[#1a1a4b] uppercase mb-2 ml-1 tracking-widest italic">City</label>
              <select name="city" className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 font-bold outline-none focus:border-[#00d4ff] transition cursor-pointer" onChange={handleInputChange} value={formData.city}>
                {pkCities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#1a1a4b] uppercase mb-2 ml-1 tracking-widest italic">Area/Street Name</label>
            <input name="location" type="text" placeholder="e.g. Near Rawal Lake" className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 font-bold outline-none focus:border-[#00d4ff] transition" required onChange={handleInputChange} />
          </div>

          {/* MAP SECTION */}
          <div className="relative">
            <label className="block text-[10px] font-black text-[#1a1a4b] uppercase mb-2 ml-1 tracking-widest italic">Pin Point Location (Smart Map)</label>
            <div className="w-full h-72 rounded-[30px] border-4 border-gray-100 overflow-hidden shadow-inner mt-2 z-[1] relative">
              <MapContainer center={[33.6844, 73.0479]} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '26px' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <SearchField setCoords={setCoords} />
                <LocationMarker setCoords={setCoords} currentCoords={coords} />
              </MapContainer>
            </div>
            
            {/* LATITUDE / LONGITUDE DISPLAY (THE MISSING BOX) */}
            <div className="grid grid-cols-2 gap-4 mt-4 relative z-10">
               <div className="bg-[#1a1a4b]/5 p-3 rounded-2xl border border-[#1a1a4b]/10">
                  <p className="text-[8px] font-black text-[#1a1a4b] uppercase italic">Latitude</p>
                  <p className="font-mono font-bold text-sm text-[#1a1a4b]">{coords.lat.toFixed(6)}</p>
               </div>
               <div className="bg-[#ff007a]/5 p-3 rounded-2xl border border-[#ff007a]/10 text-right">
                  <p className="text-[8px] font-black text-[#ff007a] uppercase italic">Longitude</p>
                  <p className="font-mono font-bold text-sm text-[#ff007a]">{coords.lng.toFixed(6)}</p>
               </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#1a1a4b] uppercase mb-2 ml-1 tracking-widest italic text-black">Detailed Description</label>
            <textarea name="description" rows="3" placeholder="Mention specific marks..." className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 font-bold outline-none focus:border-[#ff007a] transition" required onChange={handleInputChange}></textarea>
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#1a1a4b] uppercase mb-2 ml-1 tracking-widest italic text-black">Upload Image (Optional)</label>
            <label className="border-4 border-dashed border-gray-100 rounded-[30px] p-6 text-center cursor-pointer bg-gray-50/50 flex flex-col items-center hover:border-[#00d4ff] transition-all">
              <span className="text-2xl">📸</span>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2">{image ? image.name : "Select Item Image"}</p>
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