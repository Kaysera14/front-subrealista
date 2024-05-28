import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { getUserDataService } from "../services/get-user";
import { useNavigate } from "react-router-dom";
import NewReleasesOutlinedIcon from "@mui/icons-material/NewReleasesOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import "./user-reservations.css";
import { manageRentals } from "../services/mange-rentals-status";
import { getUsersRentals } from "../services/get-other-users-rentals";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { deleteRental } from "../services/delete-rental-id";
import { Main } from "../components/main";

export const UsersReservations = () => {
  const [user, setUser] = useState([]);
  const [username, setUserName] = useState([]);
  const [changuedStatus, setChanguedStatus] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [pendingReservations, setPendingReservations] = useState();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function formatDate(date) {
    return dayjs(date).format("MMM-DD");
  }

  const handleManageStatus = (id, status) => {
    const fetchStatus = async () => {
      await manageRentals(id, status);
    };
    setChanguedStatus(true);
    fetchStatus();
  };

  useEffect(() => {
    const fetchUsersReservationsData = async () => {
      const data = await getUsersRentals();
      if (data.status === "ok") {
        const reservationsFilterDeleteds = data.data.filter(
          (reservation) => reservation.rental_deleted === 0
        );
        if (reservationsFilterDeleteds) {
          setReservations(reservationsFilterDeleteds);
        }

        const pending = data.data.filter(
          (reservation) => reservation.rental_status === "Pendiente"
        );
        setPendingReservations({
          ...pendingReservations,
          pendingRentsNumber: pending.length,
          pendingRentsArray: pending,
        });
      }
    };
    fetchUsersReservationsData();
    setChanguedStatus(false);
  }, [reservations?.length, changuedStatus]);

  useEffect(() => {
    const fetchUsernames = () => {
      if (reservations.length > 0) {
        const names = reservations.map(
          (reservation) => reservation.rental_tenant
        );

        setUserName(names);
      }
    };

    fetchUsernames();
  }, [reservations]);

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

  const handleDeleteRental = async (reservation) => {
    try {
      const newReservetions = reservations.filter(
        (reserve) => reserve.rental_id === reservation.rental_id
      );
      setReservations(newReservetions);
      await deleteRental(reservation.rental_id);
    } catch (error) {
      console.error(error);
    }
  };

  return user && reservations?.length !== 0 ? (
    <Main>
      <section className="flex flex-col w-full items-center  max-w-full min-h-[65vh] h-[65vh] md:my-8 md:justify-center md:my-0">
        <h2 className="text-center font-bold text-xl mt-8 mb-8 md:text-2xl md:fixed md:top-24">
          Reservas realizadas por los usuarios
        </h2>
        <ul className="custom-scrollbar flex flex-col w-full items-center min-h-[100%] max-h-[100%] justify-start p-4 gap-4 overflow-y-scroll overflow-x-hidden md:w-8/12 md:min-w-[45rem] md:gap-8 md:mt-8 md:max-h-[55vh] md:min-h-[55vh]">
          {reservations?.map((reservation, index) => {
            return (
              <li
                key={reservation.rental_id}
                className="flex flex-col w-full relative h-full items-center bg-orange-50 py-4 px-4 justify-between md:w-[85%] md:flex-row md:items-start md:h-fit"
              >
                <aside className="flex flex-col w-full md:w-fit md:h-full">
                  <h3 className="text-lg font-bold mb-4 md:text-xl">{`${reservation.rent_title} - ${reservation.rent_location}`}</h3>

                  <span className="flex flex-row">
                    <img
                      className="w-28 aspect-square object-cover md:w-32"
                      src={reservation.rent_cover}
                      alt={reservation.rent_title}
                    />
                    <span className="flex flex-col gap-2 mt-4 pl-6 md:gap-2 md:pl-6">
                      <p>{reservation.rent_description}</p>

                      <p className="font-semibold">
                        {`${formatDate(
                          reservation.rental_start
                        )} - ${formatDate(reservation.rental_end)}`}
                      </p>
                      <button
                        className="flex flex-row w-fit items-center bg-white p-4 rounded-full shadow-md gap-4"
                        onClick={() =>
                          navigate(`/users/${reservation?.rental_tenant}`)
                        }
                      >
                        <img
                          src={
                            user &&
                            user[index]?.profilePic !== (undefined || null) &&
                            user[index]?.profilePic?.length !== 0
                              ? user[index]?.profilePic
                              : "/users/default_avatar.png"
                          }
                          alt={`${user?.username}`}
                          className="rounded-full w-12 aspect-square object-cover"
                        />
                        <p className="font-medium">{`${reservation?.rental_tenant}`}</p>
                      </button>
                    </span>
                  </span>
                </aside>

                <aside className="flex flex-col w-full relative mt-4 relative md:w-fit md:mt-0 md:h-full md:items-start md:justify-start">
                  {isMobileView ? (
                    <aside
                      className={`flex flex-row w-full justify-between ${
                        reservation.rental_status === "Pendiente" ? "mb-10" : ""
                      }`}
                    >
                      <span className="flex flex-row gap-2 self-start">
                        <p>{reservation.rental_status}</p>
                        {reservation.rental_status === "Pendiente" && (
                          <NewReleasesOutlinedIcon color="warning" />
                        )}
                        {reservation.rental_status === "Aceptado" && (
                          <CheckCircleOutlinedIcon color="success" />
                        )}
                        {reservation.rental_status === "Rechazado" && (
                          <CancelOutlinedIcon color="error" />
                        )}
                      </span>
                      <span
                        className={`flex flex-col text-xl items-end font-bold md:text-2xl ${
                          reservation.rental_status === "Pendiente"
                            ? "mb-10"
                            : "mb-2"
                        }`}
                      >
                        <p>{`${reservation.rent_price}€`}</p>
                      </span>
                    </aside>
                  ) : (
                    <aside className="flex flex-col grow-1 h-full content-evenly">
                      <span
                        className={`flex flex-row gap-2 self-start  grow-1 ${
                          reservation.rental_status !== "Pendiente"
                            ? "mb-[130%]"
                            : "mb-[75%]"
                        }`}
                      >
                        <p>{reservation.rental_status}</p>
                        {reservation.rental_status === "Pendiente" && (
                          <NewReleasesOutlinedIcon color="warning" />
                        )}
                        {reservation.rental_status === "Aceptado" && (
                          <CheckCircleOutlinedIcon color="success" />
                        )}
                        {reservation.rental_status === "Rechazado" && (
                          <CancelOutlinedIcon color="error" />
                        )}
                      </span>
                      <span
                        className={`flex flex-col text-xl items-end font-bold md:text-2xl ${
                          reservation.rental_status !== "Pendiente"
                            ? "mb-0"
                            : "mb-8"
                        }`}
                      >
                        <p>{`${reservation.rent_price}€`}</p>
                      </span>
                    </aside>
                  )}

                  {reservation.rental_status === "Pendiente" && (
                    <span className="flex flex-row absolute w-full mt-8 bottom-0 right-0 gap-4 md:mt-0 md:w-fit md:bottom-0">
                      <button
                        className="flex flex-col w-full text-red-500 font-semibold items-center bg-white p-4 rounded-md shadow-md gap-4 md:w-fit"
                        onClick={() =>
                          handleManageStatus(reservation.rental_id, {
                            rental_status: "Rechazado",
                          })
                        }
                      >
                        Rechazar
                      </button>
                      <button
                        className="flex flex-col w-full text-white font-semibold items-center bg-black p-4 rounded-md shadow-md gap-4 md:w-fit"
                        onClick={() =>
                          handleManageStatus(reservation.rental_id, {
                            rental_status: "Aceptado",
                          })
                        }
                      >
                        Aceptar
                      </button>
                    </span>
                  )}
                </aside>
                {reservation.rental_status === "Rechazado" && (
                  <DeleteOutlineOutlinedIcon
                    color="error"
                    onClick={() => handleDeleteRental(reservation)}
                    sx={{ width: "3rem", height: "3rem" }}
                    className="absolute top-[50%] border shadow-md rounded-md p-2 md:-right-[10%] lg:-right-[9.5%] xl:-right-[8%]"
                  />
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </Main>
  ) : (
    <Main>
      <section className="flex flex-col w-full items-center min-h-[65vh] md:my-8 md:min-h-[68vh] md:justify-center md:my-0">
        <h2 className="text-center font-bold text-xl mt-8 mb-8 md:text-2xl md:fixed md:top-24">
          Reservas realizadas por los usuarios
        </h2>
        <ul className="flex flex-col w-6/12 min-h-[64vh] w-full items-center justify-center p-4">
          <p className="w-full text-center">
            Aún no has recibido ningúna reserva.
          </p>
        </ul>
      </section>
    </Main>
  );
};
