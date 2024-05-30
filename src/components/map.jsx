import React, { useEffect, useState } from "react";
import "./map.css";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { buscarDireccion } from "../services/get-map-data";

export const Mapa = ({ location }) => {
  const [position, setPosition] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await buscarDireccion(location);
        if (data) {
          setPosition([parseFloat(data.lat), parseFloat(data.lon)]);
        }
      } catch (error) {
        console.error("Error al buscar la dirección:", error);
      }
    };

    fetchData();
  }, [location]);

  return (
    position && (
      <MapContainer
        center={position}
        zoom={13}
        id="map"
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>{location}</Popup>
        </Marker>
      </MapContainer>
    )
  );
};
