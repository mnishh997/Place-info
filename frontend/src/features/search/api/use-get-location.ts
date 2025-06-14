import { GOOGLE_MAPS_API_KEY } from "@/constants.ts";
import { useQuery } from "@tanstack/react-query";

type useGetGeocodeProps = {
  locationText: string | null;
  enabled: boolean;
};
const useGetGeocode = ({ locationText, enabled }: useGetGeocodeProps) => {
  const query = useQuery({
    queryKey: ["geocode", locationText],
    queryFn: async () => {
      try {
        if (!locationText) {
          throw new Error("Location is Null")
        }
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          locationText
        )}&key=${GOOGLE_MAPS_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.results?.length > 0) {
          const loc = data.results[0].geometry.location;
          return { lat: loc.lat, lng: loc.lng };
        }
      } catch (err) {
        console.error("Geocoding failed", err);
        throw err;
      }
    },
    enabled,
    staleTime: 0
  });
  return query;
};

export { useGetGeocode };
