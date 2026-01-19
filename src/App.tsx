import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider, AuthProvider } from "@/contexts";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Lazy load feature pages
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/components/common";

const UploadPage = lazy(() => import("./pages/upload/UploadPage"));
const GalleryPage = lazy(() => import("./pages/gallery/GalleryPage"));
const GeneratorPage = lazy(() => import("./pages/generator/GeneratorPage"));
const HuntsPage = lazy(() => import("./pages/hunts/HuntsPage"));
const HuntDetailPage = lazy(() => import("./pages/hunts/HuntDetailPage"));
const EventsPage = lazy(() => import("./pages/events/EventsPage"));
const EventDetailPage = lazy(() => import("./pages/events/EventDetailPage"));
const CreateEventPage = lazy(() => import("./pages/events/CreateEventPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      // Don't throw errors - let components handle loading/error states
      throwOnError: false,
    },
    mutations: {
      retry: 0,
      throwOnError: false,
    },
  },
});

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" text="Загрузка..." />
    </div>
  );
}

// Use basename only in production (GitHub Pages)
const basename = import.meta.env.PROD ? "/snapquest-daily" : "/";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <UserProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={basename}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Main pages */}
              <Route path="/" element={<Index />} />
              <Route path="/profile" element={<Profile />} />

              {/* Upload & Gallery */}
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/gallery" element={<GalleryPage />} />

              {/* Challenge Generator */}
              <Route path="/generator" element={<GeneratorPage />} />

              {/* Scavenger Hunts */}
              <Route path="/hunts" element={<HuntsPage />} />
              <Route path="/hunts/:id" element={<HuntDetailPage />} />

              {/* Private Events */}
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/create" element={<CreateEventPage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
