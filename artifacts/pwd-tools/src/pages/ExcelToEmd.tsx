/**
 * ExcelToEmd — the real tool is served as a standalone HTML file via ToolViewer.
 * This component is only a safety fallback; App.tsx redirects /excel-to-emd → /tool/excel-to-emd.
 */
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ExcelToEmd() {
  const [, navigate] = useLocation();
  useEffect(() => {
    navigate("/tool/excel-to-emd");
  }, []);
  return null;
}
