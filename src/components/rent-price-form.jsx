import { Input } from "@mui/material";

import { useEffect, useState } from "react";

export const RentPriceForm = ({ setStepData, stepData }) => {
  /* console.log(stepData); */

  const [basePrice, setBasePrice] = useState(
    stepData.basePrice !== undefined ? stepData.basePrice : 0
  );
  const commision = basePrice !== 0 ? (basePrice * 28) / 100 : 0;
  const totalPrice = basePrice !== 0 ? basePrice + (basePrice * 28) / 100 : 0;

  /* console.log(parseFloat(basePrice)); */

  useEffect(() => {
    if (!isNaN(totalPrice)) {
      setStepData({
        ...stepData,
        rent_price: totalPrice,
        basePrice: basePrice,
        commision: commision,
      });
    }
  }, [totalPrice, basePrice]);

  const handleBasePrice = (e) => {
    let value = e.target.value;

    // Eliminar ceros a la izquierda
    if (value.startsWith(0) && value.length > 1) {
      value = value.replace(/^0+/, "");
    }

    if (value === "") {
      setBasePrice(0);
    } else {
      setBasePrice(parseFloat(value));
    }
  };

  return (
    <section className="flex flex-col w-full items-center justify-evenly">
      <h2 className="font-semibold text-2xl md:text-3xl">
        Precio y disponibilidad
      </h2>
      <form className="flex flex-col gap-8 w-6/12 items-center justify-center max-w-fit md:w-8/12">
        <label className="flex flex-col font-semibold w-full">
          Precio Base
          <Input
            type="number"
            aria-label="Precio de la vivienda"
            value={basePrice === 0 ? "" : basePrice}
            onChange={(e) => handleBasePrice(e)}
            placeholder="Precio de tu vivienda…"
            sx={{
              fontSize: { xs: "1rem", md: "2rem" },
              maxWidth: "35rem",
              width: "100%",
              fontWeight: "bold",
              alignContent: "center",
              input: {
                textAlign: "center",
              },
            }}
          />
        </label>
        <label className="flex flex-col font-semibold w-full">
          Comisión
          <Input
            type="number"
            aria-label="Comision"
            value={
              stepData.commision !== 0
                ? parseFloat(stepData.commision)
                : commision
            }
            readOnly={true}
            sx={{
              fontSize: { xs: "1rem", md: "2rem" },
              maxWidth: "35rem",
              fontWeight: "bold",
              alignContent: "center",
              input: {
                textAlign: "center",
              },
            }}
          />
        </label>
        <label className="flex flex-col font-semibold w-full">
          Precio total
          <Input
            type="number"
            aria-label="Precio Total"
            value={
              stepData.rent_price !== 0
                ? parseFloat(stepData.rent_price)
                : totalPrice
            }
            readOnly={true}
            sx={{
              fontSize: { xs: "1.5rem", md: "2rem" },
              maxWidth: "35rem",
              fontWeight: "bold",
              alignContent: "center",
              input: {
                textAlign: "center",
              },
            }}
          />
        </label>
      </form>
    </section>
  );
};

/* Comisión: value={isNaN(commision) ? 0 : commision} */
/* Precio total: value={isNaN(totalPrice) ? 0 : totalPrice} */
