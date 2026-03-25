import geoService from '../services/geo.service.js';

export const getPartnersGeo = async (req, res) => {
  try {
    const { lat, lng, radius, city, state } = req.query;

    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      const radiusKm = radius ? parseFloat(radius) : 50;

      if (
        isNaN(latitude) || isNaN(longitude) ||
        latitude < -90 || latitude > 90 ||
        longitude < -180 || longitude > 180
      ) {
        return res.status(400).json({ message: 'Invalid coordinates' });
      }

      const partners = await geoService.findPartnersNearby(longitude, latitude, radiusKm);
      return res.json(partners);
    }

    if (city || state) {
      const partners = await geoService.getPartnersByRegion(city, state);
      return res.json(partners);
    }

    res.status(400).json({ message: 'Provide lat/lng or city/state query parameters' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHeatmap = async (req, res) => {
  try {
    const data = await geoService.getHeatmapData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getImpactZones = async (req, res) => {
  try {
    const data = await geoService.getImpactZones();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
