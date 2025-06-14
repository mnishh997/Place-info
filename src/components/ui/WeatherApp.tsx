import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Map, Marker } from "@vis.gl/react-google-maps";
import { Search, X, Wind, Droplets, Eye, Gauge, ThermometerSun } from "lucide-react";

// --- Type Definitions for API responses and other data structures ---

interface GeoLocation {
  lat: number;
  lng: number;
}

interface CurrentWeather {
  temperature: { degrees: number };
  weatherCondition: { description: { text: string } };
  feelsLikeTemperature: { degrees: number };
  wind: { speed: { value: number } };
  relativeHumidity: number;
  visibility?: { value: number };
  pressure?: { value: number };
  dewPoint?: { degrees: number };
}

interface ForecastHour {
  displayDateTime: { hours: number };
  temperature: { degrees: number };
  weatherCondition: { description: { text: string } };
  relativeHumidity: number;
  wind: { speed: { value: number } };
}

interface Forecast {
  forecastHours: ForecastHour[];
}

interface MetricCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEOCODING_API_KEY = import.meta.env.VITE_Maps_API_KEY;

export function WeatherApp() {
  const [showContent, setShowContent] = useState<boolean>(false);
  const [geo, setGeo] = useState<GeoLocation>({ lat: 0, lng: 0 });
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [suggestions, setSuggestions] = useState<string>("No suggestions yet.");

  const inputRef = useRef<HTMLInputElement>(null);

  const geocode = async (q: string): Promise<GeoLocation | null> => {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(q)}&key=${GEOCODING_API_KEY}`
    );
    const data = await res.json();
    return data.results?.[0]?.geometry?.location || null;
  };

  const fetchJSON = async <T,>(url: string, opts?: RequestInit): Promise<T> => {
    const r = await fetch(url, opts);
    if (!r.ok) {
      throw new Error(await r.text()); // helpful for debug
    }
    return r.json();
  };

  const handleSearch = async (): Promise<void> => {
    const loc = inputRef.current?.value.trim();
    if (!loc) return;

    const geoData = await geocode(loc);
    if (!geoData) {
      alert("Location not found.");
      return;
    }
    setGeo(geoData);
    setShowContent(true);
    setCurrentWeather(null);
    setForecast(null);
    setSuggestions("Fetching...");

    try {
      // Fetch current
      const current = await fetchJSON<CurrentWeather>(
        `https://weather.googleapis.com/v1/currentConditions:lookup?key=${WEATHER_API_KEY}&location.latitude=${geoData.lat}&location.longitude=${geoData.lng}`
      );
      setCurrentWeather(current);

      // Fetch forecast
      const fc = await fetchJSON<Forecast>(
        `https://weather.googleapis.com/v1/forecast/hourly:lookup?key=${WEATHER_API_KEY}&location.latitude=${geoData.lat}&location.longitude=${geoData.lng}`
      );
      setForecast(fc);

      // Gemini
      const prompt = 'Give 3 brief, bulleted suggestions based on this weather forecast: ' + 
        fc.forecastHours.slice(0, 5).map(h => `${h.displayDateTime.hours}:00 ${h.weatherCondition.description.text}`).join(', ');

      const sg = await fetchJSON<any>(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      );
      const txt = sg?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "Could not fetch suggestions.";
      setSuggestions(txt);
    } catch (err) {
      console.error(err);
      setSuggestions("Error retrieving data.");
    }
  };

  const handleClear = (): void => {
    if (inputRef.current) inputRef.current.value = "";
    setShowContent(false);
    setCurrentWeather(null);
    setForecast(null);
    setSuggestions("No suggestions yet.");
  };

  const MetricCard = ({ icon, value, label }: MetricCardProps) => (
    <Card className="text-center p-2 shadow-sm border-blue-100">
      <CardContent className="p-2">
        <div className="text-blue-800 mb-1">{icon}</div>
        <div className="font-bold text-sm">{value}</div>
        <div className="text-xs text-gray-600">{label}</div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <h1 className="text-center text-4xl font-bold my-5 text-blue-900">
        WeatherWise
      </h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-5 px-4">
        <div className="flex w-full max-w-2xl items-center space-x-2 relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for a city or place…"
            className="text-base p-6 rounded-full border-2 border-blue-800"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button
            type="button"
            size="icon"
            className="absolute right-14 rounded-full bg-transparent hover:bg-gray-200 text-blue-800"
            onClick={handleClear}>
            <X className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            size="icon"
            className="absolute right-2 rounded-full bg-transparent hover:bg-gray-200 text-blue-800"
            onClick={handleSearch}>
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="weather" className="w-full max-w-6xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 bg-white mb-2">
          <TabsTrigger value="weather">Weather</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="extra">Extra</TabsTrigger>
        </TabsList>

        {showContent && (
          <>
            <TabsContent value="weather" className="p-4">
              <div className="flex flex-col lg:flex-row gap-5">
                {/* Left Column */}
                <div className="flex flex-col gap-5 w-full lg:w-2/3">
                   {/* Current Weather */}
                   <Card className="flex-1 bg-gradient-to-br from-white to-blue-50">
                      <CardHeader>
                        <CardTitle className="text-blue-800">
                          Current Weather
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {currentWeather ? (
                          <>
                            <div className="flex items-center gap-6 mb-4">
                             <div className="flex items-center">
                                <span className="text-6xl">☁️</span>
                                <span className="text-5xl font-bold text-blue-800">
                                   {Math.round(currentWeather.temperature.degrees)}°
                                </span>
                             </div>
                             <div>
                                <div className="font-semibold text-lg">
                                   {currentWeather.weatherCondition.description.text}
                                </div>
                                <div className="text-gray-600">
                                   Feels like <strong>{Math.round(currentWeather.feelsLikeTemperature.degrees)}°</strong>
                                </div>
                             </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                             <MetricCard icon={<Wind />} value={`${currentWeather.wind.speed.value} km/h`} label="Wind" />
                             <MetricCard icon={<Droplets />} value={`${currentWeather.relativeHumidity}%`} label="Humidity" />
                             <MetricCard icon={<Eye />} value={`${currentWeather.visibility?.value ?? '--'} km`} label="Visibility" />
                             <MetricCard icon={<Gauge />} value={`${currentWeather.pressure?.value ?? '--'} mb`} label="Pressure" />
                             <MetricCard icon={<ThermometerSun />} value={`${currentWeather.dewPoint?.degrees ?? '--'}°`} label="Dew Point" />
                            </div>
                          </>
                        ) : <p>Fetching...</p>}
                      </CardContent>
                   </Card>

                   {/* Hourly Forecast */}
                   <Card>
                      <CardHeader>
                         <CardTitle className="text-blue-800">
                           Hourly Conditions
                         </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-3 overflow-x-auto pb-3">
                          {forecast ? forecast.forecastHours.slice(0, 12).map((h, i) => (
                            <div key={i} className="flex-shrink-0 w-28 text-center bg-gray-50 p-3 rounded-lg shadow-sm border border-blue-50">
                                <div className="font-bold">{h.displayDateTime.hours}:00</div>
                                <div className="text-2xl my-1">🌥</div>
                                <div className="text-lg">{Math.round(h.temperature.degrees)}°</div>
                                <div className="text-xs text-gray-500">{h.weatherCondition.description.text}</div>
                            </div>
                          )) : <p>Fetching...</p>}
                        </div>
                      </CardContent>
                   </Card>
                </div>

                {/* Right Column - Suggestions */}
                <div className="w-full lg:w-1/3">
                   <Card className="min-h-full">
                      <CardHeader>
                         <CardTitle className="text-blue-800">
                           Suggestions
                         </CardTitle>
                      </CardHeader>
                      <CardContent className="whitespace-pre-wrap text-sm leading-relaxed">
                         {suggestions}
                      </CardContent>
                   </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="locations" className="p-4">
               <Card className="w-full h-[60vh]">
                 <Map center={geo} zoom={12} mapId="full_map" className="rounded-lg">
                   <Marker position={geo} />
                 </Map>
               </Card>
            </TabsContent>

            <TabsContent value="extra" className="p-4">
              <Card>
                <CardHeader>
                   <CardTitle>Extra</CardTitle>
                </CardHeader>
                <CardContent>
                   <p>Extra features are coming soon!</p>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}

      </Tabs>
    </>
  )
}

