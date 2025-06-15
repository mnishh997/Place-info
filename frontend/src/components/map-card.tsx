import {
  AdvancedMarker,
  InfoWindow,
  Map,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const placeTypes = [
  { label: "All", value: "" },
  { label: "Cafe", value: "cafe" },
  { label: "Restaurant", value: "restaurant" },
  { label: "EV Charging Station", value: "ev_charging_station" },
];

export const MapCard = ({ className }: { className?: string }) => {
  const map = useMap();
  const [selectedPlaceType, setSelectedPlaceType] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for the selected place and its details for the InfoWindow
  const [selectedPlaceForInfoWindow, setSelectedPlaceForInfoWindow] =
    useState<any>(null as any);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);
  const [infoWindowPlaceDetails, setInfoWindowPlaceDetails] = useState<
    any | null
  >(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null as any);

  // --- 1. Fetch Nearby Places (Existing Logic) ---
  const fetchNearbyPlaces = useCallback(async () => {
    if (!map) {
      console.log("Map not loaded yet.");
      return;
    }

    setLoading(true);
    setError(null);
    setPlaces([]);
    // Close any open info window when new search starts
    setInfoWindowOpen(false);
    setSelectedPlaceForInfoWindow(null);
    setInfoWindowPlaceDetails(null);

    const center = map.getCenter();
    if (!center) {
      setError("Could not get map center.");
      setLoading(false);
      return;
    }

    const requestBody = {
      maxResultCount: 10,
      locationRestriction: {
        circle: {
          center: {
            latitude: center.lat(),
            longitude: center.lng(),
          },
          radius: 500,
        },
      },
    } as any;

    if (selectedPlaceType) {
      requestBody.includedTypes = [selectedPlaceType];
    }

    const headers = {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": "AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8",
      // We need place_id to fetch full details later
      "X-Goog-Fieldmask":
        "places.displayName,places.location,places.formattedAddress,places.rating,places.types,places.id",
    };

    try {
      const response = await fetch(
        "https://places.googleapis.com/v1/places:searchNearby",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `API Error: ${response.status} ${
            errorData.error?.message || response.statusText
          }`
        );
      }

      const data = await response.json();
      setPlaces(data.places || []);
    } catch (err: any) {
      console.error("Error fetching places:", err);
      setError(`Failed to fetch places: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [map, selectedPlaceType]);

  useEffect(() => {
    if (map) {
      fetchNearbyPlaces();
    }
  }, [map, selectedPlaceType, fetchNearbyPlaces]);

  // --- 2. Fetch Place Details for InfoWindow ---
  const fetchPlaceDetails = useCallback(async (placeId: string) => {
    if (!placeId) return;

    setDetailsLoading(true);
    setDetailsError(null);
    setInfoWindowPlaceDetails(null); // Clear previous details

    // Define the fields you want for your info card. This is crucial for billing.
    const fieldMask = [
      "displayName",
      "formattedAddress",
      "photos",
      "rating",
      "userRatingCount",
      "internationalPhoneNumber",
      "websiteUri",
      "regularOpeningHours",
      "currentOpeningHours",
      "reviews",
      "googleMapsUri",
      "location", // Needed for InfoWindow position
      "editorialSummary", // For the "Coffee & creative cakes..." description
      "types", // To potentially show "Coffee Shop"
      "priceLevel", // For "$1-20"
    ].join(",");

    const headers = {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": "AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8",
      "X-Goog-Fieldmask": fieldMask,
    };

    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}`,
        {
          method: "GET", // GET request for Place Details
          headers: headers,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `API Error: ${response.status} ${
            errorData.error?.message || response.statusText
          }`
        );
      }

      const data = await response.json();
      setInfoWindowPlaceDetails(data);
    } catch (err: any) {
      console.error("Error fetching place details:", err);
      setDetailsError(`Failed to load details: ${err.message}`);
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  // --- 3. Handle Marker Click ---
  const handleMarkerClick = useCallback(
    (place: any) => {
      console.log(place);
      setSelectedPlaceForInfoWindow(place);
      setInfoWindowOpen(true);
      fetchPlaceDetails(place.id); // Fetch full details when marker is clicked
    },
    [fetchPlaceDetails]
  );

  // --- 4. Render InfoWindow Content ---
  const renderInfoWindowContent = () => {
    if (detailsLoading) return <p>Loading details...</p>;
    if (detailsError) return <p style={{ color: "red" }}>{detailsError}</p>;
    if (!infoWindowPlaceDetails) return null;

    const place = infoWindowPlaceDetails;
    const firstPhotoUrl = place.photos?.[0]?.uri;
    const secondPhotoUrl = place.photos?.[1]?.uri;
    const thirdPhotoUrl = place.photos?.[2]?.uri; // Assuming there's a third for the second small image
    const forthPhotoUrl = place.photos?.[3]?.uri; // Assuming there's a forth for the second small image

    const getCurrentStatus = (openingHours: any) => {
      if (!openingHours || !openingHours.periods) return "Unknown";
      const today = new Date();
      const dayOfWeek = (today.getDay() + 6) % 7; // Monday is 0, Sunday is 6 for regularOpeningHours

      // Find today's opening hours
      const todayHours = openingHours.periods.find(
        (p: any) => p.open.day === dayOfWeek
      );

      if (!todayHours) {
        return "Closed today"; // No specific hours for today
      }

      const now = today.getHours() * 60 + today.getMinutes(); // Current time in minutes since midnight

      // Convert open and close times to minutes since midnight
      const openTime =
        parseInt(todayHours.open.time.substring(0, 2)) * 60 +
        parseInt(todayHours.open.time.substring(2, 4));
      const closeTime = todayHours.close
        ? parseInt(todayHours.close.time.substring(0, 2)) * 60 +
          parseInt(todayHours.close.time.substring(2, 4))
        : null;

      if (closeTime === null || closeTime <= openTime) {
        // Handles cases where close time wraps around midnight (e.g., opens Thu 22:00, closes Fri 02:00)
        // This simple logic might not fully cover complex overnight hours.
        // For robust handling, use regularOpeningHours.weekdayDescriptions
        // or currentOpeningHours.openNow property directly.
        return "Open 24 hours or complex schedule";
      }

      if (now >= openTime && now < closeTime) {
        return `Open ⋅ Closes ${todayHours.close.time.substring(
          0,
          2
        )}:${todayHours.close.time.substring(2, 4)} ${
          todayHours.close.day === dayOfWeek ? "" : "the next day"
        }`;
      } else if (now < openTime) {
        return `Closed ⋅ Opens ${todayHours.open.time.substring(
          0,
          2
        )}:${todayHours.open.time.substring(2, 4)} today`;
      } else {
        return `Closed ⋅ Opens ${
          place.regularOpeningHours?.weekdayDescriptions?.[
            (dayOfWeek + 1) % 7
          ] || "next day"
        }`; // Try to find next open day
      }
    };

    const nextOpeningTime =
      place.regularOpeningHours?.weekdayDescriptions?.[
        (new Date().getDay() + 6) % 7
      ] || "";
    const priceLevelText = place.priceLevel
      ? "$" + "x".repeat(place.priceLevel)
      : ""; // e.g. 1 -> $, 2 -> $$, 3 -> $$$

    return (
      <div
        style={{
          width: "300px",
          padding: "10px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Header section like "Little Rogue." */}
        <div style={{ marginBottom: "10px" }}>
          <h2 style={{ margin: "0", fontSize: "1.2em" }}>
            {place.displayName?.text}
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "0.9em",
              color: "#555",
            }}
          >
            <span>{place.rating?.toFixed(1) || "N/A"}</span>
            <span style={{ marginLeft: "5px", color: "#FFD700" }}>
              {"★".repeat(Math.round(place.rating))}
              {"☆".repeat(5 - Math.round(place.rating))}
            </span>
            <span style={{ marginLeft: "5px", textDecoration: "underline" }}>
              (
              {place.userRatingCount
                ? place.userRatingCount.toLocaleString()
                : "0"}
              )
            </span>
            {place.types && place.types.length > 0 && (
              <span style={{ marginLeft: "10px" }}>
                {place.types[0]
                  .replace(/_/g, " ")
                  .split(" ")
                  .map(
                    (word: string) =>
                      word.charAt(0).toUpperCase() + word.slice(1)
                  )
                  .join(" ")}
              </span>
            )}
            {priceLevelText && (
              <span style={{ marginLeft: "10px" }}>{priceLevelText}</span>
            )}
          </div>
          <p style={{ margin: "5px 0", fontSize: "0.9em", color: "#888" }}>
            {/* Simplified opening status for example */}
            {place.currentOpeningHours?.openNow ? "Open" : "Closed"} ⋅ Opens{" "}
            {place.regularOpeningHours?.weekdayDescriptions?.[
              (new Date().getDay() + 6) % 7
            ]?.split(": ")[1] || "check hours"}
          </p>
          {/* Simplified: "Open in Maps" button */}
          {place.googleMapsUri && (
            <button
              onClick={() => window.open(place.googleMapsUri, "_blank")}
              style={{
                background: "#1a73e8",
                color: "white",
                border: "none",
                padding: "8px 15px",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "10px",
                fontSize: "0.9em",
              }}
            >
              Open in Maps
            </button>
          )}
        </div>

        {/* Photos section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "5px",
            marginBottom: "10px",
          }}
        >
          {firstPhotoUrl && (
            <div
              style={{
                gridColumn: "span 1",
                gridRow: "span 2",
                position: "relative",
              }}
            >
              <img
                src={firstPhotoUrl + "=w200-h200-c"} // Append for sizing
                alt={place.displayName?.text}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
              {place.photos?.length > 1 && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "5px",
                    left: "5px",
                    background: "rgba(0,0,0,0.6)",
                    color: "white",
                    padding: "3px 8px",
                    borderRadius: "3px",
                    fontSize: "0.8em",
                  }}
                >
                  📸 {place.photos.length} photos
                </div>
              )}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {secondPhotoUrl && (
              <img
                src={secondPhotoUrl + "=w100-h100-c"} // Append for sizing
                alt="Additional photo"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
            )}
            {thirdPhotoUrl && (
              <img
                src={thirdPhotoUrl + "=w100-h100-c"} // Append for sizing
                alt="Additional photo"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
            )}
          </div>
        </div>

        {/* Description */}
        {place.editorialSummary?.overview && (
          <p style={{ fontSize: "0.9em", color: "#333", marginBottom: "15px" }}>
            {place.editorialSummary.overview}
          </p>
        )}

        {/* Tabs (Overview, Reviews, About) - simplified as just overview details */}
        <div style={{ borderBottom: "1px solid #eee", marginBottom: "15px" }}>
          <button
            style={{
              background: "none",
              border: "none",
              padding: "10px 15px",
              fontWeight: "bold",
              color: "#1a73e8",
              borderBottom: "2px solid #1a73e8",
            }}
          >
            Overview
          </button>
          {/* You can add actual tab logic here if needed */}
        </div>

        {/* Details List */}
        <div style={{ fontSize: "0.9em" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <span style={{ marginRight: "10px", color: "#555" }}>📍</span>
            <span>{place.formattedAddress}</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <span style={{ marginRight: "10px", color: "#555" }}>🕒</span>
            <span>
              {/* This could be more robust, pulling from regularOpeningHours.weekdayDescriptions */}
              {place.currentOpeningHours?.openNow ? "Open now" : "Closed"} ⋅
              Opens{" "}
              {place.regularOpeningHours?.weekdayDescriptions?.[
                (new Date().getDay() + 6) % 7
              ]?.split(": ")[1] || "check hours"}{" "}
              {/* Simplified for brevity */}
            </span>
          </div>
          {place.websiteUri && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <span style={{ marginRight: "10px", color: "#555" }}>🌐</span>
              <a
                href={place.websiteUri}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1a73e8", textDecoration: "none" }}
              >
                {place.websiteUri.replace(/(^\w+:|^)\/\//, "")}
              </a>
            </div>
          )}
          {place.internationalPhoneNumber && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <span style={{ marginRight: "10px", color: "#555" }}>📞</span>
              <span>{place.internationalPhoneNumber}</span>
            </div>
          )}
          {place.location && ( // Plus Code
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <span style={{ marginRight: "10px", color: "#555" }}>➕</span>
              <span>{place.location.plusCode?.globalCode || "N/A"}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={className}>
      <div className="flex bg-background border rounded-xl p-4 shadow items-stretch">
        <div className="bg-primary px-8 py-8 rounded-l-lg grow">
          <RadioGroup
            onValueChange={(e) => setSelectedPlaceType(e)}
            className="text-primary-foreground"
          >
            {placeTypes.map((item, index) => {
              return (
                <div key={index} className="flex items-center gap-3">
                  <RadioGroupItem
                    value={item.value}
                    id={`place-type-${item.label}-${index}`}
                  />
                  <Label htmlFor={`place-type-${item.label}-${index}`}>
                    {item.label}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>

        <div>
          <Map
            defaultCenter={{ lat: -37.8136, lng: 144.9631 }} // Melbourne
            defaultZoom={14}
            gestureHandling={"greedy"}
            disableDefaultUI={false}
            className="w-96 h-96"
            reuseMaps={true}
            mapId={"YOUR_MAP_ID"} // Essential for Advanced Markers
          >
            {places.map((place: any) => (
              <AdvancedMarker
                key={place.id}
                position={{
                  lat: place.location.latitude,
                  lng: place.location.longitude,
                }}
                title={place.displayName?.text}
                clickable
                onClick={() => handleMarkerClick(place)} // Attach click handler
              >
                <Pin
                  background={"#FBBC04"}
                  glyphColor={"#000"}
                  borderColor={"#000"}
                >
                  {selectedPlaceType ? selectedPlaceType[0].toUpperCase() : "P"}
                </Pin>
              </AdvancedMarker>
            ))}

            {/* InfoWindow conditionally rendered */}
            {infoWindowOpen &&
              selectedPlaceForInfoWindow &&
              infoWindowPlaceDetails && (
                <InfoWindow
                  position={{
                    lat: selectedPlaceForInfoWindow.location.latitude,
                    lng: selectedPlaceForInfoWindow.location.longitude,
                  }}
                  onCloseClick={() => setInfoWindowOpen(false)}
                >
                  {renderInfoWindowContent()}
                </InfoWindow>
              )}
          </Map>
        </div>
      </div>
    </div>
  );
};
