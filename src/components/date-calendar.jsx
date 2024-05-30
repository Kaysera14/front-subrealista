import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import "./date-calendar.css";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

dayjs.extend(isBetween);

export function Fecha({
  active,
  setDateValue,
  dateValue,
  dateDisable,
  setActive,
}) {
  const { id } = useParams();
  //Función adicional, creada para dar formato a la fecha.
  const formatDate = (date) => {
    return dayjs(date).format("YYYY-MM-DD");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Verificar si el clic se produce fuera del componente Calendar
      if (!id && active && event.target.closest(".fecha-container") === null) {
        setActive(false); // Cambiar el estado active a false
      }
    };

    // Agregar el event listener cuando el componente se monta
    document.addEventListener("click", handleClickOutside);

    // Limpiar el event listener cuando el componente se desmonta
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [active, setActive]);

  // Función para deshabilitar las fechas seleccionadas
  const tileDisabled = ({ date }) => {
    if (!dateDisable) return false;

    for (const { dateStart, dateEnd } of dateDisable) {
      const startDate = dayjs(dateStart).subtract(1, "day");
      const endDate = dayjs(dateEnd).add(1, "day"); // Incrementamos en un día para incluir la fecha final

      if (
        dayjs(date).isAfter(startDate, "day") &&
        dayjs(date).isBefore(endDate, "day")
      ) {
        return true; // Si la fecha está dentro del rango de deshabilitación, retorna true
      }
    }
    return false;
  };

  const selectDateValue = (date) => {
    if (date) {
      setDateValue(date);
      if (dateValue >= 2) {
        const fechaFormateada = [dayjs(dateValue[0]), dayjs(dateValue[1])];

        if (fechaFormateada.length >= 2 && dateDisable) {
          for (const { dateStart, dateEnd } of dateDisable) {
            const startDate = dayjs(dateStart);
            const endDate = dayjs(dateEnd);

            if (
              dayjs(startDate).isBetween(fechaFormateada, "day", "[]") ||
              dayjs(endDate).isBetween(fechaFormateada, "day", "[]")
            ) {
              console.error("Error al seleccionar la fecha");
              break; // Si la fecha está dentro de algún rango de deshabilitación, establecemos disableSelected a true y salimos del bucle
            }
          }
        }
      }
    }
  };

  return id === undefined ? (
    <section
      className={`${
        active ? "flex" : "hidden"
      } flex flex-col w-full bg-white gap-5 mt-5 md:top-24 md:-right-20 md:mt-0 md:absolute md:p-6 md:shadow-lg md:rounded-xl md:w-[30rem] md:w-fit`}
    >
      <span className="flex flex-row items-center justify-center p-2 gap-2 border rounded-full shadow-lg">
        {dateValue && dateValue[0] > 1 ? (
          <p className="bg-gray-200 text-xs text-center w-full rounded-full p-2 md: text-normal">
            Ida: {formatDate(dateValue[0])}
          </p>
        ) : (
          <p className="bg-white text-xs text-center w-full p-2 text-center md: text-normal">
            Ida: ...
          </p>
        )}
        {dateValue && dateValue[1] > 1 ? (
          <p className="bg-gray-200 text-xs text-center w-full rounded-full p-2 md: text-normal">
            Vuelta: {formatDate(dateValue[1])}
          </p>
        ) : (
          <p className="bg-white w-full text-xs text-center p-2 text-center md: text-normal">
            Vuelta: ...
          </p>
        )}
      </span>

      <Calendar
        minDate={new Date()}
        className="fecha-container"
        selectRange={true}
        onChange={(value) => {
          setDateValue(value);
          setActive(!active);
        }}
        value={dateValue}
      />
    </section>
  ) : (
    <section className={"flex flex-col items-center w-full bg-white"}>
      <span className="flex flex-row items-center justify-center p-2 gap-2 border rounded-full shadow-lg mb-5 min-w-96">
        {dateValue && dateValue[0] > 1 ? (
          <p className="bg-gray-200 text-xs text-center w-full rounded-full p-2 md: text-normal">
            Ida: {formatDate(dateValue[0])}
          </p>
        ) : (
          <p className="bg-white text-xs text-center w-full p-2 text-center md: text-normal">
            Ida: ...
          </p>
        )}
        {dateValue && dateValue[1] > 1 ? (
          <p className="bg-gray-200 text-xs text-center w-full rounded-full p-2 md: text-normal">
            Vuelta: {formatDate(dateValue[1])}
          </p>
        ) : (
          <p className="bg-white w-full text-xs text-center p-2 text-center md: text-normal">
            Vuelta: ...
          </p>
        )}
      </span>
      <Calendar
        minDate={new Date()}
        selectRange={true}
        onChange={(value) => selectDateValue(value)}
        value={dateValue}
        tileDisabled={tileDisabled}
      />
    </section>
  );
}
