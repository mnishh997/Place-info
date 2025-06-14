import { GEMINI_API_KEY } from "@/constants";
import { useQuery } from "@tanstack/react-query";

type useGetSuggestionsProps = {
  hourlySummaries: string[];
  enabled: boolean;
};

export const useGetSuggestions = ({
  hourlySummaries,
  enabled,
}: useGetSuggestionsProps) => {
  const hourlySummaryText = hourlySummaries?.join("\n");
  const summaryText = `Hourly forecast:\n${hourlySummaryText}\n\nBased on this forecast, give 3 concise and useful weather-related suggestions (e.g., carry umbrella, drink more water, best time to go out).`;

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  const body = { contents: [{ parts: [{ text: summaryText }] }] };

  const query = useQuery({
    queryKey: ["suggestion", hourlySummaryText],
    queryFn: async () => {
      try {
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const json = await res.json();

        if (!json.candidates || !json.candidates.length) {
          throw new Error("No suggestions returned.");
        }

        const rawText = json.candidates[0].content?.parts?.[0]?.text as string;

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
    },
    enabled,
  });
  return query;
};
