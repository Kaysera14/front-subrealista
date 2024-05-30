import dayjs from "dayjs";
import { CostsPc } from "./costs-pc";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate, useParams } from "react-router-dom";
import { postReserve } from "../services/post-reserve";

export function PaymentGateway({
  payActive,
  setPayActive,
  post,
  dateValue,
  rooms,
  daysDiff,
  images,
  setSuccess,
  setError,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  function formatDate(date) {
    return dayjs(date).format("MMM-DD");
  }

  function formatDateBack(date) {
    return dayjs(date).format("YYYY-MM-DD");
  }

  async function handlePayData(e) {
    e.preventDefault();
    try {
      const jsonData = {
        rental_start: formatDateBack(dateValue[0]),
        rental_end: formatDateBack(dateValue[1]),
      };

      if (jsonData) {
        await postReserve(id, jsonData);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setSuccess(
        "Reserva realizada con éxtio, el anfitrión aceptará su petición en menos de 48/hrs"
      );
      navigate("/");
    }
  }

  return rooms &&
    post &&
    dateValue.length !== 0 &&
    payActive &&
    images.length !== 0 ? (
    <section className="flex flex-col relative w-full overflow-scroll my-8 md:max-w-[75rem] md:py-8 md:h-full md:overflow-hidden">
      <button
        className="flex flex-col items-center justify-center absolute left-5 top-0 border rounded-full p-2 shadow-sm md:top-10 md:left-0"
        onClick={() => setPayActive(!payActive)}
      >
        <ArrowBackIosNewIcon />
      </button>
      <section className="flex flex-col items-center justify-center bg-white md:max-w-[75rem] h-full mt-20">
        <section className="flex flex-col items-center md:flex-row md:gap-24">
          {daysDiff && (
            <aside className="flex flex-col w-9/12 md:w-6/12">
              <h2 className="font-semibold text-2xl pl-6">Tu viaje</h2>
              <CostsPc post={post} daysDiff={daysDiff} />
            </aside>
          )}
          <aside className="flex flex-col gap-4 w-9/12 md:w-6/12 border rounded-xl p-8 shadow-md md:flex-row">
            <img
              src={images[0].rent_image}
              alt="rentImage"
              className="w-full h-fit rounded-md object-object-cover md:aspect-square md:w-6/12"
            />
            <span className="w-full">
              <h3 className="font-semibold text-lg">{post.rent_title}</h3>
              <span className="flex flex-col text-sm mt-2 md:px-2">
                <p>Vivienda: {post.rent_type}</p>
                <p>Localización: {post.rent_location}</p>
                <p>Habitaciones: {post.rent_rooms}</p>
                <p className="border w-full mt-4" />
                <p className="mt-4">Anfitrion: {post.rent_owner}</p>
                <p className="mt-2">{`Ida: ${formatDate(dateValue[0])}`}</p>
                <p>{`Vuelta: ${formatDate(dateValue[1])}`}</p>
              </span>
            </span>
          </aside>
        </section>
        <button
          className="p-6 w-10/12 text-white font-semibold rounded-xl bg-gradient-to-b from-quaternary-inicio to-quaternary-fin mt-16 md:w-[10rem] md:self-end"
          onClick={(e) => handlePayData(e)}
        >
          Reservar
        </button>
      </section>
    </section>
  ) : null;
}
