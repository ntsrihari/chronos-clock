import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePreferences } from "@/hooks/usePreferences";
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
    toggle24Hour,
    toggleSeconds,
    toggleSound,
    toggleAmbientMode,
    addTimezone,
    removeTimezone,
  } = usePreferences();

  return (
    <div
      className={cn(
        "min-h-screen bg-background",
        preferences.ambientMode && "ambient-mode"
      )}
    >
      <Header
        ambientMode={preferences.ambientMode}
        soundEnabled={preferences.soundEnabled}
        onToggleAmbient={toggleAmbientMode}
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
                onToggleAmbient={toggleAmbientMode}
                onSetDefaultFace={setDefaultFace}
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
