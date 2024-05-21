import { useRef, useState } from "react";

export const RentImages = ({ setStepData, stepData }) => {
  const fileInputRef = useRef(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [webImages, setWebImages] = useState([]);

  const handleChangeImage = (e) => {
    e.preventDefault();

    if (e.target) {
      console.log(e.target.files);
      const files = e.target.files;
      if (files) {
        const filesArray = Array.from(files);

        const newImages = filesArray.map((file) => URL.createObjectURL(file));

        setSelectedImages([...selectedImages, ...files]);
        setWebImages([...webImages, ...newImages]);

        setStepData({
          ...stepData,
          images: [...selectedImages, ...files],
          webImages: [...webImages, ...newImages],
        });
      }
    }
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  return (
    <section className="flex flex-col w-full items-center justify-evenly">
      <h2 className="font-semibold text-2xl md:text-3xl mb-4">
        Añade algunas imágenes de tu apartamento
      </h2>

      {stepData?.webImages?.length !== 0 && (
        <ul className="grid grid-cols-6 overflow-y-scroll gap-1">
          {stepData?.webImages?.map((image, index) => (
            <li key={index}>
              <img src={`${image}`} alt="rentImage" className="w-48" />
            </li>
          ))}
        </ul>
      )}

      <form className="flex flex-row items-center justify-center mt-4">
        <label>
          <input
            className="custom-file-input hidden"
            type="file"
            id="file-input"
            onChange={handleChangeImage}
            accept="image/*"
            ref={fileInputRef}
            multiple
          />
        </label>
        <button
          type="button"
          className="flex flex-col items-center justify-center bg-black text-white p-4 rounded-md"
          onClick={handleFileClick}
        >
          Añadir imágenes
        </button>
      </form>
    </section>
  );
};
