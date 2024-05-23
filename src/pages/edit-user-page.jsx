import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Main } from "../components/main";
import { Link } from "react-router-dom";
import { UserEditForm } from "../forms/user-edit-form";
import { validateField, modifyUserSchema } from "../utils/joi-validation";
import { updateUser } from "../services/update-user";
import { Alert, Stack } from "@mui/material";
import { getUserDataService } from "../services/get-user";
import { getCurrentUserFromLocalStorage } from "../utils/get-current-user";
import { useLogin } from "../hooks/use-login";

export function EditUserPage() {
  const navigate = useNavigate();
  const { username } = useParams();
  const setCurrentUserToken = useLogin();
  const [validationErrors, setValidationErrors] = useState("");
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    bio: "",
  });

  const token = localStorage.getItem(
    import.meta.env.VITE_APP_CURRENT_USER_STORAGE_ID
  );

  // Carga inicial de los datos del usuario
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (username) {
          const data = await getUserDataService(username);
          if (data?.length !== 0) {
            setUserData(data);
            setFormData({
              username: data?.username,
              email: data?.email,
              address: data?.address,
              bio: data?.bio,
              profilePic: data?.profilePic,
            });
          }
        }
        setIsLoading(false);
      } catch (error) {
        setError("Error al cargar los datos del usuario");
        setIsLoading(false);
      }
    };
    fetchData();
  }, [username, localStorage.getItem("userToken")]);

  // Manejo de cambios en el formulario y validación
  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === null ? "" : value,
    }));
    const error = validateField(name, value, modifyUserSchema);
    setValidationErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Enviar los datos actualizados
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      formDataToSend.append(
        "username",
        formData.username === null ? "" : formData.username
      );
      formDataToSend.append(
        "email",
        formData.email === null ? "" : formData.email
      );
      formDataToSend.append(
        "address",
        formData.address === null ? "" : formData.address
      );
      formDataToSend.append("bio", formData.bio === null ? "" : formData.bio);

      if (selectedImage) {
        formDataToSend.append(
          "profilePic",
          selectedImage === undefined ? null : selectedImage
        );
      }

      const data = await updateUser(userData.username, formDataToSend, token);

      if (data && data.status === "ok") {
        localStorage.setItem("userToken", data?.newToken);
        setCurrentUserToken(data?.newToken);
      }

      navigate(`/users/${data?.data?.tokenPayLoad?.newUsername}`);
    } catch (error) {
      setError("Error al actualizar el usuario");
    }
  };

  if (isLoading) return <Main>Loading...</Main>;

  return (
    <Main>
      <section className="flex flex-col justify-evenly items-center w-full md:h-[77vh]">
        <h1 className="text-4xl block self-center">Edita tu cuenta</h1>
        <UserEditForm
          setSelectedImage={setSelectedImage}
          formData={formData}
          handleInputChange={handleInputChange}
          validationErrors={validationErrors}
          handleSubmit={handleSubmit}
        />
        {error?.length !== 0 && (
          <Stack
            sx={{
              width: "60%",
              position: "static",
              zIndex: "20",
              backgroundColor: "white",
              paddingTop: "1rem",
            }}
            spacing={2}
          >
            <Alert
              variant="outlined"
              severity="warning"
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          </Stack>
        )}
        <p className="flex justify-center gap-2 mt-4">
          ¿Necesitas volver?
          <Link
            to={`/users/${username}`}
            style={{ color: "var(--quaternary-color)" }}
          >
            Volver al perfil
          </Link>
        </p>
      </section>
    </Main>
  );
}
