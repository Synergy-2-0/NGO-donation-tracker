import axios from 'axios';

class GeocodingService {
  constructor() {
    this.baseUrl = 'https://nominatim.openstreetmap.org';
  }

  async geocodeAddress(address = {}) {
    const parts = [address.street, address.city, address.state, address.country, address.postalCode]
      .filter(Boolean)
      .map((part) => String(part).trim());

    if (!parts.length) {
      return null;
    }

    const query = parts.join(', ');

    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          q: query,
          format: 'json',
          limit: 1,
        },
        headers: {
          'User-Agent': 'ngo-donation-tracker/1.0 (nominatim-integration)',
          'Accept-Language': 'en',
        },
        timeout: 8000,
      });

      if (!Array.isArray(response.data) || response.data.length === 0) {
        return null;
      }

      const [result] = response.data;
      const lat = Number(result.lat);
      const lon = Number(result.lon);

      if (Number.isNaN(lat) || Number.isNaN(lon)) {
        return null;
      }

      return {
        type: 'Point',
        coordinates: [lon, lat],
      };
    } catch {
      return null;
    }
  }
}

export default new GeocodingService();
