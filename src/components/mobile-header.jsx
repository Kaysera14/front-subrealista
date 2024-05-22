import { Link, useLocation } from "react-router-dom";
import SearchMobile from "./search-mobile";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Avatar from "@mui/material/Avatar";
import { useEffect } from "react";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { AlertMessages } from "./alerts-messages";

export const HeaderMobile = ({
  handleFilteredPosts,
  isOpen,
  setIsOpen,
  userData,
  user,
  alertsActive,
  setAlertsActive,
  pendingReservations,
  setPendingReservations,
  searchRef,
  handleLogoClick,
}) => {
  const location = useLocation();
  const handleAlertsNotifications = () => {
    setPendingReservations({
      ...pendingReservations,
      pendingRentsNumber: 0,
      pendingRentsArray: pendingReservations.pendingRentsArray,
    });

    if (pendingReservations?.pendingRentsArray?.length !== 0) {
      localStorage.setItem(
        "sawReservations",
        JSON.stringify(pendingReservations.pendingRentsArray)
      );

      setPendingReservations({
        ...pendingReservations,
        pendingRentsNumber:
          pendingReservations?.pendingRentsArray?.length -
          pendingReservations?.pendingRentsArray?.length,
      });
    }

    setAlertsActive(!alertsActive);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (alertsActive && event.target.closest(".alerts-container") === null) {
        setAlertsActive(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [alertsActive, setAlertsActive]);

  return (userData === null) | (userData === undefined) ? (
    <header className="min-h-min w-full h-min fixed bottom-0 z-50 border-t bg-[var(--primary-color)] md:hidden md:top-0 md:sticky md:pt-2 md:pb-5 md:border-solid md:border-b-2 md:drop-shadow-sm">
      <ul className="flex flex-row w-screen justify-center items-center h-16 text-[var(--quintanary-color)] text-xs md:hidden">
        <li className="w-24 active:text-[var(--quaternary-color)]   ">
          <Link
            to="/"
            onClick={() => handleLogoClick()}
            className="flex flex-col justify-center items-center h-3/5"
          >
            <SearchIcon className="text-gray" />
            <p className="my-1 font-light">Explorar</p>
          </Link>
        </li>
        <li className="w-24 active:text-[var(--quaternary-color)]" />
        <li className="w-24 active:text-[var(--quaternary-color)]">
          <Link
            to="/login"
            className="w-24 h-full flex flex-col justify-center items-center"
          >
            <AccountCircleOutlinedIcon className="text-gray" />
            <p className="my-1 font-light">Iniciar Sesión</p>
          </Link>
        </li>
      </ul>
      <section className="absolute">
        <SearchMobile
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleFilteredPosts={handleFilteredPosts}
          ref={searchRef}
        />
      </section>
    </header>
  ) : (
    <header className="min-h-min w-full h-min fixed border-t bottom-0 z-50 bg-[var(--primary-color)] md:top-0 md:sticky md:pt-2 md:pb-5 md:border-solid md:border-b-2 md:drop-shadow-sm">
      <ul className="flex flex-row w-screen justify-center items-center h-16 text-[var(--quintanary-color)] text-xs md:hidden">
        {location.pathname === "/" && (
          <span className="absolute bottom-20 left-4 bg-white rounded-full shadow-md flex flex-row items-center gap-8 alerts-container">
            <span
              className=" left-0 relative"
              onClick={handleAlertsNotifications}
            >
              <NotificationsOutlinedIcon
                sx={{ width: "3rem", height: "3rem" }}
                className="border p-2 rounded-full shadow-md z-10"
              />
              {pendingReservations?.length !== 0 &&
                pendingReservations?.pendingRentsNumber !== 0 && (
                  <p className="flex flex-col w-6/12 h-1/12 absolute z-50 -bottom-1 -right-3 bg-red-500 p-1 text-white font-semibold rounded-full items-center justify-center">
                    {pendingReservations?.pendingRentsNumber}
                  </p>
                )}
              <AlertMessages
                alertsActive={alertsActive}
                pendingReservations={pendingReservations}
              />
            </span>
          </span>
        )}
        <li className="w-24 active:text-[var(--quaternary-color)]   ">
          <Link
            to="/"
            onClick={() => handleLogoClick()}
            className="flex flex-col justify-center items-center h-3/5"
          >
            <SearchIcon className="text-gray" />
            <p className="my-1 font-light">Explorar</p>
          </Link>
        </li>
        <li className="w-24 active:text-[var(--quaternary-color)]" />
        <li className="w-24 active:text-[var(--quaternary-color)] ">
          <Link
            to={`/users/${user?.username}`}
            className="w-24 h-full flex flex-col justify-center items-center"
          >
            <Avatar
              alt="Foto de perfil"
              src={user?.profilePic}
              sx={{ width: 24, height: 24 }}
            />
            <p className="my-1 font-light">Perfil</p>
          </Link>
        </li>
      </ul>
      <section className="absolute">
        <SearchMobile
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleFilteredPosts={handleFilteredPosts}
          ref={searchRef}
        />
      </section>
    </header>
  );
};
