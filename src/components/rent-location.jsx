import React, { useEffect, useState } from "react";
import "./map.css";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { createPortal } from "react-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { buscarDireccion } from "../services/get-map-data";
import SearchIcon from "@mui/icons-material/Search";
import { Alert, Input, Stack } from "@mui/material";

export const RentLocation = ({ stepData, setStepData }) => {
  const [location, setLocation] = useState({
    inputSearch: "",
    apiSearch: "",
  });
  const [position, setPosition] = useState([]);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const spainBounds = [
    [45, -20],
    [27, 20],
  ];

  const MapClickHandler = ({ onClick }) => {
    useMapEvents({
      click: onClick,
    });

    return null;
  };

  useEffect(() => {
    if (position?.length === 0) {
      const getPosition = async () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (location) => {
              setPosition([
                location.coords.latitude,
                location.coords.longitude,
              ]);
            },
            (error) => {
              console.error("Error getting geolocation:", error);
            }
          );
          navigator.geolocation.getCurrentPosition(async (location) => {
            const data = await buscarDireccion([
              location.coords.latitude,
              location.coords.longitude,
            ]);

            setLocation({
              inputSearch: data.display_name,
              apiSearch: data.display_name,
            });
            setStepData({
              ...stepData,
              rent_address: data.display_name,
            });
          });
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      };
      getPosition();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (position?.length !== 0) {
      setLocation({ ...location, apiSearch: location.inputSearch });
      if (position?.length !== 0) {
        const data = await buscarDireccion(location.inputSearch);
        if (data) {
          setPosition([parseFloat(data.lat), parseFloat(data.lon)]);
          setLocation({
            ...location,
            inputSearch: data.display_name,
            apiSearch: data.display_name,
          });
          setStepData({
            ...stepData,
            rent_address: data.display_name,
          });
        }
      }
    }
  };

  const handleMapClick = async (e) => {
    const clickedPosition = [e.latlng.lat, e.latlng.lng];
    setPosition(clickedPosition);
    const data = await buscarDireccion(clickedPosition);

    setLocation({
      inputSearch: data.display_name,
      apiSearch: data.display_name,
    });

    setStepData({
      ...stepData,
      rent_address: data.display_name,
    });
  };

  const handleDragEnd = (e) => {
    const map = e.target;
    if (
      !spainBounds[0][0] <= map.getBounds().getSouth() &&
      map.getBounds().getNorth() <= !spainBounds[1][0]
    ) {
      map.setView([position[0], position[1]]);
    }
    if (
      !spainBounds[0][1] <= map.getBounds().getWest() &&
      map.getBounds().getEast() <= !spainBounds[1][1]
    ) {
      map.setView([position[0], position[1]]);
    }
  };
  return (
    <section className="flex flex-col relative w-full items-center justify-evenly">
      <h2 className="font-semibold text-2xl md:text-3xl">
        Ingresa tu dirección
      </h2>
      <form className="flex flex-row mb-4 w-full items-center justify-center z-0">
        {location?.inputSearch?.length !== 0 &&
          !location?.inputSearch?.includes("España") && (
            <section
              className="relative z-50"
              onMouseEnter={() => setShow(true)}
              onMouseLeave={() => setShow(false)}
            >
              <ErrorOutlineIcon color="warning" className="mr-3" />
              {show &&
                createPortal(
                  <span className="absolute w-fit text-sm top-[13.5vh] left-[10%] right-[10%] bg-white py-2 px-4 border rounded-md shadow-md z-50 md:w-max md:top-[24.5vh] md:left-[31.5vw] md:text-base">
                    "Debes introducir una dirección dentro de España"
                  </span>,
                  document.body
                )}
            </section>
          )}
        <Input
          type="text"
          aria-label="Dirección"
          id="searchInput"
          value={location.inputSearch}
          onChange={(e) =>
            setLocation({ ...location, inputSearch: e.target.value })
          }
          placeholder="Búsca tu ciudad…"
          className="w-4/12"
        />

        <button
          onClick={(e) => {
            handleSubmit(e);
          }}
          className="flex align-center justify-center bg-black py-2 px-4 rounded-md mx-4"
        >
          <SearchIcon className="w-5 h-5 text-white" />
        </button>
      </form>
      {position?.length !== 0 && (
        <section className="w-full h-[36rem] md:h-[31rem]">
          <MapContainer
            center={position}
            zoom={13}
            id="map"
            style={{ height: "100%", width: "100%" }}
            maxBounds={spainBounds}
            ondragend={handleDragEnd}
          >
            <MapClickHandler onClick={(e) => handleMapClick(e)} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
              <Popup>
                {location.apiSearch.length || location.inputSearch.length !== 0
                  ? location.inputSearch
                  : ""}
              </Popup>
            </Marker>
          </MapContainer>
        </section>
      )}
      {error ? (
        <Stack
          sx={{
            width: "60%",
            position: "fixed",
            zIndex: "20",
            bottom: "0",
            right: "0",
            backgroundColor: "white",
          }}
          spacing={2}
        >
          <Alert
            variant="outlined"
            severity="warning"
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        </Stack>
      ) : null}
    </section>
  );
};
