import { useEffect, useState } from "react";
import { Main } from "../components/main";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/use-login";
import { Link } from "react-router-dom";
import { loginUserSchema, validateField } from "../utils/joi-validation";
import { LoginForm } from "../forms/login-form";
import { loginUser } from "../services/post-login-request";
import { Alert, Stack } from "@mui/material";

export function LoginUserPage() {
  const setCurrentUserToken = useLogin();
  const navigate = useNavigate();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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

    const validationError = validateField(name, value, loginUserSchema);
    setValidationErrors({
      ...validationErrors,
      [name]: validationError,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { errorValidation } = loginUserSchema.validate(formData, {
      abortEarly: false,
    });

    if (errorValidation) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });
      setValidationErrors(errors);
      return;
    }

    const token = await loginUser(formData.email, formData.password, setError);
    if (token) {
      setCurrentUserToken(token);
      navigate("/");
    }
  };

  return (
    <Main>
      <section className="flex flex-col h-[65vh] w-full items-center justify-center max-w-full">
        <h1 className="text-4xl block self-center mb-5">Inicia sesión</h1>
        <LoginForm
          formData={formData}
          handleInputChange={handleInputChange}
          validationErrors={validationErrors}
          handleSubmit={handleSubmit}
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
        <p className="flex justify-center gap-2 mt-5">
          ¿No tienes cuenta?
          <Link to="/register" style={{ color: "var(--quaternary-color)" }}>
            ¡Regístrate!
          </Link>
        </p>
      </section>
    </Main>
  );
}
