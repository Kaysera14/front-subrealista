import {
  FormControl,
  Input,
  InputLabel,
  TextareaAutosize,
  TextField,
} from "@mui/material";

export const RentInfo = ({ stepData, setStepData }) => {
  return (
    <section className="flex flex-col w-full items-center justify-evenly">
      <h2 className="font-semibold text-2xl md:text-3xl">
        Añade información básica sobre tu espacio
      </h2>
      <section className="flex flex-row w-full items-start justify-center gap-24">
        <section className="flex flex-col gap-8">
          <FormControl fullWidth>
            <h3 className="font-semibold text-xl mb-2">
              Ponle un título a tu vivienda
            </h3>
            <Input
              aria-label="Título"
              value={stepData.rent_title}
              onChange={(e) =>
                setStepData({ ...stepData, rent_title: e.target.value })
              }
              placeholder="Título de tu vivienda…"
            />
          </FormControl>

          <FormControl fullWidth>
            <h3 className="font-semibold text-xl mb-2">
              Inserta una descripción para tu vivienda
            </h3>
            <Input
              aria-label="Descripción"
              value={stepData.rent_description}
              onChange={(e) =>
                setStepData({ ...stepData, rent_description: e.target.value })
              }
              multiline
              placeholder="Descripción corta acerca de tu vivienda…"
            />
          </FormControl>
        </section>
        <section className="flex flex-col">
          <h3 className="font-semibold text-xl mb-2">
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
              sx={{ width: "2.5rem" }}
              placeholder="Título de tu vivienda…"
            />
          </FormControl>
        </section>
      </section>
    </section>
  );
};
