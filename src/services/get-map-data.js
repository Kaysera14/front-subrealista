export const buscarDireccion = async (location) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`
  );
  const data = await response.json();
  if (data && data.length > 0) {
    const { lat, lon, display_name } = data[0];
    return { lat, lon, display_name };
  } else {
    console.error("No se encontró la dirección.");
  }
};
