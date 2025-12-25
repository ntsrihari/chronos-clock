import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePreferences } from "@/hooks/usePreferences";
import { useAppSettings } from "@/hooks/useAppSettings";
import { cn } from "@/lib/utils";
import { AuthPage } from "@/pages/AuthPage";
import { ClockPage } from "@/pages/ClockPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { StopwatchPage } from "@/pages/StopwatchPage";
import { TimerPage } from "@/pages/TimerPage";
import { WorldClockPage } from "@/pages/WorldClockPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const {
    preferences,
    setDefaultFace,
    setFontFamily,
    toggle24Hour,
    toggleSeconds,
    toggleSound,
    toggleDarkMode,
    addTimezone,
    removeTimezone,
  } = usePreferences();

  const { settings } = useAppSettings();

  // Get current font family from settings
  const currentFont = settings.fonts.find(
    (f) => f.key === preferences.fontFamily
  );
  const fontFamily = currentFont?.family || "Orbitron, monospace";

  return (
    <div
      className={cn(
        "min-h-screen bg-background",
        preferences.darkMode && "dark"
      )}
      style={{ fontFamily }}
    >
      <Header
        ambientMode={preferences.darkMode}
        soundEnabled={preferences.soundEnabled}
        onToggleAmbient={toggleDarkMode}
        onToggleSound={toggleSound}
      />
      <main className="relative">
        <Routes>
          <Route
            path="/"
            element={
              <ClockPage
                defaultFace={preferences.defaultFace}
                is24Hour={preferences.is24Hour}
                onFaceChange={setDefaultFace}
              />
            }
          />
          <Route path="/stopwatch" element={<StopwatchPage />} />
          <Route path="/timer" element={<TimerPage />} />
          <Route
            path="/world"
            element={
              <WorldClockPage
                savedTimezones={preferences.savedTimezones}
                onAddTimezone={addTimezone}
                onRemoveTimezone={removeTimezone}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <SettingsPage
                preferences={preferences}
                onToggle24Hour={toggle24Hour}
                onToggleSeconds={toggleSeconds}
                onToggleSound={toggleSound}
                onToggleDarkMode={toggleDarkMode}
                onSetDefaultFace={setDefaultFace}
                onSetFontFamily={setFontFamily}
              />
            }
          />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Navigation />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <AppContent />
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
