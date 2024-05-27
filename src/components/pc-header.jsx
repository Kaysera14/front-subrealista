import { Link } from "react-router-dom";
import Search from "./search";
import Avatar from "@mui/material/Avatar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountMenu from "./account-menu";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect } from "react";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { AlertMessages } from "./alerts-messages";

export const HeaderPc = ({
  handleFilteredPosts,
  userData,
  active,
  setActive,
  alertsActive,
  setAlertsActive,
  isHomePage,
  user,
  pendingReservations,
  setPendingReservations,
  searchRef,
  handleLogoClick,
}) => {
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
      if (active && event.target.closest(".menu-container") === null) {
        setActive(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [active, setActive]);

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

  return userData === null ? (
    <header className="hidden md:flex md:min-h-min md:w-full md:h-min md:fixed md:bottom-0 md:z-50 md:bg-[var(--primary-color)] md:top-0 md:sticky md:pt-2 md:pb-5 md:border-solid md:border-b-2 md:drop-shadow-sm">
      <nav className="md:flex md:flex-col md:px-20 md:items-center md:h-min md:text-[var(--quintanary-color)] md:text-xs md:gap-y-1">
        <section className="flex flex-row justify-between items-center w-full">
          <Link
            to="/"
            onClick={() => handleLogoClick()}
            className="flex flex-col justify-center items-center h-3/5"
          >
            <img src="/logo/logo.webp" alt="search" className="w-24" />
          </Link>
          <button
            onClick={() => setActive(!active)}
            className={`flex flex-row h-10 px-3 py-6 gap-2 border border-zinc-400 rounded-full justify-center items-center relative bg-white z-20 menu-container ${
              active ? "drop-shadow-lg" : "hover:drop-shadow-lg"
            }`}
          >
            <MenuIcon sx={{ fontSize: "1.5rem" }} />
            <AccountCircleIcon sx={{ fontSize: "2.5rem" }} />
            <AccountMenu active={active} user={userData} />
          </button>
        </section>
        <section
          className={
            isHomePage
              ? "flex flex-col justify-center items-center min-w-[42rem] w-6/12 z-10 pt-5"
              : "hidden"
          }
        >
          <Search handleFilteredPosts={handleFilteredPosts} ref={searchRef} />
        </section>
      </nav>
    </header>
  ) : (
    <header className="min-h-min w-full h-min fixed bottom-0 z-50 bg-[var(--primary-color)] md:top-0 md:sticky md:pt-2 md:pb-5 md:border-solid md:border-b-2 md:drop-shadow-sm">
      <nav className="hidden md:flex md:flex-col md:px-20 md:items-center md:h-min md:text-[var(--quintanary-color)] md:text-xs md:gap-y-1">
        <section className="flex flex-row justify-between items-center w-full">
          <Link
            to="/"
            onClick={() => handleLogoClick()}
            className="flex flex-col justify-center items-center h-3/5"
          >
            <img src="/logo/logo.webp" alt="search" className="w-24" />
          </Link>
          <span className="flex flex-row items-center gap-8 alerts-container">
            <span className="relative" onClick={handleAlertsNotifications}>
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
            <button
              onClick={() => setActive(!active)}
              className={`flex flex-row h-10 px-3 py-6 gap-2 border border-zinc-400 rounded-full justify-center items-center relative bg-white z-20 menu-container ${
                active ? "drop-shadow-lg" : "hover:drop-shadow-lg"
              }`}
            >
              <MenuIcon sx={{ fontSize: "1.5rem" }} />
              <Avatar alt="Foto de perfil" src={user?.profilePic} />
              <AccountMenu active={active} user={user} />
            </button>
          </span>
        </section>
        <section
          className={
            isHomePage
              ? "flex flex-col justify-center items-center min-w-[42rem] w-6/12 z-10 pt-5"
              : "hidden"
          }
        >
          <Search handleFilteredPosts={handleFilteredPosts} ref={searchRef} />
        </section>
      </nav>
    </header>
  );
};
