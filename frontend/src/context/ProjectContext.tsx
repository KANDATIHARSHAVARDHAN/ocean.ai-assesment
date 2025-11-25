import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { createProject, fetchProjects } from "../services/project";
import type { DocumentStructure, Project, ProjectInput } from "../types";
import { useAuth } from "./AuthContext";

type ProjectContextValue = {
  projects: Project[];
  selectedProject: Project | null;
  loading: boolean;
  status: string;
  refreshProjects: () => Promise<void>;
  selectProject: (projectId: number) => void;
  createProject: (payload: ProjectInput) => Promise<Project | null>;
  updateStructure: (projectId: number, structure: DocumentStructure) => void;
  setStatus: (message: string) => void;
};

const ProjectContext = createContext<ProjectContextValue | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId],
  );

  const refreshProjects = useCallback(async () => {
    if (!token) {
      setProjects([]);
      setSelectedProjectId(null);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchProjects(token);
      setProjects(data);
      if (selectedProjectId) {
        const updated = data.find((project) => project.id === selectedProjectId);
        if (!updated && data.length) {
          setSelectedProjectId(data[0].id);
        }
      }
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [token, selectedProjectId]);

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  const selectProject = useCallback((projectId: number) => {
    setSelectedProjectId(projectId);
  }, []);

  const handleCreateProject = useCallback(
    async (payload: ProjectInput) => {
      if (!token) return null;
      setLoading(true);
      try {
        const project = await createProject(token, payload);
        setProjects((prev) => [project, ...prev]);
        setSelectedProjectId(project.id);
        setStatus("Project created");
        return project;
      } catch (error) {
        setStatus((error as Error).message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const updateStructure = useCallback((projectId: number, structure: DocumentStructure) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) {
          return project;
        }
        return {
          ...project,
          structures: project.structures.map((item) =>
            item.id === structure.id ? structure : item,
          ),
        };
      }),
    );
  }, []);

  const value: ProjectContextValue = {
    projects,
    selectedProject,
    loading,
    status,
    refreshProjects,
    selectProject,
    createProject: handleCreateProject,
    updateStructure,
    setStatus,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjects must be used inside ProjectProvider");
  }
  return context;
}

