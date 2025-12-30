import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";
import styles from "./AreasMap.module.css"; // reuse the same styles

import { areasGeoJson } from "./data/areasGeoJson";
import { gardensToGeoJson } from "./utils/gardensToGeoJson";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase/config.js";
const israelCenterBounds = [
  [32.4, 34.7], // north-west corner (Netanya area)
  [32.0, 35.0], // south-east corner (Tel Aviv / Petah Tikva)
];
export default function AreasMap() {
  const [gardensGeoJson, setGardensGeoJson] = useState(null);

  async function fetchGardens() {
    const snap = await getDocs(collection(db, "gardens"));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  useEffect(() => {
    fetchGardens().then(gardens => {
      if (gardens?.length) {
        setGardensGeoJson(gardensToGeoJson(gardens));
      } else {
        setGardensGeoJson({ type: "FeatureCollection", features: [] });
      }
    });
  }, []);

  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }

  return (
    <MapContainer
      bounds={israelCenterBounds}
  style={{ height: "500px", width: "100%" }} // you can set smaller height for mobile
  scrollWheelZoom={false} // optional: prevent zooming
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Areas polygons */}
      <GeoJSON
        data={areasGeoJson}
        style={{
          color: "#0066ff",
          weight: 2,
          fillOpacity: 0.2,
        }}
      />

      {/* Gardens points */}
      {gardensGeoJson?.features.map(feature => {
        const [lng, lat] = feature.geometry.coordinates;
        const props = feature.properties;
 const dayClass = props.day
    ? styles[`day${props.day.charAt(0).toUpperCase() + props.day.slice(1)}`]
    : "";
        const gardenDotIcon = new L.DivIcon({
    className: `${styles.gardenDot} ${dayClass}`,
    iconSize: [28, 28],
    iconAnchor: [14, 14], // center the dot
  });

        return (
          <Marker key={props.id} position={[lat, lng]} icon={gardenDotIcon}>
  <Popup minWidth={200} maxWidth={280}>
  <div className={styles.card}>
    <div className={styles.imageWrapper}>
      <img src={props.imageURL} className={styles.image} alt={props.name} />
    </div>

    <div className={styles.info}>
      <div className={styles.title}>{props.name}</div>
      <div className={styles.address}>{props.address}</div>
      <div className={styles.lastVisit}>
        {props.lastVisit ? (
          <p className={styles.okVisit}>{formatDate(props.lastVisit)}</p>
        ) : (
          <p className={styles.noVisit}>אין ביקורים עדיין</p>
        )}
      </div>

      <div className={styles.buttonsWrapper}>
        <button
          className={styles.navButton}
          onClick={(e) => {
            e.stopPropagation();
            window.open(`https://waze.com/ul?q=${props.locationURL ?? ""}`, "_blank");
          }}
        >
          ניווט
        </button>

        <button
          className={styles.navButton}
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = `/garden/${props.id}`;
          }}
        >
          פרטים
        </button>
      </div>
    </div>
  </div>
</Popup>
</Marker>

        );
      })}
    </MapContainer>
  );
}
