import { useEffect, useState } from "react";
import { Main } from "../components/main";
import { Link, useNavigate } from "react-router-dom";
import { newUserSchema, validateField } from "../utils/joi-validation";
import { RegistrationForm } from "../forms/registration-form";
import { registerUser } from "../services/register_user";
import { Alert, Stack } from "@mui/material";

export function NewUserPage({ setEmail }) {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [secondPassword, setSecondPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState();

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setEmail(name === "email" ? value : formData.email);

    const validationError = validateField(name, value, newUserSchema);
    setValidationErrors({
      ...validationErrors,
      [name]: validationError,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = newUserSchema.validate(formData, {
      abortEarly: false,
    });

    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });
      setValidationErrors(errors);
      console.error("Error de validación:", errors.details);
      return;
    }
    if (formData?.password === secondPassword) {
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
        "password",
        formData.password === null ? "" : formData.password
      );
      formDataToSend.append(
        "repeatPassword",
        secondPassword === null ? "" : secondPassword
      );

      if (selectedImage) {
        formDataToSend.append("profilePic", selectedImage);
      }

      const registrationSuccessful = await registerUser(formDataToSend);

      if (registrationSuccessful?.status === "ok") {
        navigate("/validate");
      } else {
        setError(registrationSuccessful?.message);
      }
    } else {
      setError("Las contraseñas no coinciden");
    }
  };

  return (
    <Main>
      <section className="flex flex-col w-full items-center justify-center">
        <h1 className="text-4xl block self-center mb-5">Crea tu cuenta</h1>
        <RegistrationForm
          formData={formData}
          handleInputChange={handleInputChange}
          validationErrors={validationErrors}
          handleSubmit={handleSubmit}
          setSecondPassword={setSecondPassword}
          setSelectedImage={setSelectedImage}
        />
        {error ? (
          <Stack
            sx={{
              width: isMobileView ? "100%" : "50%",
              position: "static",
              zIndex: "20",
              bottom: "0",
              right: "0",
              backgroundColor: "white",
              marginTop: "1rem",
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
        ) : null}
        <p className="flex justify-center gap-2 mt-5 mb-4">
          ¿Ya tienes una cuenta?
          <Link to="/login" style={{ color: "var(--quaternary-color)" }}>
            ¡Inicia sesión!
          </Link>
        </p>
      </section>
    </Main>
  );
}
