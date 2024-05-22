import React, { useEffect, useState } from "react";
import "./carousel-reservas.css";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import NewReleasesOutlinedIcon from "@mui/icons-material/NewReleasesOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

export default function CarouselReservas({ posts, rentals }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStartX, setDragStartX] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const currentDate = dayjs().toISOString();

  function formatDate(date) {
    return dayjs(date).format("MMM-DD");
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleDragStart = (e) => {
    if (e.type === "touchstart") {
      setDragStartX(e.touches[0].clientX);
    } else {
      setDragStartX(e.clientX);
    }
  };

  const handleDragMove = (e) => {
    if (dragStartX !== null) {
      let clientX;
      if (e.type === "touchmove") {
        clientX = e.touches[0].clientX;
      } else {
        clientX = e.clientX;
      }
      const deltaX = clientX - dragStartX;
      if (deltaX > 50) {
        prevSlide();
        setDragStartX(null);
      } else if (deltaX < -50) {
        nextSlide();
        setDragStartX(null);
      }
    }
  };

  const handleDragEnd = (e) => {
    setDragStartX(null);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      if (isMobileView) {
        return prevIndex === posts.length - 1 ? 0 : prevIndex + 1;
      } else {
        const newIndex = prevIndex + 1;
        return newIndex >= posts.length ? 0 : newIndex;
      }
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      if (isMobileView) {
        return prevIndex === 0 ? posts.length - 1 : prevIndex - 1;
      } else {
        const newIndex = prevIndex - 1; // Retroceder solo un elemento
        return newIndex < 0 ? posts.length - 1 : newIndex;
      }
    });
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const numGroups = Math.ceil(posts?.length / 3); // Calcular el número de grupos de tres elementos
  const groupIndexes = Array.from({ length: numGroups }, (_, i) => i);

  return isMobileView ? (
    <section className="w-full max-w-full relative">
      <section
        className="carousel-reservas-container"
        onTouchStart={(e) => handleDragStart(e)}
        onTouchMove={(e) => handleDragMove(e)}
        onTouchEnd={(e) => handleDragEnd(e)}
      >
        <ul
          className="carousel-reservas-inner z-0"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {rentals &&
            posts?.map((rent, index) => {
              return (
                <li
                  className="carousel-reservas-item flex flex-col justify-center items-center p-8"
                  key={index}
                >
                  <aside className="flex flex-col relative">
                    {rentals[index].rental_status === "Pendiente" && (
                      <NewReleasesOutlinedIcon
                        color="warning"
                        className="absolute top-2 left-2 shadow-md bg-white rounded-full"
                      />
                    )}
                    {rentals[index].rental_status === "Aceptado" && (
                      <CheckCircleOutlinedIcon
                        color="success"
                        className="absolute top-2 left-2 shadow-md bg-white rounded-full"
                      />
                    )}
                    {rentals[index].rental_status === "Rechazado" && (
                      <CancelOutlinedIcon
                        color="error"
                        className="absolute top-2 left-2 shadow-md bg-white rounded-full"
                      />
                    )}
                    <img
                      src={rent.rent_cover}
                      alt={rent.rent_title}
                      onClick={() => navigate(`/rent/${rent?.rent_id}`)}
                      className={`rounded-3xl aspect-square object-cover ${
                        rentals[index].rental_end < currentDate
                          ? "filter grayscale"
                          : ""
                      }`}
                    />
                    <aside className="flex flex-col pl-2 pt-2">
                      <h3 className="font-semibold text-md">
                        {rent.rent_title}
                      </h3>
                      <p className="text-sm">
                        Ida: {formatDate(rentals[index].rental_start)}
                      </p>
                      <p className="text-sm">
                        Vuelta: {formatDate(rentals[index].rental_end)}
                      </p>
                    </aside>
                  </aside>
                </li>
              );
            })}
        </ul>
        <span
          className="carousel-btn-res prev-res-btn z-10"
          onClick={prevSlide}
        >
          &#10094;
        </span>
        <span
          className="carousel-btn-res next-res-btn z-10"
          onClick={nextSlide}
        >
          &#10095;
        </span>
      </section>
      <aside className="carousel-reservas-dots absolute">
        {posts?.map((_, index) => (
          <span
            key={index}
            className={`res-dot ${
              index === currentIndex ? "active-dot-res" : ""
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </aside>
    </section>
  ) : (
    <section className="w-full max-w-full">
      <section
        className="carousel-reservas-container overflow-hidden"
        onTouchStart={(e) => handleDragStart(e)}
        onTouchMove={(e) => handleDragMove(e)}
        onTouchEnd={(e) => handleDragEnd(e)}
      >
        <ul
          className="carousel-reservas-inner z-0 flex flex-row transition-transform w-full"
          style={{ transform: `translateX(-${currentIndex * 33.33}%)` }}
        >
          {groupIndexes?.map((groupIndex) => (
            <li key={groupIndex} className="flex flex-row min-w-full">
              {posts
                .slice(groupIndex * 3, groupIndex * 3 + 3)
                .map((rent, index) => {
                  const realIndex = groupIndex * 3 + index;

                  return (
                    <section
                      className="carousel-reservas-item flex flex-col max-w-[33%] justify-center items-center py-8"
                      key={index}
                    >
                      <aside className="flex flex-col relative">
                        {rentals[realIndex].rental_status === "Pendiente" && (
                          <NewReleasesOutlinedIcon
                            color="warning"
                            className="absolute top-2 left-2 shadow-md bg-white rounded-full"
                          />
                        )}
                        {rentals[realIndex].rental_status === "Aceptado" && (
                          <CheckCircleOutlinedIcon
                            color="success"
                            className="absolute top-2 left-2 shadow-md bg-white rounded-full"
                          />
                        )}
                        {rentals[realIndex].rental_status === "Rechazado" && (
                          <CancelOutlinedIcon
                            color="error"
                            className="absolute top-2 left-2 shadow-md bg-white rounded-full"
                          />
                        )}
                        <img
                          src={rent.rent_cover}
                          alt={rent.rent_title}
                          onClick={() => navigate(`/rent/${rent.rent_id}`)}
                          className={`rounded-3xl aspect-square object-cover max-w-56 ${
                            rentals[realIndex]?.rental_end <= currentDate
                              ? "filter grayscale"
                              : ""
                          }`}
                        />
                        <aside className="flex flex-col pl-2 pt-2">
                          <h3 className="font-semibold text-md">
                            {rent.rent_title}
                          </h3>
                          <p className="text-sm">
                            Ida: {formatDate(rentals[realIndex]?.rental_start)}
                          </p>
                          <p className="text-sm">
                            Vuelta: {formatDate(rentals[realIndex]?.rental_end)}
                          </p>
                        </aside>
                      </aside>
                    </section>
                  );
                })}
            </li>
          ))}
        </ul>

        {groupIndexes.length > 1 && (
          <>
            <span
              className="carousel-btn-res prev-res-btn z-10"
              onClick={prevSlide}
            >
              &#10094;
            </span>
            <span
              className="carousel-btn-res next-res-btn z-10"
              onClick={nextSlide}
            >
              &#10095;
            </span>
          </>
        )}
      </section>
    </section>
  );
}