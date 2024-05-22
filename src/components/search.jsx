import { forwardRef, useImperativeHandle, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./search.css";
import { Fecha } from "./date-calendar";
import { PriceRange } from "./price-range";
import dayjs from "dayjs";

const Search = forwardRef(({ handleFilteredPosts }, ref) => {
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState([0, 2500]);
  const [dateValue, setDateValue] = useState();
  const [rooms, setRooms] = useState(0);
  const [activeDate, setActiveDate] = useState(false);
  const [activePrice, setActivePrice] = useState(false);

  // Función para resetear los filtros
  const resetFilters = () => {
    setLocation("");
    setPrice([0, 2500]);
    setDateValue();
    setRooms(0);
    setActiveDate(false);
    setActivePrice(false);
  };

  // Exponer la función resetFilters a través de ref
  useImperativeHandle(ref, () => ({
    resetFilters,
  }));

  const handleSearch = (e) => {
    e.preventDefault();

    let fechaMinSQL;
    let fechaMaxSQL;
    if (dateValue && dateValue.length !== 0) {
      fechaMinSQL = dayjs(dateValue[0]).format("YYYY-MM-DD");
      fechaMaxSQL = dayjs(dateValue[1]).format("YYYY-MM-DD");
    }

    handleFilteredPosts(
      "rent_location=" +
        location +
        "&min_price=" +
        price[0] +
        "&max_price=" +
        price[1] +
        "&min_rooms=" +
        rooms +
        "&min_date=" +
        fechaMinSQL +
        "&max_date=" +
        fechaMaxSQL
    );
  };

  return (
    <aside className="flex flex-col w-full border-solid border-2 rounded-full drop-shadow-md bg-white text-black">
      <form
        className="flex flex-row justify-center items-center height-full"
        onSubmit={(e) => handleSearch(e)}
      >
        <label className="flex flex-col w-10/12 bg-transparent font-medium text-sm py-4 px-5 rounded-l-full rounded-r-md hover:bg-zinc-200 height-full">
          Destino
          <FormControl fullWidth size="small">
            <InputLabel id="location-label">
              {location.length !== 0 ? "" : "Destino..."}
            </InputLabel>
            <Select
              id="location"
              sx={{ minWidth: "100%", width: "100%" }}
              value={location}
              name="rent_location"
              onChange={(e) => setLocation(e.target.value)}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                    overflowY: "scroll",
                  },
                },
              }}
            >
              <MenuItem value={"Andalucia"}>Andalucia</MenuItem>
              <MenuItem value={"Aragon"}>Aragon</MenuItem>
              <MenuItem value={"Asturias"}>Asturias</MenuItem>
              <MenuItem value={"Balears"}>Balears</MenuItem>
              <MenuItem value={"Canarias"}>Canarias</MenuItem>
              <MenuItem value={"Cantabria"}>Cantabria</MenuItem>
              <MenuItem value={"Castilla y Leon"}>Castilla y Leon</MenuItem>
              <MenuItem value={"Castilla La Mancha"}>
                Castilla La Mancha
              </MenuItem>
              <MenuItem value={"Cataluña"}>Cataluña</MenuItem>
              <MenuItem value={"Comunidad Valenciana"}>
                Comunidad Valenciana
              </MenuItem>
              <MenuItem value={"Extremadura"}>Extremadura</MenuItem>
              <MenuItem value={"Galicia"}>Galicia</MenuItem>
              <MenuItem value={"Madrid"}>Madrid</MenuItem>
              <MenuItem value={"Murcia"}>Murcia</MenuItem>
              <MenuItem value={"Navarra"}>Navarra</MenuItem>
              <MenuItem value={"Pais Vasco"}>Pais Vasco</MenuItem>
              <MenuItem value={"Rioja"}>Rioja</MenuItem>
              <MenuItem value={"Ceuta"}>Ceuta</MenuItem>
              <MenuItem value={"Melilla"}>Melilla</MenuItem>
            </Select>
          </FormControl>
        </label>
        <label className="flex flex-col w-8/12 fecha-container bg-transparent font-medium text-sm py-4 px-5 rounded-md hover:bg-zinc-200 relative height-full">
          Fecha
          <p
            className="w-full font-normal text-xs hover:bg-zinc-200 mt-[0.43rem]"
            onClick={() => setActiveDate(!activeDate)}
          >
            {dateValue && dateValue[0].length !== 0 ? (
              <>
                {`${dateValue[0]?.getDate()} ${dateValue[0]?.toLocaleString(
                  "default",
                  { month: "short" }
                )}`}
              </>
            ) : (
              "Salida"
            )}
            ,{" "}
            {dateValue && dateValue[1].length !== 0 ? (
              <>
                {`${dateValue[1]?.getDate()} ${dateValue[1]?.toLocaleString(
                  "default",
                  { month: "short" }
                )}`}
              </>
            ) : (
              "Llegada"
            )}
          </p>
          <Fecha
            active={activeDate}
            dateValue={dateValue}
            setDateValue={setDateValue}
            setActive={setActiveDate}
          />
        </label>
        <label className="flex flex-col w-5/12 price-container bg-transparent font-medium text-sm py-4 px-5 rounded-md hover:bg-zinc-200 relative height-full">
          Precio
          <p
            className="w-full min-w-[5.2rem] font-normal text-xs hover:bg-zinc-200 mt-[0.43rem]"
            onClick={() => setActivePrice(!activePrice)}
          >
            {`${price[0]}€, ${price[1]}€`}
          </p>
          <PriceRange
            setPrice={setPrice}
            price={price}
            activePrice={activePrice}
            setActivePrice={setActivePrice}
          />
        </label>
        <label className="flex flex-col w-4/12 bg-transparent font-medium text-sm py-4 px-5 rounded-md hover:bg-zinc-200 height-full">
          Habitaciones
          <input
            className="w-full font-normal text-xs hover:bg-zinc-200 mt-[0.43rem] focus:outline-none"
            type="text"
            pattern="[0-9]*"
            inputMode="numeric"
            value={rooms}
            id="tenants"
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
            }}
            placeholder="Num.inquilinos..."
            onChange={(e) => setRooms(e.target.value)}
          />
        </label>
        <button className="flex align-center justify-center bg-gradient-to-b from-quaternary-inicio to-quaternary-fin p-4 rounded-full mx-4">
          <SearchIcon className="w-5 h-5 text-white" />
        </button>
      </form>
    </aside>
  );
});

export default Search;
