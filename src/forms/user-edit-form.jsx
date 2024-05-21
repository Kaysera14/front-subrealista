import { TextField, Button } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { CurrentUserContext } from "../context/auth-context";
import { getUserDataService } from "../services/get-user";

export const UserEditForm = ({
  formData,
  validationErrors,
  handleInputChange,
  handleSubmit,
  setSelectedImage,
}) => {
  const [overed, setOvered] = useState(false);
  const [webImage, setWebImage] = useState();
  const { userData } = useContext(CurrentUserContext);
  const fileInputRef = useRef(null);
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserDataService(userData?.username);
      if (data) {
        setUser(data);
      }
    };
    fetchUserData();
  }, [user?.profilePic]);

  const handleChangeImage = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      const newImage = URL.createObjectURL(file);
      setSelectedImage(file);
      setWebImage(newImage);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  return (
    <section className="flex flex-col items-center justify-center w-full md:w-9/12 xl:w-7/12">
      <span className="w-full md:w-9/12 xl:w-7/12 bg-white rounded-lg shadow-md p-5">
        <form onSubmit={handleSubmit} className="flex flex-col mx-auto gap-4">
          <label className="flex flex-col pl-2 text-sm gap-2 mb-6 items-center w-full">
            Foto de perfil
            <input
              type="file"
              id="file-input"
              name="profilePic"
              accept="image/*"
              onChange={handleChangeImage}
              ref={fileInputRef}
              className="hidden"
            />
            <img
              src={webImage || user?.profilePic || "/users/default_avatar.png"}
              alt="Profile image"
              className="w-36 rounded-full aspect-square object-cover"
            />
            <button
              type="button"
              onClick={handleFileClick}
              className="bg-black text-white px-4 py-2 rounded w-8/12"
            >
              Seleccionar imagen
            </button>
          </label>
          <TextField
            label="Nombre de usuario"
            type="text"
            name="username"
            autoComplete="username"
            value={formData.username}
            onChange={handleInputChange}
            error={!!validationErrors.username}
            helperText={validationErrors.username}
          />
          <TextField
            label="Correo electrónico"
            type="email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleInputChange}
            error={!!validationErrors.email}
            helperText={validationErrors.email}
          />
          <TextField
            label="Dirección"
            name="address"
            autoComplete="address"
            value={formData.address}
            onChange={handleInputChange}
          />

          <TextField
            label="Descripción"
            name="bio"
            autoComplete="bio"
            value={formData.bio}
            onChange={handleInputChange}
            className="w-10/12 pl-3"
          />
          <Button
            type="submit"
            sx={{
              backgroundColor: "black",
              color: `${overed ? "black" : "white"}`,
            }}
            onMouseOver={() => setOvered(true)}
            onMouseLeave={() => setOvered(false)}
          >
            Actualizar
          </Button>
        </form>
      </span>
    </section>
  );
};
