import { useEffect, useState } from "react";
import { getTenantsRatings } from "../services/get-tenants-ratings";
import CarouselComents from "./carousel-comments";
import { useParams } from "react-router-dom";
import { getUserDataService } from "../services/get-user";

export function TenantsComents({ post, user }) {
  const [ratings, setRatings] = useState([]);
  const [tenant, setTenant] = useState();
  const { username } = useParams();

  useEffect(() => {
    if (user || post) {
      const fetchTenantsRatingsData = async () => {
        const ratingsData = await getTenantsRatings(
          post ? post.rent_owner : user.username
        );
        if (ratingsData?.status === "ok") {
          setRatings(ratingsData?.data);
        } else {
          console.error(ratingsData?.message);
        }
      };

      fetchTenantsRatingsData();
    }

    const fetchUserData = async () => {
      const allTenants = [];

      if (ratings) {
        for (const rating of ratings) {
          const tenantData = await getUserDataService(rating?.tenant);
          if (tenantData && tenantData?.status === "ok") {
            allTenants.push(tenantData);
          }
        }
      }
      setTenant(allTenants);
    };

    fetchUserData();
  }, [user, post]);

  return ratings && ratings?.length !== 0 ? (
    <aside className="flex flex-col py-6 pb-8 gap-2 bg-[--tertiary-color] rounded-t-md w-full max-w-full md:max-w-[50%]">
      <h3
        className={`text-2xl font-bold mb-5 ${
          username?.length !== 0 ? "pl-6" : ""
        }`}
      >
        {`${
          username?.length > 0
            ? `Valoraciones de ${username}`
            : "Valoraciones de tu anfitrión"
        }`}
      </h3>

      <CarouselComents ratings={ratings} tenant={tenant} />
    </aside>
  ) : (
    <aside className="flex flex-col py-6 pb-8 gap-2 bg-[--tertiary-color] rounded-t-md w-full max-w-full md:max-w-[50%]">
      <h3
        className={`text-2xl font-bold mb-5 ${
          username?.length !== 0 ? "pl-6" : ""
        }`}
      >
        {`${
          username?.length > 0
            ? `Valoraciones de ${username}`
            : "Valoraciones de tu anfitrión"
        }`}
      </h3>

      <p className="text-center">Este usuario todavía no tiene valoraciones</p>
    </aside>
  );
}
