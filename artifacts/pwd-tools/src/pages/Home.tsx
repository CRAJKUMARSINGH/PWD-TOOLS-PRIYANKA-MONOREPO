import { useLocation } from "wouter";

const TOOLS = [
  {
    id: "bill-generator",
    icon: "🏗️",
    name: "Bill Generator",
    description: "Complete bill package with all documents and PDFs",
    htmlFile: "BillGenerator.html",
  },
  {
    id: "emd-refund",
    icon: "💸",
    name: "EMD Refund",
    description: "Calculate EMD refunds with penalties",
    htmlFile: "EmdRefund.html",
  },
  {
    id: "security-refund",
    icon: "🔒",
    name: "Security Refund",
    description: "Security deposit refund calculator",
    htmlFile: "SecurityRefund.html",
  },
  {
    id: "hindi-bill-note-sheet",
    icon: "📄",
    name: "Hindi Bill Note Sheet",
    description: "Complete Hindi bill scrutiny sheet with contractor autocomplete, GST rounding, and PDF generation",
    htmlFile: null,
  },
  {
    id: "deductions-table",
    icon: "➖",
    name: "Deductions Table",
    description: "Calculate TDS and security deductions",
    htmlFile: "DeductionsTable.html",
  },
  {
    id: "financial-progress",
    icon: "📈",
    name: "Financial Progress",
    description: "Track financial progress of projects",
    htmlFile: "FinancialProgressTracker.html",
  },
  {
    id: "apg-calculator",
    icon: "🧮",
    name: "APG Calculator",
    description: "Calculate APG values",
    htmlFile: "ApgCalculator.html",
  },
  {
    id: "delay-calculator",
    icon: "⏱️",
    name: "Delay Calculator",
    description: "Calculate project delays and extensions",
    htmlFile: "DelayCalculator.html",
  },
  {
    id: "stamp-duty",
    icon: "⚖️",
    name: "Stamp Duty",
    description: "Calculate stamp duty for documents",
    htmlFile: "StampDuty.html",
  },
  {
    id: "bill-deviation-generator",
    icon: "📋",
    name: "Bill Deviation Generator",
    description: "Generate bill deviation reports",
    htmlFile: "BillDeviationGenerator.html",
  },
];

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f2f5", fontFamily: "Segoe UI, Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a237e 0%, #7b1fa2 100%)", color: "white", padding: "32px 24px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "8px" }}>🏗️</div>
        <h1 style={{ margin: "0 0 8px", fontSize: "2rem", fontWeight: 700 }}>PWD Tools Suite</h1>
        <p style={{ margin: "0 0 4px", fontSize: "1rem", opacity: 0.9 }}>Professional Tools for Public Works Department</p>
        <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.75 }}>Initiative: Mrs. Premlata Jain, AAO, PWD Udaipur</p>
      </div>

      {/* Tool Grid */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}>
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => navigate(`/tool/${tool.id}`)}
              style={{
                background: "white",
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                padding: "24px",
                textAlign: "left",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                transition: "box-shadow 0.2s, transform 0.2s",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: "36px" }}>{tool.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "1rem", color: "#1a237e", marginBottom: "6px" }}>{tool.name}</div>
                <div style={{ fontSize: "0.875rem", color: "#555", lineHeight: 1.5 }}>{tool.description}</div>
              </div>
              <div style={{
                marginTop: "auto",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "#7b1fa2",
                fontWeight: 600,
                fontSize: "0.875rem",
              }}>
                🚀 Launch Tool
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "24px", color: "#888", fontSize: "0.85rem", borderTop: "1px solid #e0e0e0", background: "white" }}>
        <div style={{ fontWeight: 600, color: "#1a237e", marginBottom: "4px" }}>🏗️ PWD Tools Suite</div>
        <div>Prepared on Initiative of Mrs. Premlata Jain, AAO | PWD Udaipur, Rajasthan</div>
      </div>
    </div>
  );
}
