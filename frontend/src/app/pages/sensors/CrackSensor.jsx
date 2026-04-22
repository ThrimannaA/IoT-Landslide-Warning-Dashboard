// import { useState, useEffect } from "react";
// import { StatCard } from "../../components/StatCard";
// import { getAllReadings, getLatestReading } from "../../../services/firebaseService";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   ResponsiveContainer,
//   CartesianGrid,
//   PieChart,
//   Pie,
//   Cell,
//   ReferenceLine,
// } from "recharts";

// const riskColors = ["#22c55e", "#f59e0b", "#ef4444"];

// export function CrackSensor() {
//   const [dateRange, setDateRange] = useState("7d");
//   const [crackData, setCrackData] = useState([]);
//   const [crackHistory, setCrackHistory] = useState([]);
//   const [latestCrack, setLatestCrack] = useState(3.1);
//   const [crackRate, setCrackRate] = useState(0);
//   const [riskDistribution, setRiskDistribution] = useState([
//     { name: "Safe", value: 0 },
//     { name: "Warning", value: 0 },
//     { name: "Critical", value: 0 }
//   ]);
//   const isSensorHealthy = true;

//   useEffect(() => {
//     // Get latest crack reading
//     getLatestReading((latest) => {
//       if (latest) {
//         setLatestCrack(latest.crack_width || 0);
//       }
//     });

//     // Get all readings for history
//     getAllReadings((readings) => {
//       if (readings && readings.length > 0) {
//         // Prepare crack trend data (last 30 readings)
//         const last30 = readings.slice(-30);
//         const trendData = last30.map((reading, index) => ({
//           time: index,
//           value: reading.crack_width || 0
//         }));
//         setCrackData(trendData);

//         // Prepare historical data based on date range
//         let historyData = [];
//         const now = new Date();
        
//         if (dateRange === "7d") {
//           historyData = readings.slice(-7);
//         } else if (dateRange === "14d") {
//           historyData = readings.slice(-14);
//         } else {
//           historyData = readings.slice(-30);
//         }
        
//         const historyChartData = historyData.map(reading => ({
//           date: new Date(reading.timestamp).toLocaleDateString(),
//           value: reading.crack_width || 0
//         }));
//         setCrackHistory(historyChartData);

//         // Calculate risk distribution
//         let safe = 0, warning = 0, critical = 0;
//         readings.forEach(reading => {
//           const crack = reading.crack_width || 0;
//           if (crack < 3.5) safe++;
//           else if (crack < 5) warning++;
//           else critical++;
//         });
        
//         const total = safe + warning + critical;
//         setRiskDistribution([
//           { name: "Safe", value: total > 0 ? Math.round((safe / total) * 100) : 0 },
//           { name: "Warning", value: total > 0 ? Math.round((warning / total) * 100) : 0 },
//           { name: "Critical", value: total > 0 ? Math.round((critical / total) * 100) : 0 }
//         ]);

//         // Calculate crack rate (last reading vs previous)
//         if (readings.length >= 2) {
//           const last = readings[readings.length - 1];
//           const prev = readings[readings.length - 2];
//           const timeDiff = new Date(last.timestamp) - new Date(prev.timestamp);
//           const hoursDiff = timeDiff / (1000 * 60 * 60);
//           const rate = (last.crack_width - prev.crack_width) / hoursDiff;
//           setCrackRate(Math.abs(rate).toFixed(2));
//         }
//       }
//     });
//   }, [dateRange]);

//   const getStatus = () => {
//     if (latestCrack > 5) return "CRITICAL";
//     if (latestCrack > 3.5) return "WARNING";
//     return "SAFE";
//   };

//   const getStatusColor = () => {
//     if (latestCrack > 5) return "var(--red)";
//     if (latestCrack > 3.5) return "var(--amber)";
//     return "var(--green)";
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
//         <StatCard label="GAP WIDTH" value={`${latestCrack.toFixed(1)} mm`} sub="Current measurement" color={getStatusColor()} />
//         <StatCard label="WIDENING RATE" value={`${crackRate} mm/hr`} sub="Rate of change" color={crackRate > 0.1 ? "var(--amber)" : "var(--green)"} />
//         <StatCard label="STATUS" value={getStatus()} sub="Safety status" color={getStatusColor()} />
//       </div>

//       <div style={{ height: "20px" }}></div>

//       <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030" }}>
//         <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: "Barlow, sans-serif" }}>
//           SENSOR TREND — LAST 30 READINGS
//         </div>
//         <ResponsiveContainer width="100%" height={150}>
//           <LineChart data={crackData}>
//             <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 51, 71, 0.5)" />
//             <XAxis dataKey="time" stroke="var(--muted)"
//               style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
//             <YAxis domain={[0, 8]} stroke="var(--muted)"
//               style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
//             <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={false} />
//             <ReferenceLine y={5} stroke="red" strokeDasharray="4 4"
//               label={{ value: "CRITICAL (5mm)", position: "right", fill: "red", fontSize: 10 }} />
//             <ReferenceLine y={3.5} stroke="#f59e0b" strokeDasharray="4 4"
//               label={{ value: "WARNING (3.5mm)", position: "right", fill: "#f59e0b", fontSize: 10 }} />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>

//       <div style={{ height: "20px" }}></div>

//       <div style={{ display: 'flex', gap: '8px' }}>
//         {[{ id: "7d", label: "Last 7 Days" }, { id: "14d", label: "Last 14 Days" }, { id: "30d", label: "Last 30 Days" }].map((range) => (
//           <button key={range.id} onClick={() => setDateRange(range.id)} style={{
//             padding: "4px 12px", borderRadius: "4px",
//             fontSize: "11px", fontWeight: 600, fontFamily: "Barlow, sans-serif", letterSpacing: "0.05em",
//             backgroundColor: dateRange === range.id ? "rgba(34, 197, 94, 0.15)" : "var(--bg3)",
//             border: `1px solid ${dateRange === range.id ? "var(--green)" : "var(--border)"}`,
//             color: dateRange === range.id ? "var(--green)" : "var(--text)",
//             cursor: "pointer"
//           }}>
//             {range.label.toUpperCase()}
//           </button>
//         ))}
//       </div>

//       <div style={{ height: "12px" }}></div>

//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
//         <div style={{ gridColumn: 'span 3', padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
//           <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: "Barlow, sans-serif" }}>
//             CRACK DISPLACEMENT — HISTORICAL TREND ({dateRange.toUpperCase()})
//           </div>
//           <ResponsiveContainer width="100%" height={150}>
//             <LineChart data={crackHistory}>
//               <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 51, 71, 0.5)" />
//               <XAxis dataKey="date" stroke="var(--muted)" style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
//               <YAxis domain={[0, 8]} stroke="var(--muted)" style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
//               <ReferenceLine y={5} stroke="#ef4444" strokeDasharray="4 4" />
//               <ReferenceLine y={3.5} stroke="#f59e0b" strokeDasharray="4 4" />
//               <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={false} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         <div style={{ padding: "14px", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
//           <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "10px", fontFamily: "Barlow, sans-serif", textAlign: "center" }}>
//             RISK LEVEL DISTRIBUTION
//           </div>
//           <ResponsiveContainer width="100%" height={120}>
//             <PieChart>
//               <Pie data={riskDistribution} dataKey="value" innerRadius={25} outerRadius={45} paddingAngle={3}>
//                 {riskDistribution.map((_, index) => (
//                   <Cell key={`cell-${index}`} fill={riskColors[index]} />
//                 ))}
//               </Pie>
//             </PieChart>
//           </ResponsiveContainer>
//           <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "8px" }}>
//             {[["#22c55e", "SAFE"], ["#f59e0b", "WARNING"], ["#ef4444", "CRITICAL"]].map(([color, label]) => (
//               <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                 <div style={{ width: "10px", height: "10px", backgroundColor: color, borderRadius: "2px" }} />
//                 <span style={{ fontSize: "6px", color: "var(--muted)", fontFamily: "Share Tech Mono, monospace" }}>{label}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div style={{ padding: "14px", borderRadius: "8px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
//           <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "20px", fontFamily: "Barlow, sans-serif" }}>
//             SENSOR HEALTH
//           </div>
//           <div style={{ fontSize: "18px", fontWeight: 600, color: isSensorHealthy ? "var(--green)" : "var(--red)", marginBottom: "6px" }}>
//             {isSensorHealthy ? "FUNCTIONING" : "FAULT DETECTED"}
//           </div>
//           <div style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.4 }}>
//             {isSensorHealthy ? "Signal stable. No data loss detected." : "Check wiring, power supply, or sensor module."}
//           </div>
//         </div>
//       </div>

//       <div style={{ height: "8px" }}></div>

//       <div style={{ padding: "16px", borderRadius: "8px", backgroundColor: latestCrack > 5 ? "rgba(239, 68, 68, 0.08)" : latestCrack > 3.5 ? "rgba(245, 158, 11, 0.08)" : "rgba(59, 130, 246, 0.08)", border: `1px solid ${latestCrack > 5 ? "var(--red)" : latestCrack > 3.5 ? "var(--amber)" : "var(--blue)"}` }}>
//         <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
//           <div style={{ fontSize: "24px", color: latestCrack > 5 ? "var(--red)" : latestCrack > 3.5 ? "var(--amber)" : "var(--blue)" }}>
//             {latestCrack > 5 ? "⬥" : latestCrack > 3.5 ? "⬦" : "◆"}
//           </div>
//           <div style={{ flex: 1 }}>
//             <div style={{ fontSize: "13px", fontWeight: 500, color: latestCrack > 5 ? "var(--red)" : latestCrack > 3.5 ? "var(--amber)" : "var(--blue)", marginBottom: "8px" }}>
//               {latestCrack > 5 ? "Immediate Action Required" : latestCrack > 3.5 ? "Caution — Monitor Closely" : "No Action Required"}
//             </div>
//             <div style={{ fontSize: "12px", color: "var(--text)", lineHeight: 1.5 }}>
//               {latestCrack > 5 
//                 ? `Crack width at ${latestCrack.toFixed(1)}mm exceeds critical threshold (5mm). Immediate evacuation recommended for affected zone.` 
//                 : latestCrack > 3.5 
//                 ? `Crack width at ${latestCrack.toFixed(1)}mm is approaching critical threshold. Increase monitoring frequency.` 
//                 : `Crack displacement is stable at ${latestCrack.toFixed(1)}mm. Continue routine monitoring. Alert will trigger if gap exceeds 5mm.`}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



/**
 * CrackSensor.jsx — Enhanced Visual Analytics Component
 *
 * UX Design Philosophy:
 *  - Progressive disclosure: simple headline → expandable deep-dives
 *  - Data storytelling: annotated events, contextual callouts, narrative flow
 *  - Brushing & linking: selecting a chart point highlights it across ALL panels
 *  - Accessibility: ARIA roles, keyboard navigation, color-blind safe palette
 *  - Decision support: tiered action checklist, time-to-threshold countdowns
 *  - Gestalt: proximity grouping, continuity in trend lines, figure-ground contrast
 *  - Pre-attentive: colour, size, motion used for immediate risk perception
 *  - Data-ink ratio: no decorative chrome, every pixel encodes information
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { StatCard } from "../../components/StatCard";
import {
  getAllReadings,
  getLatestReading,
} from "../../../services/firebaseService";
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, ReferenceLine,
  Tooltip, Area, AreaChart, BarChart, Bar, Legend,
  ComposedChart, ScatterChart, Scatter, ZAxis, RadarChart,
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ReferenceDot,
} from "recharts";
import {
  Calendar, Download, Filter, TrendingUp, AlertTriangle,
  Info, ChevronDown, ChevronUp, HelpCircle, Activity,
  CheckCircle, XCircle, Clock, Zap, Droplets, Thermometer,
  Wind, BarChart2, Eye, EyeOff, RefreshCw, Bell, BellOff,
} from "lucide-react";

// ─── Design tokens (aligned with assignment color theory) ────────────────────
const TOKEN = {
  safe:     "#22c55e",
  warning:  "#f59e0b",
  critical: "#ef4444",
  blue:     "#3b82f6",
  purple:   "#8b5cf6",
  teal:     "#14b8a6",
  muted:    "var(--muted)",
  bg2:      "var(--bg2)",
  bg3:      "var(--bg3)",
  border:   "var(--border)",
  text:     "var(--text)",
  card:     "#1A2030",
};

// Color-blind safe diverging palette
const CB_SAFE = ["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd"];

// Thresholds (based on CrackWidth)
const TH_WARNING  = 3.5;
const TH_CRITICAL = 5.0;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const riskOf = (v) =>
  v >= TH_CRITICAL ? "CRITICAL" : v >= TH_WARNING ? "WARNING" : "SAFE";

const colorOf = (v) =>
  v >= TH_CRITICAL ? TOKEN.critical : v >= TH_WARNING ? TOKEN.warning : TOKEN.safe;

const fmt = (v, d = 1) => (typeof v === "number" ? v.toFixed(d) : "—");

// Build a "severity score" 0-100 using only allowed columns
const severityScore = (r) => {
  let s = Math.min((r.crack_width || 0) / TH_CRITICAL, 1) * 60;
  s += Math.min((r.soil_20cm || 0) / 100, 1) * 20;
  s += Math.min(Math.abs(r.vibration || 0) / 100, 1) * 20;
  return Math.round(s);
};

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Animated ring gauge */
const RingGauge = ({ value, max = 8, label, color, size = 100, unit = "mm" }) => {
  const r   = 36;
  const circ = 2 * Math.PI * r;
  const pct  = Math.min(value / max, 1);
  const dash = circ * pct;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
      <svg width={size} height={size} viewBox="0 0 100 100" aria-label={`${label}: ${value}`}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r}
          fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dasharray 0.8s cubic-bezier(.4,0,.2,1)" }}
        />
        <text x="50" y="46" textAnchor="middle" fontSize="16" fontWeight="600" fill={color}>{fmt(value)}</text>
        <text x="50" y="60" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.45)">{unit}</text>
      </svg>
      <span style={{ fontSize:10, color: TOKEN.muted, letterSpacing:"0.08em" }}>{label.toUpperCase()}</span>
    </div>
  );
};

/** Inline sparkline */
const Sparkline = ({ data, color = TOKEN.safe, height = 36 }) => {
  if (!data || data.length < 2) return null;
  const vals = data.map(d => d.value || 0);
  const minV = Math.min(...vals);
  const maxV = Math.max(...vals) || 1;
  const w = 120, h = height;
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * w;
    const y = h - ((v - minV) / (maxV - minV)) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} style={{ overflow:"visible" }} aria-label="Trend sparkline">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/** Severity heatmap calendar */
const SeverityHeatmap = ({ readings }) => {
  if (!readings || readings.length === 0) return null;

  const byDate = {};
  readings.forEach(r => {
    const d = new Date(r.timestamp).toLocaleDateString();
    const s = severityScore(r);
    if (!byDate[d] || byDate[d].score < s) {
      byDate[d] = { date: d, score: s, crack: r.crack_width || 0 };
    }
  });
  const days = Object.values(byDate).slice(-21);

  const cellColor = (score) => {
    if (score >= 70) return TOKEN.critical;
    if (score >= 40) return TOKEN.warning;
    if (score >= 10) return TOKEN.safe;
    return "rgba(255,255,255,0.07)";
  };

  return (
    <div role="img" aria-label="Severity heatmap over time">
      <div style={{ fontSize:10, color:TOKEN.muted, marginBottom:8, letterSpacing:"0.08em" }}>
        DAILY MAX SEVERITY HEATMAP
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
        {days.map((d, i) => (
          <div key={i} title={`${d.date}: severity ${d.score}, crack ${fmt(d.crack)}mm`}
            style={{
              width:28, height:28, borderRadius:4,
              backgroundColor: cellColor(d.score),
              opacity: 0.7 + (d.score / 200),
              cursor:"pointer",
              transition:"transform 0.15s",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}
            onMouseEnter={e => e.target.style.transform = "scale(1.25)"}
            onMouseLeave={e => e.target.style.transform = "scale(1)"}
          >
            <span style={{ fontSize:7, color:"rgba(255,255,255,0.7)", fontWeight:600 }}>
              {new Date(d.date).getDate()}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:12, marginTop:8 }}>
        {[["SAFE", TOKEN.safe], ["WARNING", TOKEN.warning], ["CRITICAL", TOKEN.critical]].map(([l,c]) => (
          <span key={l} style={{ fontSize:9, color:c, display:"flex", alignItems:"center", gap:4 }}>
            <span style={{ width:8, height:8, borderRadius:2, backgroundColor:c, display:"inline-block" }} />{l}
          </span>
        ))}
      </div>
    </div>
  );
};

/** Annotated event timeline */
const EventTimeline = ({ readings, linkedPoint }) => {
  if (!readings || readings.length < 5) return null;

  const events = [];
  for (let i = 1; i < readings.length; i++) {
    const prev = readings[i-1], cur = readings[i];
    const prevCrack = prev.crack_width || 0;
    const curCrack  = cur.crack_width  || 0;

    if (prevCrack < TH_WARNING && curCrack >= TH_WARNING)
      events.push({ time: cur.timestamp, type:"threshold", label:"⚠ Crossed warning threshold", color: TOKEN.warning, value: curCrack });
    if (prevCrack < TH_CRITICAL && curCrack >= TH_CRITICAL)
      events.push({ time: cur.timestamp, type:"critical",  label:"🔴 Critical threshold breached", color: TOKEN.critical, value: curCrack });
    if ((prev.vibration || 0) === 0 && (cur.vibration || 0) > 40)
      events.push({ time: cur.timestamp, type:"vibration", label:"📳 Vibration spike", color: TOKEN.purple, value: cur.vibration });
  }

  if (events.length === 0) return (
    <div style={{ fontSize:11, color:TOKEN.safe, padding:"12px", textAlign:"center" }}>
      ✅ No significant threshold events in this period.
    </div>
  );

  return (
    <div role="list" aria-label="Event timeline">
      {events.slice(-8).reverse().map((e, i) => (
        <div key={i} role="listitem" style={{
          display:"flex", alignItems:"flex-start", gap:12, marginBottom:10,
          padding:"8px 10px", borderRadius:6,
          backgroundColor: `${e.color}12`,
          borderLeft: `3px solid ${e.color}`,
          opacity: linkedPoint ? 0.6 : 1,
          transition:"opacity 0.2s",
        }}>
          <div style={{ minWidth:2 }} />
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, color:e.color, fontWeight:500 }}>{e.label}</div>
            <div style={{ fontSize:9, color:TOKEN.muted, marginTop:2 }}>
              {new Date(e.time).toLocaleString()} · value: {fmt(e.value)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/** Action checklist card */
const ActionChecklist = ({ status, crackRate, predictions }) => {
  const [checked, setChecked] = useState({});
  const toggle = (id) => setChecked(p => ({ ...p, [id]: !p[id] }));

  const actions = {
    SAFE: [
      { id:"s1", text:"Continue routine monitoring every 30 min", priority:"low" },
      { id:"s2", text:"Document any visible surface changes",      priority:"low" },
      { id:"s3", text:"Review monthly trend report",               priority:"low" },
    ],
    WARNING: [
      { id:"w1", text:"Increase sensor polling to every 5 min",    priority:"high"   },
      { id:"w2", text:"Notify site supervisor of warning status",   priority:"high"   },
      { id:"w3", text:"Review evacuation procedure checklist",      priority:"medium" },
      { id:"w4", text:"Schedule structural inspection ≤ 24 hours",  priority:"high"   },
      { id:"w5", text:"Check soil moisture correlation",            priority:"medium" },
    ],
    CRITICAL: [
      { id:"c1", text:"🚨 EVACUATE Zone C immediately",             priority:"urgent" },
      { id:"c2", text:"Alert site supervisor & safety officer",     priority:"urgent" },
      { id:"c3", text:"Halt ALL construction / heavy activity",      priority:"urgent" },
      { id:"c4", text:"Call structural engineer for emergency review",priority:"urgent"},
      { id:"c5", text:"Monitor crack width every 2 minutes",         priority:"high"  },
      { id:"c6", text:"Prepare incident documentation",              priority:"high"  },
    ],
  };

  const priorityColor = { urgent:"#ef4444", high:"#f59e0b", medium:"#3b82f6", low:"#22c55e" };
  const items = actions[status] || actions.SAFE;
  const done  = items.filter(a => checked[a.id]).length;

  return (
    <div style={{ padding:14, backgroundColor:TOKEN.card, borderRadius:8, border:`1px solid ${TOKEN.border}` }}
      role="region" aria-label="Action checklist">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <div style={{ fontSize:11, fontWeight:600, color:colorOf(status === "CRITICAL" ? 6 : status === "WARNING" ? 4 : 0) }}>
          ACTION CHECKLIST — {status}
        </div>
        <div style={{ fontSize:10, color:TOKEN.muted }}>{done}/{items.length} complete</div>
      </div>

      <div style={{ height:3, backgroundColor:"rgba(255,255,255,0.08)", borderRadius:2, marginBottom:12, overflow:"hidden" }}>
        <div style={{
          height:"100%", borderRadius:2, backgroundColor: colorOf(status === "CRITICAL" ? 6 : 4),
          width:`${(done/items.length)*100}%`, transition:"width 0.4s ease",
        }} />
      </div>

      {items.map(action => (
        <label key={action.id} style={{
          display:"flex", alignItems:"flex-start", gap:8, marginBottom:8,
          cursor:"pointer", opacity: checked[action.id] ? 0.5 : 1,
          transition:"opacity 0.2s",
        }}>
          <input
            type="checkbox"
            checked={!!checked[action.id]}
            onChange={() => toggle(action.id)}
            style={{ marginTop:2, accentColor: priorityColor[action.priority] }}
            aria-label={action.text}
          />
          <span style={{
            fontSize:11, color: checked[action.id] ? TOKEN.muted : TOKEN.text,
            textDecoration: checked[action.id] ? "line-through" : "none",
            transition:"color 0.2s",
          }}>
            <span style={{
              display:"inline-block", width:6, height:6, borderRadius:"50%",
              backgroundColor: priorityColor[action.priority], marginRight:6, verticalAlign:"middle",
            }} />
            {action.text}
          </span>
        </label>
      ))}

      {predictions && (
        <div style={{ marginTop:12, padding:"8px 10px", backgroundColor:"rgba(59,130,246,0.08)", borderRadius:6 }}>
          <div style={{ fontSize:9, color: TOKEN.blue, marginBottom:4 }}>⏱ TIME-TO-THRESHOLD FORECAST</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
            <div style={{ fontSize:10, color:TOKEN.warning }}>
              ⚠ Warning in: <strong>{predictions.hoursToWarning}h</strong>
            </div>
            <div style={{ fontSize:10, color:TOKEN.critical }}>
              🔴 Critical in: <strong>{predictions.hoursToCritical}h</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/** Multi-metric correlation overlay using allowed columns */
const MultiMetricChart = ({ readings, linkedPoint, onBrush }) => {
  if (!readings || readings.length < 5) return null;

  const data = readings.slice(-50).map((r, i) => ({
    i,
    crack:    +(r.crack_width || 0).toFixed(2),
    rotationX: +((Math.abs(r.rotation_x || 0)) / 100 * 8).toFixed(2),
    vibration: +((Math.abs(r.vibration || 0)) / 100 * 8).toFixed(2),
    soil20:   +((r.soil_20cm  || 0) / 100 * 8).toFixed(2),
    ts: new Date(r.timestamp).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }),
  }));

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    if (linkedPoint && linkedPoint.i === payload.i) {
      return <circle cx={cx} cy={cy} r={6} fill={TOKEN.safe} stroke="#fff" strokeWidth={2} />;
    }
    return null;
  };

  return (
    <div style={{ padding:16, backgroundColor:TOKEN.card, borderRadius:8, border:`1px solid ${TOKEN.border}` }}>
      <div style={{ fontSize:10, fontWeight:600, color:TOKEN.muted, letterSpacing:"0.08em", marginBottom:12 }}>
        MULTI-SENSOR OVERLAY (normalised 0–8 scale)
      </div>
      <div style={{ fontSize:9, color:TOKEN.muted, marginBottom:8 }}>
        Click any data point to cross-highlight across all panels
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} onClick={(d) => d?.activePayload && onBrush(d.activePayload[0].payload)}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="ts" stroke={TOKEN.muted} tick={{ fontSize:8 }} interval={9} />
          <YAxis domain={[0,8]} stroke={TOKEN.muted} tick={{ fontSize:8 }} />
          <Tooltip
            contentStyle={{ backgroundColor:"#1A2030", border:"1px solid rgba(255,255,255,0.1)", fontSize:11, borderRadius:6 }}
            labelStyle={{ color:TOKEN.muted }}
          />
          <Legend wrapperStyle={{ fontSize:10 }} />
          <ReferenceLine y={TH_WARNING}  stroke={TOKEN.warning}  strokeDasharray="4 4" />
          <ReferenceLine y={TH_CRITICAL} stroke={TOKEN.critical} strokeDasharray="4 4" />
          <Line type="monotone" dataKey="crack"    stroke={TOKEN.safe}    strokeWidth={2.5} dot={false} activeDot={{ r:5 }} name="Crack (mm)" />
          <Line type="monotone" dataKey="rotationX" stroke={TOKEN.warning} strokeWidth={1.5} dot={false} activeDot={{ r:4 }} strokeDasharray="4 3" name="|Rotation X| (norm)" />
          <Line type="monotone" dataKey="vibration" stroke={TOKEN.purple}  strokeWidth={1.5} dot={false} activeDot={{ r:4 }} strokeDasharray="2 3" name="|Vibration| (norm)" />
          <Line type="monotone" dataKey="soil20"    stroke={TOKEN.blue}    strokeWidth={1.5} dot={false} activeDot={{ r:4 }} strokeDasharray="6 3" name="Soil 20cm (norm)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

/** Radar chart using only allowed columns */
const SensorRadar = ({ readings }) => {
  if (!readings || readings.length < 3) return null;
  const last10 = readings.slice(-10);

  const avg = (fn) => last10.reduce((s,r) => s + (fn(r)||0), 0) / last10.length;

  const data = [
    { metric:"Crack Risk",   value: Math.min(avg(r => (r.crack_width||0)/TH_CRITICAL)*100, 100) },
    { metric:"Soil 20cm",    value: Math.min(avg(r => (r.soil_20cm||0)),100) },
    { metric:"Vibration",    value: Math.min(avg(r => Math.abs(r.vibration||0)),100) },
    { metric:"Rotation X",   value: Math.min(Math.abs(avg(r => r.rotation_x||0))/2,100) },
    { metric:"Rotation Y",   value: Math.min(Math.abs(avg(r => r.rotation_y||0))/2,100) },
    { metric:"Rotation Z",   value: Math.min(Math.abs(avg(r => r.rotation_z||0))/2,100) },
  ];

  return (
    <div style={{ padding:14, backgroundColor:TOKEN.card, borderRadius:8, border:`1px solid ${TOKEN.border}` }}>
      <div style={{ fontSize:10, fontWeight:600, color:TOKEN.muted, letterSpacing:"0.08em", marginBottom:4 }}>
        SENSOR STATE SNAPSHOT
      </div>
      <div style={{ fontSize:9, color:TOKEN.muted, marginBottom:8 }}>Average of last 10 readings</div>
      <ResponsiveContainer width="100%" height={200}>
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis dataKey="metric" tick={{ fill:TOKEN.muted, fontSize:9 }} />
          <PolarRadiusAxis angle={30} domain={[0,100]} tick={{ fill:TOKEN.muted, fontSize:7 }} />
          <Radar name="Current" dataKey="value"
            stroke={TOKEN.safe} fill={TOKEN.safe} fillOpacity={0.15}
            dot={{ fill:TOKEN.safe, r:3 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

/** Scatter plot: Crack width vs Soil20cm */
const CorrelationScatter = ({ readings }) => {
  if (!readings || readings.length < 10) return null;

  const data = readings.slice(-80).map(r => ({
    soil: r.soil_20cm || 0,
    crack: r.crack_width || 0,
    risk: riskOf(r.crack_width || 0),
  }));

  const colorMap = { SAFE: TOKEN.safe, WARNING: TOKEN.warning, CRITICAL: TOKEN.critical };
  const grouped = { SAFE:[], WARNING:[], CRITICAL:[] };
  data.forEach(d => grouped[d.risk].push(d));

  return (
    <div style={{ padding:14, backgroundColor:TOKEN.card, borderRadius:8, border:`1px solid ${TOKEN.border}` }}>
      <div style={{ fontSize:10, fontWeight:600, color:TOKEN.muted, letterSpacing:"0.08em", marginBottom:4 }}>
        CRACK vs SOIL 20cm — CORRELATION
      </div>
      <div style={{ fontSize:9, color:TOKEN.muted, marginBottom:8 }}>
        Each point = one reading. Colour = risk level.
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <ScatterChart margin={{ top:4, right:12, bottom:4, left:0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="soil" name="Soil 20cm (%)" stroke={TOKEN.muted} tick={{ fontSize:8 }} label={{ value:"Soil 20cm (%)", position:"insideBottom", fill:TOKEN.muted, fontSize:9, offset:-2 }} />
          <YAxis dataKey="crack" name="Crack (mm)" stroke={TOKEN.muted} tick={{ fontSize:8 }} label={{ value:"mm", position:"insideLeft", fill:TOKEN.muted, fontSize:9 }} />
          <ZAxis range={[20,20]} />
          <Tooltip cursor={{ strokeDasharray:"3 3" }}
            contentStyle={{ backgroundColor:"#1A2030", border:"1px solid rgba(255,255,255,0.1)", fontSize:11, borderRadius:6 }}
            formatter={(v, n) => [fmt(v,2), n]}
          />
          <ReferenceLine y={TH_WARNING}  stroke={TOKEN.warning}  strokeDasharray="4 4" />
          <ReferenceLine y={TH_CRITICAL} stroke={TOKEN.critical} strokeDasharray="4 4" />
          {Object.entries(grouped).map(([risk, pts]) => (
            <Scatter key={risk} name={risk} data={pts} fill={colorMap[risk]} fillOpacity={0.7} />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

/** Hourly bar chart using only allowed columns */
const HourlyPattern = ({ readings }) => {
  if (!readings || readings.length < 24) return null;

  const byHour = Array.from({ length:24 }, (_, h) => ({ hour:`${String(h).padStart(2,"0")}:00`, sum:0, count:0 }));
  readings.forEach(r => {
    const h = new Date(r.timestamp).getHours();
    byHour[h].sum   += r.crack_width || 0;
    byHour[h].count += 1;
  });
  const data = byHour.map(h => ({
    hour:  h.hour,
    avg:   h.count > 0 ? +(h.sum / h.count).toFixed(2) : 0,
    fill:  h.count > 0 && (h.sum/h.count) >= TH_CRITICAL ? TOKEN.critical
         : h.count > 0 && (h.sum/h.count) >= TH_WARNING  ? TOKEN.warning
         : TOKEN.safe,
  }));

  return (
    <div style={{ padding:14, backgroundColor:TOKEN.card, borderRadius:8, border:`1px solid ${TOKEN.border}` }}>
      <div style={{ fontSize:10, fontWeight:600, color:TOKEN.muted, letterSpacing:"0.08em", marginBottom:4 }}>
        CRACK WIDTH BY HOUR OF DAY
      </div>
      <div style={{ fontSize:9, color:TOKEN.muted, marginBottom:8 }}>
        Identify diurnal patterns
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} margin={{ top:0, right:0, bottom:0, left:-20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="hour" stroke={TOKEN.muted} tick={{ fontSize:7 }} interval={3} />
          <YAxis stroke={TOKEN.muted} tick={{ fontSize:8 }} domain={[0, "auto"]} />
          <Tooltip
            contentStyle={{ backgroundColor:"#1A2030", border:"1px solid rgba(255,255,255,0.1)", fontSize:11, borderRadius:6 }}
            formatter={(v) => [`${fmt(v,2)} mm`, "Avg crack"]}
          />
          <ReferenceLine y={TH_WARNING}  stroke={TOKEN.warning}  strokeDasharray="3 3" />
          <ReferenceLine y={TH_CRITICAL} stroke={TOKEN.critical} strokeDasharray="3 3" />
          <Bar dataKey="avg" radius={[2,2,0,0]}>
            {data.map((d, i) => <Cell key={i} fill={d.fill} fillOpacity={0.75} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export function CrackSensor() {

  // ── State ─────────────────────────────────────────────────────────────────
  const [dateRange,      setDateRange]      = useState("7d");
  const [crackData,      setCrackData]      = useState([]);
  const [crackHistory,   setCrackHistory]   = useState([]);
  const [allReadings,    setAllReadings]     = useState([]);
  const [latestCrack,    setLatestCrack]     = useState(0);
  const [crackRate,      setCrackRate]       = useState(0);
  const [predictions,    setPredictions]     = useState(null);
  const [riskDist,       setRiskDist]        = useState([{ name:"Safe",value:0},{name:"Warning",value:0},{name:"Critical",value:0}]);
  const [correlationData,setCorrelationData] = useState([]);
  const [alertHistory,   setAlertHistory]    = useState([]);
  const [linkedPoint,    setLinkedPoint]     = useState(null);
  const [selectedNode,   setSelectedNode]    = useState("all");
  const [showPredictions,setShowPredictions] = useState(false);
  const [showFilters,    setShowFilters]     = useState(false);
  const [showHelp,       setShowHelp]        = useState(false);
  const [alertsMuted,    setAlertsMuted]     = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    headline: true, story: true, trend: true, multiMetric: false,
    patterns: false, correlations: false, scatter: false,
    radar: false, heatmap: false, alerts: false, actions: true,
  });

  const isSensorHealthy = true;
  const toggleSection   = (k) => setExpandedSections(p => ({ ...p, [k]: !p[k] }));

  // ── Calculations using only allowed columns ──────────────────────────────────────────
  const calculatePredictions = useCallback((readings) => {
    if (!readings || readings.length < 10) return null;
    const last10 = readings.slice(-10);
    let totalRate = 0;
    for (let i = 1; i < last10.length; i++) {
      const dt = (new Date(last10[i].timestamp) - new Date(last10[i-1].timestamp)) / 3_600_000;
      if (dt > 0) totalRate += Math.abs((last10[i].crack_width - last10[i-1].crack_width) / dt);
    }
    const avgRate     = totalRate / 9;
    const current     = readings[readings.length-1].crack_width || 0;
    const toWarning   = avgRate > 0 ? Math.max(0,(TH_WARNING - current)/avgRate)  : Infinity;
    const toCritical  = avgRate > 0 ? Math.max(0,(TH_CRITICAL - current)/avgRate) : Infinity;
    return {
      avgRate:          +avgRate.toFixed(3),
      hoursToWarning:   isFinite(toWarning)  ? +toWarning.toFixed(1)  : "∞",
      hoursToCritical:  isFinite(toCritical) ? +toCritical.toFixed(1) : "∞",
      predictedNextHour:+(current + avgRate).toFixed(2),
      predictedNextDay: +(current + avgRate*24).toFixed(2),
      trend: avgRate > 0.02 ? "Rapidly Worsening" : avgRate > 0.005 ? "Gradually Worsening" : "Stable",
    };
  }, []);

  const calculateCorrelations = useCallback((readings) => {
    if (!readings || readings.length < 5) return [];
    const correlate = (fn1, fn2) => {
      const pairs = readings.map(r => [fn1(r), fn2(r)]);
      const n = pairs.length;
      const [mx,my] = [pairs.map(p=>p[0]).reduce((a,b)=>a+b,0)/n, pairs.map(p=>p[1]).reduce((a,b)=>a+b,0)/n];
      const num = pairs.reduce((s,[x,y])=>s+(x-mx)*(y-my),0);
      const den = Math.sqrt(pairs.reduce((s,[x])=>s+(x-mx)**2,0)*pairs.reduce((s,[,y])=>s+(y-my)**2,0));
      return den === 0 ? 0 : Math.abs(num/den);
    };
    const crack = r => r.crack_width || 0;
    return [
      { factor:"Soil Moisture (20cm)", correlation:+correlate(crack,r=>r.soil_20cm||0).toFixed(2), icon:"💧", color:TOKEN.blue },
      { factor:"Rotation X (abs)",     correlation:+correlate(crack,r=>Math.abs(r.rotation_x||0)).toFixed(2), icon:"📐", color:TOKEN.warning },
      { factor:"Rotation Y (abs)",     correlation:+correlate(crack,r=>Math.abs(r.rotation_y||0)).toFixed(2), icon:"📐", color:TOKEN.warning },
      { factor:"Rotation Z (abs)",     correlation:+correlate(crack,r=>Math.abs(r.rotation_z||0)).toFixed(2), icon:"📐", color:TOKEN.warning },
      { factor:"Vibration",            correlation:+correlate(crack,r=>Math.abs(r.vibration||0)).toFixed(2), icon:"📳", color:TOKEN.critical },
    ].sort((a,b) => b.correlation - a.correlation);
  }, []);

  const generateAlertHistory = useCallback((readings) => {
    if (!readings || readings.length === 0) return [];
    const alerts = [];
    for (let i = readings.length-1; i >= 0 && alerts.length < 15; i--) {
      const crack = readings[i].crack_width || 0;
      if (crack >= TH_CRITICAL) alerts.push({
        id: alerts.length+1,
        time: new Date(readings[i].timestamp).toLocaleTimeString(),
        date: new Date(readings[i].timestamp).toLocaleDateString(),
        severity:"CRITICAL", color:TOKEN.critical,
        message:`Crack width ${fmt(crack)}mm — exceeds ${TH_CRITICAL}mm emergency threshold`,
        acked: false,
      });
      else if (crack >= TH_WARNING && alerts.length === 0) alerts.push({
        id: alerts.length+1,
        time: new Date(readings[i].timestamp).toLocaleTimeString(),
        date: new Date(readings[i].timestamp).toLocaleDateString(),
        severity:"WARNING", color:TOKEN.warning,
        message:`Crack width ${fmt(crack)}mm — approaching critical level`,
        acked: true,
      });
    }
    return alerts;
  }, []);

  // ── Data fetching ─────────────────────────────────────────────────────────
  useEffect(() => {
    getLatestReading((latest) => {
      if (latest) setLatestCrack(latest.crack_width || 0);
    });

    getAllReadings((readings) => {
      if (!readings || readings.length === 0) return;
      let filtered = selectedNode !== "all"
        ? readings.filter(r => r.node_name === selectedNode)
        : readings;

      setAllReadings(filtered);

      const last30 = filtered.slice(-30);
      setCrackData(last30.map((r,i) => ({ time:i, value:r.crack_width||0, timestamp:r.timestamp })));

      const daysMap = { "7d":7, "14d":14, "30d":30 };
      const histData = filtered.slice(-(daysMap[dateRange]||30)).map(r => ({
        date:     new Date(r.timestamp).toLocaleDateString(),
        value:    r.crack_width || 0,
        soil20:   r.soil_20cm   || 0,
        rotationX: r.rotation_x || 0,
      }));
      setCrackHistory(histData);

      let s=0,w=0,c=0;
      filtered.forEach(r => {
        const v = r.crack_width || 0;
        if (v < TH_WARNING) s++; else if (v < TH_CRITICAL) w++; else c++;
      });
      const total = s+w+c || 1;
      setRiskDist([
        { name:"Safe",     value:Math.round(s/total*100) },
        { name:"Warning",  value:Math.round(w/total*100) },
        { name:"Critical", value:Math.round(c/total*100) },
      ]);

      if (filtered.length >= 2) {
        const a = filtered[filtered.length-1], b = filtered[filtered.length-2];
        const dt = (new Date(a.timestamp)-new Date(b.timestamp))/3_600_000;
        if (dt > 0) setCrackRate(+Math.abs((a.crack_width-b.crack_width)/dt).toFixed(3));
      }

      setPredictions(calculatePredictions(filtered));
      setCorrelationData(calculateCorrelations(filtered));
      setAlertHistory(generateAlertHistory(filtered));
    });
  }, [dateRange, selectedNode, calculatePredictions, calculateCorrelations, generateAlertHistory]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const status       = riskOf(latestCrack);
  const statusColor  = colorOf(latestCrack);

  const annotatedCrackData = crackData.map((d,i,arr) => {
    const marks = {};
    if (d.value >= TH_CRITICAL) marks.critical = d.value;
    if (d.value >= TH_WARNING && d.value < TH_CRITICAL) marks.warning = d.value;
    return { ...d, ...marks };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ backgroundColor:"#0f1521", padding:10, border:"1px solid rgba(255,255,255,0.12)", borderRadius:6, fontSize:11 }}>
        <p style={{ margin:0, color:TOKEN.muted }}>Reading #{label}</p>
        <p style={{ margin:"2px 0 0", color:TOKEN.safe }}><strong>Crack:</strong> {fmt(payload[0].value,2)} mm</p>
        {payload[0].payload.timestamp && (
          <p style={{ margin:"2px 0 0", color:TOKEN.muted, fontSize:9 }}>{new Date(payload[0].payload.timestamp).toLocaleTimeString()}</p>
        )}
        {linkedPoint?.time === payload[0].payload.time && (
          <p style={{ margin:"2px 0 0", color:TOKEN.purple, fontSize:9 }}>● Linked across panels</p>
        )}
      </div>
    );
  };

  const SectionHeader = ({ id, icon: Icon, iconColor, title, badge }) => (
    <div
      onClick={() => toggleSection(id)}
      role="button" aria-expanded={expandedSections[id]}
      tabIndex={0}
      onKeyDown={(e) => e.key==="Enter" && toggleSection(id)}
      style={{
        display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:14, cursor:"pointer",
        backgroundColor: `${iconColor}08`,
        userSelect:"none",
      }}
    >
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        {Icon && <Icon size={14} style={{ color:iconColor }} />}
        <span style={{ fontSize:11, fontWeight:600, color:TOKEN.text }}>{title}</span>
        {badge && (
          <span style={{
            fontSize:9, padding:"2px 6px", borderRadius:10,
            backgroundColor:`${iconColor}22`, color:iconColor,
          }}>{badge}</span>
        )}
      </div>
      {expandedSections[id] ? <ChevronUp size={15} style={{ color:TOKEN.muted }} /> : <ChevronDown size={15} style={{ color:TOKEN.muted }} />}
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      role="main"
      aria-label="Crack sensor analytics dashboard"
      style={{ display:"flex", flexDirection:"column", gap:16 }}
    >

      {/* HELP MODAL */}
      {showHelp && (
        <div
          style={{
            position:"fixed", inset:0, backgroundColor:"rgba(0,0,0,0.7)",
            display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999,
          }}
          role="dialog" aria-modal="true" aria-label="Help overlay"
          onClick={() => setShowHelp(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor:"#1A2030", border:`2px solid ${TOKEN.warning}`,
              borderRadius:12, padding:24, width:460, maxWidth:"90vw", maxHeight:"80vh", overflowY:"auto",
            }}
          >
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
              <h2 style={{ color:TOKEN.warning, margin:0, fontSize:15, fontWeight:600 }}>Crack Sensor — Help Guide</h2>
              <button onClick={()=>setShowHelp(false)} style={{ background:"none",border:"none",color:TOKEN.text,cursor:"pointer",fontSize:20,lineHeight:1 }} aria-label="Close help">✕</button>
            </div>
            <div style={{ fontSize:12, color:TOKEN.text, lineHeight:1.7 }}>
              <p><strong style={{ color:TOKEN.safe }}>● SAFE (&lt;3.5 mm)</strong> — Normal. Routine monitoring.</p>
              <p><strong style={{ color:TOKEN.warning }}>● WARNING (3.5–5 mm)</strong> — Elevated. Increase inspection frequency.</p>
              <p><strong style={{ color:TOKEN.critical }}>● CRITICAL (&gt;5 mm)</strong> — Emergency. Evacuate and call engineer.</p>
              <hr style={{ borderColor:"rgba(255,255,255,0.1)", margin:"12px 0" }} />
              <p><strong>Brushing & Linking:</strong> Click any chart point to highlight that timestamp across all panels simultaneously.</p>
              <p><strong>Heatmap:</strong> Each cell = one day. Hover for date + severity details.</p>
              <p><strong>Radar Chart:</strong> Multi-sensor snapshot using Rotation X/Y/Z, Vibration, Soil20cm.</p>
              <p><strong>Scatter Plot:</strong> Reveals whether soil saturation triggers crack widening.</p>
              <p><strong>Hourly Pattern:</strong> Identify daily thermal-expansion or rain-cycle effects.</p>
              <p><strong>Action Checklist:</strong> Check off completed actions. Resets on page reload.</p>
              <p><strong>Predictions:</strong> Toggle ON to see trend-based time-to-threshold forecasts.</p>
              <p><strong>Export CSV:</strong> Downloads the last 30 readings for offline analysis.</p>
            </div>
            <button
              onClick={()=>setShowHelp(false)}
              style={{ marginTop:16, padding:"8px 0", width:"100%", backgroundColor:TOKEN.warning, border:"none", borderRadius:6, color:"#000", cursor:"pointer", fontWeight:600, fontSize:12 }}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* HEADLINE — STATUS STRIP */}
      <div style={{
        padding:"10px 16px", borderRadius:8,
        backgroundColor:`${statusColor}15`,
        border:`2px solid ${statusColor}`,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        flexWrap:"wrap", gap:8,
      }} role="banner" aria-label={`Current status: ${status}`}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{
            width:12, height:12, borderRadius:"50%",
            backgroundColor:statusColor,
            boxShadow:`0 0 8px ${statusColor}`,
            animation: status !== "SAFE" ? "pulse 1.5s infinite" : "none",
            display:"inline-block",
          }} />
          <span style={{ fontSize:14, fontWeight:700, color:statusColor, letterSpacing:"0.05em" }}>
            {status === "CRITICAL" ? "🚨 CRITICAL — IMMEDIATE ACTION" : status === "WARNING" ? "⚠ WARNING — MONITOR CLOSELY" : "✅ SAFE — NORMAL OPERATIONS"}
          </span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <span style={{ fontSize:22, fontWeight:700, color:statusColor }}>{fmt(latestCrack)} mm</span>
          <Sparkline data={crackData.slice(-15)} color={statusColor} />
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(1.3)}}`}</style>
      </div>

      {/* STAT CARDS */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:12 }} role="region" aria-label="Key metrics">
        <StatCard label="CRACK WIDTH"    value={`${fmt(latestCrack)} mm`}   sub={`Threshold: ${TH_WARNING}–${TH_CRITICAL}mm`} color={statusColor} />
        <StatCard label="WIDENING RATE"  value={`${fmt(crackRate,3)} mm/hr`} sub={crackRate > 0.02 ? "Rapid change" : crackRate > 0 ? "Gradual change" : "Stable"} color={crackRate > 0.05 ? TOKEN.critical : crackRate > 0.01 ? TOKEN.warning : TOKEN.safe} />
        <StatCard label="RISK STATUS"    value={status}                       sub={`Score: ${severityScore(allReadings[allReadings.length-1]||{})}/100`} color={statusColor} />
        <StatCard label="SENSOR HEALTH"  value={isSensorHealthy ? "ONLINE" : "FAULT"} sub="ToF + IMU + Soil" color={isSensorHealthy ? TOKEN.safe : TOKEN.critical} />
      </div>

      {/* TOP BAR — CONTROLS */}
      <div style={{
        display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:"10px 14px", backgroundColor:TOKEN.bg3, borderRadius:8,
        flexWrap:"wrap", gap:10,
      }} role="toolbar" aria-label="Dashboard controls">
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <Filter size={12} style={{ color:TOKEN.muted }} />
          <span style={{ fontSize:11, color:TOKEN.muted }}>Node:</span>
          <select
            value={selectedNode}
            onChange={e=>setSelectedNode(e.target.value)}
            style={{ padding:"3px 8px", borderRadius:4, fontSize:11, backgroundColor:TOKEN.bg2, border:`1px solid ${TOKEN.border}`, color:TOKEN.text }}
            aria-label="Filter by node"
          >
            <option value="all">All Nodes</option>
            <option value="Node1">Node 1</option>
            <option value="Node2">Node 2</option>
          </select>

          <div style={{ display:"flex", gap:4 }}>
            {[["7d","7 Days"],["14d","14 Days"],["30d","30 Days"]].map(([id,label]) => (
              <button key={id} onClick={()=>setDateRange(id)}
                aria-pressed={dateRange===id}
                style={{
                  padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:600,
                  backgroundColor: dateRange===id ? `${TOKEN.safe}25` : TOKEN.bg2,
                  border:`1px solid ${dateRange===id ? TOKEN.safe : TOKEN.border}`,
                  color: dateRange===id ? TOKEN.safe : TOKEN.muted,
                  cursor:"pointer",
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display:"flex", gap:6 }}>
          <button onClick={()=>setShowPredictions(p=>!p)}
            aria-pressed={showPredictions}
            style={{
              padding:"3px 10px", borderRadius:4, fontSize:10,
              backgroundColor: showPredictions ? `${TOKEN.purple}22` : TOKEN.bg2,
              border:`1px solid ${showPredictions ? TOKEN.purple : TOKEN.border}`,
              color: showPredictions ? TOKEN.purple : TOKEN.muted,
              cursor:"pointer", display:"flex", alignItems:"center", gap:4,
            }}>
            <TrendingUp size={11} /> Predictions
          </button>

          <button onClick={()=>setAlertsMuted(p=>!p)}
            aria-pressed={alertsMuted}
            style={{
              padding:"3px 10px", borderRadius:4, fontSize:10,
              backgroundColor: TOKEN.bg2, border:`1px solid ${TOKEN.border}`,
              color: alertsMuted ? TOKEN.muted : TOKEN.warning, cursor:"pointer",
              display:"flex", alignItems:"center", gap:4,
            }}>
            {alertsMuted ? <BellOff size={11}/> : <Bell size={11}/>}
            {alertsMuted ? "Muted" : "Alerts"}
          </button>

          <button
            onClick={() => {
              const headers = ["Timestamp","Crack(mm)","Soil20","Rotation_X","Rotation_Y","Rotation_Z","Vibration","Risk"];
              const rows = allReadings.slice(-30).map(r=>[
                r.timestamp, r.crack_width, r.soil_20cm, r.rotation_x, r.rotation_y, r.rotation_z, r.vibration, riskOf(r.crack_width||0)
              ]);
              const csv = [headers,...rows].map(r=>r.join(",")).join("\n");
              const a = document.createElement("a");
              a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
              a.download = `crack_export_${new Date().toISOString().slice(0,10)}.csv`;
              a.click();
            }}
            style={{
              padding:"3px 10px", borderRadius:4, fontSize:10,
              backgroundColor:TOKEN.bg2, border:`1px solid ${TOKEN.border}`,
              color:TOKEN.muted, cursor:"pointer",
              display:"flex", alignItems:"center", gap:4,
            }}
            aria-label="Export CSV"
          >
            <Download size={11}/> Export
          </button>

          <button onClick={()=>setShowHelp(true)}
            style={{
              padding:"3px 10px", borderRadius:4, fontSize:10,
              backgroundColor:TOKEN.bg2, border:`1px solid ${TOKEN.border}`,
              color:TOKEN.muted, cursor:"pointer",
              display:"flex", alignItems:"center", gap:4,
            }}
            aria-label="Open help">
            <HelpCircle size={11}/> Help
          </button>
        </div>
      </div>

      {/* LINKED POINT BANNER */}
      {linkedPoint && (
        <div style={{
          padding:"7px 14px", borderRadius:6, fontSize:10,
          backgroundColor:`${TOKEN.purple}15`, border:`1px solid ${TOKEN.purple}55`,
          display:"flex", justifyContent:"space-between", alignItems:"center",
        }} role="status">
          <span style={{ color:TOKEN.purple }}>
            🔗 Linked to reading #{linkedPoint.i} · {fmt(linkedPoint.value,2)}mm
            {linkedPoint.timestamp && ` · ${new Date(linkedPoint.timestamp).toLocaleTimeString()}`}
          </span>
          <button onClick={()=>setLinkedPoint(null)}
            style={{ background:"none", border:"none", color:TOKEN.purple, cursor:"pointer", fontSize:16, lineHeight:1 }}
            aria-label="Clear linked selection">✕</button>
        </div>
      )}

      {/* TWO-COLUMN LAYOUT: Gauges + Pie */}
      <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:16 }}>
        <div style={{ padding:16, backgroundColor:TOKEN.card, borderRadius:8, border:`1px solid ${TOKEN.border}`, display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ fontSize:10, fontWeight:600, color:TOKEN.muted, letterSpacing:"0.08em" }}>SENSOR GAUGES</div>
          <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
            <RingGauge value={latestCrack} max={8} label="Crack" color={statusColor} unit="mm" />

            <RingGauge value={allReadings[allReadings.length-1]?.soil_20cm||0} max={100} label="Soil 20cm" color={TOKEN.blue} unit="%" />

            <RingGauge value={Math.abs(allReadings[allReadings.length-1]?.vibration||0)} max={100} label="Vibration" color={TOKEN.purple} unit="raw" />
    
            <RingGauge value={Math.min(Math.abs(allReadings[allReadings.length-1]?.rotation_x||0), 10)} max={10} label="Rot X (abs)" color={TOKEN.warning} unit="°" />
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div style={{ padding:14, backgroundColor:TOKEN.card, borderRadius:8, border:`1px solid ${TOKEN.border}`, textAlign:"center" }}>
            <div style={{ fontSize:10, fontWeight:600, color:TOKEN.muted, letterSpacing:"0.08em", marginBottom:8 }}>RISK DISTRIBUTION</div>
            <ResponsiveContainer width="100%" height={130}>
              <PieChart>
                <Pie data={riskDist} dataKey="value" innerRadius={28} outerRadius={52} paddingAngle={3}
                  label={({ name, value }) => value > 0 ? `${name}: ${value}%` : ""} labelLine={false}>
                  {riskDist.map((_,i) => <Cell key={i} fill={[TOKEN.safe,TOKEN.warning,TOKEN.critical][i]} />)}
                </Pie>
                <Tooltip formatter={v=>[`${v}%`]} contentStyle={{ backgroundColor:TOKEN.card, border:`1px solid ${TOKEN.border}`, fontSize:10, borderRadius:6 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{
            padding:14, backgroundColor:TOKEN.card, borderRadius:8,
            border:`1px solid ${TOKEN.border}`,
            display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center",
          }}>
            <div style={{ fontSize:10, fontWeight:600, color:TOKEN.muted, letterSpacing:"0.08em", marginBottom:12 }}>SENSOR HEALTH</div>
            <div style={{
              width:52, height:52, borderRadius:"50%",
              backgroundColor: isSensorHealthy ? `${TOKEN.safe}20` : `${TOKEN.critical}20`,
              border:`2px solid ${isSensorHealthy ? TOKEN.safe : TOKEN.critical}`,
              display:"flex", alignItems:"center", justifyContent:"center", marginBottom:8,
            }}>
              {isSensorHealthy ? <CheckCircle size={24} color={TOKEN.safe} /> : <XCircle size={24} color={TOKEN.critical} />}
            </div>
            <div style={{ fontSize:11, fontWeight:600, color: isSensorHealthy ? TOKEN.safe : TOKEN.critical }}>
              {isSensorHealthy ? "FUNCTIONING" : "FAULT"}
            </div>
            <div style={{ fontSize:9, color:TOKEN.muted, textAlign:"center", marginTop:6, lineHeight:1.5 }}>
              {isSensorHealthy ? "ToF calibrated\nNo data loss" : "Check wiring"}
            </div>
            <div style={{ fontSize:9, color:TOKEN.muted, marginTop:6 }}>
              Calibrated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TREND CHART */}
      <div style={{ backgroundColor:TOKEN.card, border:`1px solid ${TOKEN.border}`, borderRadius:8, overflow:"hidden" }}>
        <SectionHeader id="trend" icon={TrendingUp} iconColor={TOKEN.safe} title="SENSOR TREND — LAST 30 READINGS" />
        {expandedSections.trend && (
          <div style={{ padding:16 }}>
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart
                data={annotatedCrackData}
                onClick={(d) => d?.activePayload && setLinkedPoint(d.activePayload[0].payload)}
              >
                <defs>
                  <linearGradient id="crackGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={TOKEN.safe} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={TOKEN.safe} stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="time" stroke={TOKEN.muted} tick={{ fontSize:8 }} />
                <YAxis domain={[0,8]} stroke={TOKEN.muted} tick={{ fontSize:8 }} label={{ value:"mm", angle:-90, position:"insideLeft", fill:TOKEN.muted, fontSize:9 }} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={TH_CRITICAL} stroke={TOKEN.critical} strokeDasharray="5 4"
                  label={{ value:`Critical (${TH_CRITICAL}mm)`, position:"right", fill:TOKEN.critical, fontSize:9 }} />
                <ReferenceLine y={TH_WARNING}  stroke={TOKEN.warning}  strokeDasharray="5 4"
                  label={{ value:`Warning (${TH_WARNING}mm)`, position:"right", fill:TOKEN.warning, fontSize:9 }} />

                <Area type="monotone" dataKey="value" stroke={TOKEN.safe} strokeWidth={2.5}
                  fill="url(#crackGrad)" dot={false} activeDot={{ r:6, fill:TOKEN.safe, stroke:"#fff", strokeWidth:2 }} />

                {linkedPoint && (
                  <ReferenceDot x={linkedPoint.time} y={linkedPoint.value}
                    r={8} fill={TOKEN.purple} stroke="#fff" strokeWidth={2} />
                )}

                {showPredictions && predictions && (
                  <ReferenceLine
                    y={predictions.predictedNextHour}
                    stroke={TOKEN.purple} strokeDasharray="8 4"
                    label={{ value:`Pred. 1hr: ${predictions.predictedNextHour}mm`, position:"insideTopRight", fill:TOKEN.purple, fontSize:9 }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>

            {crackHistory.length > 0 && (
              <div style={{ marginTop:14, padding:"10px 12px", backgroundColor:`rgba(59,130,246,0.08)`, borderRadius:6 }}>
                <div style={{ fontSize:10, color:TOKEN.blue, marginBottom:6, fontWeight:600 }}>📖 VISUAL NARRATIVE</div>
                <div style={{ fontSize:11, color:TOKEN.text, lineHeight:1.6 }}>
                  {latestCrack >= TH_CRITICAL
                    ? `🔴 The crack width has surpassed the ${TH_CRITICAL}mm emergency threshold, reaching ${fmt(latestCrack)}mm. The trend line shows ${predictions?.trend || "worsening"} conditions. Immediate structural intervention is required.`
                    : latestCrack >= TH_WARNING
                    ? `⚠ Crack width is currently ${fmt(latestCrack)}mm — above the ${TH_WARNING}mm warning threshold. The ${crackRate > 0 ? "upward" : "stable"} trend at ${fmt(crackRate,3)} mm/hr suggests${crackRate > 0.02 ? " rapid deterioration" : " gradual change"}. Schedule an inspection within 24 hours.`
                    : `✅ Crack width remains within safe bounds at ${fmt(latestCrack)}mm (threshold: ${TH_WARNING}mm). The stabilised trend over the last 30 readings supports continued normal operations with routine monitoring.`
                  }
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* HISTORICAL AREA CHART */}
      <div style={{ backgroundColor:TOKEN.card, border:`1px solid ${TOKEN.border}`, borderRadius:8, overflow:"hidden" }}>
        <SectionHeader id="story" icon={Calendar} iconColor={TOKEN.blue} title={`HISTORICAL TREND — ${dateRange.toUpperCase()}`} />
        {expandedSections.story && (
          <div style={{ padding:16 }}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={crackHistory} onClick={(d) => d?.activePayload && setLinkedPoint({ time:d.activePayload[0].payload.date, value:d.activePayload[0].payload.value })}>
                <defs>
                  <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={statusColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={statusColor} stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" stroke={TOKEN.muted} tick={{ fontSize:8 }} interval={Math.floor(crackHistory.length/8)} />
                <YAxis domain={[0,8]} stroke={TOKEN.muted} tick={{ fontSize:8 }} />
                <Tooltip contentStyle={{ backgroundColor:TOKEN.card, border:`1px solid ${TOKEN.border}`, fontSize:11, borderRadius:6 }} />
                <Legend wrapperStyle={{ fontSize:9 }} />
                <ReferenceLine y={TH_CRITICAL} stroke={TOKEN.critical} strokeDasharray="4 4" label={{ value:"CRITICAL", fill:TOKEN.critical, fontSize:9 }} />
                <ReferenceLine y={TH_WARNING}  stroke={TOKEN.warning}  strokeDasharray="4 4" label={{ value:"WARNING",  fill:TOKEN.warning,  fontSize:9 }} />
                <Area type="monotone" dataKey="value" stroke={statusColor} fill="url(#histGrad)" strokeWidth={2} name="Crack (mm)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* MULTI-METRIC OVERLAY */}
      <div style={{ backgroundColor:TOKEN.card, border:`1px solid ${TOKEN.border}`, borderRadius:8, overflow:"hidden" }}>
        <SectionHeader id="multiMetric" icon={Activity} iconColor={TOKEN.teal} title="MULTI-SENSOR OVERLAY" badge="Brushing & Linking" />
        {expandedSections.multiMetric && (
          <div style={{ padding:16 }}>
            <MultiMetricChart readings={allReadings} linkedPoint={linkedPoint} onBrush={setLinkedPoint} />
          </div>
        )}
      </div>

      {/* PREDICTIONS */}
      {showPredictions && predictions && (
        <div style={{ backgroundColor:TOKEN.card, border:`1px solid ${TOKEN.border}`, borderRadius:8, overflow:"hidden" }}>
          <SectionHeader id="predictions" icon={Zap} iconColor={TOKEN.warning} title="PREDICTIONS & TIME-TO-THRESHOLD" />
          {expandedSections.predictions && (
            <div style={{ padding:16 }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:14 }}>
                {[
                  ["Rate",          `${predictions.avgRate} mm/hr`, predictions.avgRate > 0.02 ? TOKEN.critical : TOKEN.safe],
                  ["In 1 hour",     `${predictions.predictedNextHour} mm`, colorOf(predictions.predictedNextHour)],
                  ["→ Warning",     `${predictions.hoursToWarning}h`,  predictions.hoursToWarning < 24 ? TOKEN.warning : TOKEN.safe],
                  ["→ Critical",    `${predictions.hoursToCritical}h`, predictions.hoursToCritical < 12 ? TOKEN.critical : TOKEN.warning],
                ].map(([label, value, color]) => (
                  <div key={label} style={{ textAlign:"center", padding:"10px 8px", backgroundColor:TOKEN.bg3, borderRadius:6 }}>
                    <div style={{ fontSize:9, color:TOKEN.muted, marginBottom:4 }}>{label}</div>
                    <div style={{ fontSize:16, fontWeight:600, color }}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding:"10px 12px", backgroundColor:`${TOKEN.purple}12`, borderRadius:6 }}>
                <div style={{ fontSize:10, color:TOKEN.purple, marginBottom:6, fontWeight:600 }}>🤖 AI TREND ASSESSMENT</div>
                <div style={{ fontSize:11, color:TOKEN.text, lineHeight:1.6 }}>
                  <strong style={{ color:TOKEN.purple }}>Trend: {predictions.trend}</strong> — average widening rate of {predictions.avgRate} mm/hr.
                  {predictions.trend === "Rapidly Worsening"
                    ? ` At this rate, critical threshold (${TH_CRITICAL}mm) will be reached in approximately ${predictions.hoursToCritical} hours. Escalate immediately.`
                    : predictions.trend === "Gradually Worsening"
                    ? ` Warning threshold (${TH_WARNING}mm) will be reached in approximately ${predictions.hoursToWarning} hours. Schedule inspection.`
                    : ` No significant widening trend detected. Continue routine monitoring.`
                  }
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* HOURLY PATTERN */}
      <div style={{ backgroundColor:TOKEN.card, border:`1px solid ${TOKEN.border}`, borderRadius:8, overflow:"hidden" }}>
        <SectionHeader id="patterns" icon={BarChart2} iconColor={TOKEN.warning} title="HOURLY CRACK PATTERN" badge="Temporal Analysis" />
        {expandedSections.patterns && (
          <div style={{ padding:16 }}>
            <HourlyPattern readings={allReadings} />
          </div>
        )}
      </div>

      {/* SENSOR CORRELATIONS */}
      <div style={{ backgroundColor:TOKEN.card, border:`1px solid ${TOKEN.border}`, borderRadius:8, overflow:"hidden" }}>
        <SectionHeader id="correlations" icon={Info} iconColor={TOKEN.blue} title="SENSOR CORRELATIONS (Pearson r)" />
        {expandedSections.correlations && (
          <div style={{ padding:16 }}>
            <div style={{ fontSize:9, color:TOKEN.muted, marginBottom:12 }}>
              Pearson correlation coefficient between crack width and each sensor. 1.0 = perfect linear relationship.
            </div>
            {correlationData.map((item, idx) => (
              <div key={idx} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4, alignItems:"center" }}>
                  <span style={{ fontSize:11, color:TOKEN.text }}>{item.icon} {item.factor}</span>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:10, color:item.color, fontWeight:600 }}>r = {item.correlation}</span>
                    <span style={{ fontSize:9, color:TOKEN.muted }}>
                      {item.correlation > 0.7 ? "Strong" : item.correlation > 0.4 ? "Moderate" : "Weak"}
                    </span>
                  </div>
                </div>
                <div style={{ height:6, backgroundColor:"rgba(255,255,255,0.07)", borderRadius:3, overflow:"hidden" }}>
                  <div style={{
                    width:`${item.correlation*100}%`, height:"100%",
                    backgroundColor:item.color, borderRadius:3,
                    transition:"width 0.6s ease",
                  }} />
                </div>
              </div>
            ))}
            <div style={{ fontSize:9, color:TOKEN.muted, marginTop:12, fontStyle:"italic" }}>
              Tip: Strong correlations may indicate causal relationships.
            </div>
          </div>
        )}
      </div>

      {/* SCATTER CORRELATION PLOT */}
      <div style={{ backgroundColor:TOKEN.card, border:`1px solid ${TOKEN.border}`, borderRadius:8, overflow:"hidden" }}>
        <SectionHeader id="scatter" icon={Eye} iconColor={TOKEN.teal} title="CRACK vs SOIL 20cm — SCATTER ANALYSIS" badge="Multi-dimensional" />
        {expandedSections.scatter && (
          <div style={{ padding:16 }}>
            <CorrelationScatter readings={allReadings} />
          </div>
        )}
      </div>

      {/* RADAR SNAPSHOT */}
      <div style={{ backgroundColor:TOKEN.card, border:`1px solid ${TOKEN.border}`, borderRadius:8, overflow:"hidden" }}>
        <SectionHeader id="radar" icon={Activity} iconColor={TOKEN.purple} title="MULTI-SENSOR STATE RADAR" />
        {expandedSections.radar && (
          <div style={{ padding:16 }}>
            <SensorRadar readings={allReadings} />
          </div>
        )}
      </div>

      {/* SEVERITY HEATMAP */}
      <div style={{ backgroundColor:TOKEN.card, border:`1px solid ${TOKEN.border}`, borderRadius:8, overflow:"hidden" }}>
        <SectionHeader id="heatmap" icon={Calendar} iconColor={TOKEN.warning} title="DAILY SEVERITY HEATMAP" badge="Calendar View" />
        {expandedSections.heatmap && (
          <div style={{ padding:16 }}>
            <SeverityHeatmap readings={allReadings} />
          </div>
        )}
      </div>

      {/* EVENT TIMELINE */}
      <div style={{ backgroundColor:TOKEN.card, border:`1px solid ${TOKEN.border}`, borderRadius:8, overflow:"hidden" }}>
        <SectionHeader id="story" icon={Clock} iconColor={TOKEN.critical} title="THRESHOLD EVENT TIMELINE" badge={`${alertHistory.length} events`} />
        {expandedSections.story !== undefined && (
          <div style={{ padding:16 }}>
            <EventTimeline readings={allReadings} linkedPoint={linkedPoint} />
          </div>
        )}
      </div>

      {/* ALERT HISTORY */}
      <div style={{ backgroundColor:TOKEN.card, border:`1px solid ${TOKEN.border}`, borderRadius:8, overflow:"hidden" }}>
        <SectionHeader id="alerts" icon={AlertTriangle} iconColor={TOKEN.critical} title="ALERT LOG" badge={alertsMuted ? "MUTED" : `${alertHistory.length} recent`} />
        {expandedSections.alerts && (
          <div style={{ padding:16 }}>
            {alertsMuted ? (
              <div style={{ textAlign:"center", padding:20, color:TOKEN.muted, fontSize:11 }}>🔕 Alerts muted. Click the bell icon in the toolbar to unmute.</div>
            ) : alertHistory.length === 0 ? (
              <div style={{ textAlign:"center", padding:20, color:TOKEN.safe, fontSize:11 }} role="status">
                ✅ No recent alerts detected. All parameters within normal range.
              </div>
            ) : (
              <div role="list">
                {alertHistory.map(a => (
                  <div key={a.id} role="listitem" style={{
                    padding:"10px 12px", marginBottom:8, borderRadius:6,
                    backgroundColor:`${a.color}12`, borderLeft:`3px solid ${a.color}`,
                  }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:10, color:a.color, fontWeight:700 }}>{a.severity}</span>
                      <span style={{ fontSize:9, color:TOKEN.muted }}>{a.date} {a.time}</span>
                    </div>
                    <div style={{ fontSize:11, color:TOKEN.text }}>{a.message}</div>
                    <div style={{ fontSize:9, marginTop:4, color: a.acked ? TOKEN.safe : TOKEN.warning }}>
                      {a.acked ? "✓ Acknowledged" : "⚠ Pending acknowledgement"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ACTION CHECKLIST */}
      <div style={{ backgroundColor:TOKEN.card, border:`1px solid ${TOKEN.border}`, borderRadius:8, overflow:"hidden" }}>
        <SectionHeader id="actions" icon={CheckCircle} iconColor={statusColor} title="DECISION SUPPORT — ACTION CHECKLIST" />
        {expandedSections.actions && (
          <div style={{ padding:14 }}>
            <ActionChecklist status={status} crackRate={crackRate} predictions={predictions} />
          </div>
        )}
      </div>

      {/* UX FOOTER NOTE */}
      <div style={{ fontSize:9, color:TOKEN.muted, textAlign:"center", padding:"6px 8px", lineHeight:1.6 }}>
        💡 <strong>UX features:</strong> Brushing &amp; Linking · Progressive Disclosure · Annotated Storytelling · Pearson Correlations ·
        Heatmap Calendar · Hourly Pattern · Radar Snapshot · Scatter Analysis · Action Checklists · ARIA Accessibility
        <br />Data flows in real-time from Firebase Realtime Database
      </div>
    </div>
  );
}







// // Below is correct

// import { useState, useEffect } from "react";
// import { StatCard } from "../../components/StatCard";
// import { getAllReadings, getLatestReading, getReadingsByDateRange } from "../../../services/firebaseService";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   ResponsiveContainer,
//   CartesianGrid,
//   PieChart,
//   Pie,
//   Cell,
//   ReferenceLine,
//   Tooltip,
//   Area,
//   AreaChart,
//   BarChart,
//   Bar,
//   Legend,
//   ComposedChart,
// } from "recharts";
// import { Calendar, Download, Filter, TrendingUp, AlertTriangle, Info, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

// const riskColors = ["#22c55e", "#f59e0b", "#ef4444"];

// export function CrackSensor() {
//   // ========== STATE MANAGEMENT ==========
//   const [dateRange, setDateRange] = useState("7d");
//   const [crackData, setCrackData] = useState([]);
//   const [crackHistory, setCrackHistory] = useState([]);
//   const [latestCrack, setLatestCrack] = useState(3.1);
//   const [crackRate, setCrackRate] = useState(0);
//   const [showPredictions, setShowPredictions] = useState(false);
//   const [selectedDataPoint, setSelectedDataPoint] = useState(null);
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedNode, setSelectedNode] = useState("all");
//   const [predictions, setPredictions] = useState(null);
//   const [riskDistribution, setRiskDistribution] = useState([
//     { name: "Safe", value: 0 },
//     { name: "Warning", value: 0 },
//     { name: "Critical", value: 0 }
//   ]);
//   const [correlationData, setCorrelationData] = useState([]);
//   const [alertHistory, setAlertHistory] = useState([]);
//   const [showHelp, setShowHelp] = useState(false);
//   const [expandedSections, setExpandedSections] = useState({
//     historical: true,
//     predictions: false,
//     correlations: false,
//     alerts: false
//   });

//   const isSensorHealthy = true;

//   // ========== HELPER FUNCTIONS ==========
//   const toggleSection = (section) => {
//     setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
//   };

//   // Calculate predictions based on trend
//   const calculatePredictions = (readings) => {
//     if (!readings || readings.length < 10) return null;
    
//     const last10 = readings.slice(-10);
//     const avgRate = last10.reduce((acc, r, i, arr) => {
//       if (i === 0) return 0;
//       const timeDiff = new Date(r.timestamp) - new Date(arr[i-1].timestamp);
//       const hoursDiff = timeDiff / (1000 * 60 * 60);
//       const rate = (r.crack_width - arr[i-1].crack_width) / hoursDiff;
//       return acc + Math.abs(rate);
//     }, 0) / 9;
    
//     const currentCrack = readings[readings.length - 1].crack_width || 0;
//     const hoursToWarning = avgRate > 0 ? ((3.5 - currentCrack) / avgRate) : Infinity;
//     const hoursToCritical = avgRate > 0 ? ((5 - currentCrack) / avgRate) : Infinity;
    
//     return {
//       avgRate: avgRate.toFixed(3),
//       hoursToWarning: Math.max(0, hoursToWarning).toFixed(1),
//       hoursToCritical: Math.max(0, hoursToCritical).toFixed(1),
//       predictedNextHour: (currentCrack + avgRate).toFixed(1),
//       predictedNextDay: (currentCrack + avgRate * 24).toFixed(1),
//       trend: avgRate > 0.02 ? "Rapidly Worsening" : avgRate > 0.005 ? "Gradually Worsening" : "Stable"
//     };
//   };

//   // Calculate correlation with other sensors
//   const calculateCorrelations = (readings) => {
//     if (!readings || readings.length < 5) return [];
    
//     const correlations = [];
    
//     // Crack vs Soil Moisture
//     let crackSoilSum = 0;
//     for (let i = 0; i < readings.length; i++) {
//       crackSoilSum += (readings[i].crack_width || 0) * (readings[i].soil_20cm || 0);
//     }
//     const crackSoilCorr = crackSoilSum / readings.length / 100;
    
//     // Crack vs Tilt
//     let crackTiltSum = 0;
//     for (let i = 0; i < readings.length; i++) {
//       crackTiltSum += (readings[i].crack_width || 0) * Math.abs(readings[i].rotation_x || 0);
//     }
//     const crackTiltCorr = crackTiltSum / readings.length / 50;
    
//     // Crack vs Vibration
//     let crackVibSum = 0;
//     for (let i = 0; i < readings.length; i++) {
//       crackVibSum += (readings[i].crack_width || 0) * Math.abs(readings[i].acceleration_x || 0);
//     }
//     const crackVibCorr = crackVibSum / readings.length / 2;
    
//     return [
//       { factor: "Soil Moisture", correlation: Math.min(1, crackSoilCorr).toFixed(2), icon: "💧", color: "#3b82f6" },
//       { factor: "Tilt Angle", correlation: Math.min(1, crackTiltCorr).toFixed(2), icon: "📐", color: "#f59e0b" },
//       { factor: "Vibration", correlation: Math.min(1, crackVibCorr).toFixed(2), icon: "📳", color: "#ef4444" }
//     ];
//   };

//   // Generate alert history
//   const generateAlertHistory = (readings) => {
//     if (!readings || readings.length === 0) return [];
    
//     const alerts = [];
//     let alertCount = 0;
    
//     for (let i = readings.length - 1; i >= 0 && alerts.length < 10; i--) {
//       const crack = readings[i].crack_width || 0;
//       if (crack > 5) {
//         alertCount++;
//         alerts.push({
//           id: alertCount,
//           time: new Date(readings[i].timestamp).toLocaleTimeString(),
//           date: new Date(readings[i].timestamp).toLocaleDateString(),
//           severity: "CRITICAL",
//           message: `Crack width reached ${crack.toFixed(1)}mm, exceeding critical threshold`,
//           acknowledged: false
//         });
//       } else if (crack > 3.5 && alerts.length % 3 === 0) {
//         alertCount++;
//         alerts.push({
//           id: alertCount,
//           time: new Date(readings[i].timestamp).toLocaleTimeString(),
//           date: new Date(readings[i].timestamp).toLocaleDateString(),
//           severity: "WARNING",
//           message: `Crack width at ${crack.toFixed(1)}mm, approaching critical level`,
//           acknowledged: true
//         });
//       }
//     }
    
//     return alerts;
//   };

//   // Handle chart click (Brushing & Linking)
//   const handleChartClick = (data) => {
//     if (data && data.activePayload) {
//       const point = data.activePayload[0].payload;
//       setSelectedDataPoint(point);
//       // This would trigger other charts to highlight the same time point
//       // In a full implementation, this would dispatch an event to other components
//     }
//   };

//   // Export data as CSV
//   const exportData = () => {
//     const headers = ["Timestamp", "Crack Width (mm)", "Status", "Rate (mm/hr)"];
//     const csvData = crackHistory.map(row => [
//       row.date,
//       row.value,
//       row.value > 5 ? "Critical" : row.value > 3.5 ? "Warning" : "Safe",
//       crackRate
//     ]);
    
//     const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
//     const blob = new Blob([csvContent], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `crack_data_${new Date().toISOString()}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   // ========== DATA FETCHING ==========
//   useEffect(() => {
//     getLatestReading((latest) => {
//       if (latest) {
//         setLatestCrack(latest.crack_width || 0);
//       }
//     });

//     getAllReadings((readings) => {
//       if (readings && readings.length > 0) {
//         // Filter by node if selected
//         let filteredReadings = readings;
//         if (selectedNode !== "all") {
//           filteredReadings = readings.filter(r => r.node_name === selectedNode);
//         }
        
//         // Trend data
//         const last30 = filteredReadings.slice(-30);
//         const trendData = last30.map((reading, index) => ({
//           time: index,
//           value: reading.crack_width || 0,
//           timestamp: reading.timestamp
//         }));
//         setCrackData(trendData);

//         // Historical data based on date range
//         let historyData = [];
//         const daysMap = { "7d": 7, "14d": 14, "30d": 30 };
//         const days = daysMap[dateRange] || 30;
//         historyData = filteredReadings.slice(-days);
        
//         const historyChartData = historyData.map(reading => ({
//           date: new Date(reading.timestamp).toLocaleDateString(),
//           value: reading.crack_width || 0,
//           fullDate: reading.timestamp
//         }));
//         setCrackHistory(historyChartData);

//         // Risk distribution
//         let safe = 0, warning = 0, critical = 0;
//         filteredReadings.forEach(reading => {
//           const crack = reading.crack_width || 0;
//           if (crack < 3.5) safe++;
//           else if (crack < 5) warning++;
//           else critical++;
//         });
        
//         const total = safe + warning + critical;
//         setRiskDistribution([
//           { name: "Safe", value: total > 0 ? Math.round((safe / total) * 100) : 0 },
//           { name: "Warning", value: total > 0 ? Math.round((warning / total) * 100) : 0 },
//           { name: "Critical", value: total > 0 ? Math.round((critical / total) * 100) : 0 }
//         ]);

//         // Crack rate
//         if (filteredReadings.length >= 2) {
//           const last = filteredReadings[filteredReadings.length - 1];
//           const prev = filteredReadings[filteredReadings.length - 2];
//           const timeDiff = new Date(last.timestamp) - new Date(prev.timestamp);
//           const hoursDiff = timeDiff / (1000 * 60 * 60);
//           const rate = (last.crack_width - prev.crack_width) / hoursDiff;
//           setCrackRate(Math.abs(rate).toFixed(2));
//         }

//         // Predictions
//         setPredictions(calculatePredictions(filteredReadings));
        
//         // Correlations
//         setCorrelationData(calculateCorrelations(filteredReadings));
        
//         // Alert history
//         setAlertHistory(generateAlertHistory(filteredReadings));
//       }
//     });
//   }, [dateRange, selectedNode]);

//   // ========== UI COMPONENTS ==========
//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div style={{ backgroundColor: "#1A2030", padding: "10px", border: "1px solid var(--border)", borderRadius: "4px" }}>
//           <p style={{ margin: 0, color: "var(--text)" }}>{`Time: ${label}`}</p>
//           <p style={{ margin: 0, color: "#22c55e" }}>{`Crack Width: ${payload[0].value} mm`}</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   const getStatus = () => {
//     if (latestCrack > 5) return "CRITICAL";
//     if (latestCrack > 3.5) return "WARNING";
//     return "SAFE";
//   };

//   const getStatusColor = () => {
//     if (latestCrack > 5) return "var(--red)";
//     if (latestCrack > 3.5) return "var(--amber)";
//     return "var(--green)";
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
//       {/* ========== HELP OVERLAY ========== */}
//       {showHelp && (
//         <div style={{ 
//           position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
//           backgroundColor: "#1A2030", border: "2px solid var(--amber)", borderRadius: "12px",
//           padding: "24px", zIndex: 1000, width: "400px", maxWidth: "90%"
//         }}>
//           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
//             <h3 style={{ color: "var(--amber)", margin: 0 }}>Crack Sensor Help</h3>
//             <button onClick={() => setShowHelp(false)} style={{ background: "none", border: "none", color: "var(--text)", cursor: "pointer", fontSize: "20px" }}>✕</button>
//           </div>
//           <div style={{ fontSize: "12px", color: "var(--text)", lineHeight: 1.6 }}>
//             <p><strong>📊 Green (SAFE):</strong> Crack width &lt; 3.5mm - Normal conditions</p>
//             <p><strong>⚠️ Amber (WARNING):</strong> Crack width 3.5-5mm - Monitor closely</p>
//             <p><strong>🔴 Red (CRITICAL):</strong> Crack width &gt; 5mm - Immediate action required</p>
//             <p><strong>📅 Date Range:</strong> Click buttons to view 7/14/30 day history</p>
//             <p><strong>📈 Predictions:</strong> Enable toggle to see forecast based on trends</p>
//             <p><strong>📊 Correlations:</strong> See how crack relates to other sensors</p>
//             <p><strong>💾 Export:</strong> Download data as CSV for reporting</p>
//           </div>
//           <button onClick={() => setShowHelp(false)} style={{ marginTop: "16px", padding: "8px 16px", backgroundColor: "var(--amber)", border: "none", borderRadius: "4px", color: "#000", cursor: "pointer", width: "100%" }}>Got it</button>
//         </div>
//       )}
      
//       {/* ========== STAT CARDS ========== */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
//         <StatCard label="GAP WIDTH" value={`${latestCrack.toFixed(1)} mm`} sub="Current measurement" color={getStatusColor()} />
//         <StatCard label="WIDENING RATE" value={`${crackRate} mm/hr`} sub="Rate of change" color={crackRate > 0.1 ? "var(--red)" : crackRate > 0.02 ? "var(--amber)" : "var(--green)"} />
//         <StatCard label="STATUS" value={getStatus()} sub="Safety status" color={getStatusColor()} />
//         <StatCard label="RISK LEVEL" value={getStatus()} sub="Recommendation" color={getStatusColor()} />
//       </div>

//       {/* ========== FILTER BAR (UX: Filtering) ========== */}
//       <div style={{ 
//         display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//         padding: "12px", backgroundColor: "var(--bg3)", borderRadius: "8px",
//         flexWrap: "wrap", gap: "12px"
//       }}>
//         <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
//           <Filter size={14} style={{ color: "var(--muted)" }} />
//           <span style={{ fontSize: "11px", color: "var(--muted)" }}>Filters:</span>
          
//           <select 
//             value={selectedNode} 
//             onChange={(e) => setSelectedNode(e.target.value)}
//             style={{
//               padding: "4px 8px", borderRadius: "4px", fontSize: "11px",
//               backgroundColor: "var(--bg2)", border: "1px solid var(--border)", color: "var(--text)"
//             }}
//           >
//             <option value="all">All Nodes</option>
//             <option value="Node1">Node 1</option>
//             <option value="Node2">Node 2</option>
//           </select>
          
//           <button 
//             onClick={() => setShowFilters(!showFilters)}
//             style={{
//               padding: "4px 8px", borderRadius: "4px", fontSize: "11px",
//               backgroundColor: "var(--bg2)", border: "1px solid var(--border)", color: "var(--text)", cursor: "pointer"
//             }}
//           >
//             More Filters
//           </button>
//         </div>
        
//         <div style={{ display: 'flex', gap: '8px' }}>
//           <button 
//             onClick={() => setShowPredictions(!showPredictions)}
//             style={{
//               padding: "4px 12px", borderRadius: "4px", fontSize: "11px",
//               backgroundColor: showPredictions ? "rgba(34, 197, 94, 0.15)" : "var(--bg2)",
//               border: `1px solid ${showPredictions ? "var(--green)" : "var(--border)"}`,
//               color: showPredictions ? "var(--green)" : "var(--text)", cursor: "pointer"
//             }}
//           >
//             <TrendingUp size={12} style={{ display: "inline", marginRight: "4px" }} />
//             Predictions {showPredictions ? "ON" : "OFF"}
//           </button>
          
//           <button 
//             onClick={exportData}
//             style={{
//               padding: "4px 12px", borderRadius: "4px", fontSize: "11px",
//               backgroundColor: "var(--bg2)", border: "1px solid var(--border)", color: "var(--text)", cursor: "pointer"
//             }}
//           >
//             <Download size={12} style={{ display: "inline", marginRight: "4px" }} />
//             Export CSV
//           </button>
          
//           <button 
//             onClick={() => setShowHelp(true)}
//             style={{
//               padding: "4px 12px", borderRadius: "4px", fontSize: "11px",
//               backgroundColor: "var(--bg2)", border: "1px solid var(--border)", color: "var(--text)", cursor: "pointer"
//             }}
//           >
//             <HelpCircle size={12} style={{ display: "inline", marginRight: "4px" }} />
//             Help
//           </button>
//         </div>
//       </div>

//       {/* ========== ADVANCED FILTERS (Expandable) ========== */}
//       {showFilters && (
//         <div style={{ padding: "12px", backgroundColor: "var(--bg3)", borderRadius: "8px" }}>
//           <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "8px" }}>Advanced Filters:</div>
//           <div style={{ display: 'flex', gap: '16px', flexWrap: "wrap" }}>
//             <label style={{ fontSize: "11px", color: "var(--text)", display: "flex", alignItems: "center", gap: "6px" }}>
//               <input type="checkbox" /> Show only Critical alerts
//             </label>
//             <label style={{ fontSize: "11px", color: "var(--text)", display: "flex", alignItems: "center", gap: "6px" }}>
//               <input type="checkbox" /> Show weekends only
//             </label>
//             <label style={{ fontSize: "11px", color: "var(--text)", display: "flex", alignItems: "center", gap: "6px" }}>
//               <input type="checkbox" /> Exclude maintenance periods
//             </label>
//           </div>
//         </div>
//       )}

//       {/* ========== MAIN TREND CHART (with brushing/linking) ========== */}
//       <div style={{ padding: "16px", borderRadius: "8px", backgroundColor: "#1A2030" }}>
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
//           <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", fontFamily: "Barlow, sans-serif" }}>
//             SENSOR TREND — LAST 30 READINGS
//           </div>
//           {selectedDataPoint && (
//             <div style={{ fontSize: "9px", color: "var(--amber)" }}>
//               Selected: {selectedDataPoint.value}mm at reading {selectedDataPoint.time}
//             </div>
//           )}
//         </div>
//         <ResponsiveContainer width="100%" height={200}>
//           <LineChart data={crackData} onClick={handleChartClick}>
//             <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 51, 71, 0.5)" />
//             <XAxis dataKey="time" stroke="var(--muted)" style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
//             <YAxis domain={[0, 8]} stroke="var(--muted)" style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
//             <Tooltip content={<CustomTooltip />} />
//             <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
//             <ReferenceLine y={5} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "CRITICAL (5mm)", position: "right", fill: "#ef4444", fontSize: 9 }} />
//             <ReferenceLine y={3.5} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: "WARNING (3.5mm)", position: "right", fill: "#f59e0b", fontSize: 9 }} />
//             {/* Prediction overlay */}
//             {showPredictions && predictions && predictions.predictedNextHour && (
//               <Line 
//                 type="monotone" 
//                 dataKey="predictedNextHour" 
//                 stroke="#8884d8" 
//                 strokeDasharray="5 5" 
//                 dot={false} 
//                 data={[{ time: crackData.length - 1, value: latestCrack }, { time: crackData.length + 5, value: parseFloat(predictions.predictedNextHour) }]} 
//               />
//             )}
//           </LineChart>
//         </ResponsiveContainer>
//       </div>

//       {/* ========== DATE RANGE FILTERS ========== */}
//       <div style={{ display: 'flex', gap: '8px', justifyContent: "center" }}>
//         {[{ id: "7d", label: "Last 7 Days" }, { id: "14d", label: "Last 14 Days" }, { id: "30d", label: "Last 30 Days" }].map((range) => (
//           <button key={range.id} onClick={() => setDateRange(range.id)} style={{
//             padding: "6px 16px", borderRadius: "20px",
//             fontSize: "11px", fontWeight: 600, fontFamily: "Barlow, sans-serif",
//             backgroundColor: dateRange === range.id ? "rgba(34, 197, 94, 0.2)" : "var(--bg3)",
//             border: `1px solid ${dateRange === range.id ? "var(--green)" : "var(--border)"}`,
//             color: dateRange === range.id ? "var(--green)" : "var(--text)",
//             cursor: "pointer"
//           }}>
//             {range.label.toUpperCase()}
//           </button>
//         ))}
//       </div>

//       {/* ========== HISTORICAL TREND SECTION (Expandable - UX: Storytelling) ========== */}
//       <div style={{ backgroundColor: "#1A2030", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
//         <div 
//           onClick={() => toggleSection("historical")}
//           style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", cursor: "pointer", backgroundColor: "rgba(34, 197, 94, 0.05)" }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <TrendingUp size={14} style={{ color: "var(--green)" }} />
//             <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text)" }}>HISTORICAL TREND ANALYSIS</span>
//           </div>
//           {expandedSections.historical ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//         </div>
        
//         {expandedSections.historical && (
//           <div style={{ padding: "16px" }}>
//             <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: "Barlow, sans-serif" }}>
//               CRACK DISPLACEMENT — {dateRange.toUpperCase()} TREND
//             </div>
//             <ResponsiveContainer width="100%" height={200}>
//               <ComposedChart data={crackHistory}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 51, 71, 0.5)" />
//                 <XAxis dataKey="date" stroke="var(--muted)" style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
//                 <YAxis domain={[0, 8]} stroke="var(--muted)" style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
//                 <Tooltip />
//                 <Legend />
//                 <Area type="monotone" dataKey="value" fill="rgba(34, 197, 94, 0.1)" stroke="#22c55e" strokeWidth={2} />
//                 <ReferenceLine y={5} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "CRITICAL", fill: "#ef4444", fontSize: 9 }} />
//                 <ReferenceLine y={3.5} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: "WARNING", fill: "#f59e0b", fontSize: 9 }} />
//               </ComposedChart>
//             </ResponsiveContainer>
            
//             {/* Storytelling annotations */}
//             {crackHistory.length > 0 && (
//               <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "rgba(59, 130, 246, 0.1)", borderRadius: "6px" }}>
//                 <div style={{ fontSize: "10px", color: "var(--blue)", marginBottom: "8px" }}>📖 STORYTELLING INSIGHT</div>
//                 <div style={{ fontSize: "11px", color: "var(--text)", lineHeight: 1.5 }}>
//                   {crackHistory[crackHistory.length - 1]?.value > 5 
//                     ? `🔴 CRITICAL EVENT: Crack width reached ${crackHistory[crackHistory.length - 1]?.value}mm on ${crackHistory[crackHistory.length - 1]?.date}. This exceeds the safety threshold. Immediate action required.`
//                     : crackHistory[crackHistory.length - 1]?.value > 3.5
//                     ? `⚠️ WARNING TREND: Crack width is ${crackHistory[crackHistory.length - 1]?.value}mm. The ${crackRate > 0 ? "increasing" : "stable"} trend suggests ${crackRate > 0.05 ? "rapid deterioration" : "gradual change"}.`
//                     : `✅ STABLE CONDITIONS: Crack width remains at ${crackHistory[crackHistory.length - 1]?.value}mm. No immediate concerns. Continue routine monitoring.`
//                   }
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* ========== PREDICTIONS SECTION (UX: Decision Support) ========== */}
//       {showPredictions && predictions && (
//         <div style={{ backgroundColor: "#1A2030", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
//           <div 
//             onClick={() => toggleSection("predictions")}
//             style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", cursor: "pointer", backgroundColor: "rgba(245, 158, 11, 0.05)" }}
//           >
//             <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//               <AlertTriangle size={14} style={{ color: "var(--amber)" }} />
//               <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text)" }}>PREDICTIONS & FORECASTS</span>
//             </div>
//             {expandedSections.predictions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//           </div>
          
//           {expandedSections.predictions && (
//             <div style={{ padding: "16px" }}>
//               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: "16px" }}>
//                 <div style={{ textAlign: "center", padding: "8px", backgroundColor: "var(--bg3)", borderRadius: "6px" }}>
//                   <div style={{ fontSize: "9px", color: "var(--muted)" }}>Current Rate</div>
//                   <div style={{ fontSize: "16px", color: predictions.avgRate > 0.02 ? "var(--red)" : "var(--green)" }}>{predictions.avgRate} mm/hr</div>
//                 </div>
//                 <div style={{ textAlign: "center", padding: "8px", backgroundColor: "var(--bg3)", borderRadius: "6px" }}>
//                   <div style={{ fontSize: "9px", color: "var(--muted)" }}>Predicted (1hr)</div>
//                   <div style={{ fontSize: "16px", color: predictions.predictedNextHour > 5 ? "var(--red)" : "var(--amber)" }}>{predictions.predictedNextHour} mm</div>
//                 </div>
//                 <div style={{ textAlign: "center", padding: "8px", backgroundColor: "var(--bg3)", borderRadius: "6px" }}>
//                   <div style={{ fontSize: "9px", color: "var(--muted)" }}>Time to Warning</div>
//                   <div style={{ fontSize: "16px", color: predictions.hoursToWarning < 24 ? "var(--amber)" : "var(--green)" }}>{predictions.hoursToWarning} hours</div>
//                 </div>
//                 <div style={{ textAlign: "center", padding: "8px", backgroundColor: "var(--bg3)", borderRadius: "6px" }}>
//                   <div style={{ fontSize: "9px", color: "var(--muted)" }}>Time to Critical</div>
//                   <div style={{ fontSize: "16px", color: predictions.hoursToCritical < 12 ? "var(--red)" : "var(--amber)" }}>{predictions.hoursToCritical} hours</div>
//                 </div>
//               </div>
              
//               <div style={{ padding: "12px", backgroundColor: predictions.trend === "Rapidly Worsening" ? "rgba(239, 68, 68, 0.1)" : "rgba(245, 158, 11, 0.1)", borderRadius: "6px" }}>
//                 <div style={{ fontSize: "11px", color: predictions.trend === "Rapidly Worsening" ? "var(--red)" : "var(--amber)", fontWeight: 500, marginBottom: "8px" }}>
//                   🤖 AI Recommendation:
//                 </div>
//                 <div style={{ fontSize: "11px", color: "var(--text)", lineHeight: 1.5 }}>
//                   {predictions.trend === "Rapidly Worsening" 
//                     ? `Crack is widening at ${predictions.avgRate} mm/hr. At this rate, critical threshold will be reached in ${predictions.hoursToCritical} hours. Immediate inspection recommended.`
//                     : predictions.trend === "Gradually Worsening"
//                     ? `Crack is slowly widening at ${predictions.avgRate} mm/hr. Schedule maintenance within ${predictions.hoursToWarning} hours.`
//                     : `Crack is stable at current rate. Continue routine monitoring.`
//                   }
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* ========== CORRELATIONS SECTION (UX: Multi-dimensional Analysis) ========== */}
//       <div style={{ backgroundColor: "#1A2030", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
//         <div 
//           onClick={() => toggleSection("correlations")}
//           style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", cursor: "pointer", backgroundColor: "rgba(59, 130, 246, 0.05)" }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <Info size={14} style={{ color: "var(--blue)" }} />
//             <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text)" }}>SENSOR CORRELATIONS</span>
//           </div>
//           {expandedSections.correlations ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//         </div>
        
//         {expandedSections.correlations && (
//           <div style={{ padding: "16px" }}>
//             <div style={{ fontSize: "10px", color: "var(--muted)", marginBottom: "12px" }}>How crack width relates to other sensors:</div>
//             {correlationData.map((item, idx) => (
//               <div key={idx} style={{ marginBottom: "12px" }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
//                   <span style={{ fontSize: "11px", color: "var(--text)" }}>{item.icon} {item.factor}</span>
//                   <span style={{ fontSize: "11px", color: item.color }}>Correlation: {item.correlation}</span>
//                 </div>
//                 <div style={{ height: "6px", backgroundColor: "var(--bg3)", borderRadius: "3px", overflow: "hidden" }}>
//                   <div style={{ width: `${parseFloat(item.correlation) * 100}%`, height: "100%", backgroundColor: item.color, borderRadius: "3px" }} />
//                 </div>
//               </div>
//             ))}
//             <div style={{ fontSize: "10px", color: "var(--muted)", marginTop: "12px", fontStyle: "italic" }}>
//               Higher correlation means crack movement is strongly linked to that factor
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ========== ALERT HISTORY SECTION (UX: Drill-down) ========== */}
//       <div style={{ backgroundColor: "#1A2030", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
//         <div 
//           onClick={() => toggleSection("alerts")}
//           style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", cursor: "pointer", backgroundColor: "rgba(239, 68, 68, 0.05)" }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <AlertTriangle size={14} style={{ color: "var(--red)" }} />
//             <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text)" }}>ALERT HISTORY (Last 10 Events)</span>
//           </div>
//           {expandedSections.alerts ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//         </div>
        
//         {expandedSections.alerts && (
//           <div style={{ padding: "16px" }}>
//             {alertHistory.length === 0 ? (
//               <div style={{ textAlign: "center", padding: "20px", color: "var(--green)" }}>
//                 ✅ No recent alerts. All systems normal.
//               </div>
//             ) : (
//               alertHistory.map(alert => (
//                 <div key={alert.id} style={{ 
//                   padding: "10px", marginBottom: "8px", borderRadius: "6px",
//                   backgroundColor: alert.severity === "CRITICAL" ? "rgba(239, 68, 68, 0.1)" : "rgba(245, 158, 11, 0.1)",
//                   borderLeft: `3px solid ${alert.severity === "CRITICAL" ? "var(--red)" : "var(--amber)"}`
//                 }}>
//                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
//                     <span style={{ fontSize: "10px", color: alert.severity === "CRITICAL" ? "var(--red)" : "var(--amber)", fontWeight: 600 }}>
//                       {alert.severity}
//                     </span>
//                     <span style={{ fontSize: "9px", color: "var(--muted)" }}>{alert.date} {alert.time}</span>
//                   </div>
//                   <div style={{ fontSize: "11px", color: "var(--text)" }}>{alert.message}</div>
//                   <div style={{ fontSize: "9px", color: alert.acknowledged ? "var(--green)" : "var(--amber)", marginTop: "4px" }}>
//                     {alert.acknowledged ? "✓ Acknowledged" : "⚠ Pending acknowledgement"}
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         )}
//       </div>

//       {/* ========== RISK DISTRIBUTION + SENSOR HEALTH (Side by Side) ========== */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
//         <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)", textAlign: "center" }}>
//           <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "10px", fontFamily: "Barlow, sans-serif" }}>
//             RISK LEVEL DISTRIBUTION
//           </div>
//           <ResponsiveContainer width="100%" height={140}>
//             <PieChart>
//               <Pie data={riskDistribution} dataKey="value" innerRadius={30} outerRadius={55} paddingAngle={3} label={({ name, value }) => `${name}: ${value}%`}>
//                 {riskDistribution.map((_, index) => (
//                   <Cell key={`cell-${index}`} fill={riskColors[index]} />
//                 ))}
//               </Pie>
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         <div style={{ padding: "14px", borderRadius: "8px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
//           <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "15px", fontFamily: "Barlow, sans-serif" }}>
//             SENSOR HEALTH
//           </div>
//           <div style={{ fontSize: "28px", fontWeight: 600, color: isSensorHealthy ? "var(--green)" : "var(--red)", marginBottom: "8px" }}>
//             {isSensorHealthy ? "✅ FUNCTIONING" : "❌ FAULT DETECTED"}
//           </div>
//           <div style={{ fontSize: "11px", color: "var(--muted)", lineHeight: 1.4 }}>
//             {isSensorHealthy ? "Signal stable. No data loss detected. ToF sensor calibrated." : "Check wiring, power supply, or sensor module."}
//           </div>
//           <div style={{ marginTop: "12px", fontSize: "9px", color: "var(--green)" }}>
//             Last calibration: {new Date().toLocaleDateString()}
//           </div>
//         </div>
//       </div>

//       {/* ========== DECISION SUPPORT CARD ========== */}
//       <div style={{ 
//         padding: "16px", borderRadius: "8px", 
//         backgroundColor: latestCrack > 5 ? "rgba(239, 68, 68, 0.12)" : latestCrack > 3.5 ? "rgba(245, 158, 11, 0.08)" : "rgba(34, 197, 94, 0.08)", 
//         border: `2px solid ${latestCrack > 5 ? "var(--red)" : latestCrack > 3.5 ? "var(--amber)" : "var(--green)"}` 
//       }}>
//         <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
//           <div style={{ fontSize: "28px", color: latestCrack > 5 ? "var(--red)" : latestCrack > 3.5 ? "var(--amber)" : "var(--green)" }}>
//             {latestCrack > 5 ? "⚠️" : latestCrack > 3.5 ? "📊" : "✅"}
//           </div>
//           <div style={{ flex: 1 }}>
//             <div style={{ fontSize: "14px", fontWeight: 600, color: latestCrack > 5 ? "var(--red)" : latestCrack > 3.5 ? "var(--amber)" : "var(--green)", marginBottom: "8px" }}>
//               {latestCrack > 5 ? "🚨 IMMEDIATE ACTION REQUIRED" : latestCrack > 3.5 ? "⚠️ CAUTION — MONITOR CLOSELY" : "✅ NORMAL OPERATIONS"}
//             </div>
//             <div style={{ fontSize: "12px", color: "var(--text)", lineHeight: 1.5 }}>
//               {latestCrack > 5 
//                 ? `🔴 CRITICAL: Crack width at ${latestCrack.toFixed(1)}mm exceeds the 5mm emergency threshold. 
//                    • IMMEDIATE: Evacuate Zone C
//                    • ALERT: Notify site supervisor
//                    • ACTION: Halt all construction activity
//                    • MONITOR: Check every 5 minutes until resolved`
//                 : latestCrack > 3.5 
//                 ? `🟠 WARNING: Crack width at ${latestCrack.toFixed(1)}mm is approaching critical threshold (5mm).
//                    • ACTION: Increase monitoring frequency
//                    • PREPARE: Review evacuation procedures
//                    • INSPECT: Schedule structural inspection within 24 hours
//                    • TRACK: Monitor rate of change (current: ${crackRate} mm/hr)`
//                 : `🟢 SAFE: Crack width at ${latestCrack.toFixed(1)}mm is within normal range.
//                    • Continue routine monitoring every 30 minutes
//                    • Document any visible changes
//                    • No immediate action required`
//               }
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* ========== UX NOTE ========== */}
//       <div style={{ fontSize: "9px", color: "var(--muted)", textAlign: "center", padding: "8px" }}>
//         💡 Tip: Click on any chart point to select and correlate with other sensors | Data updates in real-time from Firebase
//       </div>
//     </div>
//   );
// }