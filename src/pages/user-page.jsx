import React, { useEffect, useState, useCallback, useContext } from "react";
import {
  Divider,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Rating,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Main } from "../components/main";
import { getUserRents } from "../services/get-all-rents-by-username";
import { CurrentUserContext } from "../context/auth-context";
import Carousel from "../components/carousel";
import { getAllImages } from "../services/get-all-images";
import { getUserDataService } from "../services/get-user";
import { useLogout } from "../hooks/use-logout";
import { TenantsComents } from "../components/tenants-coments";
import MenuIcon from "@mui/icons-material/Menu";
import { OwnerComents } from "../components/owner-coments";
export function UserPage() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [rents, setRents] = useState([]);
  const [images, setImages] = useState([]);
  const [userToken, setUserToken] = useState();
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState();
  const { userData } = useContext(CurrentUserContext);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const shortDate = dayjs(userToken?.createdAt).format("DD/MM/YYYY");

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (userData !== undefined) {
      setUserToken(userData);
    }
    const fetchUserData = async () => {
      const noTokenUser = await getUserDataService(username);
      setUser(noTokenUser);
    };
    fetchUserData();
  }, [username, userData]);

  const fetchUserRents = useCallback(async () => {
    if (user !== undefined) {
      const result = await getUserRents(user?.username);
      if (result?.status === "ok") {
        setRents(result?.data);

        // Obtener todas las imágenes para cada publicación de forma concurrente
        const promises = result.data.map(async (rent) => {
          const imagesResult = await getAllImages(rent?.rent_id);

          if (imagesResult?.status === "ok") {
            return {
              rentId: rent?.rent_id,
              images: imagesResult?.data?.images,
            };
          }
          return null;
        });

        // Esperar a que todas las promesas se resuelvan
        const imagesData = await Promise.all(promises);

        // Filtrar y eliminar elementos nulos o duplicados
        const uniqueImagesData = imagesData.filter(
          (item, index, self) =>
            item && index === self.findIndex((t) => t?.rentId === item?.rentId)
        );

        // Establecer el estado de imágenes con los datos únicos
        setImages(uniqueImagesData);
      }
    }
  }, [username, userToken, user]);

  useEffect(() => {
    if (userToken !== undefined && user !== undefined) {
      fetchUserRents();
    }
  }, [userToken, user]);

  const handleLogOut = () => {
    localStorage.setItem("sawReservations", JSON.stringify([]));
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && event.target.closest(".mobile-menu-container") === null) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showMenu, setShowMenu]);

  const logout = useLogout();
  return (
    <Main>
      <article className="flex w-full max-w-screen-2xl">
        <section className="flex flex-col w-full pb-10 md:flex-row border-b">
          <span className="flex flex-row w-full justify-between items-start mb-12 md:hidden">
            {userToken?.username !== user?.username ? null : (
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={`flex flex-col absolute top-4 right-4 h-10 px-3 py-6 gap-2 border rounded-full justify-center items-center bg-white z-20 shadow-md mobile-menu-container`}
              >
                <MenuIcon sx={{ fontSize: "1.5rem", color: "dark-gray" }} />

                {showMenu && (
                  <Paper
                    sx={{ width: "15rem", borderRadius: "20px" }}
                    className="absolute top-14 right-10 z-0 drop-shadow-lg"
                  >
                    <MenuList dense>
                      <MenuItem
                        onClick={() =>
                          navigate(`/users/${userToken?.username}/update`)
                        }
                      >
                        <ListItemText>Editar perfil</ListItemText>
                      </MenuItem>
                      <MenuItem onClick={() => navigate("/valorations")}>
                        <ListItemText>Tus Reservas y valoraciones</ListItemText>
                      </MenuItem>

                      <Divider />
                      <MenuItem onClick={() => navigate("/users-valorations")}>
                        <ListItemText>Alertas de reservas</ListItemText>
                      </MenuItem>
                      <MenuItem onClick={() => navigate("/rent-create")}>
                        <ListItemText>Publica tu vivienda</ListItemText>
                      </MenuItem>
                      <MenuItem onClick={() => handleLogOut()}>
                        <ListItemText>
                          <strong>Cerrar sesión</strong>
                        </ListItemText>
                      </MenuItem>
                    </MenuList>
                  </Paper>
                )}
              </button>
            )}
          </span>
          <span
            className="flex flex-col bg-white rounded-lg shadow-md p-5 md:w-2/5 md:min-w-72 md: max-h-96"
            style={{
              position: "relative",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              className="w-32 h-32 rounded-full mx-auto object-cover"
              src={
                user?.profilePic
                  ? user?.profilePic
                  : "/users/default_avatar.png"
              }
              alt={"Foto de " + user?.username}
            />

            <h2 className="text-center text-2xl font-semibold mt-3">
              {user?.username}
            </h2>
            <h3 className="text-center text-gray-600 mt-1">
              {user?.avg_rating ? (
                <span className="flex align-middle justify-center">
                  <Rating value={parseFloat(user?.avg_rating)} readOnly />
                  <p>({user?.avg_rating})</p>
                </span>
              ) : (
                "Sin valoraciones"
              )}
            </h3>

            <span className="flex justify-center mt-5">
              <p>Usuario desde: {shortDate}</p>
            </span>
          </span>

          <section className="flex flex-col px-10 w-full pt-4">
            <h2 className="text-3xl font-bold text-center mt-5 md:text-start">{`Información de ${user?.username}`}</h2>
            {userToken?.username !== user?.username ? null : (
              <span className="flex flex-row gap-5">
                <button
                  onClick={() => navigate(`/users/${user?.username}/update`)}
                  className="hidden md:flex md:flex-col md:items-center md:text-xs md:mt-5 md:font-semibold md:justify-center md:w-full md:border md:border-black md:p-2 md:rounded-lg md:min-w-28 md:max-w-28 md:w-2/5"
                >
                  Editar tu perfil
                </button>
              </span>
            )}
            <ul className="flex flex-col mt-5 gap-5">
              {user ? (
                user?.bio?.length || user?.address?.length !== 0 ? (
                  <React.Fragment>
                    {user?.address && user?.address.length !== 0 && (
                      <li className="flex flex-row gap-2">
                        <LocationOnIcon />
                        <p>{user?.address}</p>
                      </li>
                    )}
                    {user?.bio && user?.bio.length !== 0 && <p>{user?.bio}</p>}
                  </React.Fragment>
                ) : (
                  <p>
                    Aún no se han añadido datos en tu perfil,{" "}
                    <Link
                      to={`/users/${user?.username}/update`}
                      className="underline font-semibold"
                    >
                      haz click aquí
                    </Link>
                    .
                  </p>
                )
              ) : null}
            </ul>
          </section>
        </section>
      </article>
      <h2 className="text-3xl font-bold text-center pt-3 mt-3 pb-5 md:pt-0">
        Mis Alojamientos
      </h2>
      <section className="flex flex-col mb-3 w-full justify-center items-center md:w-10/12 lg:w-6/12">
        <ul className="flex flex-row flex-wrap basis-2 w-full justify-center items-center gap-3 max-w-screen-2xl md:flex-nowrap">
          {rents.length !== 0 ? (
            rents?.map((rent) => {
              // Filtrar las imágenes correspondientes a la renta actual
              const rentImages =
                images.find((item) => item.rentId === rent.rent_id)?.images ||
                [];

              return (
                <li
                  key={rent.rent_id}
                  className="flex flex-col items-center w-full"
                >
                  <Carousel
                    images={rentImages?.length !== 0 ? rentImages : null}
                    rent={rent}
                  />
                </li>
              );
            })
          ) : (
            <li className="flex flex-col items-center w-full h-full">
              <p>Este usuario no ha subido ningún post todavía.</p>
            </li>
          )}
        </ul>
      </section>
      <section className="flex flex-col w-full items-center justify-center mt-8">
        <TenantsComents user={user} />
        <OwnerComents user={user} />
      </section>
    </Main>
  );
}
