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
const areaColors = {
  A: "#1e90ff",
  B: "#ff9f1c",
  C: "#ffd93d",
  D: "#6a4c93",
  E: "#1e90ff",
  F: "#ff9f1c",
  G: "#2ec4b6",
  H: "#e71d36",
};

const wasteDaysByArea = {
  A: "שני, רביעי",
  B: "ראשון, שלישי",
  C: "שלישי",
  D: "רביעי",
  E: "חמישי",
  F: "שישי",
  G: "שבת",
  H: "ראשון",
};

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
        style={(feature) => ({
  color: areaColors[feature.properties.area],
  fillColor: areaColors[feature.properties.area],
  fillOpacity: 0.35,
  weight: 2,
})}
 onEachFeature={(feature, layer) => {
    const area = feature.properties.area;
    const wasteDays = wasteDaysByArea[area] ?? "לא ידוע";

    layer.bindTooltip(
      `אזור ${area} – ימי פינוי: ${wasteDays}`,
      {
        sticky: true,
        direction: "top",
        className: "areaTooltip",
      }
    );

    layer.on({
      mouseover: (e) => {
        e.target.setStyle({
          fillOpacity: 0.45,
          weight: 3,
        });
      },
      mouseout: (e) => {
        e.target.setStyle({
          fillOpacity: 0.2,
          weight: 2,
        });
      },
    });
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
  <Popup minWidth={180} maxWidth={240} closeButton={false}>
  <div
    className={styles.popup}
    role="button"
    onClick={() => {
      window.location.href = `/garden/${props.id}`;
    }}
  >
    {props.imageURL && (
      <img
        src={props.imageURL}
        className={styles.popupImage}
        alt={props.name}
      />
    )}

    <div className={styles.popupContent}>
      <div className={styles.popupTitle}>{props.name}</div>
      <div className={styles.popupAddress}>{props.address}</div>

      <div className={styles.popupFooter}>
        <span className={styles.popupDate}>
          {props.lastVisit ? formatDate(props.lastVisit) : "אין ביקורים"}
        </span>

        <button
          className={styles.popupNav}
          onClick={(e) => {
            e.stopPropagation(); // 👈 prevent redirect
            window.open(
              `https://waze.com/ul?q=${props.locationURL ?? ""}`,
              "_blank"
            );
          }}
        >
          ניווט
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
