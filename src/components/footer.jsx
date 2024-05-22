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

  return (
    <footer
      className={`px-5 static bottom-0 pb-16 z-0 w-full bg-[var(--secondary-color)] md:pb-0 md:px-0 ${
        location.pathname === "/" ||
        location.pathname === "/register" ||
        location.pathname === `/users/${username}` ||
        location.pathname === `/users/${usernameUpdate}/update` ||
        location.pathname.includes("/rent/") ||
        location.pathname.includes("/valorations")
          ? "static"
          : "fixed bottom-0"
      }`}
    >
      {/*Apartado about, privacidad, condiciones de uso*/}
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
