export function gardensToGeoJson(gardens) {
  return {
    type: "FeatureCollection",
    features: gardens
      .filter(g => g?.lat != null && g?.lng != null)
      .map(garden => ({
        type: "Feature",
        properties: {
          name: garden.name ?? "",
          type: "garden",
          ...garden
        },
        geometry: {
          type: "Point",
          coordinates: [garden.lng, garden.lat] // IMPORTANT
        }
      }))
  };
}