type RefinementPanelProps = {
  prompt: string;
  setPrompt: (text: string) => void;
  sideHeading: string;
  setSideHeading: (text: string) => void;
  linesCount: number | undefined;
  setLinesCount: (n: number | undefined) => void;
  onGenerate: () => void;
  onRefine: () => void;
  disabled?: boolean;
};

export function RefinementPanel({
  prompt,
  setPrompt,
  sideHeading,
  setSideHeading,
  linesCount,
  setLinesCount,
  onGenerate,
  onRefine,
  disabled,
}: RefinementPanelProps) {
  return (
    <>
      <div className="ocean-login-row">
        <label>Side heading (optional):</label>
        <input
          type="text"
          placeholder="Side heading — shown at top of slide/section"
          value={sideHeading}
          onChange={(e) => setSideHeading(e.target.value)}
        />
      </div>
      <div className="ocean-login-row">
        <label>Number of lines (optional):</label>
        <input
          type="number"
          min={1}
          max={100}
          placeholder="e.g. 4"
          value={linesCount ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            const n = v === "" ? undefined : Math.max(1, Number(v));
            setLinesCount(n);
          }}
        />
      </div>
      <textarea
        className="prompt"
        placeholder="Provide clear instructions for Gemini... (e.g. 'Give me introduction of RAG in 4 lines')"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
      />
      <div className="editor-controls">
        <button onClick={onGenerate} disabled={disabled}>
          Generate
        </button>
        <button className="secondary" onClick={onRefine} disabled={disabled}>
          Refine
        </button>
      </div>
    </>
  );
}

