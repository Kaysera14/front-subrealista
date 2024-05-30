import { Rating } from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { postRating } from "../services/post-rating";

export function ModalValoracion({
  rent,
  setActiveRentId,
  updateRentalsAndPosts,
}) {
  const [rate, setRate] = useState(0);
  const [comment, setComment] = useState("");

  const handleTouchStart = (e) => {
    const touchX = e.touches[0].clientX;
    const rect = e.target.getBoundingClientRect();
    const fullWidth = rect.width;
    const value = (touchX - rect.left) / fullWidth;
    setRate(value * 5);
  };

  const handleTouchMove = (e) => {
    const touchX = e.touches[0].clientX;
    const rect = e.target.getBoundingClientRect();
    const fullWidth = rect.width;
    const value = (touchX - rect.left) / fullWidth;
    setRate(value * 5);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const jsonData = {
      rating: rate,
      comments: comment,
    };

    if (rent.length !== 0 && jsonData.length !== 0) {
      await postRating(rent.rent_id, jsonData);
    }
    updateRentalsAndPosts();
    setActiveRentId(null);
  }

  return (
    <section className="flex flex-col relative w-10/12 items-center justify-center bg-white rounded-lg p-16 md:w-6/12">
      <button
        onClick={() => setActiveRentId(null)}
        type="button"
        className="fixed bg-white top-2 left-2 flex flex-col justify-center items-center m-2 p-1 rounded-full border border-gray-400"
      >
        <CloseIcon sx={{ width: "1.2rem", height: "1.2rem" }} />
      </button>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col items-center justify-center gap-8 w-full md:w-8/12"
      >
        <label className="flex flex-col font-semibold items-center justify-center w-full">
          Tu valoración
          <Rating
            value={rate}
            name="size-large"
            size="large"
            onChange={(_, newValue) => {
              setRate(newValue);
            }}
            onTouchStart={(e) => handleTouchStart(e)}
            onTouchMove={(e) => handleTouchMove(e)}
            className="mt-4 "
          />
        </label>
        <label className="flex flex-col font-semibold items-center justify-center w-full">
          Escribe tu comentario
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => {
              if (e?.target?.value?.length <= 200) {
                setComment(e?.target?.value);
              }
            }}
            maxLength={200}
            className="border rounded-md mt-4 w-full font-normal"
          />
        </label>
        <button className="flex align-center text-white justify-center bg-gradient-to-b from-quaternary-inicio to-quaternary-fin p-4 rounded-full mx-4">
          Enviar valoración
        </button>
      </form>
    </section>
  );
}
