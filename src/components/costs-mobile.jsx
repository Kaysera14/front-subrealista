import { Alert, Stack } from "@mui/material";
import dayjs from "dayjs";

export function CostsMobile({
  post,
  dateValue,
  daysDiff,
  handlePassToPayForm,
  setError,
  error,
  isMobileView,
}) {
  function formatDate(date) {
    return dayjs(date).format("MMM-DD");
  }

  const rentPrice = post.rent_price.toFixed(2);
  const totalCost = (
    post.rent_price * daysDiff +
    (post.rent_price * 24) / 100 +
    (post.rent_price * 21) / 100
  ).toFixed(2);

  return (
    <section className="flex flex-row justify-between items-center fixed w-full bottom-0 left-0 bg-white p-2 z-[60] md:hidden border-t shadow-2xl">
      <ul className="flex flex-col">
        <li className="flex flex-row gap-2">
          <p className="font-semibold">Total</p>
          <p className="font-semibold">{`${totalCost}€`}</p>
        </li>
        <li className="flex flex-row w-full justify-between py-1 gap-2">
          <p>{formatDate(dateValue[0])}</p>
          <p>{formatDate(dateValue[1])}</p>
        </li>
      </ul>

      <button
        className="py-5 px-[2%] w-3/12 items-center justify-center text-white font-semibold rounded-xl bg-gradient-to-b from-quaternary-inicio to-quaternary-fin"
        onClick={() => handlePassToPayForm()}
      >
        Reservar
      </button>
      {isMobileView && error ? (
        <Stack
          sx={{
            width: "100%",
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
}
