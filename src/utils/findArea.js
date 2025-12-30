import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import { areasGeoJson } from "../data/areasGeoJson";

/**
 * Find which area a point belongs to
 * @param {number} lat
 * @param {number} lng
 * @returns {object|null} area properties or null
 */
export function findArea(lat, lng) {
  if (lat == null || lng == null) return null;

  const pt = point([lng, lat]);

  for (const feature of areasGeoJson.features) {
    if (booleanPointInPolygon(pt, feature)) {
      return feature.properties;
    }
  }

  return null;
}
