import { useLocation } from "react-router-dom";
import LanguageIcon from "@mui/icons-material/Language";

export function Footer() {
  const location = useLocation();

  const getUsernameFromPathname = () => {
    const parts = location.pathname.split("/");
    return parts[parts.length - 1];
  };

  const getUsernameUpdateFromPathname = () => {
    const parts = location.pathname.split("/");
    return parts[parts.length - 2];
  };

  const username = getUsernameFromPathname();
  const usernameUpdate = getUsernameUpdateFromPathname();

  const isStatic =
    [
      "/",
      "/register",
      `/users/${username}`,
      `/users/${usernameUpdate}/update`,
    ].includes(location.pathname) ||
    location.pathname.includes("/rent/") ||
    location.pathname.includes("/rent-create") ||
    location.pathname.includes("/valorations");

  return (
    <footer
      className={`px-5 pb-16 w-full bg-[var(--secondary-color)] md:pb-0 md:px-0 ${
        isStatic ? "static" : "fixed bottom-0"
      }`}
    >
      {/* Apartado about, privacidad, condiciones de uso */}
      <section className="py-5 flex flex-col-reverse gap-7 border-solid border-t-2">
        <nav className="flex items-center justify-start text-xs font-normal md:items-center md:justify-center">
          <span className="flex flex-col gap-x-1 gap-1 md:flex-row md:gap-x-2">
            <p className="py-2">© 2024 Subrealista, Inc.</p>
          </span>
        </nav>
      </section>
    </footer>
  );
}

export default Footer;
