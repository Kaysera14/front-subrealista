import React, { useEffect, useState } from "react";
import "./carousel-valoraciones.css";
import dayjs from "dayjs";
import { Rating } from "@mui/material";
import { createPortal } from "react-dom";
import { ModalValoracion } from "./modal-valoracion";

export default function CarouselValoraciones({
  posts,
  ratings,
  updateRentalsAndPosts,
  rentals,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeRentId, setActiveRentId] = useState(null);
  const [dragStartX, setDragStartX] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

  const currentDate = dayjs().toISOString();

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
        const newIndex = prevIndex - 1;
        return newIndex < 0 ? posts.length - 1 : newIndex;
      }
    });
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  function searchPostRatingId(rent) {
    if (rent && ratings) {
      const rating = ratings.find(
        (rating) => rating.renting_id === rent.rent_id
      );

      return rating
        ? { rating: rating.rating, comments: rating.comments }
        : null;
    }
    return null;
  }

  const numGroups = Math.ceil(posts?.length / 3); // Calcular el número de grupos de tres elementos
  const groupIndexes = Array.from({ length: numGroups }, (_, i) => i);

  return isMobileView ? (
    <section className="w-full max-w-full relative">
      <section
        className="carousel-valoraciones-container"
        onTouchStart={(e) => handleDragStart(e)}
        onTouchMove={(e) => handleDragMove(e)}
        onTouchEnd={(e) => handleDragEnd(e)}
      >
        <ul
          className="carousel-valoraciones-inner z-0"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {rentals &&
            posts?.map((rent, index) => {
              const rentRating = searchPostRatingId(rent);
              const ratingValue = parseInt(rentRating?.rating);

              const ratingComments = rentRating?.comments;

              return isNaN(ratingValue) || ratingValue === undefined ? (
                <li
                  className="carousel-valoraciones-item flex flex-col justify-center items-center p-8"
                  key={index}
                >
                  {activeRentId === rent.rent_id && (
                    <>
                      {createPortal(
                        <section className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
                          <ModalValoracion
                            rent={rent}
                            setActiveRentId={setActiveRentId}
                            updateRentalsAndPosts={updateRentalsAndPosts}
                          />
                        </section>,
                        document.body
                      )}
                    </>
                  )}
                  <aside className="flex flex-col">
                    <span className="relative flex flex-col items-center justify-center">
                      {rentals[index]?.rental_end <= currentDate && (
                        <button
                          className="absolute bg-white px-8 py-4 rounded-xl shadow-xl text-xl font-semibold z-50"
                          onClick={() => setActiveRentId(rent?.rent_id)}
                        >
                          Vote
                        </button>
                      )}
                      <img
                        src={rent.rent_cover}
                        alt={rent.rent_title}
                        className={`rounded-3xl aspect-square object-cover ${
                          rent.rental_end <= currentDate
                            ? "filter grayscale"
                            : ""
                        }`}
                      />
                    </span>
                    <aside className="flex flex-col pl-2 pt-2">
                      <h3 className="font-semibold text-md">
                        {rent.rent_title}
                      </h3>
                      <Rating
                        value={ratingValue}
                        name="size-medium"
                        readOnly
                        className="-ml-1"
                      />
                      <p className="mt-2">No comments yet</p>
                    </aside>
                  </aside>
                </li>
              ) : (
                <li
                  className="carousel-valoraciones-item flex flex-col justify-center items-center p-8"
                  key={index}
                >
                  <aside className="flex flex-col">
                    <span className="relative">
                      <img
                        src="/val/alreadyVoted.png"
                        alt={rent.rent_title}
                        className={`rounded-3xl absolute top-0 bottom-0 right-0 left-0 z-10 aspect-square object-cover p-6`}
                      />
                      <img
                        src={rent.rent_cover}
                        alt={rent.rent_title}
                        className={`rounded-3xl aspect-square object-cover ${
                          !isNaN(ratingValue) ? "filter grayscale" : ""
                        }`}
                      />
                    </span>
                    <aside className="flex flex-col pl-2 pt-2">
                      <h3 className="font-semibold text-md">
                        {rent.rent_title}
                      </h3>
                      <Rating
                        value={ratingValue}
                        name="size-medium"
                        readOnly
                        className="-ml-1"
                      />
                      <p className="mt-2">{ratingComments}</p>
                    </aside>
                  </aside>
                </li>
              );
            })}
        </ul>

        <span
          className="carousel-btn prev-valoraciones-btn z-10"
          onClick={prevSlide}
        >
          &#10094;
        </span>
        <span
          className="carousel-btn-val next-valoraciones-btn z-10"
          onClick={nextSlide}
        >
          &#10095;
        </span>
      </section>
      <aside className="carousel-valoraciones-dots">
        {posts &&
          posts?.map((_, index) => (
            <span
              key={index}
              className={`val-dot ${
                index === currentIndex ? "active-dot-val" : ""
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
      </aside>
    </section>
  ) : (
    <section className="w-full max-w-full relative">
      <section
        className="carousel-comments-container overflow-hidden"
        onTouchStart={(e) => handleDragStart(e)}
        onTouchMove={(e) => handleDragMove(e)}
        onTouchEnd={(e) => handleDragEnd(e)}
      >
        <ul
          className="carousel-comments-inner z-0 flex flex-row transition-transform w-full"
          style={{ transform: `translateX(-${currentIndex * 33.33}%)` }}
        >
          {groupIndexes?.map((groupIndex) => (
            <li key={groupIndex} className="flex flex-row min-w-full">
              {posts
                .slice(groupIndex * 3, groupIndex * 3 + 3)
                .map((rent, index) => {
                  const realIndex = groupIndex * 3 + index;
                  const rentRating = searchPostRatingId(rent);
                  const ratingValue = parseInt(rentRating?.rating);
                  const ratingComments = rentRating?.comments;

                  return isNaN(ratingValue) || ratingValue === undefined ? (
                    <section
                      className="carousel-valoraciones-item flex flex-col max-w-[33%] justify-center items-center py-8"
                      key={index}
                    >
                      {activeRentId === rent.rent_id && (
                        <>
                          {createPortal(
                            <section className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
                              <ModalValoracion
                                rent={rent}
                                setActiveRentId={setActiveRentId}
                                updateRentalsAndPosts={updateRentalsAndPosts}
                              />
                            </section>,
                            document.body
                          )}
                        </>
                      )}
                      <aside className="flex flex-col">
                        <span className="flex flex-col relative items-center justify-center">
                          {rentals[realIndex].rental_end <= currentDate ? (
                            <button
                              className="absolute bg-white px-4 py-2 rounded-xl shadow-xl z-50"
                              onClick={() => setActiveRentId(rent?.rent_id)}
                            >
                              Vote
                            </button>
                          ) : null}
                          <img
                            src={rent.rent_cover}
                            alt={rent.rent_title}
                            className={`rounded-3xl aspect-square object-cover max-w-56 ${
                              rent.rental_end <= currentDate
                                ? "filter grayscale"
                                : ""
                            }`}
                          />
                        </span>
                        <aside className="flex flex-col pl-2 pt-2">
                          <h3 className="font-semibold text-md">
                            {rent.rent_title}
                          </h3>
                          <Rating
                            value={ratingValue}
                            name="size-medium"
                            readOnly
                            className="-ml-1"
                          />
                          <p className="mt-2">No comments yet</p>
                        </aside>
                      </aside>
                    </section>
                  ) : (
                    <section
                      className="carousel-valoraciones-item flex flex-col max-w-[33%] justify-center items-center py-8"
                      key={index}
                    >
                      <aside className="flex flex-col w-min">
                        <span className="flex flex-col relative w-min">
                          <img
                            src="/val/alreadyVoted.png"
                            alt={rent.rent_title}
                            className={`rounded-3xl absolute top-0 bottom-0 right-0 left-0 z-10 aspect-square object-contain w-[100%]`}
                          />

                          <img
                            src={rent.rent_cover}
                            alt={rent.rent_title}
                            className={`rounded-3xl aspect-square object-cover max-w-56 ${
                              !isNaN(ratingValue) ? "filter grayscale" : ""
                            }`}
                          />
                        </span>
                        <aside className="flex flex-col pl-2 pt-2">
                          <h3 className="font-semibold text-md">
                            {rent.rent_title}
                          </h3>
                          <Rating
                            value={ratingValue}
                            name="size-medium"
                            readOnly
                            className="-ml-1"
                          />
                          <p className="mt-2 text-sm">{ratingComments}</p>
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
              className="carousel-btn prev-valoraciones-btn z-10"
              onClick={prevSlide}
            >
              &#10094;
            </span>
            <span
              className="carousel-btn next-valoraciones-btn z-10"
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
