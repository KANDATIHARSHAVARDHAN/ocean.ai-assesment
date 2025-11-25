import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Footer } from "./components/common/Footer";
import { Header } from "./components/common/Header";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ProjectProvider } from "./context/ProjectContext";
import DashboardPage from "./pages/DashboardPage";
import EditorPage from "./pages/EditorPage";
import ExportPage from "./pages/ExportPage";
import LoginPage from "./pages/LoginPage";
import ProjectPage from "./pages/ProjectPage";
import "./styles/App.css";
import "./styles/components.css";
import "./styles/responsive.css";

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <BrowserRouter>
          <div className="app-shell">
            <Header />
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/:projectId"
                element={
                  <ProtectedRoute>
                    <ProjectPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/:projectId/editor"
                element={
                  <ProtectedRoute>
                    <EditorPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/:projectId/export"
                element={
                  <ProtectedRoute>
                    <ExportPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;


