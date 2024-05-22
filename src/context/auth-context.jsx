import { createContext, useEffect, useState } from "react";
import { getCurrentUserFromLocalStorage } from "../utils/get-current-user";
import { getUserDataService } from "../services/get-user";

export const CurrentUserContext = createContext(null);
export const CurrentUserUpdateContext = createContext(() => {});

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const handleUser = async () => {
      if (user) {
        const currentUser = await getUserDataService(
          user?.username || user?.newUsername
        );
        setUserData(currentUser);
      } else {
        setUserData(null);
      }
    };
    handleUser();
  }, [user]);

  useEffect(() => {
    setUser(getCurrentUserFromLocalStorage());
    window.addEventListener("storage", (e) => {
      if (e.key === import.meta.env.VITE_APP_CURRENT_USER_STORAGE_ID) {
        setUser(getCurrentUserFromLocalStorage());
      }
    });
  }, []);

  return (
    <CurrentUserContext.Provider value={{ user, userData }}>
      <CurrentUserUpdateContext.Provider value={setUser}>
        {children}
      </CurrentUserUpdateContext.Provider>
    </CurrentUserContext.Provider>
  );
}
