// src/components/MapForm.tsx
'use client';
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const center: [number, number] = [38.9072, -77.0369]; // Example: Washington, D.C.

const MapForm: React.FC = () => {
  const [siteName, setSiteName] = useState('');
  const [address, setAddress] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');

  const defaultIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    shadowSize: [41, 41]
  });
  

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '70%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Optional Marker */}
        <Marker position={center} icon={defaultIcon}>
          <Popup>A popup example</Popup>
        </Marker>
      </MapContainer>
      <div style={{ width: '30%', padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label>Site Name</label>
          <input type="text" value={siteName} onChange={e => setSiteName(e.target.value)} placeholder="Type here" />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label>Site Address</label>
          <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Type here" />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label>Longitude</label>
          <input type="text" value={longitude} onChange={e => setLongitude(e.target.value)} placeholder="Type here" />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label>Latitude</label>
          <input type="text" value={latitude} onChange={e => setLatitude(e.target.value)} placeholder="Type here" />
        </div>
      </div>
    </div>
  );
};

export default MapForm;
