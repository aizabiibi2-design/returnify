import React, { useState, useContext, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 
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

// Map View Controller (Isi se pin jump hoti hai)
function ChangeMapView({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo([coords.lat, coords.lng], 17);
    }
  }, [coords, map]);
  return null;
}

// Search Field inside Map
function SearchField({ setCoords }) {
  const map = useMap();
  useEffect(() => {
    const provider = new OpenStreetMapProvider({
      params: { 'accept-language': 'en', countrycodes: 'pk', limit: 10 },
    });

    const searchControl = new GeoSearchControl({
      provider: provider,
      style: 'bar', 
      autoClose: true,
      showMarker: false, 
      searchLabel: 'Search Area...',
    });

    map.addControl(searchControl);
    map.on('geosearch/showlocation', (result) => {
      setCoords({ lat: result.location.y, lng: result.location.x });
    });

    return () => map.removeControl(searchControl);
  }, [map, setCoords]);
  return null;
}

function LocationMarker({ setCoords, currentCoords }) {
  useMapEvents({
    click(e) { setCoords({ lat: e.latlng.lat, lng: e.latlng.lng }); },
  });
  
  return (
    <Marker 
      key={`pin-${currentCoords.lat}-${currentCoords.lng}`}
      position={[currentCoords.lat, currentCoords.lng]} 
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const pos = e.target.getLatLng();
          setCoords({ lat: pos.lat, lng: pos.lng });
        },
      }}
    />
  );
}

const PostItem = () => {
  const { token } = useContext(AuthContext); 
  const navigate = useNavigate();
  const [type, setType] = useState('Lost'); 
  const [formData, setFormData] = useState({ title: '', location: '', city: 'Rawalpindi', description: '' });
  const [coords, setCoords] = useState({ lat: 33.6007, lng: 73.0679 }); 
  const [image, setImage] = useState(null);

  // AUTO DETECT VIQAR UN NISA
  useEffect(() => {
    const loc = formData.location.toLowerCase();
    if (loc.includes("viqar") || loc.includes("nisa")) {
      setCoords({ lat: 33.6158, lng: 73.0645 });
    }
  }, [formData.location]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) { alert("Please login first! 🔒"); return; }
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('location', formData.location);
    data.append('city', formData.city); 
    data.append('description', formData.description);
    data.append('type', type); 
    data.append('latitude', coords.lat);
    data.append('longitude', coords.lng);
    if (image) data.append('image', image);

    try {
      const response = await fetch('http://localhost:5000/api/items/post', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data,
      });
      if (response.ok) {
        alert("🎉 Submit Report Successful!");
        navigate('/discovery'); 
      }
    } catch (err) {
      alert("📡 Connection error!");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-[#0f0c29] flex items-center justify-center font-sans text-black">
      <div className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl p-10 mt-10">
        <h2 className="text-4xl font-black text-[#1a1a4b] text-center uppercase mb-8 italic">Post Report</h2>

        <div className="flex bg-gray-100 rounded-2xl p-2 mb-6">
          <button type="button" onClick={() => setType('Lost')} className={`flex-1 py-4 rounded-xl font-black uppercase text-xs ${type === 'Lost' ? 'bg-[#1a1a4b] text-white shadow-md' : 'text-gray-400'}`}>Lost</button>
          <button type="button" onClick={() => setType('Found')} className={`flex-1 py-4 rounded-xl font-black uppercase text-xs ${type === 'Found' ? 'bg-[#ff007a] text-white shadow-md' : 'text-gray-400'}`}>Found</button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <input name="title" placeholder="Item Name" className="w-full p-4 bg-gray-50 rounded-2xl border-2 font-bold focus:border-[#ff007a] outline-none" required onChange={handleInputChange} />
            <select name="city" className="w-full p-4 bg-gray-50 rounded-2xl border-2 font-bold outline-none" onChange={handleInputChange} value={formData.city}>
              <option value="Rawalpindi">Rawalpindi</option>
              <option value="Islamabad">Islamabad</option>
            </select>
          </div>

          <input name="location" placeholder="Type location (e.g. Viqar-un-Nisa)" className="w-full p-4 bg-gray-50 rounded-2xl border-2 font-bold focus:border-[#00d4ff] outline-none" required onChange={handleInputChange} />

          {/* MAP AREA */}
          <div className="relative">
            <div className="w-full h-64 rounded-[30px] border-4 border-gray-100 overflow-hidden relative z-[1]">
              <MapContainer center={[coords.lat, coords.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <ChangeMapView coords={coords} />
                <SearchField setCoords={setCoords} />
                <LocationMarker setCoords={setCoords} currentCoords={coords} />
              </MapContainer>
            </div>
            {/* LAT LONG DISPLAY (FIXED) */}
            <div className="flex justify-between mt-2 px-4 text-[10px] font-black opacity-50 uppercase italic">
              <span>LAT: {coords.lat.toFixed(6)}</span>
              <span>LNG: {coords.lng.toFixed(6)}</span>
            </div>
          </div>

          <textarea name="description" rows="2" placeholder="Description..." className="w-full p-4 bg-gray-50 rounded-2xl border-2 font-bold focus:border-[#ff007a] outline-none" required onChange={handleInputChange}></textarea>

          {/* PHOTO BOX */}
          <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center bg-gray-50 hover:bg-gray-100 transition-all">
             <span className="text-xl">📸</span>
             <p className="text-[10px] font-black text-gray-400 uppercase">{image ? image.name : "Upload Photo"}</p>
             <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          </div>

          <button type="submit" className={`w-full text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl transition-all active:scale-95 ${type === 'Lost' ? 'bg-[#1a1a4b]' : 'bg-[#ff007a]'}`}>
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostItem;