import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { DocumentConfig } from "../components/editor/DocumentConfig";
import { useProjects } from "../context/ProjectContext";
import type { DocumentStructure } from "../types";

export default function ProjectPage() {
  const { projectId } = useParams();
  const { selectedProject, selectProject, status } = useProjects();
  const [selectedStructure, setSelectedStructure] = useState<DocumentStructure | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (projectId) {
      selectProject(Number(projectId));
    }
  }, [projectId, selectProject]);

  useEffect(() => {
    if (selectedProject) {
      setSelectedStructure((prev) => {
        if (!prev) {
          return selectedProject.structures[0] ?? null;
        }
        return selectedProject.structures.find((item) => item.id === prev.id) ?? prev;
      });
    }
  }, [selectedProject]);

  if (!selectedProject) {
    return <p className="status">Project not found.</p>;
  }

  return (
    <section className="grid">
      <div className="panel">
        <h2>Project Overview</h2>
        <p>
          <strong>Name:</strong> {selectedProject.project_name}
        </p>
        <p>
          <strong>Main topic:</strong> {selectedProject.main_topic}
        </p>
        <p>
          <strong>Document type:</strong> {selectedProject.document_type.toUpperCase()}
        </p>
        <div className="inline-row">
          <button onClick={() => navigate(`/projects/${selectedProject.id}/editor`)}>
            Open Editor
          </button>
          <Link className="secondary" to={`/projects/${selectedProject.id}/export`}>
            Export
          </Link>
        </div>
      </div>
      <div className="panel">
        <div className="panel-header">
          <h2>Document Structure</h2>
        </div>
        <DocumentConfig
          structures={selectedProject.structures}
          selectedId={selectedStructure?.id ?? null}
          onSelect={setSelectedStructure}
        />
        {selectedStructure && (
          <p className="status">
            Selected {selectedStructure.element_type}: {selectedStructure.title}
          </p>
        )}
        {status && <p className="status">{status}</p>}
      </div>
    </section>
  );
}

