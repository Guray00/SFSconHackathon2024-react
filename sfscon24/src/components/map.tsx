import React, { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  Polyline,
} from "react-leaflet";
import type { LatLngTuple } from "leaflet";

const defaultCenter: LatLngTuple = [46.4786, 11.3326];

interface OSRMResponse {
  routes: Array<{
    geometry: {
      coordinates: [number, number][];
    };
  }>;
}

function SetZoomControlPosition({ position }: { position: string }) {
  const map = useMap();
  map.zoomControl.setPosition(position as any);
  return null;
}

function RouteLayer({
  source,
  destination,
}: {
  source: LatLngTuple;
  destination: LatLngTuple;
}) {
  const [routeCoordinates, setRouteCoordinates] = useState<LatLngTuple[]>([]);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const sourceLonLat = `${source[1]},${source[0]}`;
        const destLonLat = `${destination[1]},${destination[0]}`;

        const response = await fetch(
          `http://router.project-osrm.org/route/v1/driving/${sourceLonLat};${destLonLat}?overview=full&geometries=geojson`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = (await response.json()) as OSRMResponse;

        const coordinates = data.routes[0].geometry.coordinates.map(
          ([lng, lat]): LatLngTuple => [lat, lng]
        );

        setRouteCoordinates(coordinates);
      } catch (error) {
        console.error(
          "Error fetching route:",
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    };

    void fetchRoute();
  }, [source, destination]);

  return routeCoordinates.length > 0 ? (
    <Polyline positions={routeCoordinates} color="red" />
  ) : null;
}

export default function Map({
  markers,
  src,
  setSrc,
  dst,
  setDst,
}: {
  markers: { value: LatLngTuple; label: string }[];
  src: LatLngTuple;
  setSrc: (src: LatLngTuple) => void;
  dst: LatLngTuple;
  setDst: (dst: LatLngTuple) => void;
}) {
  const [counter, setCounter] = useState(0);

  const handleMapClick = (position: LatLngTuple) => {
    let newCounter = counter + 1;
    if (src && dst && counter === 2) {
      newCounter = 1;
    } else {
      newCounter = (counter + 1) % 3;
    }

    setCounter(newCounter);
    console.log(newCounter);

    if (newCounter === 1) {
      setSrc(position);
    } else if (newCounter === 2) {
      setDst(position);
    }
  };

  return (
    <MapContainer
      center={defaultCenter}
      zoom={5}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        
        // url={ (src!=undefined && dst!=undefined) ? `https://{s}.tile.openstreetmap.org/?minlat=${Math.min(src[0], dst[0])}&minlon=${Math.min(src[1], dst[1])}&maxlat=${Math.max(src[0], dst[0])}&maxlon=${Math.max(src[1], dst[1])}.png` : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" }
        url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" }
      />
      <SetZoomControlPosition position="bottomright" />

      {markers.map(({ value, label }) => (
        <Marker
          key={label}
          position={value}
          eventHandlers={{
            click: () => handleMapClick(value), // Correct event handler
          }}
        >
          <Popup>{label}</Popup>
        </Marker>
      ))}

      {src && (
        <Marker position={src}>
          <Popup>Source Location</Popup>
        </Marker>
      )}

      {dst && (
        <Marker position={dst}>
          <Popup>Destination Location</Popup>
        </Marker>
      )}

      {src && dst && <RouteLayer source={src} destination={dst} />}
    </MapContainer>
  );
}
