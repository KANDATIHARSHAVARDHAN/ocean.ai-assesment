import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { DocumentConfig } from "../components/editor/DocumentConfig";
import { SectionEditor, SlideEditor } from "../components/editor/SectionEditor";
import { useProjects } from "../context/ProjectContext";
import type { DocumentStructure } from "../types";

export default function EditorPage() {
  const { projectId } = useParams();
  const numericId = Number(projectId);
  const { selectedProject, selectProject, status } = useProjects();
  const [selectedStructure, setSelectedStructure] = useState<DocumentStructure | null>(null);

  useEffect(() => {
    if (projectId) {
      selectProject(numericId);
    }
  }, [projectId, selectProject, numericId]);

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

  if (!selectedProject || !selectedStructure) {
    return <p className="status">Select a project with at least one section or slide.</p>;
  }

  const EditorComponent =
    selectedStructure.element_type === "slide" ? SlideEditor : SectionEditor;

  return (
    <>
      <div className="workspace">
        <aside className="sidebar panel">
          <div className="panel-header">
            <h2>Outline</h2>
          </div>
          <DocumentConfig
            structures={selectedProject.structures}
            selectedId={selectedStructure.id}
            onSelect={setSelectedStructure}
          />
        </aside>
        <div className="editor-pane">
          <EditorComponent projectId={selectedProject.id} structure={selectedStructure} />
        </div>
      </div>
      {status && <p className="status">{status}</p>}
    </>
  );
}

