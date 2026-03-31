import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Note: In a real app, this would be in an environment variable.
// Using a placeholder/demo token for now.
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

export default function MapboxMap({ data }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [80.7718, 7.8731], // Centered on Sri Lanka by default
      zoom: 7,
      antialias: true
    });

    map.current.on('load', () => {
      // Add data source
      map.current.addSource('partners', {
        type: 'geojson',
        data: data || { type: 'FeatureCollection', features: [] }
      });

      // Add circle layer
      map.current.addLayer({
        id: 'partners-circles',
        type: 'circle',
        source: 'partners',
        paint: {
          'circle-radius': 8,
          'circle-color': '#F97316',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      // Add popup on click
      map.current.on('click', 'partners-circles', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const { name, city, focus, trustScore } = e.features[0].properties;

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(`
            <div class="p-2 font-sans">
              <h3 class="font-bold text-slate-900">${name}</h3>
              <p class="text-xs text-slate-500">${city}</p>
              <div class="mt-2 text-xs">
                <span class="font-semibold">Focus:</span> ${focus}<br/>
                <span class="font-semibold">Trust Score:</span> 
                <span class="text-orange-600 font-bold">${trustScore}%</span>
              </div>
            </div>
          `)
          .addTo(map.current);
      });

      // Change cursor on hover
      map.current.on('mouseenter', 'partners-circles', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'partners-circles', () => {
        map.current.getCanvas().style.cursor = '';
      });
    });
  }, [data]);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner group">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-600 shadow-sm border border-white/50">
        LIVE TRANSPARENCY NETWORK
      </div>
    </div>
  );
}
