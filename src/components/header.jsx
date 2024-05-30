import { useContext, useEffect, useRef, useState } from "react";
import { CurrentUserContext } from "../context/auth-context";
import { HeaderMobile } from "./mobile-header";
import { HeaderPc } from "./pc-header";
import { useLocation } from "react-router-dom";
import { getUsersRentals } from "../services/get-other-users-rentals";
import { getUserDataService } from "../services/get-user";

export function Header({ handleFilteredPosts, isOpen, setIsOpen }) {
  const [active, setActive] = useState(false);
  const [alertsActive, setAlertsActive] = useState(false);
  const { userData } = useContext(CurrentUserContext);
  const [user, setUser] = useState();
  const location = useLocation();
  const searchRef = useRef();
  const isHomePage = location.pathname === "/";
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [pendingReservations, setPendingReservations] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserDataService(userData?.username);
      if (data) {
        setUser(data);
      }
    };
    fetchUserData();
  }, [user?.profilePic, location, userData]);

  useEffect(() => {
    if (userData && userData.username?.length !== 0) {
      const fetchUsersReservationsData = async () => {
        const data = await getUsersRentals();
        if ((data, data.data)) {
          const pending = data.data.filter(
            (reservation) => reservation.rental_status === "Pendiente"
          );

          const localStorageData = JSON.parse(
            localStorage.getItem("sawReservations")
          );

          if (localStorageData !== null && localStorageData?.length !== 0) {
            setPendingReservations({
              ...pendingReservations,
              pendingRentsArray: pending,
              pendingRentsNumber:
                pending.length - localStorageData?.length <= 0
                  ? 0
                  : pending.length - localStorageData?.length,
            });
            return;
          } else {
            setPendingReservations({
              pendingRentsNumber: pending.length,
              pendingRentsArray: pending,
            });
          }
        } else {
          setPendingReservations({
            ...pendingReservations,
            pendingRentsArray: [],
            pendingRentsNumber: 0,
          });
        }
      };
      fetchUsersReservationsData();
    }
  }, [
    pendingReservations?.length,
    localStorage.getItem("sawReservations"),
    user,
  ]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogoClick = () => {
    handleFilteredPosts([]);
    if (searchRef.current) {
      searchRef.current.resetFilters(); // Llamar a la función resetFilters del componente Search
    }
  };

  return isMobile ? (
    <HeaderMobile
      handleFilteredPosts={handleFilteredPosts}
      userData={userData}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      alertsActive={alertsActive}
      setAlertsActive={setAlertsActive}
      user={user}
      pendingReservations={pendingReservations}
      setPendingReservations={setPendingReservations}
      searchRef={searchRef}
      handleLogoClick={handleLogoClick}
    />
  ) : (
    <HeaderPc
      handleFilteredPosts={handleFilteredPosts}
      userData={userData}
      active={active}
      setActive={setActive}
      alertsActive={alertsActive}
      setAlertsActive={setAlertsActive}
      user={user}
      isHomePage={isHomePage && isHomePage}
      pendingReservations={pendingReservations}
      setPendingReservations={setPendingReservations}
      searchRef={searchRef}
      handleLogoClick={handleLogoClick}
    />
  );
}

export default Header;
