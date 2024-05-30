import { useLocation } from "react-router-dom";

export function Main({ children }) {
  const url = useLocation();

  const location = url?.pathname;

  return (
    <main
      className={`flex flex-col flex-grow items-center ${
        location === "/users-valorations" || "/"
          ? "justify-start"
          : "justify-center"
      }`}
    >
      {children}
    </main>
  );
}
