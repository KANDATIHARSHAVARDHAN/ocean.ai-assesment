import type { Project } from "../../types";

type Props = {
  project: Project;
  active?: boolean;
  onSelect?: (project: Project) => void;
};

export function ProjectCard({ project, active, onSelect }: Props) {
  return (
    <li
      className={active ? "active" : ""}
      onClick={() => onSelect?.(project)}
      style={{ cursor: "pointer" }}
    >
      <div>
        <strong>{project.project_name}</strong>
        <p>{project.main_topic}</p>
      </div>
      <span>{project.document_type.toUpperCase()}</span>
    </li>
  );
}


