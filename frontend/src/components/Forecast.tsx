import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

export default function Forecast({
  forecastHours,
  className,
}: {
  forecastHours: any[];
  className?: string;
}) {
  if (!Array.isArray(forecastHours) || forecastHours.length === 0) {
    return (
      <div id="forecastDisplay">
        <p>Unable to retrieve forecast data.</p>
      </div>
    );
  }

  return (
    <Card className={"w-full h-fit backdrop-blur-2xl " + (className || "")}>
      <CardHeader className="text-2xl font-bold">Hourly Forecast</CardHeader>
      <div className="px-6">
        <Separator />
      </div>
      <CardContent className="flex grow-0 shrink-0 gap-2 justify-center">
        <div className="flex overflow-scroll gap-2 py-2">
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
        </div>
      </CardContent>
    </Card>
  );
}

export const ForecastSkeleton = ({ className }: { className: string }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <Skeleton className="h-8 w-96" />
      </CardHeader>
      <div className="px-6">
        <Separator />
      </div>
      <CardContent className="flex grow-0 shrink-0 gap-2 justify-center">
        <div className="flex overflow-scroll gap-2 py-2">
          <Skeleton className="w-[80px] h-[119px]" />
          <Skeleton className="w-[80px] h-[119px]" />
          <Skeleton className="w-[80px] h-[119px]" />
          <Skeleton className="w-[80px] h-[119px]" />
          <Skeleton className="w-[80px] h-[119px]" />
          <Skeleton className="w-[80px] h-[119px]" />
          <Skeleton className="w-[80px] h-[119px]" />
          <Skeleton className="w-[80px] h-[119px]" />
          <Skeleton className="w-[80px] h-[119px]" />
          <Skeleton className="w-[80px] h-[119px]" />
          <Skeleton className="w-[80px] h-[119px]" />
          <Skeleton className="w-[80px] h-[119px]" />
          <Skeleton className="w-[80px] h-[119px]" />
          <Skeleton className="w-[80px] h-[119px]" />
          <Skeleton className="w-[80px] h-[119px]" />
          <Skeleton className="w-[80px] h-[119px]" />
        </div>
      </CardContent>
    </Card>
  );
};
