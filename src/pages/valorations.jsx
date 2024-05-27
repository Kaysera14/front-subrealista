import { useContext, useEffect, useState } from "react";
import { getMyRentals } from "../services/get-user-rentals";
import { getRentData } from "../services/get-rent-data";
import { Main } from "../components/main";
import { CurrentUserContext } from "../context/auth-context";
import CarouselValoraciones from "../components/carousel-valoraciones";
import { getTenantsRatings } from "../services/get-tenants-ratings";
import CarouselReservas from "../components/carousel-reservas";

export function Valoraciones() {
  const [rentals, setRentals] = useState();
  const [error, setError] = useState({});
  const [posts, setPosts] = useState([]);
  const [ratings, setRatings] = useState();

  const { userData } = useContext(CurrentUserContext);

  // Fetch rentals
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const rentalsData = await getMyRentals();
        if (rentalsData?.status === "ok") {
          setRentals(rentalsData.data);
        } else {
          setError((prevError) => ({
            ...prevError,
            errorRes: rentalsData?.message,
          }));
        }
      } catch (error) {
        console.error("Este usuario no tiene reservas", error);
      }
    };

    if (userData) {
      fetchRentals();
    }
  }, [userData?.username]);

  // Fetch ratings
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        if (userData && userData.username) {
          const ratingsData = await getTenantsRatings(userData.username);
          if (ratingsData?.status === "ok") {
            setRatings(ratingsData.data);
          } else {
            setError((prevError) => ({
              ...prevError,
              errorVal: ratingsData?.message,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching ratings", error);
      }
    };

    fetchRatings();
  }, [userData]);

  // Fetch posts data for rentals
  useEffect(() => {
    const fetchPostDataForRentals = async () => {
      try {
        if (rentals && rentals.length > 0) {
          const postsArray = await Promise.all(
            rentals.map(async (rental) => {
              const postData = await getRentData(rental.rental_rent_id);
              if (postData.status === "ok") {
                return postData.data.result;
              } else {
                setError((prevError) => ({
                  ...prevError,
                  errorRes: "Error en la carga de posts",
                }));
                return null;
              }
            })
          );
          setPosts(postsArray.filter((post) => post !== null));
        }
      } catch (error) {
        console.error("Error fetching post data for rentals", error);
      }
    };

    fetchPostDataForRentals();
  }, [rentals]);

  const updateRentalsAndPosts = async () => {
    try {
      const rentalsData = await getMyRentals();
      if (rentalsData?.status === "ok") {
        setRentals(rentalsData.data);
      }
    } catch (error) {
      console.error("Error updating rentals and posts", error);
    }
  };

  useEffect(() => {
    try {
      const fetchRatings = async () => {
        if (userData && userData.username) {
          const ratingsData = await getTenantsRatings(userData?.username);

          if (ratingsData?.status === "ok") {
            setRatings(ratingsData.data);
          } else {
            setError({
              ...error,
              errorVal: ratingsData?.message,
            });
          }
        }
      };

      fetchRatings();
    } catch {
      console.error(
        "No hay reservas, no se pueden actualizar los datos del usuario hasta que no hayan reservas"
      );
    }
  }, [rentals]);

  useEffect(() => {
    try {
      if (rentals && rentals.length !== 0) {
        const fetchPostDataForRentals = async () => {
          const postsArray = [];
          for (const rental of rentals) {
            const postData = await getRentData(rental.rental_rent_id);
            if (postData.status === "ok") {
              postsArray.push(postData?.data?.result);
            } else {
              setError((prevError) => ({
                ...prevError,
                errorRes: "Error en la carga de posts",
              }));
            }
          }
          setPosts(postsArray);
        };

        fetchPostDataForRentals();
      }
    } catch {
      console.error(
        "No hay reservas, no se pueden actualizar los datos hasta que no haya alguna reserva"
      );
    }
  }, [rentals]);

  return (
    <Main>
      <section className="flex flex-col items-center justify-center py-8">
        <section className="flex flex-col w-full items-center justify-center gap-12 bg-white md:max-w-[75%] md:min-w-[45rem]">
          <aside className="flex flex-col w-full items-center justify-center">
            <h2 className="font-semibold text-2xl pb-2">Reservas</h2>
            {posts?.length !== 0 ? (
              <section className="flex flex-col w-full bg-[--tertiary-color] items-center justify-center rounded-xl md:flex-row">
                <CarouselReservas posts={posts} rentals={rentals} />
              </section>
            ) : (
              <p>{error?.errorRes}</p>
            )}
          </aside>
          <aside className="flex flex-col w-full items-center justify-center">
            <h2 className="font-semibold text-2xl pb-2">Valoraciones</h2>
            {posts?.length !== 0 ? (
              <section className="flex flex-col w-full bg-[--tertiary-color] items-center justify-center rounded-xl md:flex-row">
                <CarouselValoraciones
                  posts={posts}
                  rentals={rentals}
                  ratings={ratings}
                  updateRentalsAndPosts={updateRentalsAndPosts}
                />
              </section>
            ) : (
              <p>{error?.errorVal}</p>
            )}
          </aside>
        </section>
      </section>
    </Main>
  );
}
