import express from "express";
import {
  WEATHER_API_KEY,
  GEMINI_API_KEY,
  GEOCODING_API_KEY,
} from "./../lib/constants.js";
import { zValidator } from "./../middleware/validationMiddleware.js";
import { z } from "zod";
import passport from "passport";

const app = express.Router();
app.use(passport.authenticate("jwt", { session: false, failureMessage: "Not authorized to use this endpoint" }));
app
  .post(
    "/currentconditions",
    zValidator(
      z.object({
        lat: z.number(),
        lng: z.number(),
      })
    ),
    async (req, res) => {
      console.log("here")
      const { lat, lng } = req.body;
      try {
        const url = `https://weather.googleapis.com/v1/currentConditions:lookup?key=${WEATHER_API_KEY}&location.latitude=${lat}&location.longitude=${lng}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log(data)
        res.status(200).send({ status: "success", data });
      } catch (err) {
        console.error("Current Conditions API error:", err);
        res.status(500).send({ message: "Internal Server Error" });
      }
    }
  )
  .post(
    "/geocode",
    zValidator(
      z.object({
        address: z.string().trim().min(1),
      })
    ),
    async (req, res) => {
      const { address } = req.body;
      try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${GEOCODING_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.results?.length > 0) {
          const loc = data.results[0].geometry.location;
          res.status(200).send({ lat: loc.lat, lng: loc.lng });
        } else {
          res.status(500).send({ message: "Unable to find the given address" });
        }
      } catch (err) {
        console.error("Geocoding failed", err);
        res.status(500).send({ message: "Internal Server Error" });
      }
    }
  )
  .post("/suggestions", async (req, res) => {
    const { hourlySummaries } = req.body;
    if (!hourlySummaries || hourlySummaries.length === 0) {
      return res.status(401).send({ message: "Hourly Summaries missing" });
    }
    const hourlySummaryText = hourlySummaries?.join("\n");
    const summaryText = `Hourly forecast:\n${hourlySummaryText}\n\nBased on this forecast, give 3 concise and useful weather-related suggestions (e.g., carry umbrella, drink more water, best time to go out).`;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    const body = { contents: [{ parts: [{ text: summaryText }] }] };
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await response.json();

      if (!json.candidates || !json.candidates.length) {
        throw new Error("No suggestions returned.");
      }

      const rawText = json.candidates[0].content?.parts?.[0]?.text;

      if (!rawText) throw new Error("No Suggestions Returned");

      const lines = rawText
        .split(/[\n\r]+/)
        .map((line) => line.replace(/^\s*(?:-|\d+\.|•|\*)\s*/, "").trim())
        .filter((line) => line.length > 0);
      return lines;
    } catch (err) {
      console.error("Suggestion generation error:", err);
      throw err;
    }
  })
  .post(
    "/weather",
    zValidator(
      z.object({
        lat: z.number(),
        lng: z.number(),
      })
    ),
    async (req, res) => {
      const { lat, lng } = req.body;
      try {
        const url = `https://weather.googleapis.com/v1/forecast/hours:lookup?key=${WEATHER_API_KEY}&location.latitude=${lat}&location.longitude=${lng}`;
        const response = await fetch(url);
        const data = await response.json();
        if (!data) {
          throw new Error("Data field is empty");
        }
        return res.status(200).send(data);
      } catch (err) {
        console.error("Weather API error:", err);
        res.status(500).send({ message: "Internal Server Error" });
      }
    }
  );

export default app;
