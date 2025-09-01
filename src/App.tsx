import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppLayout from "@/components/AppLayout";
import ProjectLayout from "@/components/ProjectLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewProject from "./pages/NewProject";
import ProjectDetail from "./pages/ProjectDetail";
import Workbench from "./pages/Workbench";
import NotFound from "./pages/NotFound";
import { CompanyListPlaceholder, ShortlistPlaceholder, OutreachPlaceholder, ProjectReportPlaceholder } from "@/components/PlaceholderPages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes with header and footer */}
            <Route path="/" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Index />
                </main>
                <Footer />
              </div>
            } />
            <Route path="/login" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Login />
                </main>
                <Footer />
              </div>
            } />
            
            {/* App routes with sidebar layout */}
            <Route path="/app/dashboard" element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/app/new-project" element={
              <ProtectedRoute>
                <AppLayout>
                  <NewProject />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/app/projects/:id" element={
              <ProtectedRoute>
                <AppLayout>
                  <ProjectLayout>
                    <ProjectDetail />
                  </ProjectLayout>
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/app/projects/:id/workbench" element={
              <ProtectedRoute>
                <AppLayout>
                  <ProjectLayout>
                    <Workbench />
                  </ProjectLayout>
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/app/projects/:id/companies" element={
              <ProtectedRoute>
                <AppLayout>
                  <ProjectLayout>
                    <CompanyListPlaceholder />
                  </ProjectLayout>
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/app/projects/:id/shortlist" element={
              <ProtectedRoute>
                <AppLayout>
                  <ProjectLayout>
                    <ShortlistPlaceholder />
                  </ProjectLayout>
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/app/projects/:id/outreach" element={
              <ProtectedRoute>
                <AppLayout>
                  <ProjectLayout>
                    <OutreachPlaceholder />
                  </ProjectLayout>
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/app/projects/:id/report" element={
              <ProtectedRoute>
                <AppLayout>
                  <ProjectLayout>
                    <ProjectReportPlaceholder />
                  </ProjectLayout>
                </AppLayout>
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
