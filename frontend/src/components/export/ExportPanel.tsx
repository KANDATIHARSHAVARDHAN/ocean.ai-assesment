import { useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { exportDocument } from "../../services/project";
import { downloadBlob } from "../../utils/helpers";

type Props = {
  projectId: number;
  projectName: string;
};

export function ExportPanel({ projectId, projectName }: Props) {
  const { token } = useAuth();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const blob = await exportDocument(token, projectId);
      downloadBlob(blob, projectName);
      setStatus("Export ready");
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="export-panel">
      <button onClick={handleExport} disabled={loading}>
        {loading ? "Exporting..." : "Export document"}
      </button>
      {status && <p className="status">{status}</p>}
    </div>
  );
}


