import React from "react";
import Slider from "@mui/material/Slider";

export function PriceRange({ setPrice, price, activePrice }) {
	function handleChanges(event, newValue) {
		setPrice(newValue);
	}

	const handleInputChange = (index, newValue) => {
		const updatedPrice = [...price];
		updatedPrice[index] = newValue;
		setPrice(updatedPrice);
	};

	return (
		<section
			className={`${
				activePrice ? "flex" : "hidden"
			} flex flex-col w-full bg-white p-12 md:shadow-lg md:rounded-xl md:top-24 md:-right-20 md:absolute md:min-w-60 md:w-max`}
		>
			<Slider
				value={price}
				onChange={handleChanges}
				valueLabelDisplay="auto"
				min={0}
				max={2500}
				sx={{ color: "gray" }}
			/>
			<section className="flex flex-row w-full items-center justify-center gap-5">
				<label className="flex flex-row items-center gap-2 mt-5 ">
					€
					<input
						className="w-[5rem] border text-xs p-2 rounded-md font-normal"
						placeholder="Mínimo €"
						name="min_price"
						id="precioMin"
						onChange={(e) => {
							if (e.target.value > 0) {
								handleInputChange(0, parseInt(e.target.value));
							} else {
								handleInputChange(0, parseInt(0));
							}
						}}
						value={price[0]}
					/>
				</label>
				<label className="flex flex-row items-center gap-2 mt-5">
					€
					<input
						className="w-[5rem] border text-xs p-2 rounded-md font-normal"
						placeholder="Mínimo €"
						name="max_price"
						id="precioMax"
						onChange={(e) => {
							if (e.target.value > 0) {
								handleInputChange(1, parseInt(e.target.value));
							} else {
								handleInputChange(1, parseInt(0));
							}
						}}
						value={price[1]}
					/>
				</label>
			</section>
		</section>
	);
}
