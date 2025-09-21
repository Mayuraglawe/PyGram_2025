import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { AuthProvider, ProtectedRoute } from "./contexts/AuthContext";
import { DepartmentProvider } from "./contexts/DepartmentContext";
import { DepartmentRouter } from "./components/routing/DepartmentRouter";
import { NotificationProvider } from "./contexts/NotificationContext";
import SidebarLayout from "@/components/layout/SidebarLayout";
import PublicHeader from "@/components/layout/PublicHeader";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FacultyPage from "./pages/Faculty";
import SubjectsPage from "./pages/Subjects";
import ClassroomsPage from "./pages/Classrooms";
import BatchesPage from "./pages/Batches";
import SignInPage from "./pages/SignIn";
import RegisterPage from "./pages/Register";
import RoleSelectionPage from "./pages/RoleSelection";
import DepartmentsPage from "./pages/Departments";
import AdminPage from "./pages/Admin";
import TelegramSetup from "./pages/TelegramSetup";
import AdminTest from "./pages/AdminTest";
import { NotificationList } from "./components/notifications/NotificationComponents";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <DepartmentProvider>
            <NotificationProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <DepartmentRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/role-selection" element={
                <div className="min-h-screen bg-background">
                  <PublicHeader />
                  <RoleSelectionPage />
                </div>
              } />
              <Route path="/signin" element={
                <div className="min-h-screen bg-background">
                  <PublicHeader />
                  <SignInPage />
                </div>
              } />
              <Route path="/register" element={
                <div className="min-h-screen bg-background">
                  <PublicHeader />
                  <RegisterPage />
                </div>
              } />
              
              {/* Protected routes - all wrapped with SidebarLayout */}
              <Route path="/" element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <Index />
                  </SidebarLayout>
                </ProtectedRoute>
              } />
              
              {/* Faculty management - Admin and Mentors only */}
              <Route path="/faculty" element={
                <ProtectedRoute requiredPermission="view_department_data">
                  <SidebarLayout>
                    <FacultyPage />
                  </SidebarLayout>
                </ProtectedRoute>
              } />
              
              {/* Subjects management - Admin and Mentors only */}
              <Route path="/subjects" element={
                <ProtectedRoute requiredPermission="view_department_data">
                  <SidebarLayout>
                    <SubjectsPage />
                  </SidebarLayout>
                </ProtectedRoute>
              } />
              
              {/* Classrooms management - Admin and Mentors only */}
              <Route path="/classrooms" element={
                <ProtectedRoute requiredPermission="view_department_data">
                  <SidebarLayout>
                    <ClassroomsPage />
                  </SidebarLayout>
                </ProtectedRoute>
              } />
              
              {/* Batches management - Admin and Mentors only */}
              <Route path="/batches" element={
                <ProtectedRoute requiredPermission="view_department_data">
                  <SidebarLayout>
                    <BatchesPage />
                  </SidebarLayout>
                </ProtectedRoute>
              } />
              
              {/* Department management - Admin only */}
              <Route path="/departments" element={
                <ProtectedRoute requiredRole="admin">
                  <SidebarLayout>
                    <DepartmentsPage />
                  </SidebarLayout>
                </ProtectedRoute>
              } />
              
              {/* Admin panel - Admin only */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <SidebarLayout>
                    <AdminPage />
                  </SidebarLayout>
                </ProtectedRoute>
              } />
              
              {/* Telegram Setup - Admin only */}
              <Route path="/telegram-setup" element={
                <ProtectedRoute requiredRole="admin">
                  <SidebarLayout>
                    <TelegramSetup />
                  </SidebarLayout>
                </ProtectedRoute>
              } />
              
              {/* Notifications - All authenticated users */}
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <NotificationList />
                  </SidebarLayout>
                </ProtectedRoute>
              } />
              
              {/* Admin Test page */}
              <Route path="/admin-test" element={
                <div className="min-h-screen bg-background">
                  <AdminTest />
                </div>
              } />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
                </DepartmentRouter>
          </BrowserRouter>
        </NotificationProvider>
      </DepartmentProvider>
    </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
</Provider>
);

createRoot(document.getElementById("root")!).render(<App />);
