import {
  FormControl,
  Input,
  InputLabel,
  TextareaAutosize,
  TextField,
} from "@mui/material";

export const RentInfo = ({ stepData, setStepData }) => {
  return (
    <section className="flex flex-col w-full items-center justify-center justify-evenly px-8">
      <h2 className="font-semibold text-center text-2xl md:text-3xl">
        Añade información básica sobre tu espacio
      </h2>
      <section className="flex flex-col w-full items-center justify-center gap-8 md:gap-24 md:items-start md:flex-row">
        <section className="flex flex-col gap-8">
          <FormControl fullWidth>
            <h3 className="font-semibold text-md mb-2 md:text-xl">
              Ponle un título a tu vivienda
            </h3>
            <Input
              aria-label="Título"
              value={stepData.rent_title}
              onChange={(e) =>
                setStepData({ ...stepData, rent_title: e.target.value })
              }
              sx={{
                alignContent: "center",
                input: {
                  textAlign: "center",
                },
              }}
              placeholder="Título de tu vivienda…"
            />
          </FormControl>

          <FormControl fullWidth>
            <h3 className="font-semibold text-md mb-2 md:text-xl">
              Inserta una descripción para tu vivienda
            </h3>
            <Input
              aria-label="Descripción"
              value={stepData.rent_description}
              sx={{
                alignContent: "center",
                ".MuiInputBase-input": {
                  textAlign: "center",
                },
              }}
              onChange={(e) =>
                setStepData({ ...stepData, rent_description: e.target.value })
              }
              multiline
              placeholder="Descripción corta acerca de tu vivienda…"
            />
          </FormControl>
        </section>
        <section className="flex flex-col">
          <h3 className="font-semibold text-md mb-2 md:text-xl">
            ¿Cuántos dormitorios tiene tu vivienda?
          </h3>
          <FormControl fullWidth>
            <Input
              type="number"
              aria-label="Número de dormitorios"
              value={stepData.rent_rooms}
              onChange={(e) =>
                setStepData({
                  ...stepData,
                  rent_rooms: parseInt(e.target.value),
                })
              }
              sx={{
                alignContent: "center",
                input: {
                  textAlign: "center",
                },
              }}
              placeholder="Título de tu vivienda…"
            />
          </FormControl>
        </section>
      </section>
    </section>
  );
};
