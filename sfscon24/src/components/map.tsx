import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, Polyline } from "react-leaflet";
import type { LatLngTuple } from 'leaflet';

const defaultCenter: LatLngTuple = [51.505, -0.09];

const source: LatLngTuple = [51.505, -0.09];
const destination: LatLngTuple = [51.515, -0.1];

interface OSRMResponse {
  routes: Array<{
    geometry: {
      coordinates: [number, number][];
    };
  }>;
}

function SetZoomControlPosition({ position }: { position: string }) {
  const map = useMap();
  map.zoomControl.setPosition(position as any); // Change 'topright', 'bottomright', 'bottomleft'
  return null;
}

function RouteLayer() {
  const [routeCoordinates, setRouteCoordinates] = useState<LatLngTuple[]>([]);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        // Format coordinates as longitude,latitude for OSRM
        const sourceLonLat = `${source[1]},${source[0]}`;
        const destLonLat = `${destination[1]},${destination[0]}`;
        
        const response = await fetch(
          `http://router.project-osrm.org/route/v1/driving/${sourceLonLat};${destLonLat}?overview=full&geometries=geojson`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json() as OSRMResponse;
        
        // Convert coordinates from [longitude, latitude] to [latitude, longitude] for Leaflet
        const coordinates = data.routes[0].geometry.coordinates.map(
          ([lng, lat]): LatLngTuple => [lat, lng]
        );
        
        setRouteCoordinates(coordinates);
      } catch (error) {
        console.error('Error fetching route:', error instanceof Error ? error.message : 'Unknown error');
      }
    };

    void fetchRoute();
  }, []);

  return routeCoordinates.length > 0 ? (
    <Polyline
      positions={routeCoordinates}
      color="red"
      weight={5}
      opacity={1}
    />
  ) : null;
}

export default function Map() {
  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={13} 
      scrollWheelZoom={false}
      style={{ height: '100vh', width: '100%' }}
    >
      <SetZoomControlPosition position="bottomright" />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={source}>
        <Popup>Source Location</Popup>
      </Marker>
      <Marker position={destination}>
        <Popup>Destination Location</Popup>
      </Marker>
      <RouteLayer />
    </MapContainer>
  );
}