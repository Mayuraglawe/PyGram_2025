import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FacultyPage from "./pages/Faculty";
import SubjectsPage from "./pages/Subjects";
import ClassroomsPage from "./pages/Classrooms";
import BatchesPage from "./pages/Batches";
import TimetablesPage from "./pages/Timetables";
import GeneratePage from "./pages/Generate";
import SignInPage from "./pages/SignIn";
import RegisterPage from "./pages/Register";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/faculty" element={<FacultyPage />} />
            <Route path="/subjects" element={<SubjectsPage />} />
            <Route path="/classrooms" element={<ClassroomsPage />} />
            <Route path="/batches" element={<BatchesPage />} />
            <Route path="/timetables" element={<TimetablesPage />} />
            <Route path="/generate" element={<GeneratePage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

createRoot(document.getElementById("root")!).render(<App />);
