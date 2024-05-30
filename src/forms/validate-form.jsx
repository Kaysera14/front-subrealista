import { TextField, Button } from "@mui/material";
import { useState } from "react";

export const ValidateForm = ({ formData, handleInputChange, handleSubmit }) => {
  const [overed, setOvered] = useState(false);

  return (
    <section className="flex justify-center w-full md:w-9/12 xl:w-7/12">
      <span className="w-full md:w-9/12 xl:w-7/12 bg-white rounded-lg shadow-md p-5">
        <form onSubmit={handleSubmit} className="flex flex-col mx-auto gap-4">
          <TextField
            label="Código"
            type="text"
            name="code"
            autoComplete="code"
            value={formData.code}
            onChange={handleInputChange}
            required
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
            Enviar
          </Button>
        </form>
      </span>
    </section>
  );
};
