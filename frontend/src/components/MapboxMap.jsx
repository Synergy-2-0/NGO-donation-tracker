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
                <div class="p-4 font-sans bg-white text-slate-900 rounded-2xl border border-slate-100 min-w-[200px] shadow-2xl">
                    <div class="flex items-center gap-2 mb-3">
                        <div class="w-1.5 h-1.5 rounded-full bg-tf-primary animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
                        <span class="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">${feature.properties.type}</span>
                    </div>
                    <h3 class="font-black text-lg leading-tight mb-1 text-slate-900">${name}</h3>
                    <p class="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-4 flex items-center gap-1">
                        <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        ${city}
                    </p>
                    <div class="space-y-3 pt-3 border-t border-slate-50">
                        <div>
                            <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Impact Sector</p>
                            <p class="text-[10px] text-slate-600 font-medium">${focus}</p>
                        </div>
                        <div class="flex justify-between items-center bg-tf-primary/5 p-2.5 rounded-xl border border-tf-primary/10">
                            <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Trust Index</span>
                            <span class="text-tf-primary font-black text-sm tabular-nums">${trustScore}%</span>
                        </div>
                    </div>
                </div>
            `, {
                closeButton: false,
                className: 'custom-popup'
            });
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
