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
  {
    id: "contractor-registration",
    icon: "📝",
    name: "Contractor Registration",
    description: "Fill out the contractor enlistment form and generate a printable order",
    htmlFile: null,
  },
    {
      id: "enrollment-data-form",
      icon: "🧾",
      name: "Enrollment Data Form",
      description: "Collect enrollment details and generate a printable summary",
      htmlFile: null,
    },
  ];

const DIYAS = [
  { left: "3%",  delay: "0s",    dur: "2.8s" },
  { left: "11%", delay: "0.4s",  dur: "3.2s" },
  { left: "21%", delay: "0.9s",  dur: "2.5s" },
  { left: "33%", delay: "0.2s",  dur: "3.6s" },
  { left: "46%", delay: "1.1s",  dur: "2.9s" },
  { left: "59%", delay: "0.6s",  dur: "3.1s" },
  { left: "70%", delay: "1.4s",  dur: "2.7s" },
  { left: "81%", delay: "0.3s",  dur: "3.4s" },
  { left: "91%", delay: "0.8s",  dur: "2.6s" },
];

function Diyas() {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden", pointerEvents: "none" }}>
      {DIYAS.map((d, i) => (
        <div key={i} style={{ position: "absolute", bottom: "4px", left: d.left, animation: `floatBalloon ${d.dur} ${d.delay} ease-in-out infinite` }}>
          <div style={{ fontSize: "22px", lineHeight: 1, filter: "drop-shadow(0 0 6px #FFD700) drop-shadow(0 0 12px #FF8C00)" }}>🪔</div>
        </div>
      ))}
      {["8%","25%","43%","62%","78%","95%"].map((left, i) => (
        <div key={`f${i}`} style={{ position: "absolute", top: "4px", left, fontSize: "16px", opacity: 0.7, animation: `floatBalloon ${2.4 + i * 0.3}s ${i * 0.5}s ease-in-out infinite` }}>🌸</div>
      ))}
    </div>
  );
}

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&display=swap');
        @keyframes floatBalloon {
          0%,100% { transform: translateY(0) rotate(-2deg); }
          50%      { transform: translateY(-14px) rotate(2deg); }
        }
        @keyframes shimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .tool-card-navratri {
          background: linear-gradient(135deg, #fffbf0 0%, #fff8e1 100%);
          border: 1.5px solid #e6a817;
          border-radius: 14px;
          padding: 24px;
          text-align: left;
          cursor: pointer;
          box-shadow: 0 2px 12px rgba(200,130,0,0.10);
          transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }
        .tool-card-navratri:hover {
          box-shadow: 0 8px 28px rgba(200,130,0,0.22);
          transform: translateY(-3px);
          border-color: #c8720a;
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #fff8e1 0%, #fff3e0 40%, #fce4ec 100%)", fontFamily: "'Noto Sans Devanagari','Segoe UI',sans-serif" }}>

        {/* Navratri Header */}
        <div style={{ position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #7B0D00 0%, #c0392b 25%, #e67e22 50%, #c0392b 75%, #7B0D00 100%)", backgroundSize: "300% auto", animation: "shimmer 8s linear infinite", borderBottom: "4px solid #FFD700" }}>
          <Diyas />
          <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "28px 24px 18px" }}>
            <div style={{ fontSize: "48px", marginBottom: "6px", filter: "drop-shadow(0 0 12px #FFD700)" }}>🏗️</div>
            <div style={{ color: "#FFD700", fontWeight: 900, fontSize: "1.8rem", letterSpacing: "0.06em", textShadow: "0 0 16px rgba(255,215,0,0.8), 0 2px 8px rgba(0,0,0,0.5)" }}>
              🪔 PWD Tools Suite 🪔
            </div>
            <div style={{ color: "#FFEAA7", fontWeight: 500, fontSize: "0.95rem", letterSpacing: "0.08em", marginTop: "6px" }}>
              Professional Tools for Public Works Department
            </div>
            <div style={{ color: "#FFD700", fontWeight: 500, fontSize: "0.8rem", letterSpacing: "0.12em", marginTop: "4px", opacity: 0.85 }}>
              ✦ Initiative: Mrs. Premlata Jain, AAO, PWD Udaipur ✦ नवरात्रि की शुभकामनाएं 🌸
            </div>
          </div>
          <div style={{ background: "linear-gradient(90deg, #FFD700, #FF8C00, #FFD700)", height: "3px" }} />
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
                className="tool-card-navratri"
              >
                <div style={{ fontSize: "36px", filter: "drop-shadow(0 0 4px rgba(230,168,23,0.4))" }}>{tool.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1rem", color: "#7B2D00", marginBottom: "6px" }}>{tool.name}</div>
                  <div style={{ fontSize: "0.875rem", color: "#6b3a00", lineHeight: 1.5 }}>{tool.description}</div>
                </div>
                <div style={{
                  marginTop: "auto",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#c0392b",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                }}>
                  🪔 Launch Tool
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "24px", color: "#7B2D00", fontSize: "0.85rem", borderTop: "2px solid #e6a817", background: "linear-gradient(90deg, #fffbf0, #fff8e1, #fffbf0)" }}>
          <div style={{ fontSize: "1.2rem", marginBottom: "4px" }}>🪔 ✦ 🌸 ✦ 🪔</div>
          <div style={{ fontWeight: 700, color: "#7B0D00", marginBottom: "4px" }}>🏗️ PWD Tools Suite</div>
          <div>Prepared on Initiative of Mrs. Premlata Jain, AAO | PWD Udaipur, Rajasthan</div>
        </div>
      </div>
    </>
  );
}
