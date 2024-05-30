import React, { useEffect, useState } from "react";
import "./carousel-valoraciones.css";
import dayjs from "dayjs";
import { Rating } from "@mui/material";
import { createPortal } from "react-dom";
import { ModalValoracion } from "./modal-valoracion";

export default function CarouselValoraciones({
	posts,
	ratings,
	updateRentalsAndPosts,
	rentals,
}) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [activeRentId, setActiveRentId] = useState(null);
	const [dragStartX, setDragStartX] = useState(null);
	const [groupSize, setGroupSize] = useState(window.innerWidth <= 1100 ? 2 : 3);
	const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

	const currentDate = dayjs().toISOString();

	useEffect(() => {
		const handleResize = () => {
			setIsMobileView(window.innerWidth <= 768);
			setGroupSize(window.innerWidth <= 1100 ? 2 : 3);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const handleDragStart = (e) => {
		if (e.type === "touchstart") {
			setDragStartX(e.touches[0].clientX);
		} else {
			setDragStartX(e.clientX);
		}
	};

	const handleDragMove = (e) => {
		if (dragStartX !== null) {
			let clientX;
			if (e.type === "touchmove") {
				clientX = e.touches[0].clientX;
			} else {
				clientX = e.clientX;
			}
			const deltaX = clientX - dragStartX;
			if (deltaX > 50) {
				prevSlide();
				setDragStartX(null);
			} else if (deltaX < -50) {
				nextSlide();
				setDragStartX(null);
			}
		}
	};

	const handleDragEnd = (e) => {
		setDragStartX(null);
	};

	const nextSlide = () => {
		setCurrentIndex((prevIndex) => {
			if (isMobileView) {
				return prevIndex === rentals.length - 1 ? 0 : prevIndex + 1;
			} else {
				const newIndex = prevIndex + groupSize;
				return newIndex >= rentals.length ? 0 : newIndex;
			}
		});
	};

	const prevSlide = () => {
		setCurrentIndex((prevIndex) => {
			if (isMobileView) {
				return prevIndex === 0 ? rentals.length - 1 : prevIndex - 1;
			} else {
				const newIndex = prevIndex === -1 ? 0 : prevIndex - groupSize;
				return newIndex < 0 ? 0 : newIndex;
			}
		});
	};

	const goToSlide = (index) => {
		setCurrentIndex(index);
	};
	function searchPostRatingId(rental) {
		if (rental && ratings) {
			const rating = ratings.find(
				(rating) => rating.renting_id === rental.rental_rent_id
			);
			return rating
				? {
						id: rating.renting_id,
						rating: rating.rating,
						comments: rating.comments,
				  }
				: null;
		}
		return null;
	}

	const numGroups = Math.ceil(posts.length / groupSize); // Calcular el nÃºmero de grupos de tres elementos
	const groupIndexes = Array.from({ length: numGroups }, (_, i) => i);

	const displayedRentals = new Set();

	return isMobileView ? (
		<section className="w-full max-w-full relative overflow-hidden">
			<section
				className="carousel-valoraciones-container"
				onTouchStart={(e) => handleDragStart(e)}
				onTouchMove={(e) => handleDragMove(e)}
				onTouchEnd={(e) => handleDragEnd(e)}
			>
				<ul
					className="carousel-valoraciones-inner z-0"
					style={{ transform: `translateX(-${currentIndex * 100}%)` }}
				>
					{rentals &&
						posts?.map((rent, index) => {
							const rentRating = searchPostRatingId(rent);
							const ratingValue = parseInt(rentRating?.rating);
							const ratingComments = rentRating?.comments;

							const alreadyDisplayed = displayedRentals.has(rent.rent_id);
							if (!alreadyDisplayed && rentRating) {
								displayedRentals.add(rent.rent_id);
							}

							return isNaN(ratingValue) || ratingValue === undefined ? (
								<li
									className={`carousel-valoraciones-item flex flex-col justify-center items-center p-8 ${
										window.innerWidth <= 1100
											? window.innerWidth > 768
												? "max-w-[50%]"
												: "max-w-[100%]"
											: "max-w-[33%]"
									}`}
									key={index}
								>
									{activeRentId === rent.rent_id && (
										<>
											{createPortal(
												<section className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
													<ModalValoracion
														rent={rent}
														setActiveRentId={setActiveRentId}
														updateRentalsAndPosts={updateRentalsAndPosts}
													/>
												</section>,
												document.body
											)}
										</>
									)}
									<aside className="flex flex-col">
										<span className="relative flex flex-col items-center justify-center">
											{rentals[index]?.rental_end <= currentDate && (
												<button
													className="absolute bg-white px-8 py-4 rounded-xl shadow-xl text-xl font-semibold z-50"
													onClick={() => setActiveRentId(rent?.rent_id)}
												>
													Vote
												</button>
											)}
											<img
												src={rent.rent_cover}
												alt={rent.rent_title}
												className={`rounded-3xl aspect-square object-cover ${
													rent.rental_end <= currentDate
														? "filter grayscale"
														: ""
												}`}
											/>
										</span>
										<aside className="flex flex-col pl-2 pt-2">
											<h3 className="font-semibold text-md">
												{rent.rent_title}
											</h3>
											<Rating
												value={ratingValue}
												name="size-medium"
												readOnly
												className="-ml-1"
											/>
											<p className="mt-2">No comments yet</p>
										</aside>
									</aside>
								</li>
							) : (
								<li
									className="carousel-valoraciones-item flex flex-col justify-center items-center p-8"
									key={index}
								>
									<aside className="flex flex-col">
										<span className="relative">
											<img
												src="/val/alreadyVoted.png"
												alt={rent.rent_title}
												className={`rounded-3xl absolute top-0 bottom-0 right-0 left-0 z-10 aspect-square object-cover p-6`}
											/>
											<img
												src={rent.rent_cover}
												alt={rent.rent_title}
												className={`rounded-3xl aspect-square object-cover ${
													!isNaN(ratingValue) ? "filter grayscale" : ""
												}`}
											/>
										</span>
										<aside className="flex flex-col pl-2 pt-2">
											<h3 className="font-semibold text-md">
												{rent.rent_title}
											</h3>
											{!alreadyDisplayed &&
												ratingValue !== undefined &&
												!isNaN(ratingValue) && (
													<>
														<Rating
															value={ratingValue}
															name="size-medium"
															readOnly
															className="-ml-1"
														/>
														<p className="mt-2">{ratingComments}</p>
													</>
												)}
											{alreadyDisplayed && (
												<p className="mt-2">No comments yet</p>
											)}
										</aside>
									</aside>
								</li>
							);
						})}
				</ul>

				<span
					className="carousel-btn prev-valoraciones-btn z-10"
					onClick={prevSlide}
				>
					&#10094;
				</span>
				<span
					className="carousel-btn-val next-valoraciones-btn z-10"
					onClick={nextSlide}
				>
					&#10095;
				</span>
			</section>
			<aside className="carousel-valoraciones-dots">
				{posts &&
					posts?.map((_, index) => (
						<span
							key={index}
							className={`val-dot ${
								index === currentIndex ? "active-dot-val" : ""
							}`}
							onClick={() => goToSlide(index)}
						/>
					))}
			</aside>
		</section>
	) : (
		<section className="w-full max-w-full">
			<section
				className="carousel-comments-container"
				onTouchStart={(e) => handleDragStart(e)}
				onTouchMove={(e) => handleDragMove(e)}
				onTouchEnd={(e) => handleDragEnd(e)}
			>
				<ul
					className="carousel-comments-inner z-0 flex flex-row transition-transform w-full"
					style={{
						transform: `translateX(-${currentIndex * (100 / groupSize)}%)`,
					}}
				>
					{groupIndexes?.map((groupIndex) => (
						<li
							key={groupIndex}
							className={`flex flex-row min-w-full ${
								window.innerWidth <= 1100
									? "justify-center"
									: "justify-auto px-12"
							}`}
						>
							{posts
								.slice(
									groupIndex * groupSize,
									groupIndex * groupSize + groupSize
								)
								.map((rent, index) => {
									const realIndex = groupIndex * groupSize + index;

									const rentRating = rentals?.map((rental) =>
										searchPostRatingId(rental)
									);
									console.log(ratings);
									console.log(rentRating);

									const ratingValue = parseInt(rentRating[realIndex]?.rating);

									const ratingComments = rentRating[realIndex]?.comments;

									return isNaN(ratingValue) &&
										rentRating[realIndex]?.rating === undefined &&
										rentRating[realIndex] === null ? (
										<section
											className={`carousel-reservas-item flex flex-col self-start justify-start items-center py-8 ${
												window.innerWidth <= 1100
													? "max-w-[50%]"
													: "max-w-[33%]"
											}`}
											key={index}
										>
											{activeRentId === rent.rent_id && (
												<>
													{createPortal(
														<section className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
															<ModalValoracion
																rent={rent}
																setActiveRentId={setActiveRentId}
																updateRentalsAndPosts={updateRentalsAndPosts}
															/>
														</section>,
														document.body
													)}
												</>
											)}
											<aside className="flex flex-col">
												<span className="flex flex-col relative items-center justify-center">
													{rentals[realIndex].rental_end <= currentDate &&
													rentals[realIndex].rental_status === "Aceptado" ? (
														<button
															className="absolute bg-white px-4 py-2 rounded-xl shadow-xl z-50"
															onClick={() => setActiveRentId(rent?.rent_id)}
														>
															Vote
														</button>
													) : null}
													<img
														src={rent.rent_cover}
														alt={rent.rent_title}
														className={`rounded-3xl aspect-square object-cover max-w-56 ${
															rent.rental_end <= currentDate
																? "filter grayscale"
																: ""
														}`}
													/>
												</span>
												<aside className="flex flex-col pl-2 pt-2">
													<h3 className="font-semibold text-md">
														{rent.rent_title}
													</h3>
													<Rating
														value={ratingValue}
														name="size-medium"
														readOnly
														className="-ml-1"
													/>
													<p className="mt-2">No comments yet</p>
												</aside>
											</aside>
										</section>
									) : (
										<section
											className={`carousel-reservas-item flex flex-col justify-start items-center py-8 ${
												window.innerWidth <= 1100
													? "max-w-[50%]"
													: "max-w-[33%]"
											}`}
											key={index}
										>
											<aside className="flex flex-col w-min">
												<span className="flex flex-col relative w-min">
													<img
														src="/val/alreadyVoted.png"
														alt={rent.rent_title}
														className={`rounded-3xl absolute top-0 bottom-0 right-0 left-0 z-10 aspect-square object-contain w-[100%]`}
													/>

													<img
														src={rent.rent_cover}
														alt={rent.rent_title}
														className={`rounded-3xl aspect-square object-cover max-w-56 ${
															!isNaN(ratingValue) ? "filter grayscale" : ""
														}`}
													/>
												</span>
												<aside className="flex flex-col pl-2 pt-2">
													<h3 className="font-semibold text-md">
														{rent.rent_title}
													</h3>
													<Rating
														value={ratingValue}
														name="size-medium"
														readOnly
														className="-ml-1"
													/>
													<p className="mt-2 text-sm">{ratingComments}</p>
												</aside>
											</aside>
										</section>
									);
								})}
						</li>
					))}
				</ul>

				{groupIndexes.length > 1 && (
					<>
						<span
							className="carousel-btn prev-valoraciones-btn z-10"
							onClick={prevSlide}
						>
							&#10094;
						</span>
						<span
							className="carousel-btn next-valoraciones-btn z-10"
							onClick={nextSlide}
						>
							&#10095;
						</span>
					</>
				)}
			</section>
		</section>
	);
}
