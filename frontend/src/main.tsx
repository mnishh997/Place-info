import { StrictMode } from "react";

import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "./pages/page.tsx";
import SignInPage from "./pages/(auth)/sign-in/page.tsx";
import { EnsureLoggedIn } from "./components/EnsureLoggedIn.tsx";
import SignUpPage from "./pages/(auth)/sign-up/page.tsx";
import UpdateUserDetailsPage from "./pages/(auth)/update-user-details/page.tsx";
import { ThemeContextProvider } from "./hooks/theme-context-hook.tsx";
import TestPage from "./pages/test/page.tsx";
import { APIProvider } from "@vis.gl/react-google-maps";
import { GOOGLE_MAPS_API_KEY } from "./constants.ts";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <APIProvider apiKey={"AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8"}>
    <QueryClientProvider client={queryClient}>
      <ThemeContextProvider>
        <div className="w-screen h-screen bg-background text-foreground">
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <EnsureLoggedIn>
                    <HomePage />
                  </EnsureLoggedIn>
                }
              />
                          <Route
              path="/update-user"
              element={
                <EnsureLoggedIn>
                  <UpdateUserDetailsPage />
                </EnsureLoggedIn>
              }
            />
              <Route path="sign-in" element={<SignInPage />} />
              <Route path="sign-up" element={<SignUpPage />} />

              <Route path="test" element={<TestPage />} />
            </Routes>
          </BrowserRouter>
        </div>
      </ThemeContextProvider>
    </QueryClientProvider>
  </APIProvider>
  // </StrictMode>
);
