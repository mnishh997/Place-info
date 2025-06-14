import { GOOGLE_MAPS_API_KEY } from "@/constants.ts";
import { useQuery } from "@tanstack/react-query";

type useGetCurrentConditions = {
  lat: number;
  lng: number;
  enabled: boolean;
};

export const useGetCurrentConditions = ({
  enabled,
  lat,
  lng,
}: useGetCurrentConditions) => {
  const query =  useQuery({
    queryKey: ["currentconditions", lat, lng],
    queryFn: async ({queryKey: [_key, lat, lng]}) => {
      try {
        console.log("inside query",lat, lng)
        const url = `https://weather.googleapis.com/v1/currentConditions:lookup?key=${GOOGLE_MAPS_API_KEY}&location.latitude=${lat}&location.longitude=${lng}`;
        const res = await fetch(url);
        const data = await res.json();
        return data;
      } catch (err) {
        console.error("Current Conditions API error:", err);
        throw err;
      }
    },
    enabled,
  });

  return query
};
