// Make sure the file exists at ./components/WeatherApp.tsx or ./components/WeatherApp/index.tsx
import { WeatherApp } from "./components/ui/WeatherApp";
import { APIProvider } from "@vis.gl/react-google-maps";

const App = () => {
  const googleMapsApiKey = import.meta.env.VITE_Maps_API_KEY as string;

  return (
    <APIProvider apiKey={googleMapsApiKey}>
      <div className="bg-[#eef6ff] min-h-screen font-sans text-[#333]">
        <WeatherApp />
      </div>
    </APIProvider>
  );
};

export default App;