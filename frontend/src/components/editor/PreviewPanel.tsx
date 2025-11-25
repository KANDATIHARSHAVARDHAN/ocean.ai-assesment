import { useEffect, useState } from "react";

import type { DocumentStructure } from "../../types";

type PreviewPanelProps = {
  structure: DocumentStructure;
  onLike: (positive: boolean) => void;
  onSaveComment: (comment: string) => void;
};

export function PreviewPanel({ structure, onLike, onSaveComment }: PreviewPanelProps) {
  const [comment, setComment] = useState(structure.content?.comments ?? "");

  useEffect(() => {
    setComment(structure.content?.comments ?? "");
  }, [structure]);

  return (
    <div>
      <div className="content-preview">
        {structure.content?.generated_content ? (
          <p>{structure.content.generated_content}</p>
        ) : (
          <p className="placeholder">No content yet.</p>
        )}
      </div>
      <div className="feedback-row">
        <button className="like" onClick={() => onLike(true)}>
          👍 {structure.content?.likes_count ?? 0}
        </button>
        <button className="dislike" onClick={() => onLike(false)}>
          👎 {structure.content?.dislikes_count ?? 0}
        </button>
      </div>
      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Add reviewer notes..."
      />
      <button className="secondary" onClick={() => onSaveComment(comment)}>
        Save comment
      </button>
    </div>
  );
}

