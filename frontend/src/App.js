import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/sonner";

// Public pages
import HomePage from "./pages/HomePage";
import FeaturesPage from "./pages/FeaturesPage";
import PricingPage from "./pages/PricingPage";
import FAQPage from "./pages/FAQPage";
import ContactPage from "./pages/ContactPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Dashboard pages
import DashboardPage from "./pages/DashboardPage";
import LibraryPage from "./pages/LibraryPage";
import ProfilePage from "./pages/ProfilePage";
import ClipsPage from "./pages/ClipsPage";
import StoryPage from "./pages/StoryPage";
import VoiceoverPage from "./pages/VoiceoverPage";
import TranscriptionPage from "./pages/TranscriptionPage";
import RankingPage from "./pages/RankingPage";
import SplitScreenPage from "./pages/SplitScreenPage";

function App() {
  return (
    <AuthProvider>
      <div className="App min-h-screen bg-[#050505]">
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/library"
              element={
                <ProtectedRoute>
                  <LibraryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/clips"
              element={
                <ProtectedRoute>
                  <ClipsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/story"
              element={
                <ProtectedRoute>
                  <StoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/voiceover"
              element={
                <ProtectedRoute>
                  <VoiceoverPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/transcription"
              element={
                <ProtectedRoute>
                  <TranscriptionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/ranking"
              element={
                <ProtectedRoute>
                  <RankingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/split-screen"
              element={
                <ProtectedRoute>
                  <SplitScreenPage />
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;
