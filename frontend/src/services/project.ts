import type { DocumentStructure, Project, ProjectInput } from "../types";
import { apiRequest, downloadBinary } from "./api";

export function fetchProjects(token: string) {
  return apiRequest<Project[]>("/projects/", {}, token);
}

export function createProject(token: string, payload: ProjectInput) {
  return apiRequest<Project>(
    "/projects/",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function generateSection(
  token: string,
  structureId: number,
  prompt: string,
  sideHeading?: string,
  linesCount?: number,
) {
  return apiRequest<DocumentStructure>(
    `/generate/${structureId}`,
    {
      method: "POST",
      body: JSON.stringify({ prompt, side_heading: sideHeading, lines_count: linesCount }),
    },
    token,
  );
}

export function refineSection(
  token: string,
  structureId: number,
  prompt: string,
  sideHeading?: string,
  linesCount?: number,
) {
  return apiRequest<DocumentStructure>(
    `/generate/${structureId}/refine`,
    {
      method: "POST",
      body: JSON.stringify({ prompt, side_heading: sideHeading, lines_count: linesCount }),
    },
    token,
  );
}

export function sendFeedback(token: string, structureId: number, positive: boolean) {
  return apiRequest<DocumentStructure>(
    `/generate/${structureId}/feedback`,
    {
      method: "POST",
      body: JSON.stringify({ positive }),
    },
    token,
  );
}

export function saveComment(token: string, structureId: number, comment: string) {
  return apiRequest<DocumentStructure>(
    `/generate/${structureId}/comment`,
    {
      method: "POST",
      body: JSON.stringify({ comment }),
    },
    token,
  );
}

export function requestOutline(
  token: string,
  document_type: "docx" | "pptx",
  main_topic: string,
  desired_sections: number,
) {
  return apiRequest<{ suggestions: Array<{ title: string; element_type: string }> }>(
    "/generate/outline/suggest",
    {
      method: "POST",
      body: JSON.stringify({ document_type, main_topic, desired_sections }),
    },
    token,
  );
}

export async function exportDocument(token: string, projectId: number) {
  return downloadBinary(`/export/${projectId}`, token);
}


