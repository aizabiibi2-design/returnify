import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import axios from "axios";

// Marker Icon Fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function LocationMarker({ setLocation }) {
  const [position, setPosition] = useState([33.6844, 73.0479]);

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      setLocation(e.latlng);
    },
  });

  return position === null ? null : <Marker position={position}></Marker>;
}

const PostItem = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");
  const [city, setCity] = useState(""); // City field documentation ke mutabiq
  const [coords, setCoords] = useState({ lat: 33.6844, lng: 73.0479 });
  const [type, setType] = useState("Lost");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // FormData use karna zaroori hai kyunke hum image upload kar rahe hain
    const data = new FormData();
    data.append("title", title);
    data.append("description", description);
    data.append("location", locationName);
    data.append("city", city);
    data.append("type", type);
    data.append("latitude", coords.lat);
    data.append("longitude", coords.lng);
    if (image) data.append("image", image);

    try {
      // Backend URL check karleijye ga (e.g., /api/items/post)
      const token = localStorage.getItem("token"); 
      const res = await axios.post("http://localhost:5000/api/items/post", data, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}` 
        }
      });

      if (res.status === 201) {
        alert("Item Posted Successfully with Map Location!");
        // Reset form or redirect
      }
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Post failed. Please check if you are logged in.");
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "20px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#fff" }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>Report New Item</h2>
      <form onSubmit={handleSubmit}>
        
        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <div style={{ flex: 2 }}>
            <label>Item Name:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%", padding: "10px", marginTop: "5px" }} required />
          </div>
          <div style={{ flex: 1 }}>
            <label>Type:</label>
            <select value={type} onChange={(e) => setType(e.target.value)} style={{ width: "100%", padding: "10px", marginTop: "5px" }}>
              <option value="Lost">Lost</option>
              <option value="Found">Found</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: "100%", padding: "10px", marginTop: "5px", height: "80px" }} required />
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <div style={{ flex: 1 }}>
            <label>Specific Location:</label>
            <input type="text" placeholder="e.g. Library Bench" value={locationName} onChange={(e) => setLocationName(e.target.value)} style={{ width: "100%", padding: "10px", marginTop: "5px" }} required />
          </div>
          <div style={{ flex: 1 }}>
            <label>City:</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} style={{ width: "100%", padding: "10px", marginTop: "5px" }} required />
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Upload Image:</label>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} style={{ width: "100%", marginTop: "5px" }} />
        </div>

        {/* --- MAP SECTION --- */}
        <div style={{ marginBottom: "20px" }}>
          <label>Pin Exact Location on Map (Required for Smart Search):</label>
          <div style={{ height: "250px", width: "100%", marginTop: "10px", borderRadius: "10px", overflow: "hidden", border: "2px solid #007bff" }}>
            <MapContainer center={[33.6844, 73.0479]} zoom={13} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker setLocation={setCoords} />
            </MapContainer>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
            <small style={{ color: "#666" }}>Latitude: {coords.lat.toFixed(4)}</small>
            <small style={{ color: "#666" }}>Longitude: {coords.lng.toFixed(4)}</small>
          </div>
        </div>

        <button type="submit" style={{ width: "100%", padding: "15px", background: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}>
          POST ITEM
        </button>
      </form>
    </div>
  );
};

export default PostItem;