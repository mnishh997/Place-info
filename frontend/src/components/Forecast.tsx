import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";

export default function Forecast({ forecastHours }: { forecastHours: any[] }) {
  if (!Array.isArray(forecastHours) || forecastHours.length === 0) {
    return (
      <div id="forecastDisplay">
        <p>Unable to retrieve forecast data.</p>
      </div>
    );
  }

  return (
    <Card className="w-full h-fit bg-muted/30 backdrop-blur-2xl">
      <CardHeader className="text-2xl font-bold">Hourly Forecast</CardHeader>
      <div className="px-6">
        <Separator />
      </div>
      <CardContent className="flex grow-0 shrink-0 gap-2 flex-wrap justify-center">
        {forecastHours.map((hour, idx) => {
          const timeNum = hour.displayDateTime?.hours;
          const hourStr =
            typeof timeNum === "number"
              ? String(timeNum).padStart(2, "0") + ":00"
              : "N/A";
          const temp =
            hour.temperature?.degrees !== undefined
              ? `${hour.temperature.degrees}°C`
              : "N/A";
          const condition = hour.weatherCondition?.description?.text || "N/A";

          return (
            <div className="hour-block" key={idx}>
              <div className="hour-temp">{temp}</div>
              <div className="hour-condition">{condition}</div>
              <div className="hour-time">{hourStr}</div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
