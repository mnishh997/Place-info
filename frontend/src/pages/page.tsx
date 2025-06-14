import { useEffect, useRef, useState, type KeyboardEventHandler } from "react";

import CurrentConditions from "../components/CurrentConditions.js";
import Forecast from "../components/Forecast.js";
import Suggestions from "../components/Suggestions.js";
import HourlyForecast from "../features/auth/components/hourly-forecast.js"; // Updated import path
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
    isFetchedAfterMount: gotGeocode,
    refetch: refetchGeocode,
  } = useGetGeocode({
    locationText: location,
    enabled: !!location,
  });
  const { data: forecast, isFetchedAfterMount: gotForecast } = useGetWeather({
    lat: coords?.lat,
    lng: coords?.lng,
    enabled: !!coords,
  });
  const { data: curr, isFetchedAfterMount: gotCurr } = useGetCurrentConditions({
    lat: coords?.lat,
    lng: coords?.lng,
    enabled: !!coords,
  });

  const { data: suggestions, isFetchedAfterMount: gotSuggestions } =
    useGetSuggestions({
      enabled: !!forecast,
      hourlySummaries: getSummary(forecast),
    });
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
        queryClient.removeQueries({ queryKey: [item], exact: false });
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
    <>
      <Navbar />
      {/* <h1>WeatherWise</h1> */}
      <section className="flex  flex-col gap-8 px-4 py-12 sm:px-24">
        <div className="flex gap-2 h-12 grow">
          <Input
            type="text"
            placeholder="Enter location (e.g. New York)"
            className="bg-muted h-full"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            onClick={handleSearch}
            className="h-full font-bold"
            variant={"default"}
          >
            Get Weather
          </Button>
        </div>

        {/* {errorMsg && <div id="errorMsg">{errorMsg}</div>} */}
        <div className="contents lg:grid gap-8 lg:grid-cols-2">
          {gotCurr && (
              <CurrentConditions data={curr} locationName={location!} />
          )}
          {gotForecast && (
              <Forecast forecastHours={forecast.forecastHours} />
          )}
          {gotForecast && (
              <HourlyForecast data={formatForecastData(forecast)} />
          )}
          {gotSuggestions && (
              <Suggestions text={suggestions?.join("\n") ?? ""} />
          )}
        </div>
      </section>
    </>
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


const formatForecastData = (forecast: any) => {
  if (!forecast?.forecastHours) return [];
  
  return forecast.forecastHours.map((hour: any) => ({
    time: `${hour.displayDateTime?.hours ?? "??"}:00`,
    icon: hour.weatherCondition?.iconUrl || "/default-weather-icon.png",
    temp: hour.temperature?.degrees ?? "N/A",
    rain: hour.precipitationProbability ?? 0,
    condition: hour.weatherCondition?.description?.text || "Clear" // Add weather condition
  }));
};
