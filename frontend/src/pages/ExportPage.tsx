import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { ExportPanel } from "../components/export/ExportPanel";
import { useProjects } from "../context/ProjectContext";

export default function ExportPage() {
  const { projectId } = useParams();
  const { selectedProject, selectProject } = useProjects();

  useEffect(() => {
    if (projectId) {
      selectProject(Number(projectId));
    }
  }, [projectId, selectProject]);

  if (!selectedProject) {
    return <p className="status">Project not found.</p>;
  }

  return (
    <div className="panel">
      <h2>Export {selectedProject.project_name}</h2>
      <p>Download the latest .{selectedProject.document_type} version of your document.</p>
      <ExportPanel projectId={selectedProject.id} projectName={selectedProject.project_name} />
    </div>
  );
}


