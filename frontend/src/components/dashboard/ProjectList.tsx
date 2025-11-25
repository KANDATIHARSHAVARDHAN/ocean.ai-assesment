import type { Project } from "../../types";
import { ProjectCard } from "./ProjectCard";

type Props = {
  projects: Project[];
  selectedProjectId: number | null;
  onSelect: (project: Project) => void;
};

export function ProjectList({ projects, selectedProjectId, onSelect }: Props) {
  if (!projects.length) {
    return <p className="placeholder">No projects yet – create one to get started.</p>;
  }
  return (
    <ul className="project-list">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          active={project.id === selectedProjectId}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}


