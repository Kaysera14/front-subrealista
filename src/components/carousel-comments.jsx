import React, { useEffect, useState } from "react";
import "./carousel-comments.css";
import { Rating } from "@mui/material";
import { useParams } from "react-router-dom";

export default function CarouselComents({ ratings, tenant }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStartX, setDragStartX] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const { username } = useParams();

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
        return prevIndex === ratings.length - 1 ? 0 : prevIndex + 1;
      } else {
        const newIndex = prevIndex + 3;
        return newIndex >= ratings.length ? 0 : newIndex;
      }
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      if (isMobileView) {
        return prevIndex === 0 ? ratings.length - 1 : prevIndex - 1;
      } else {
        const newIndex = prevIndex - 3;
        return newIndex < 0 ? ratings.length - 1 : newIndex;
      }
    });
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const numGroups = Math.ceil(ratings?.length / 2); // Calcular el número de grupos de tres elementos
  const groupIndexes = Array.from({ length: numGroups }, (_, i) => i);

  return isMobileView && ratings?.length !== 0 ? (
    <section className="relative w-full max-w-full">
      <section
        className="carousel-comments-container"
        onTouchStart={(e) => handleDragStart(e)}
        onTouchMove={(e) => handleDragMove(e)}
        onTouchEnd={(e) => handleDragEnd(e)}
      >
        <ul
          className="carousel-comments-inner z-0"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {ratings &&
            ratings?.map((rating, index) => {
              return (
                <li
                  className="carousel-comments-item flex flex-col w-full justify-center items-center py-8"
                  key={index}
                >
                  <aside
                    className={`flex flex-col bg-white w-fit p-5 rounded-xl shadow-xl ${
                      username?.length > 0 ? "w-7/12" : "w-full"
                    }`}
                  >
                    <span className="flex flex-row items-center gap-2">
                      <img
                        src={`${
                          tenant?.length !== 0 &&
                          (tenant[index].profilePic !== null) | undefined
                            ? tenant[index].profilePic
                            : "/users/default_avatar.png"
                        }`}
                        className="rounded-full w-1/12"
                      />
                      <h3 className="font-semibold text-lg">
                        {rating?.tenant}
                      </h3>
                    </span>
                    <span className="flex flex-col items-center justify-center gap-2">
                      <Rating
                        value={parseFloat(rating?.rating)}
                        name="size-medium"
                        readOnly
                      />
                      <p>{rating.comments}</p>
                    </span>
                  </aside>
                </li>
              );
            })}
        </ul>

        <span
          className="carousel-btn prev-comment-btn z-10"
          onClick={prevSlide}
        >
          &#10094;
        </span>
        <span
          className="carousel-btn next-comment-btn z-10"
          onClick={nextSlide}
        >
          &#10095;
        </span>
      </section>
      <aside className="carousel-comments-dots">
        {ratings &&
          ratings?.map((_, index) => (
            <span
              key={index}
              className={`comments-dot ${
                index === currentIndex ? "active-dot" : ""
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
      </aside>
    </section>
  ) : (
    <section className="relative w-full max-w-full px-6">
      <section
        className="carousel-comments-container overflow-hidden w-full"
        onTouchStart={(e) => handleDragStart(e)}
        onTouchMove={(e) => handleDragMove(e)}
        onTouchEnd={(e) => handleDragEnd(e)}
      >
        <ul
          className="carousel-comments-inner z-0 flex flex-row transition-transform w-full"
          style={{ transform: `translateX(-${currentIndex * 33.33}%)` }}
        >
          {groupIndexes?.map((groupIndex) => (
            <li
              key={groupIndex}
              className="flex flex-row justify-center min-w-[100%] w-[100%] gap-4 "
            >
              {ratings
                .slice(groupIndex * 3, groupIndex * 3 + 3)
                .map((rating, index) => (
                  <section
                    className={`carousel-comments-item-pc flex flex-col justify-center items-center py-8 ${
                      username?.length !== 0 ? "max-w-80" : "max-w-full"
                    }`}
                    key={index}
                  >
                    <aside className="flex flex-col bg-white p-5 gap-3 rounded-xl shadow-xl max-w-[85%]">
                      <span className="flex flex-row items-center gap-2">
                        <img
                          src={`${
                            tenant.length !== 0 &&
                            (tenant[index].profilePic !== null) | undefined
                              ? tenant[index].profilePic
                              : "/users/default_avatar.png"
                          }`}
                          className="rounded-full w-2/12"
                        />
                        <h3 className="font-semibold text-lg">
                          {rating?.tenant}
                        </h3>
                      </span>
                      <span className="flex flex-col items-center">
                        <Rating
                          value={parseFloat(rating.rating)}
                          name="size-medium"
                          readOnly
                        />
                        <p>{rating.comments}</p>
                      </span>
                    </aside>
                  </section>
                ))}
            </li>
          ))}
        </ul>
      </section>
      <aside>
        <span
          className={`carousel-btn z-10 ${
            username?.length > 0 ? "prev-comment-user-btn" : "prev-comment-btn"
          }`}
          onClick={prevSlide}
        >
          &#10094;
        </span>
        <span
          className={`carousel-btn ${
            username?.length > 0 ? "next-comment-user-btn" : "next-comment-btn"
          } z-10`}
          onClick={nextSlide}
        >
          &#10095;
        </span>
      </aside>
      <aside className="carousel-comments-dots">
        {groupIndexes.map((index) => (
          <span
            key={index}
            className={`comments-dot ${
              index === Math.floor(currentIndex / 3) ? "active-dot" : ""
            }`}
            onClick={() => goToSlide(index * 3)}
          />
        ))}
      </aside>
    </section>
  );
}
