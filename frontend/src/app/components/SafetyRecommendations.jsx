import { useState } from "react";
import { ShieldAlert, HardHat, AlertTriangle, Phone, ChevronDown, ChevronUp } from "lucide-react";

// ─── PPE Item Badge ──────────────────────────────────────────────────────────
function PpeBadge({ icon, label, required }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 12px",
        borderRadius: "8px",
        backgroundColor: required ? "rgba(239,68,68,0.08)" : "rgba(245,158,11,0.08)",
        border: `1px solid ${required ? "rgba(239,68,68,0.3)" : "rgba(245,158,11,0.3)"}`,
        minWidth: "0",
      }}
    >
      <span style={{ fontSize: "20px", flexShrink: 0 }}>{icon}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {label}
        </div>
        <div style={{ fontSize: "10px", color: required ? "var(--red)" : "var(--amber)", fontWeight: 600, letterSpacing: "0.05em" }}>
          {required ? "MANDATORY" : "RECOMMENDED"}
        </div>
      </div>
    </div>
  );
}

// ─── Action Step ─────────────────────────────────────────────────────────────
function ActionStep({ step, description, urgent }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        padding: "10px 12px",
        borderRadius: "8px",
        backgroundColor: urgent ? "rgba(239,68,68,0.06)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${urgent ? "rgba(239,68,68,0.25)" : "var(--border)"}`,
        marginBottom: "8px",
      }}
    >
      <div
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: urgent ? "rgba(239,68,68,0.2)" : "rgba(245,158,11,0.2)",
          color: urgent ? "var(--red)" : "var(--amber)",
          fontSize: "12px",
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {step}
      </div>
      <div style={{ fontSize: "13px", color: "var(--text)", lineHeight: 1.5 }}>
        {description}
      </div>
    </div>
  );
}

// ─── Definitions ─────────────────────────────────────────────────────────────
const RECOMMENDATIONS = {
  critical: {
    label: "CRITICAL RISK — IMMEDIATE ACTION REQUIRED",
    color: "var(--red)",
    bgColor: "rgba(239,68,68,0.08)",
    borderColor: "rgba(239,68,68,0.4)",
    headerBg: "rgba(239,68,68,0.15)",
    icon: "🚨",
    ppe: [
      { icon: "⛑️", label: "Hard Hat (EN 397)", required: true },
      { icon: "🦺", label: "High-Vis Vest (Class 3)", required: true },
      { icon: "👢", label: "Steel-Toed Safety Boots", required: true },
      { icon: "🧤", label: "Heavy-Duty Gloves", required: true },
      { icon: "😷", label: "Dust Respirator (P2)", required: true },
      { icon: "🦺", label: "Full-Body Safety Harness", required: true },
      { icon: "👓", label: "Safety Goggles (EN 166)", required: true },
      { icon: "📡", label: "Personal Gas Monitor", required: true },
    ],
    actions: [
      { step: 1, description: "EVACUATE all personnel from the affected zone immediately. Clear a 50-metre safety perimeter.", urgent: true },
      { step: 2, description: "Stop ALL machinery and heavy equipment operations in the site immediately.", urgent: true },
      { step: 3, description: "Call emergency services and site geotechnical engineer — report imminent landslide risk.", urgent: true },
      { step: 4, description: "Notify site supervisor, safety officer, and project manager via emergency communication protocol.", urgent: true },
      { step: 5, description: "Set up safety barriers and warning signs at all entry points to the danger zone.", urgent: false },
      { step: 6, description: "Do NOT re-enter the zone until a qualified geotechnical engineer confirms it is safe.", urgent: false },
      { step: 7, description: "Document all readings and sensor data for incident reporting and regulatory compliance.", urgent: false },
    ],
    contacts: [
      { label: "Emergency Services", number: "999" },
      { label: "Site Safety Officer", number: "Ext. 201" },
      { label: "Geotechnical Engineer", number: "Ext. 305" },
    ],
    monitoringNote: "🔴 Continuous monitoring — 30-second sensor polling intervals active",
  },
  warning: {
    label: "WARNING RISK — HEIGHTENED PRECAUTIONS",
    color: "var(--amber)",
    bgColor: "rgba(245,158,11,0.07)",
    borderColor: "rgba(245,158,11,0.35)",
    headerBg: "rgba(245,158,11,0.12)",
    icon: "⚠️",
    ppe: [
      { icon: "⛑️", label: "Hard Hat (EN 397)", required: true },
      { icon: "🦺", label: "High-Vis Vest (Class 2)", required: true },
      { icon: "👢", label: "Steel-Toed Safety Boots", required: true },
      { icon: "🧤", label: "Work Gloves", required: false },
      { icon: "😷", label: "Dust Mask (FFP2)", required: false },
      { icon: "👓", label: "Safety Glasses", required: false },
    ],
    actions: [
      { step: 1, description: "Reduce non-essential personnel in the monitoring zone. Only authorised workers allowed.", urgent: true },
      { step: 2, description: "Schedule a geotechnical inspection within 24 hours. Contact engineering team now.", urgent: true },
      { step: 3, description: "Increase sensor polling to 2-minute intervals and assign a dedicated monitoring operator.", urgent: false },
      { step: 4, description: "Prepare the site evacuation plan and brief all workers on evacuation routes and assembly points.", urgent: false },
      { step: 5, description: "Restrict heavy machinery operations near the flagged zone until inspection is completed.", urgent: false },
      { step: 6, description: "Log all warning events and notify the site manager for daily review.", urgent: false },
    ],
    contacts: [
      { label: "Site Safety Officer", number: "Ext. 201" },
      { label: "Geotechnical Engineer", number: "Ext. 305" },
      { label: "Site Manager", number: "Ext. 100" },
    ],
    monitoringNote: "🟠 Elevated monitoring — 2-minute sensor polling intervals recommended",
  },
  safe: {
    label: "SAFE CONDITIONS — ROUTINE OPERATIONS",
    color: "var(--green)",
    bgColor: "rgba(34,197,94,0.06)",
    borderColor: "rgba(34,197,94,0.3)",
    headerBg: "rgba(34,197,94,0.1)",
    icon: "✅",
    ppe: [
      { icon: "⛑️", label: "Hard Hat (EN 397)", required: true },
      { icon: "🦺", label: "High-Vis Vest", required: true },
      { icon: "👢", label: "Safety Boots", required: true },
      { icon: "🧤", label: "Work Gloves", required: false },
      { icon: "👓", label: "Safety Glasses", required: false },
    ],
    actions: [
      { step: 1, description: "Continue routine monitoring — sensor readings within normal operating parameters.", urgent: false },
      { step: 2, description: "Maintain standard construction site safety protocols and toolbox talks.", urgent: false },
      { step: 3, description: "Review sensor data at standard 30-minute intervals and log daily readings.", urgent: false },
      { step: 4, description: "Ensure all personnel have reviewed site evacuation procedures and assembly points.", urgent: false },
    ],
    contacts: [
      { label: "Site Safety Officer", number: "Ext. 201" },
      { label: "Site Manager", number: "Ext. 100" },
    ],
    monitoringNote: "🟢 Standard monitoring — 5-minute sensor polling intervals active",
  },
};

// ─── Main Component ───────────────────────────────────────────────────────────
export function SafetyRecommendations({ riskLevel = "safe" }) {
  const [expanded, setExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState("ppe");

  const rec = RECOMMENDATIONS[riskLevel] || RECOMMENDATIONS.safe;

  return (
    <div
      style={{
        borderRadius: "10px",
        border: `1px solid ${rec.borderColor}`,
        backgroundColor: rec.bgColor,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          backgroundColor: rec.headerBg,
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <ShieldAlert size={18} style={{ color: rec.color, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: rec.color, letterSpacing: "0.05em" }}>
              {rec.icon} SAFETY RECOMMENDATIONS
            </div>
            <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px" }}>
              {rec.label}
            </div>
          </div>
        </div>
        <div style={{ color: "var(--muted)", flexShrink: 0 }}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* Body */}
      {expanded && (
        <div style={{ padding: "16px 18px" }}>

          {/* Monitoring Note */}
          <div
            style={{
              fontSize: "12px",
              color: rec.color,
              padding: "8px 14px",
              borderRadius: "6px",
              backgroundColor: `${rec.bgColor}`,
              border: `1px solid ${rec.borderColor}`,
              marginBottom: "16px",
              fontWeight: 600,
            }}
          >
            {rec.monitoringNote}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            {["ppe", "actions", "contacts"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  border: `1px solid ${activeTab === tab ? rec.color : "var(--border)"}`,
                  backgroundColor: activeTab === tab ? `${rec.bgColor}` : "transparent",
                  color: activeTab === tab ? rec.color : "var(--muted)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textTransform: "uppercase",
                }}
              >
                {tab === "ppe" ? "⛑️ PPE Required" : tab === "actions" ? "📋 Actions" : "📞 Contacts"}
              </button>
            ))}
          </div>

          {/* PPE Tab */}
          {activeTab === "ppe" && (
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--muted)",
                  marginBottom: "12px",
                  lineHeight: 1.5,
                }}
              >
                <HardHat size={13} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
                All personnel entering the work zone must wear the following Personal Protective Equipment:
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "8px",
                }}
              >
                {rec.ppe.map((item, i) => (
                  <PpeBadge key={i} icon={item.icon} label={item.label} required={item.required} />
                ))}
              </div>
              {riskLevel === "critical" && (
                <div
                  style={{
                    marginTop: "14px",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    fontSize: "12px",
                    color: "var(--red)",
                    lineHeight: 1.6,
                  }}
                >
                  ⚠️ <strong>Critical zone protocol:</strong> Full-body harness required for any work above 1.5m. All PPE must meet current regulatory standards. No exceptions permitted.
                </div>
              )}
            </div>
          )}

          {/* Actions Tab */}
          {activeTab === "actions" && (
            <div>
              <div style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "14px", lineHeight: 1.5 }}>
                <AlertTriangle size={13} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
                Follow these steps in order based on current risk assessment:
              </div>
              {rec.actions.map((action) => (
                <ActionStep
                  key={action.step}
                  step={action.step}
                  description={action.description}
                  urgent={action.urgent}
                />
              ))}
            </div>
          )}

          {/* Contacts Tab */}
          {activeTab === "contacts" && (
            <div>
              <div style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "14px", lineHeight: 1.5 }}>
                <Phone size={13} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
                Emergency and key contacts for current risk level:
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {rec.contacts.map((contact, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      backgroundColor: "var(--bg3)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div style={{ fontSize: "13px", color: "var(--text)", fontWeight: 500 }}>
                      {contact.label}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontFamily: "Share Tech Mono, monospace",
                        color: riskLevel === "critical" && i === 0 ? "var(--red)" : "var(--amber)",
                        fontWeight: 700,
                        padding: "4px 12px",
                        borderRadius: "6px",
                        backgroundColor: riskLevel === "critical" && i === 0 ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)",
                        border: `1px solid ${riskLevel === "critical" && i === 0 ? "rgba(239,68,68,0.3)" : "rgba(245,158,11,0.3)"}`,
                      }}
                    >
                      📞 {contact.number}
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: "12px",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--border)",
                  fontSize: "11px",
                  color: "var(--muted)",
                  lineHeight: 1.6,
                }}
              >
                💡 Always follow your organisation's emergency response plan. Keep all emergency numbers saved in your mobile device and site notice boards.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
