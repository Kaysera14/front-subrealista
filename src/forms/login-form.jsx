import { TextField, Button } from "@mui/material";
import { useState } from "react";

export const LoginForm = ({
  formData,
  validationErrors,
  handleInputChange,
  handleSubmit,
}) => {
  const [overed, setOvered] = useState(false);
  return (
    <section className="flex justify-center w-full md:w-9/12 xl:w-7/12">
      <span className="w-full md:w-9/12 xl:w-7/12 bg-white rounded-lg shadow-md p-5">
        <form onSubmit={handleSubmit} className="flex flex-col mx-auto gap-4">
          <TextField
            label="Correo electrónico"
            type="email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            error={Boolean(validationErrors.email)}
            helperText={validationErrors.email}
          />
          <TextField
            label="Contraseña"
            type="password"
            name="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleInputChange}
            required
            error={Boolean(validationErrors.password)}
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
            Iniciar sesión
          </Button>
        </form>
      </span>
    </section>
  );
};
