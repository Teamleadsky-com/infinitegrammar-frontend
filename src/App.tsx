import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import LevelSelection from "./pages/LevelSelection";
import Exercise from "./pages/Exercise";
import Statistics from "./pages/Statistics";
import ExerciseStats from "./pages/ExerciseStats";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import VerifyMagicLink from "./pages/VerifyMagicLink";
import PruefungsZentren from "./pages/PruefungsZentren";
import CityExamPage from "./pages/CityExamPage";
import Grammatik from "./pages/Grammatik";
import GrammatikLevel from "./pages/GrammatikLevel";
import GrammatikTopic from "./pages/GrammatikTopic";
import WechselpraepositionenWoWohin from "./pages/grammar-content/WechselpraepositionenWoWohin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LevelSelection />} />
              <Route path="/exercise" element={<Exercise />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/exercise-stats" element={<ExerciseStats />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/verify-magic-link" element={<VerifyMagicLink />} />
              <Route path="/pruefungszentren" element={<PruefungsZentren />} />
              <Route path="/pruefungszentren/:examCity" element={<CityExamPage />} />
              <Route path="/grammatik" element={<Grammatik />} />
              <Route path="/grammatik/thema/:topic" element={<GrammatikTopic />} />
              <Route path="/grammatik/:level" element={<GrammatikLevel />} />
              <Route path="/grammatik/b1/wechselpraepositionen-wo-wohin" element={<WechselpraepositionenWoWohin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
