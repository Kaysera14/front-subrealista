import { Apartment, Cottage, Home, House } from "@mui/icons-material";
import { Checkbox, FormControlLabel } from "@mui/material";

export const RentType = ({ stepData, setStepData }) => {
  const handleSelectRentType = (rentType) => {
    setStepData({ ...stepData, rent_type: rentType });
  };
  return (
    <section className="flex flex-col w-full items-center justify-evenly gap-8 mb-8">
      <h2 className="font-semibold text-2xl md:text-3xl">
        Selecciona el tipo de renta
      </h2>
      <ul className="grid grid-cols-2 gird-rows-2 gap-8">
        <li className="flex flex-col items-center justify-center border rounded-md shadow-md p-8">
          <FormControlLabel
            control={
              <Checkbox
                checked={stepData.rent_type === "Casa"}
                onChange={() => handleSelectRentType("Casa")}
                name="Casa"
                icon={<House style={{ color: "#002222" }} />}
              />
            }
            label="Casa"
          />
        </li>
        <li className="flex flex-col items-center justify-center border rounded-md shadow-md p-8">
          <FormControlLabel
            control={
              <Checkbox
                checked={stepData.rent_type === "Apartamento"}
                onChange={() => handleSelectRentType("Apartamento")}
                name="Apartamento"
                icon={<Apartment style={{ color: "#002222" }} />}
              />
            }
            label="Apartamento"
          />
        </li>
        <li className="flex flex-col items-center justify-center border rounded-md shadow-md p-8">
          <FormControlLabel
            control={
              <Checkbox
                checked={stepData.rent_type === "Piso"}
                onChange={() => handleSelectRentType("Piso")}
                name="Piso"
                icon={<Home style={{ color: "#002222" }} />}
              />
            }
            label="Piso"
          />
        </li>
        <li className="flex flex-col items-center justify-center border rounded-md shadow-md p-8">
          <FormControlLabel
            control={
              <Checkbox
                checked={stepData.rent_type === "Chalet"}
                onChange={() => handleSelectRentType("Chalet")}
                name="Chalet"
                icon={<Cottage style={{ color: "#002222" }} />}
              />
            }
            label="Chalet"
          />
        </li>
      </ul>
    </section>
  );
};
