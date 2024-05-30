import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { PriceRange } from "./price-range";
import { Fecha } from "./date-calendar";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";

const SearchMobile = forwardRef(
  ({ isOpen, setIsOpen, handleFilteredPosts }, ref) => {
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

      setIsOpen(!isOpen);
    };

    return (
      isOpen && (
        <section className="fixed z-20 top-0 w-screen h-full">
          <aside className="flex items-center justify-center h-full pt-4 px-4 pb-20 text-center sm:block sm:p-0 overflow-y-scroll">
            <span
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <span className="absolute inset-0 bg-gray-500 opacity-75" />
            </span>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <section
              className="inline-block w-full h-full align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <section className="flex flex-col relative justify-center items-center bg-white w-full h-full px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-y-scroll">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  type="button"
                  className="fixed bg-white top-0 left-0 flex flex-col justify-center items-center m-2 p-1 rounded-full border border-gray-400"
                >
                  <CloseIcon sx={{ width: "1.2rem", height: "1.2rem" }} />
                </button>
                <aside className="flex flex-col w-full border-solid bg-white text-black">
                  <form
                    className="flex flex-col w-full h-full justify-center items-center gap-2"
                    onSubmit={(e) => handleSearch(e)}
                  >
                    <label className="flex flex-col w-full bg-transparent border-2 rounded-full font-medium text-sm py-1 px-5">
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
                          <MenuItem value={"Castilla y Leon"}>
                            Castilla y Leon
                          </MenuItem>
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
                    <label
                      className={`flex flex-col w-full bg-transparent border-2 rounded-full font-medium text-sm py-1 px-5 ${
                        activeDate ? "h-auto rounded-md" : ""
                      }`}
                    >
                      Fecha
                      <p
                        className="w-full font-normal text-xs mt-[0.43rem]"
                        onClick={() => setActiveDate(!activeDate)}
                      >
                        {dateValue && dateValue[0].length !== 0
                          ? `${dateValue[0].getDate()} ${dateValue[0].toLocaleString(
                              "default",
                              { month: "short" }
                            )}`
                          : "Salida"}
                        ,{" "}
                        {dateValue && dateValue[1].length !== 0
                          ? `${dateValue[1].getDate()} ${dateValue[1].toLocaleString(
                              "default",
                              { month: "short" }
                            )}`
                          : "Llegada"}
                      </p>
                      <Fecha
                        active={activeDate}
                        dateValue={dateValue}
                        setDateValue={setDateValue}
                      />
                    </label>
                    <label
                      className={`flex flex-col w-full bg-transparent border-2 rounded-full font-medium text-sm py-1 px-5 mt-[0.43rem] ${
                        activePrice ? "h-auto rounded-md" : ""
                      }`}
                    >
                      Precio
                      <p
                        className="w-full font-normal text-xs mt-[0.43rem]"
                        onClick={() => setActivePrice(!activePrice)}
                      >
                        {`${price[0]}€, ${price[1]}€`}
                      </p>
                      <PriceRange
                        setPrice={setPrice}
                        price={price}
                        activePrice={activePrice}
                      />
                    </label>
                    <label className="flex flex-col w-full bg-transparent border-2 rounded-full font-medium text-sm py-1 px-5 hover:bg-zinc-200">
                      Habitaciones
                      <input
                        className="w-full font-normal text-xs hover:bg-zinc-200 mt-[0.43rem] focus:outline-none"
                        type="text"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        value={rooms}
                        id="tenants"
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                        }}
                        placeholder="Num.inquilinos..."
                        onChange={(e) => setRooms(e.target.value)}
                      />
                    </label>
                    <button className=" mt-16 flex items-center justify-center bg-gradient-to-b from-quaternary-inicio to-quaternary-fin px-4 py-3 gap-2 rounded-lg">
                      <SearchIcon className="w-5 h-5 text-white" />
                      <p className="text-white">Buscar</p>
                    </button>
                  </form>
                </aside>
              </section>
            </section>
          </aside>
        </section>
      )
    );
  }
);

export default SearchMobile;
