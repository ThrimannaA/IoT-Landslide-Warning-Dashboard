import { useState, useMemo } from "react";
import { StatCard } from "../../components/StatCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
} from "recharts";

const crackData = Array.from({ length: 30 }, (_, i) => ({
  time: i, value: 3.1 + (Math.random() * 0.1 - 0.05),
}));

const crackHistory = [
  { date: "Feb 15", value: 2.4 }, { date: "Feb 16", value: 2.4 },
  { date: "Feb 17", value: 2.5 }, { date: "Feb 18", value: 2.5 },
  { date: "Feb 19", value: 2.6 }, { date: "Feb 20", value: 2.6 },
  { date: "Feb 21", value: 2.6 }, { date: "Feb 22", value: 2.7 },
  { date: "Feb 23", value: 2.7 }, { date: "Feb 24", value: 2.7 },
  { date: "Feb 25", value: 2.8 }, { date: "Feb 26", value: 2.8 },
  { date: "Feb 27", value: 2.8 }, { date: "Feb 28", value: 2.9 },
  { date: "Mar 1", value: 2.9 }, { date: "Mar 2", value: 2.9 },
  { date: "Mar 3", value: 3.0 }, { date: "Mar 4", value: 3.0 },
  { date: "Mar 5", value: 3.0 }, { date: "Mar 6", value: 3.0 },
  { date: "Mar 7", value: 3.0 }, { date: "Mar 8", value: 3.0 },
  { date: "Mar 9", value: 3.0 }, { date: "Mar 10", value: 3.1 },
  { date: "Mar 11", value: 3.1 }, { date: "Mar 12", value: 3.1 },
  { date: "Mar 13", value: 3.2 }, { date: "Mar 14", value: 3.2 },
  { date: "Mar 15", value: 3.0 },
];

const riskDistribution = [
  { name: "Safe", value: 22 },
  { name: "Warning", value: 6 },
  { name: "Critical", value: 2 }
];
const riskColors = ["#22c55e", "#f59e0b", "#ef4444"];

export function CrackSensor() {
  const [dateRange, setDateRange] = useState("7d");
  const isSensorHealthy = true;

  const filteredCrackHistory = useMemo(() => {
    if (dateRange === "7d") return crackHistory.slice(-7);
    if (dateRange === "14d") return crackHistory.slice(-14);
    return crackHistory;
  }, [dateRange]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <StatCard label="GAP WIDTH" value="3.1 mm" sub="Current measurement" color="var(--green)" />
        <StatCard label="WIDENING RATE" value="0.02 mm/hr" sub="Minimal change" color="var(--green)" />
        <StatCard label="STATUS" value="SAFE" sub="Within tolerance" color="var(--green)" />
      </div>

      <div style={{ height: "20px" }}></div>

      <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030" }}>
        <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: "Barlow, sans-serif" }}>
          SENSOR TREND — LAST 30 MINUTES
        </div>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={crackData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 51, 71, 0.5)" />
            <XAxis dataKey="time" stroke="var(--muted)"
              style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }}
              tickFormatter={(v) => `${v}m`} />
            <YAxis domain={[2.8, 6]} stroke="var(--muted)"
              style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
            <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={false} />
            <ReferenceLine y={5} stroke="red" strokeDasharray="4 4"
              label={{ value: "CRITICAL (5mm)", position: "right", fill: "red", fontSize: 10 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ height: "20px" }}></div>

      <div style={{ display: 'flex', gap: '8px' }}>
        {[{ id: "7d", label: "Last 7 Days" }, { id: "14d", label: "Last 14 Days" }, { id: "30d", label: "Last 30 Days" }].map((range) => (
          <button key={range.id} onClick={() => setDateRange(range.id)} style={{
            padding: "4px 12px", borderRadius: "4px",
            fontSize: "11px", fontWeight: 600, fontFamily: "Barlow, sans-serif", letterSpacing: "0.05em",
            backgroundColor: dateRange === range.id ? "rgba(34, 197, 94, 0.15)" : "var(--bg3)",
            border: `1px solid ${dateRange === range.id ? "var(--green)" : "var(--border)"}`,
            color: dateRange === range.id ? "var(--green)" : "var(--text)",
            cursor: "pointer"
          }}>
            {range.label.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ height: "12px" }}></div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
        <div style={{ gridColumn: 'span 3', padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: "Barlow, sans-serif" }}>
            CRACK DISPLACEMENT — HISTORICAL TREND ({dateRange.toUpperCase()})
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={filteredCrackHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 51, 71, 0.5)" />
              <XAxis dataKey="date" stroke="var(--muted)" style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
              <YAxis stroke="var(--muted)" style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
              <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ padding: "14px", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "10px", fontFamily: "Barlow, sans-serif", textAlign: "center" }}>
            RISK LEVEL DISTRIBUTION
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie data={riskDistribution} dataKey="value" innerRadius={25} outerRadius={45} paddingAngle={3}>
                {riskDistribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={riskColors[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "8px" }}>
            {[["#22c55e", "SAFE"], ["#f59e0b", "WARNING"], ["#ef4444", "CRITICAL"]].map(([color, label]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "10px", height: "10px", backgroundColor: color, borderRadius: "2px" }} />
                <span style={{ fontSize: "6px", color: "var(--muted)", fontFamily: "Share Tech Mono, monospace" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "14px", borderRadius: "8px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "20px", fontFamily: "Barlow, sans-serif" }}>
            SENSOR HEALTH
          </div>
          <div style={{ fontSize: "18px", fontWeight: 600, color: isSensorHealthy ? "var(--green)" : "var(--red)", marginBottom: "6px" }}>
            {isSensorHealthy ? "FUNCTIONING" : "FAULT DETECTED"}
          </div>
          <div style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.4 }}>
            {isSensorHealthy ? "Signal stable. No data loss detected." : "Check wiring, power supply, or sensor module."}
          </div>
        </div>
      </div>

      <div style={{ height: "8px" }}></div>

      <div style={{ padding: "16px", borderRadius: "8px", backgroundColor: "rgba(59, 130, 246, 0.08)", border: "1px solid var(--blue)" }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ fontSize: "24px", color: "var(--blue)" }}>◆</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--blue)", marginBottom: "8px" }}>No Action Required</div>
            <div style={{ fontSize: "12px", color: "var(--text)", lineHeight: 1.5 }}>
              Crack displacement is stable at 3.1mm with minimal widening rate. Continue routine monitoring.
              Alert will trigger if gap exceeds 5mm or widening rate exceeds 0.1mm/hr.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}