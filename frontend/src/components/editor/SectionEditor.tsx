import { useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { useProjects } from "../../context/ProjectContext";
import {
  generateSection,
  refineSection,
  saveComment,
  sendFeedback,
} from "../../services/project";
import type { DocumentStructure } from "../../types";
import { PreviewPanel } from "./PreviewPanel";
import { RefinementPanel } from "./RefinementPanel";

type BaseEditorProps = {
  projectId: number;
  structure: DocumentStructure;
  label: string;
};

function BaseEditor({ projectId, structure, label }: BaseEditorProps) {
  const { token } = useAuth();
  const { updateStructure, setStatus } = useProjects();
  const [prompt, setPrompt] = useState("");
  const [sideHeading, setSideHeading] = useState("");
  const [linesCount, setLinesCount] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  if (!token) {
    return <p>Please log in to edit content.</p>;
  }

  const safeUpdate = (updatedStructure: DocumentStructure) => {
    updateStructure(projectId, updatedStructure);
    setPrompt("");
  };

  const run = async (action: "generate" | "refine") => {
    setStatus("");
    if (!prompt.trim()) {
      setStatus("Prompt required");
      return;
    }
    setLoading(true);
    try {
      if (action === "generate") {
        const response = await generateSection(token, structure.id, prompt, sideHeading, linesCount);
        safeUpdate(response);
      } else {
        const response = await refineSection(token, structure.id, prompt, sideHeading, linesCount);
        safeUpdate(response);
      }
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (positive: boolean) => {
    setStatus("");
    try {
      const response = await sendFeedback(token, structure.id, positive);
      safeUpdate(response);
    } catch (error) {
      setStatus((error as Error).message);
    }
  };

  const handleComment = async (comment: string) => {
    setStatus("");
    try {
      const response = await saveComment(token, structure.id, comment);
      safeUpdate(response);
      setStatus("Comment saved");
    } catch (error) {
      setStatus((error as Error).message);
    }
  };

  return (
    <div className="panel">
      <h2>
        {label}: {structure.title}
      </h2>
      <RefinementPanel
        prompt={prompt}
        setPrompt={setPrompt}
        sideHeading={sideHeading}
        setSideHeading={setSideHeading}
        linesCount={linesCount}
        setLinesCount={setLinesCount}
        onGenerate={() => run("generate")}
        onRefine={() => run("refine")}
        disabled={loading}
      />
      {loading && <p className="status">Working...</p>}
      <PreviewPanel structure={structure} onLike={handleFeedback} onSaveComment={handleComment} />
    </div>
  );
}

type EditorProps = {
  projectId: number;
  structure: DocumentStructure;
};

export function SectionEditor(props: EditorProps) {
  return <BaseEditor {...props} label="Section" />;
}

export function SlideEditor(props: EditorProps) {
  return <BaseEditor {...props} label="Slide" />;
}

