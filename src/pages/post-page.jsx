import { useContext, useEffect, useState } from "react";
import { getRentData } from "../services/get-rent-data";
import { useNavigate, useParams } from "react-router-dom";
import { getUserDataService } from "../services/get-user";
import dayjs from "dayjs";
import { PcGallery } from "../components/pc-gallery";
import { MobileGallery } from "../components/mobile-gallery";
import { RentData } from "../components/rent-data";
import { RentPrice } from "../components/rent-price";
import { PaymentGateway } from "../components/payment-gateway";
import { Alert, Stack } from "@mui/material";
import { CostsMobile } from "../components/costs-mobile";
import { CurrentUserContext } from "../context/auth-context";
import { Main } from "../components/main";

export function PostPage({ setSuccess, success }) {
  const [post, setPost] = useState();
  const [images, setImages] = useState();
  const [services, setServices] = useState();
  const [rooms, setRooms] = useState(1);
  const [dateValue, setDateValue] = useState([]);
  const [disableDate, setDisableDate] = useState([]);
  const [daysDiff, setDaysDiff] = useState(1);
  const [user, setUser] = useState();
  const [payActive, setPayActive] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [active, setActive] = useState(false);
  const [error, setError] = useState();
  const { user: userLogged } = useContext(CurrentUserContext);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function formatDate(date) {
    return dayjs(date).format("YYYY-MM-DD");
  }

  useEffect(() => {
    try {
      const fetchData = async () => {
        const postData = await getRentData(id);
        setPost(postData?.data?.result);
        setImages(postData?.data?.images);
        setServices(postData?.data?.services);
        if (postData && postData?.data?.rentals) {
          postData?.data?.rentals.map((date) => {
            if (date.rental_status === "Aceptado") {
              const dateStart = formatDate(date.rental_start);
              const dateEnd = formatDate(date.rental_end);
              setDisableDate([
                ...disableDate,
                {
                  dateStart: dateStart,
                  dateEnd: dateEnd,
                },
              ]);
            }
          });

          if (dateValue) {
            const daysDifference = dayjs(dateValue[1]).diff(
              dateValue[0],
              "day"
            );
            setDaysDiff(daysDifference + 1);
          }
        }
      };
      fetchData();
    } catch {
      console.error("Error al cargar los datos del alquiler.");
    }
  }, [id, dateValue]);

  const handlePassToPayForm = () => {
    if (rooms !== 0 && dateValue.length !== 0) {
      if (userLogged !== null) {
        setPayActive(!payActive);
      } else {
        setError("Para poder hacer una reserva necesitas iniciar sesión");
      }
    } else {
      setError("Selecciona al menos una fecha de ida y vuelta");
    }
  };

  useEffect(() => {
    if (post && post.length !== 0) {
      const fetchUserData = async () => {
        const userData = await getUserDataService(post.rent_owner);
        setUser(userData);
      };
      fetchUserData();
    }
  }, [post]);

  return (
    post &&
    (payActive ? (
      <Main>
        <section className="flex flex-col items-center justify-center w-full">
          {dateValue.length !== 0 && (
            <PaymentGateway
              payActive={payActive}
              setPayActive={setPayActive}
              post={post}
              dateValue={dateValue}
              rooms={rooms}
              daysDiff={daysDiff}
              images={images}
              setSuccess={setSuccess}
              setError={setError}
            />
          )}
        </section>
      </Main>
    ) : (
      <Main>
        <section className="flex flex-col items-center justify-center w-full">
          <PcGallery
            images={images}
            active={active}
            setActive={setActive}
            post={post}
          />
          <section className="flex flex-col md:flex-row md:max-w-[1280px] pb-6">
            <MobileGallery images={images} post={post} navigate={navigate} />
            <RentData
              user={user}
              post={post}
              services={services}
              disableDate={disableDate}
              dateValue={dateValue}
              setDateValue={setDateValue}
            />
            <RentPrice
              formatDate={formatDate}
              dateValue={dateValue}
              post={post}
              rooms={rooms}
              setRooms={setRooms}
              daysDiff={daysDiff}
              images={images}
              error={error}
              setError={setError}
              handlePassToPayForm={handlePassToPayForm}
            />
            <CostsMobile
              post={post}
              daysDiff={daysDiff}
              dateValue={dateValue}
              handlePassToPayForm={handlePassToPayForm}
              error={error}
              setError={setError}
              isMobileView={isMobileView}
            />
          </section>
          {isMobileView && error ? (
            <Stack
              sx={{
                width: "60%",
                position: "fixed",
                zIndex: "20",
                bottom: "0",
                right: "0",
                backgroundColor: "white",
              }}
              spacing={2}
            >
              <Alert
                variant="outlined"
                severity="warning"
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            </Stack>
          ) : null}
        </section>
      </Main>
    ))
  );
}
