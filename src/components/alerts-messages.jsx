import { useEffect, useState } from "react";
import { getUserDataService } from "../services/get-user";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

export const AlertMessages = ({ alertsActive, pendingReservations }) => {
  const [user, setUser] = useState([]);
  const [username, setUserName] = useState([]);
  const navigate = useNavigate();

  function formatDate(date) {
    return dayjs(date).format("MMM-DD");
  }

  useEffect(() => {
    const fetchUsernames = () => {
      if (pendingReservations?.pendingRentsArray?.length > 0) {
        const names = pendingReservations?.pendingRentsArray?.map(
          (reservation) => reservation.rental_tenant
        );

        setUserName(names);
      }
    };

    fetchUsernames();
  }, [pendingReservations]);

  useEffect(() => {
    if (username.length !== 0) {
      const fetchUserData = async () => {
        const userDataArray = await Promise.all(
          username?.map(async (name) => {
            const data = await getUserDataService(name);
            return data;
          })
        );
        setUser(userDataArray);
      };

      fetchUserData();
    }
  }, [username]);

  return (
    alertsActive &&
    (pendingReservations?.pendingRentsArray?.length !== 0 ? (
      <section
        className="absolute -top-[8rem] left-12 bg-white p-4 border rounded-md shadow-md z-50 md:top-14 md:right-6 md:left-auto"
        onClick={() => navigate("/users-valorations")}
      >
        <ul className="flex flex-col w-max custom-scrollbar w-max items-center justify-start overflow-y-scroll h-[6rem] md:w-96">
          {pendingReservations?.pendingRentsArray?.map((reservation, index) => {
            return (
              <li
                key={reservation.rental_id}
                className="flex flex-row w-full border h-full items-center bg-orange-50 p-4 justify-between"
              >
                <aside className="flex flex-col">
                  <h3 className="text-md font-bold mb-2">{`${reservation.rent_title} - ${reservation.rent_location}`}</h3>

                  <span className="flex flex-row">
                    <img
                      className="w-10 h-10 aspect-square object-cover"
                      src={reservation.rent_cover}
                      alt={reservation.rent_title}
                    />
                    <span className="flex flex-col pl-2 gap-2 pl-4">
                      <p className="font-semibold">
                        {`${formatDate(
                          reservation.rental_start
                        )} - ${formatDate(reservation.rental_end)}`}
                      </p>

                      <p className="font-medium">{`${reservation?.rental_tenant}`}</p>
                    </span>
                  </span>
                </aside>

                <span className="flex flex-col text-lg ml-8 items-end self-end font-bold md:self-auto md:ml-0">
                  <p>{`${reservation.rent_price}€`}</p>
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    ) : (
      <ul className="absolute -top-36 left-8 bg-white p-4 w-64 border rounded-md shadow-md z-50 md:top-14 md:right-6 md:left-auto">
        <li className="flex flex-row w-full h-full items-center bg-orange-50 py-4 px-8 justify-between">
          <p className="w-full">
            No hay nuevas entradas,
            <a href="/users-valorations">
              {" "}
              haz click aquí para ver todas tus reservas
            </a>
          </p>
        </li>
      </ul>
    ))
  );
};
