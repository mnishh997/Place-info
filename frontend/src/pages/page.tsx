import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type KeyboardEventHandler,
} from "react";

import CurrentConditions, {
  CurrentConditionsSkeleton,
} from "../components/CurrentConditions.js";
import Forecast, { ForecastSkeleton } from "../components/Forecast.js";
import Suggestions, { SuggestionSkeleton } from "../components/Suggestions.js";
import "../App.css";
import { useGetGeocode } from "../features/search/api/use-get-location.js";
import { useGetCurrentConditions } from "../features/search/api/use-get-current-conditions.js";
import { useGetWeather } from "../features/search/api/use-get-weather.js";
import { useGetSuggestions } from "../features/search/api/use-get-suggestions.js";
import { Navbar } from "@/components/navbar.js";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader } from "@/components/ui/card.js";
import { Input } from "@/components/ui/input.js";
import { Button } from "@/components/ui/button.js";
import { Search, X } from "lucide-react";
import { MapCard } from "@/components/map-card.js";
import { Map } from "@vis.gl/react-google-maps";

export default function App() {
  const [locationInput, setLocationInput] = useState("");
  const [location, setLocation] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const queryClient = useQueryClient();

  const counter = useRef(0);
  counter.current += 1;
  // console.log("Re-render Count", counter.current);

  const {
    data: coords,

    isLoading: loadingGeocode,
    isSuccess: gotGeocode,
    refetch: refetchGeocode,
  } = useGetGeocode({
    locationText: location,
    enabled: !!location,
  });
  const {
    data: forecast,
    isLoading: loadingForecast,
    isSuccess: gotForecast,
  } = useGetWeather({
    lat: coords?.lat,
    lng: coords?.lng,
    enabled: !!coords,
  });
  const {
    data: curr,
    isLoading: loadingCurr,
    isSuccess: gotCurr,
  } = useGetCurrentConditions({
    lat: coords?.lat,
    lng: coords?.lng,
    enabled: !!coords,
  });

  const {
    data: suggestions,
    isLoading: loadingSuggestions,
    isSuccess: gotSuggestions,
  } = useGetSuggestions({
    enabled: !!forecast,
    hourlySummaries: getSummary(forecast),
  });
  console.log("Loading Suggestions", loadingSuggestions);
  // console.log(coords, curr, forecast, suggestions);
  // const data = useGetGeocode({ locationText: locationInput, enabled: trigger });
  // console.log("data",data);
  // ───────────── EVENT HANDLER ─────────────────
  const handleSearch = async () => {
    setErrorMsg("");
    if (!locationInput.trim()) {
      alert("Please enter a location.");
      return;
    }
    ["currentconditions", "geocode", "suggestion", "weather"].forEach(
      (item) => {
        queryClient.invalidateQueries({ queryKey: [item], exact: false });
        // queryClient.removeQueries({ queryKey: [item], exact: false });
      }
    );
    setLocation(locationInput);
  };

  // Allow pressing Enter to trigger search
  const handleKeyDown: KeyboardEventHandler = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <main className="w-full h-full flex flex-col bg-background overflow-scroll">
      <Navbar />
      {/* <h1>WeatherWise</h1> */}
      <section className="flex flex-col gap-8 px-4 pt-8 pb-24 sm:px-24  transition-all duration-500 overflow-scroll-y grow">
        <div className="flex gap-2 grow basis-full">
          <div className="flex gap-2 w-full items-center justify-center">
            <div className="w-full relative max-w-4xl">
              <Input
                type="text"
                placeholder="Enter location (e.g. New York)"
                className="bg-input h-12 border border-border"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div
                className="hover:bg-primary/20 absolute right-0 top-0 h-8 w-8 flex items-center justify-center rounded-lg m-2 group"
                onClick={() => {
                  setLocation(null);
                  setLocationInput("");
                }}
              >
                <X className="text-primary/50 group-hover:text-primary" />
              </div>
            </div>
            <Button
              onClick={handleSearch}
              className="font-bold size-12"
              variant={"default"}
            >
              <Search />
            </Button>
          </div>
        </div>

        {/* {errorMsg && <div id="errorMsg">{errorMsg}</div>} */}
        <div className="contents lg:grid lg:grid-cols-3 lg:grid-rows-[3_100px] gap-8 basis-0 grow max-h-[700px] pb-8">
          {location !== null && coords && (
            <>
              {gotCurr ? (
                <CurrentConditions
                  data={curr}
                  locationName={location!}
                  className="col-span-1 row-span-2 lg:order-1"
                />
              ) : (
                <CurrentConditionsSkeleton className="col-span-1 row-span-2 lg:order-1" />
              )}
              {gotForecast ? (
                <Forecast
                  forecastHours={forecast.forecastHours}
                  className="col-span-2 row-span-1 lg:order-4 size-full"
                />
              ) : (
                <ForecastSkeleton className="col-span-2 row-span-1 lg:order-4" />
              )}

              {gotSuggestions ? (
                <Suggestions
                  text={suggestions?.join("\n") ?? ""}
                  className="col-span-1 row-span-3 lg:order-3"
                />
              ) : (
                <SuggestionSkeleton className="col-span-1 row-span-3 lg:order-3" />
              )}
              {gotCurr && gotForecast && gotSuggestions ? (
                <div className="lg:col-span-1 lg:row-span-2 lg:order-2 lg:size-full h-96 w-full shrink-0 border p-2 rounded-xl bg-border">
                  <Map
                    defaultCenter={{ lat: -37.8136, lng: 144.9631 }} // Melbourne
                    center={coords}
                    defaultZoom={5}
                    zoom={9}
                    gestureHandling={"greedy"}
                    disableDefaultUI={true}
                    className="w-full h-full rounded-xl"
                    reuseMaps={true}
                    mapId={"YOUR_MAP_ID"} // Essential for Advanced Markers
                  ></Map>
                </div>
              ) : (
                <CurrentConditionsSkeleton className="lg:col-span-1 lg:row-span-2 lg:order-2" />
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

const getSummary = (forecast: any) => {
  if (
    !forecast ||
    !forecast.forecastHours ||
    forecast.forecastHours.length === 0
  ) {
    return;
  }
  const { forecastHours } = forecast;
  const hourlySummaries = forecastHours.map((hour: any) => {
    const time = `${hour.displayDateTime?.hours ?? "??"}:00`;
    const condition = hour.weatherCondition?.description?.text || "Unknown";
    const temp =
      hour.temperature?.degrees !== undefined
        ? `${hour.temperature.degrees}°C`
        : "N/A";
    const humidity =
      hour.relativeHumidity !== undefined ? `${hour.relativeHumidity}%` : "N/A";
    const wind =
      hour.wind?.speed?.value !== undefined
        ? `${hour.wind.speed.value} km/h`
        : "N/A";
    return `${time} - ${condition}, ${temp}, humidity: ${humidity}, wind: ${wind}`;
  });

  return hourlySummaries;
};
