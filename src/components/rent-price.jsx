import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Alert, Stack } from "@mui/material";
import { CostsPc } from "./costs-pc";

export function RentPrice({
  formatDate,
  dateValue,
  post,
  rooms,
  setRooms,
  daysDiff,
  error,
  setError,
  handlePassToPayForm,
}) {
  return (
    <aside className="w-5/12 hidden p-6 gap-2 md:flex">
      <section className="flex flex-col items-center w-full relative">
        <span className="flex flex-col w-full items-center bg-white p-6 rounded-lg shadow-xl border sticky top-56 right-0">
          <h3 className="text-2xl font-bold mb-5">{`${post.rent_price.toFixed(
            2
          )}€ noche`}</h3>
          <ul className="flex flex-row w-full items-center justify-center border-2 rounded-lg flex-wrap">
            {dateValue && dateValue[0] > 1 ? (
              <li className="px-4 py-2 w-6/12 border-r">
                <p className="text-sm font-semibold">Ida</p>
                <p className="text-sm">{formatDate(dateValue[0])}</p>
              </li>
            ) : (
              <li className="px-4 py-2 w-6/12 border-r">
                <p className="text-sm font-semibold">Ida</p>
                <p className="text-sm">...</p>
              </li>
            )}
            {dateValue && dateValue[1] > 1 ? (
              <li className="px-4 py-2 w-6/12 border-l">
                <p className="text-sm font-semibold">Vuelta</p>
                <p className="text-sm">{formatDate(dateValue[1])}</p>
              </li>
            ) : (
              <li className="px-4 py-2 w-6/12 border-l">
                <p className="text-sm font-semibold">Vuelta</p>
                <p className="text-sm">...</p>
              </li>
            )}
            <li className="flex flex-row items-center w-full gap-2 border-t-2">
              <label className="text-sm font-semibold p-4">
                Viajeros
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
              <button
                onClick={() =>
                  setRooms(
                    rooms >= post.rent_rooms ? post.rent_rooms : rooms + 1
                  )
                }
                className="rounded-full p-1 h-fit bg-white border"
              >
                <AddIcon sx={{ height: "1rem" }} />
              </button>
              <button
                onClick={() => setRooms(rooms <= 0 ? 0 : rooms - 1)}
                className="rounded-full p-1 h-fit bg-white border"
              >
                <RemoveIcon sx={{ height: "1rem" }} />
              </button>
            </li>
          </ul>
          <button
            className="p-6 w-full text-white font-semibold rounded-xl bg-gradient-to-b from-quaternary-inicio to-quaternary-fin mt-5"
            onClick={() => handlePassToPayForm()}
          >
            Reservar
          </button>
          <CostsPc post={post} daysDiff={daysDiff} />
          {error ? (
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert
                variant="outlined"
                severity="warning"
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            </Stack>
          ) : null}
        </span>
      </section>
    </aside>
  );
}
