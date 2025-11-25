export function LoadingSpinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}


