import { useEffect, useState } from "react";
import { Main } from "../components/main";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Alert, Stack } from "@mui/material";
import { ValidateForm } from "../forms/validate-form";
import { userValidate } from "../services/user-validate";

export function Validate({ email, setEmail }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [success, setSuccess] = useState(
    `Se ha enviado un correo con el código de verificación a tu email ${email}`
  );
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    code: searchParams.get("registrationCode") || "",
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
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validateInfo = await userValidate(formData?.code, setError);
    if (validateInfo) {
      setEmail("");
      navigate("/login");
    }
  };

  return (
    <Main>
      <section className="flex flex-col h-screen w-full items-center justify-center">
        <h1 className="text-4xl block self-center mb-5">Intoduce tu código</h1>
        <ValidateForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
        {success ? (
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
              severity="success"
              onClose={() => setSuccess("")}
            >
              {success}
            </Alert>
          </Stack>
        ) : null}
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
      </section>
    </Main>
  );
}
