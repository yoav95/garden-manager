// geocode.js

/**
 * Get latitude and longitude for an address using Nominatim (OpenStreetMap)
 * @param {string} address - the address to geocode
 * @returns {Promise<{lat: number, lng: number} | null>} - coordinates or null if not found
 */
export async function getCoordinates(address) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon), // Nominatim returns "lon"
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
}
