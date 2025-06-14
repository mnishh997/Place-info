import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";

export default function CurrentConditions({
  data,
  locationName,
}: {
  data: any;
  locationName: string;
}) {
  if (!data) {
    return (
      <div id="">
        <p>Current conditions unavailable.</p>
      </div>
    );
  }

  const temp = data.temperature?.degrees?.toFixed(1) ?? "N/A";
  const feelsLike = data.feelsLikeTemperature?.degrees?.toFixed(1) ?? "N/A";
  const condition = data.weatherCondition?.description?.text ?? "N/A";
  const humidity =
    data.relativeHumidity !== undefined ? `${data.relativeHumidity}%` : "N/A";
  const wind =
    data.wind?.speed?.value !== undefined
      ? `${data.wind.speed.value} km/h`
      : "N/A";
  const uv = data.uvIndex ?? "N/A";
  const visibility =
    data.visibility?.distance !== undefined
      ? `${data.visibility.distance} km`
      : "N/A";
  const time = data.currentTime
    ? new Date(data.currentTime).toLocaleString()
    : "N/A";

  return (
    <Card className="bg-muted/30 backdrop-blur-2xl">
      <CardHeader className="font-bold text-2xl">{locationName}</CardHeader>
      <div className="px-6">
        <Separator />
      </div>
      <CardContent>
        <div className="grid grid-cols-2">
          <div>
            <span className="font-bold">As of:</span>{" "}
            <span className="condition-value">{time}</span>
          </div>
          <div>
            <span className="font-bold">Condition:</span>{" "}
            <span className="condition-value">{condition}</span>
          </div>
          <div>
            <span className="font-bold">Temperature:</span>{" "}
            <span className="condition-value">{temp}°C</span>
          </div>
          <div>
            <span className="font-bold">Feels Like:</span>{" "}
            <span className="condition-value">{feelsLike}°C</span>
          </div>
          <div>
            <span className="font-bold">Humidity:</span>{" "}
            <span className="condition-value">{humidity}</span>
          </div>
          <div>
            <span className="font-bold">UV Index:</span>{" "}
            <span className="condition-value">{uv}</span>
          </div>
          <div>
            <span className="font-bold">Wind Speed:</span>{" "}
            <span className="condition-value">{wind}</span>
          </div>
          <div>
            <span className="font-bold">Visibility:</span>{" "}
            <span className="condition-value">{visibility}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
