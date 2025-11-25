import { useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { useProjects } from "../../context/ProjectContext";
import { requestOutline } from "../../services/project";
import { DOCUMENT_TYPES, DEFAULT_OUTLINE_LENGTH } from "../../utils/constants";
import type { ProjectInput } from "../../types";

const emptyProjectForm: ProjectInput = {
  project_name: "",
  document_type: "docx",
  main_topic: "",
  structures: [],
};

export function CreateProject() {
  const { token } = useAuth();
  const { createProject, setStatus } = useProjects();
  const [form, setForm] = useState<ProjectInput>(emptyProjectForm);
  const [outlineLength, setOutlineLength] = useState(DEFAULT_OUTLINE_LENGTH);
  const [newStructureTitle, setNewStructureTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAddStructure = () => {
    if (!newStructureTitle.trim()) return;
    setForm((prev) => ({
      ...prev,
      structures: [
        ...prev.structures,
        {
          element_type: prev.document_type === "docx" ? "section" : "slide",
          title: newStructureTitle.trim(),
          order_index: prev.structures.length,
        },
      ],
    }));
    setNewStructureTitle("");
  };

  const handleSubmit = async () => {
    setStatus("");
    if (!form.project_name || !form.main_topic || !form.structures.length) {
      setStatus("Please provide project name, topic, and outline.");
      return;
    }
    setSubmitting(true);
    const project = await createProject(form);
    if (project) {
      setForm(emptyProjectForm);
      setNewStructureTitle("");
    }
    setSubmitting(false);
  };

  const handleSuggestOutline = async () => {
    if (!token) return;
    setStatus("");
    if (!form.main_topic) {
      setStatus("Main topic is required for AI suggestions.");
      return;
    }
    try {
      const response = await requestOutline(
        token,
        form.document_type,
        form.main_topic,
        outlineLength,
      );
      setForm((prev) => ({
        ...prev,
        structures: response.suggestions.map((item, index) => ({
          element_type: item.element_type as "section" | "slide",
          title: item.title,
          order_index: index,
        })),
      }));
    } catch (error) {
      setStatus((error as Error).message);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Create Project</h2>
        <button className="secondary" onClick={handleSuggestOutline}>
          AI-Suggest Outline
        </button>
      </div>
      <div className="form-row">
        <label>Project name</label>
        <input
          value={form.project_name}
          onChange={(e) => setForm((prev) => ({ ...prev, project_name: e.target.value }))}
          placeholder="Go-to-market deck"
        />
      </div>
      <div className="form-row">
        <label>Main topic</label>
        <input
          value={form.main_topic}
          onChange={(e) => setForm((prev) => ({ ...prev, main_topic: e.target.value }))}
          placeholder="AI launch strategy"
        />
      </div>
      <div className="form-row two-col">
        <label>Document type</label>
        <select
          value={form.document_type}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              document_type: e.target.value as ProjectInput["document_type"],
              structures: prev.structures.map((structure) => ({
                ...structure,
                element_type: e.target.value === "docx" ? "section" : "slide",
              })),
            }))
          }
        >
          {DOCUMENT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>
      <div className="form-row two-col">
        <label>Outline length</label>
        <input
          type="number"
          min={1}
          max={20}
          value={outlineLength}
          onChange={(e) => setOutlineLength(Number(e.target.value))}
        />
      </div>
      <div className="form-row">
        <label>Add {form.document_type === "docx" ? "section" : "slide"}</label>
        <div className="inline-row">
          <input
            value={newStructureTitle}
            onChange={(e) => setNewStructureTitle(e.target.value)}
            placeholder={form.document_type === "docx" ? "Executive Summary" : "Slide 1 Title"}
          />
          <button type="button" onClick={handleAddStructure}>
            Add
          </button>
        </div>
      </div>
      <ul className="structure-list">
        {form.structures.map((structure) => (
          <li key={structure.order_index}>
            #{structure.order_index + 1} {structure.title}
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Saving..." : "Save project"}
      </button>
    </div>
  );
}

