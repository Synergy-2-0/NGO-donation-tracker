import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons when using Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function GeospatialMap({ data }) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (mapInstance.current) return; // initialize map only once
    
    // Initialize Leaflet Map (Centered on Sri Lanka)
    mapInstance.current = L.map(mapContainer.current, {
        center: [7.8731, 80.7718],
        zoom: 7,
        scrollWheelZoom: false,
        attributionControl: false
    });

    // Add Premium Dark Tiles Hub
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CartoDB',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(mapInstance.current);

    // Add markers from data
    if (data && data.features) {
        data.features.forEach(feature => {
            if (!feature.geometry?.coordinates || feature.geometry.coordinates.length < 2) return;
            
            const lat = feature.geometry.coordinates[1];
            const lng = feature.geometry.coordinates[0];

            if (typeof lat !== 'number' || typeof lng !== 'number') return;
            
            const latlng = [lat, lng];
            const { name, city, focus, trustScore } = feature.properties || {};
            
            const marker = L.circleMarker(latlng, {
                radius: 8,
                fillColor: "#F97316",
                color: "#ffffff",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(mapInstance.current);

            marker.bindPopup(`
                <div class="p-2 font-sans text-slate-800">
                    <h3 class="font-bold text-sm">${name}</h3>
                    <p class="text-[10px] text-slate-500 uppercase tracking-tighter">${city}</p>
                    <div class="mt-2 text-[10px] border-t border-slate-100 pt-2">
                        <span class="font-semibold text-slate-400">MISSION:</span> ${focus}<br/>
                        <span class="font-semibold text-slate-400">TRUST SCORE:</span> 
                        <span class="text-orange-600 font-bold">${trustScore}%</span>
                    </div>
                </div>
            `);
        });
    }

    return () => {
        if (mapInstance.current) {
            mapInstance.current.remove();
            mapInstance.current = null;
        }
    };
  }, [data]);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner group relative">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-600 shadow-sm border border-white/50 pointer-events-none">
        LIVE OPEN NETWORK HUB
      </div>
    </div>
  );
}
