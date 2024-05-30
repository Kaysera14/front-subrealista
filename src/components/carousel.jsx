import React, { useState } from "react";
import "./carousel.css";
import { useNavigate, useParams } from "react-router-dom";

export default function Carousel({ images, rent }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStartX, setDragStartX] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSetActiveClass = (e) => {
    e.preventDefault();
    e?.target?.parentElement?.parentElement?.parentElement?.children[2]?.classList.add(
      "active"
    );
    e?.target?.parentElement?.parentElement?.parentElement?.children[3]?.classList.add(
      "active"
    );
  };

  const handleSetInactiveClass = (e) => {
    e.preventDefault();
    e?.target?.parentElement?.parentElement?.parentElement?.children[2]?.classList.remove(
      "active"
    );
    e?.target?.parentElement?.parentElement?.parentElement?.children[3]?.classList.remove(
      "active"
    );
  };

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
      return prevIndex === images.length - 1 ? 0 : prevIndex + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      return prevIndex === 0 ? images.length - 1 : prevIndex - 1;
    });
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return id ? (
    <section
      className="carousel-container"
      onMouseMove={(e) => handleSetActiveClass(e)}
      onMouseLeave={(e) => handleSetInactiveClass(e)}
      onTouchStart={(e) => handleDragStart(e)}
      onTouchMove={(e) => handleDragMove(e)}
      onTouchEnd={(e) => handleDragEnd(e)}
    >
      <ul
        className="carousel-inner z-0"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images?.map((image, index) => (
          <li
            className="carousel-item"
            key={index}
            onClick={() => {
              if (id === undefined) navigate(`/rent/${rent.rent_id}`);
            }}
          >
            <img
              className="carousel-img-mobile"
              src={image?.rent_image}
              alt={`Slide ${index + 1}`}
            />
          </li>
        ))}
      </ul>
      <aside className="carousel-dots bottom-2">
        {images?.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active-dot" : ""}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </aside>
      <span className="z-10 carousel-btn prev-btn " onClick={prevSlide}>
        &#10094;
      </span>
      <span className="z-10 carousel-btn next-btn" onClick={nextSlide}>
        &#10095;
      </span>
    </section>
  ) : (
    <section
      className="carousel-container"
      onMouseMove={(e) => handleSetActiveClass(e)}
      onMouseLeave={(e) => handleSetInactiveClass(e)}
      onTouchStart={(e) => handleDragStart(e)}
      onTouchMove={(e) => handleDragMove(e)}
      onTouchEnd={(e) => handleDragEnd(e)}
    >
      <ul
        className="carousel-inner z-0"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images?.map((image, index) => (
          <li
            className="carousel-item"
            key={index}
            onClick={() => {
              if (id === undefined) navigate(`/rent/${rent.rent_id}`);
            }}
          >
            <img
              className="carousel-img"
              src={image?.rent_image}
              alt={`Slide ${index + 1}`}
            />
          </li>
        ))}
      </ul>
      <aside className="carousel-dots bottom-2">
        {images?.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active-dot" : ""}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </aside>
      <span className="z-10 carousel-btn prev-btn " onClick={prevSlide}>
        &#10094;
      </span>
      <span className="z-10 carousel-btn next-btn" onClick={nextSlide}>
        &#10095;
      </span>
    </section>
  );
}
