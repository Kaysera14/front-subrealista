import { useEffect, useState } from "react";
import HouseCard from "../components/house-card";
import { Main } from "../components/main";
import { fetchPosts } from "../hooks/fetch-posts";
import SearchIcon from "@mui/icons-material/Search";
import { Alert, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Home({
  filteredPosts,
  setIsOpen,
  isOpen,
  success,
  setSuccess,
}) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const postsData = await fetchPosts(filteredPosts);

      if (postsData) {
        // Filtrar los rent_id únicos
        const uniqueRentIds = new Set(postsData.map((post) => post.rent_id));

        // Filtrar los datos de postData para mantener solo una instancia de cada rent_id
        const uniquePostsData = postsData.filter((post) =>
          uniqueRentIds.has(post.rent_id)
        );
        setPosts(uniquePostsData);
      }
    };

    fetchData();
  }, [filteredPosts, posts?.length]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(768));

  return posts?.length !== 0 ? (
    <Main>
      <section
        className="flex flex-col bg-white fixed top-0 items-center justify-center w-screen mb-5 p-5 border-solid border-b-2 drop-shadow-sm z-10 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <aside className="flex flex-row w-[90%] border-solid border-2 p-2 rounded-full drop-shadow-md bg-white text-black">
          <button className="flex align-center justify-center p-2 rounded-full">
            <SearchIcon className="w-5 h-5 text-black" />
          </button>
          <span className="flex flex-col">
            <h3 className="text-md font-semibold">Cualquier lugar</h3>
            <p className="text-xs">Cualquier semana - añade inquilinos</p>
          </span>
        </aside>
      </section>
      <section className="grid grid-cols-1 gap-5 mt-28 px-2 md:max-w-full md:px-4 md:grid-cols-3 xl:grid-cols-5 mt-24 md:mt-4 md:min-h-full">
        {posts?.map((rent, index) => {
          const rentCover = { rent_image: rent.rent_cover };
          const rentImages = rent?.images?.map((image) => ({
            rent_image: image.rent_image,
          }));

          const allImages = [rentCover, ...rentImages];

          return (
            <HouseCard key={rent.rent_id} rent={rent} images={allImages} />
          );
        })}
      </section>
      {success && success?.length !== 0 ? (
        <Stack
          sx={{
            width: isSmallScreen ? "100%" : "60%",
            position: "fixed",
            zIndex: "60",
            bottom: "0",
            right: "0",
            backgroundColor: "white",
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
    </Main>
  ) : (
    <Main>
      <section
        className="flex flex-col bg-white fixed top-0 items-center justify-center w-screen mb-5 p-5 border-solid border-b-2 drop-shadow-sm z-10 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <aside className="flex  flex-row w-[90%] border-solid border-2 p-2 rounded-full drop-shadow-md bg-white text-black">
          <button className="flex align-center justify-center p-2 rounded-full">
            <SearchIcon className="w-5 h-5 text-black" />
          </button>
          <span className="flex flex-col">
            <h3 className="text-md font-semibold">Cualquier lugar</h3>
            <p className="text-xs">Cualquier semana - añade inquilinos</p>
          </span>
        </aside>
      </section>
      <section className="flex flex-col items-center justify-center min-h-[57vh]">
        <p className="mt-24 ">
          No se han encontrado alquileres con esas características...
        </p>
      </section>
      {success && success?.length !== 0 ? (
        <Stack
          sx={{
            width: isSmallScreen ? "100%" : "60%",
            position: "fixed",
            zIndex: "60",
            bottom: "0",
            right: "0",
            backgroundColor: "white",
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
    </Main>
  );
}
