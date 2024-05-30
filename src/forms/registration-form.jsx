import { TextField, Button } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { CurrentUserContext } from "../context/auth-context";
import { getUserDataService } from "../services/get-user";

export const RegistrationForm = ({
  formData,
  validationErrors,
  handleInputChange,
  handleSubmit,
  setSecondPassword,
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
    <section className="flex justify-center w-full md:w-9/12 xl:w-7/12">
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
              src={webImage || "/users/default_avatar.png"}
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
            label="Correo electrónico"
            type="email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            error={!!validationErrors.email}
            helperText={validationErrors.email}
          />
          <TextField
            label="Nombre de usuario"
            name="username"
            autoComplete="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            error={!!validationErrors.username}
            helperText={validationErrors.username}
          />
          <TextField
            label="Contraseña"
            type="password"
            name="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleInputChange}
            required
            error={!!validationErrors.password}
            helperText={validationErrors.password}
          />
          <TextField
            label="Repite la contraseña"
            type="password"
            name="repeatPassword"
            autoComplete="new-password"
            onChange={(e) => setSecondPassword(e.target.value)}
            required
            error={!!validationErrors.password}
            helperText={validationErrors.password}
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
            Registrarse
          </Button>
        </form>
      </span>
    </section>
  );
};
