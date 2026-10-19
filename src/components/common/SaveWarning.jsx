import { useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { useToast } from "./toastContext";

// Says once when this device refuses to save, with a way to keep the counts anyway.
export default function SaveWarning() {
  const { saveProblem, exportData } = useApp();
  const toast = useToast();
  const shown = useRef(false);
  useEffect(() => {
    if (!saveProblem || shown.current) return;
    shown.current = true;
    toast("Your counts can't be saved on this device right now. Storage may be full, or blocked in a private window. Save a backup to keep them.", {
      action: { label: "Save backup", onClick: () => exportData() },
      duration: 12000,
    });
  }, [saveProblem, exportData, toast]);
  return null;
}
