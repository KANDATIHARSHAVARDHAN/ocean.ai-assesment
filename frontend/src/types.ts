export type DocumentType = "docx" | "pptx";

export interface UserCredentials {
  email: string;
  password: string;
}

export interface DocumentStructure {
  id: number;
  element_type: "section" | "slide";
  title: string;
  order_index: number;
  created_at: string;
  content?: Content;
}

export interface RefinementHistory {
  id: number;
  old_content?: string;
  new_content: string;
  refinement_prompt: string;
  created_at: string;
  updated_at: string;
}

export interface Content {
  id: number;
  generated_content: string;
  refinement_prompt?: string;
  likes_count: number;
  dislikes_count: number;
  comments: string;
  history: RefinementHistory[];
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  project_name: string;
  document_type: DocumentType;
  main_topic: string;
  created_at: string;
  updated_at: string;
  structures: DocumentStructure[];
}

export interface ProjectInput {
  project_name: string;
  document_type: DocumentType;
  main_topic: string;
  structures: Array<{
    element_type: "section" | "slide";
    title: string;
    order_index: number;
  }>;
}

export interface OutlineSuggestion {
  title: string;
  element_type: "section" | "slide";
}

