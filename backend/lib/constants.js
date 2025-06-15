import { config } from "dotenv"
config()

export const WEATHER_API_KEY = process.env.WEATHER_API_KEY
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY
export const GEOCODING_API_KEY = process.env.GEOCODING_API_KEY
export const JWT_AUTH_SECRET = process.env.JWT_AUTH_SECRET
export const MONGODB_URI = process.env.MONGODB_URI
