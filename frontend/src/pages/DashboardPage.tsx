import { useNavigate } from "react-router-dom";

import { CreateProject } from "../components/dashboard/CreateProject";
import { ProjectList } from "../components/dashboard/ProjectList";
import { useProjects } from "../context/ProjectContext";

export default function DashboardPage() {
  const { projects, selectedProject, selectProject, loading, status, refreshProjects } =
    useProjects();
  const navigate = useNavigate();

  const handleSelect = (projectId: number) => {
    selectProject(projectId);
    navigate(`/projects/${projectId}`);
  };

  return (
    <section className="grid">
      <CreateProject />
      <div className="panel">
        <div className="panel-header">
          <h2>Projects</h2>
          <button className="secondary" onClick={refreshProjects} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
        <ProjectList
          projects={projects}
          selectedProjectId={selectedProject?.id ?? null}
          onSelect={(project) => handleSelect(project.id)}
        />
        {status && <p className="status">{status}</p>}
      </div>
    </section>
  );
}

