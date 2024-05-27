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
  const [groupSize, setGroupSize] = useState(window.innerWidth <= 1100 ? 2 : 3);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const currentDate = dayjs().toISOString();

  function formatDate(date) {
    return dayjs(date).format("MMM-DD");
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
      setGroupSize(window.innerWidth <= 1100 ? 2 : 3);
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
        return prevIndex === rentals.length - 1 ? 0 : prevIndex + 1;
      } else {
        const newIndex = prevIndex + groupSize;
        return newIndex >= rentals.length ? 0 : newIndex;
      }
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      if (isMobileView) {
        return prevIndex === 0 ? rentals.length - 1 : prevIndex - 1;
      } else {
        const newIndex = prevIndex - groupSize;
        return newIndex < 0 ? rentals.length - 1 : newIndex;
      }
    });
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const numGroups = Math.ceil(posts.length / groupSize); // Calcular el número de grupos de tres elementos
  const groupIndexes = Array.from({ length: numGroups }, (_, i) => i);

  console.log(numGroups, groupIndexes);

  return isMobileView ? (
    <section className="w-full max-w-full relative overflow-hidden">
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
        className="carousel-reservas-container"
        onTouchStart={(e) => handleDragStart(e)}
        onTouchMove={(e) => handleDragMove(e)}
        onTouchEnd={(e) => handleDragEnd(e)}
      >
        <ul
          className="carousel-reservas-inner overflow-x-hidden z-0 flex flex-row transition-transform w-full"
          style={{
            transform: `translateX(-${currentIndex * (100 / groupSize)}%)`,
          }}
        >
          {groupIndexes?.map((groupIndex) => (
            <li
              key={groupIndex}
              className={`flex flex-row min-w-full ${
                window.innerWidth <= 1100 ? "justify-center" : "justify-auto"
              }`}
            >
              {posts
                .slice(
                  groupIndex * groupSize,
                  groupIndex * groupSize + groupSize
                )
                .map((rent, index) => {
                  const realIndex = groupIndex * groupSize + index;

                  return (
                    <section
                      className={`carousel-reservas-item flex flex-col justify-center items-center py-8 ${
                        window.innerWidth <= 1100
                          ? "max-w-[50%]"
                          : "max-w-[33%]"
                      }`}
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
