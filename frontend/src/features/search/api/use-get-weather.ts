import { GOOGLE_MAPS_API_KEY } from "@/constants.ts";
import { useQuery } from "@tanstack/react-query";

type useGetWeatherProps = {
  lat: number;
  lng: number;
  enabled: boolean;
};

const useGetWeather = ({ lat, lng, enabled }: useGetWeatherProps) => {
  return useQuery({
    queryKey: ["weather", lat, lng],
    queryFn: async () => {
      try {
        const url = `https://weather.googleapis.com/v1/forecast/hours:lookup?key=${GOOGLE_MAPS_API_KEY}&location.latitude=${lat}&location.longitude=${lng}`;
        const res = await fetch(url);
        const data = await res.json();
        return data;
      } catch (err) {
        console.error("Weather API error:", err);
        throw err;
      }
    },
    enabled,
  });
};

export { useGetWeather };
