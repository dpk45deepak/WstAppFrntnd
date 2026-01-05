// src/components/common/Map.tsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";

// ✅ Import marker images properly (ESM-friendly)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// ✅ Fix default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapProps {
  pickupLocation?: [number, number];
  driverLocation?: [number, number];
  height?: string;
}

const Map = ({
  pickupLocation,
  driverLocation,
  height = "400px",
}: MapProps) => {
  const defaultCenter: [number, number] = [51.505, -0.09]; // London
  const center = pickupLocation ?? defaultCenter;

  return (
    <div className="rounded-lg overflow-hidden" style={{ height }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {pickupLocation && (
          <Marker position={pickupLocation}>
            <Popup>Pickup Location</Popup>
          </Marker>
        )}

        {driverLocation && (
          <Marker position={driverLocation}>
            <Popup>Driver Location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
