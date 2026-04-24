// /**
//  * CrackSensor.jsx — Enhanced Visual Analytics Component
//  *
//  * UX Design Philosophy:
//  *  - Progressive disclosure: simple headline → expandable deep-dives
//  *  - Data storytelling: annotated events, contextual callouts, narrative flow
//  *  - Brushing & linking: selecting a chart point highlights it across ALL panels
//  *  - Accessibility: ARIA roles, keyboard navigation, color-blind safe palette
//  *  - Decision support: tiered action checklist, time-to-threshold countdowns
//  *  - Gestalt: proximity grouping, continuity in trend lines, figure-ground contrast
//  *  - Pre-attentive: colour, size, motion used for immediate risk perception
//  *  - Data-ink ratio: no decorative chrome, every pixel encodes information
//  */

// import { useState, useEffect, useCallback, useRef } from "react";
// import { StatCard } from "../../components/StatCard";
// import {
//   getAllReadings,
//   getLatestReading,
// } from "../../../services/firebaseService";
// import {
//   LineChart, Line, XAxis, YAxis, ResponsiveContainer,
//   CartesianGrid, PieChart, Pie, Cell, ReferenceLine,
//   Tooltip, Area, AreaChart, BarChart, Bar, Legend,
//   ComposedChart, ScatterChart, Scatter, ZAxis, RadarChart,
//   Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
//   ReferenceDot,
// } from "recharts";
// import {
//   Calendar, Download, Filter, TrendingUp, AlertTriangle,
//   Info, ChevronDown, ChevronUp, HelpCircle, Activity,
//   CheckCircle, XCircle, Clock, Zap, Droplets, Thermometer,
//   Wind, BarChart2, Eye, EyeOff, RefreshCw, Bell, BellOff,
//   Brain,  
// } from "lucide-react";

// // ─── Design tokens (aligned with assignment color theory) ────────────────────
// const TOKEN = {
//   safe:     "#22c55e",
//   warning:  "#f59e0b",
//   critical: "#ef4444",
//   blue:     "#3b82f6",
//   purple:   "#8b5cf6",
//   teal:     "#14b8a6",
//   muted:    "var(--muted)",
//   bg2:      "var(--bg2)",
//   bg3:      "var(--bg3)",
//   border:   "var(--border)",
//   text:     "var(--text)",
//   card:     "#1A2030",
// };

// // Color-blind safe diverging palette
// const CB_SAFE = ["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd"];

// // Thresholds (based on CrackWidth)
// const TH_WARNING  = 3.5;
// const TH_CRITICAL = 5.0;

// // ─── Helpers ─────────────────────────────────────────────────────────────────
// const riskOf = (v) =>
//   v >= TH_CRITICAL ? "CRITICAL" : v >= TH_WARNING ? "WARNING" : "SAFE";

// const colorOf = (v) =>
//   v >= TH_CRITICAL ? TOKEN.critical : v >= TH_WARNING ? TOKEN.warning : TOKEN.safe;

// const fmt = (v, d = 1) => (typeof v === "number" ? v.toFixed(d) : "—");

// // Build a "severity score" 0-100 using only allowed columns
// const severityScore = (r) => {
//   let s = Math.min((r.crack_width || 0) / TH_CRITICAL, 1) * 60;
//   s += Math.min((r.soil_20cm || 0) / 100, 1) * 20;
//   s += Math.min(Math.abs(r.acceleration_x || 0) / 0.5, 1) * 20;
//   return Math.round(s);
// };

// // ─── Sub-components ──────────────────────────────────────────────────────────

// /** Animated ring gauge */
// const RingGauge = ({ value, max = 8, label, color, size = 100, unit = "mm" }) => {
//   const r   = 36;
//   const circ = 2 * Math.PI * r;
//   const pct  = Math.min(value / max, 1);
//   const dash = circ * pct;
//   return (
//     <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
//       <svg width={size} height={size} viewBox="0 0 100 100" aria-label={`${label}: ${value}`}>
//         <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
//         <circle
//           cx="50" cy="50" r={r}
//           fill="none" stroke={color} strokeWidth="8"
//           strokeDasharray={`${dash} ${circ - dash}`}
//           strokeLinecap="round"
//           transform="rotate(-90 50 50)"
//           style={{ transition: "stroke-dasharray 0.8s cubic-bezier(.4,0,.2,1)" }}
//         />
//         <text x="50" y="46" textAnchor="middle" fontSize="16" fontWeight="600" fill={color}>{fmt(value)}</text>
//         <text x="50" y="60" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.45)">{unit}</text>
//       </svg>
//       <span style={{ fontSize:10, color: TOKEN.muted, letterSpacing:"0.08em" }}>{label.toUpperCase()}</span>
//     </div>
//   );
// };

// /** Inline sparkline */
// const Sparkline = ({ data, color = TOKEN.safe, height = 36 }) => {
//   if (!data || data.length < 2) return null;
//   const vals = data.map(d => d.value || 0);
//   const minV = Math.min(...vals);
//   const maxV = Math.max(...vals) || 1;
//   const w = 120, h = height;
//   const pts = vals.map((v, i) => {
//     const x = (i / (vals.length - 1)) * w;
//     const y = h - ((v - minV) / (maxV - minV)) * h;
//     return `${x},${y}`;
//   }).join(" ");
//   return (
//     <svg width={w} height={h} style={{ overflow:"visible" }} aria-label="Trend sparkline">
//       <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//   );
// };

// /** Severity heatmap calendar */
// const SeverityHeatmap = ({ readings }) => {
//   if (!readings || readings.length === 0) return null;

//   const byDate = {};
//   readings.forEach(r => {
//     const d = new Date(r.timestamp).toLocaleDateString();
//     const s = severityScore(r);
//     if (!byDate[d] || byDate[d].score < s) {
//       byDate[d] = { date: d, score: s, crack: r.crack_width || 0 };
//     }
//   });
//   const days = Object.values(byDate).slice(-21);

//   const cellColor = (score) => {
//     if (score >= 70) return TOKEN.critical;
//     if (score >= 40) return TOKEN.warning;
//     if (score >= 10) return TOKEN.safe;
//     return "rgba(255,255,255,0.07)";
//   };

//   return (
//     <div role="img" aria-label="Severity heatmap over time">
//       <div style={{ fontSize:10, color:TOKEN.muted, marginBottom:8, letterSpacing:"0.08em" }}>
//         DAILY MAX SEVERITY HEATMAP
//       </div>
//       <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
//         {days.map((d, i) => (
//           <div key={i} title={`${d.date}: severity ${d.score}, crack ${fmt(d.crack)}mm`}
//             style={{
//               width:28, height:28, borderRadius:4,
//               backgroundColor: cellColor(d.score),
//               opacity: 0.7 + (d.score / 200),
//               cursor:"pointer",
//               transition:"transform 0.15s",
//               display:"flex", alignItems:"center", justifyContent:"center",
//             }}
//             onMouseEnter={e => e.target.style.transform = "scale(1.25)"}
//             onMouseLeave={e => e.target.style.transform = "scale(1)"}
//           >
//             <span style={{ fontSize:7, color:"rgba(255,255,255,0.7)", fontWeight:600 }}>
//               {new Date(d.date).getDate()}
//             </span>
//           </div>
//         ))}
//       </div>
//       <div style={{ display:"flex", gap:12, marginTop:8 }}>
//         {[["SAFE", TOKEN.safe], ["WARNING", TOKEN.warning], ["CRITICAL", TOKEN.critical]].map(([l,c]) => (
//           <span key={l} style={{ fontSize:9, color:c, display:"flex", alignItems:"center", gap:4 }}>
//             <span style={{ width:8, height:8, borderRadius:2, backgroundColor:c, display:"inline-block" }} />{l}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// };

// /** Annotated event timeline */
// const EventTimeline = ({ readings, linkedPoint }) => {
//   if (!readings || readings.length < 5) return null;

//   const events = [];
//   for (let i = 1; i < readings.length; i++) {
//     const prev = readings[i-1], cur = readings[i];
//     const prevCrack = prev.crack_width || 0;
//     const curCrack  = cur.crack_width  || 0;

//     if (prevCrack < TH_WARNING && curCrack >= TH_WARNING)
//       events.push({ time: cur.timestamp, type:"threshold", label:"⚠ Crossed warning threshold", color: TOKEN.warning, value: curCrack });
//     if (prevCrack < TH_CRITICAL && curCrack >= TH_CRITICAL)
//       events.push({ time: cur.timestamp, type:"critical",  label:"🔴 Critical threshold breached", color: TOKEN.critical, value: curCrack });
//     if ((Math.abs(prev.acceleration_x || 0)) === 0 && (Math.abs(cur.acceleration_x || 0)) > 0.3)
//       events.push({ time: cur.timestamp, type:"vibration", label:"📳 Vibration spike", color: TOKEN.purple, value: cur.vibration });
//   }

//   if (events.length === 0) return (
//     <div style={{ fontSize:11, color:TOKEN.safe, padding:"12px", textAlign:"center" }}>
//       ✅ No significant threshold events in this period.
//     </div>
//   );

//   return (
//     <div role="list" aria-label="Event timeline">
//       {events.slice(-8).reverse().map((e, i) => (
//         <div key={i} role="listitem" style={{
//           display:"flex", alignItems:"flex-start", gap:12, marginBottom:10,
//           padding:"8px 10px", borderRadius:6,
//           backgroundColor: `${e.color}12`,
//           borderLeft: `3px solid ${e.color}`,
//           opacity: linkedPoint ? 0.6 : 1,
//           transition:"opacity 0.2s",
//         }}>
//           <div style={{ minWidth:2 }} />
//           <div style={{ flex:1 }}>
//             <div style={{ fontSize:11, color:e.color, fontWeight:500 }}>{e.label}</div>
//             <div style={{ fontSize:9, color:TOKEN.muted, marginTop:2 }}>
//               {new Date(e.time).toLocaleString()} · value: {fmt(e.value)}
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// /** Action checklist card */
// const ActionChecklist = ({ status, crackRate, predictions }) => {
//   const [checked, setChecked] = useState({});
//   const toggle = (id) => setChecked(p => ({ ...p, [id]: !p[id] }));

//   const actions = {
//     SAFE: [
//       { id:"s1", text:"Continue routine monitoring every 30 min", priority:"low" },
//       { id:"s2", text:"Document any visible surface changes",      priority:"low" },
//       { id:"s3", text:"Review monthly trend report",               priority:"low" },
//     ],
//     WARNING: [
//       { id:"w1", text:"Increase sensor polling to every 5 min",    priority:"high"   },
//       { id:"w2", text:"Notify site supervisor of warning status",   priority:"high"   },
//       { id:"w3", text:"Review evacuation procedure checklist",      priority:"medium" },
//       { id:"w4", text:"Schedule structural inspection ≤ 24 hours",  priority:"high"   },
//       { id:"w5", text:"Check soil moisture correlation",            priority:"medium" },
//     ],
//     CRITICAL: [
//       { id:"c1", text:"🚨 EVACUATE Zone C immediately",             priority:"urgent" },
//       { id:"c2", text:"Alert site supervisor & safety officer",     priority:"urgent" },
//       { id:"c3", text:"Halt ALL construction / heavy activity",      priority:"urgent" },
//       { id:"c4", text:"Call structural engineer for emergency review",priority:"urgent"},
//       { id:"c5", text:"Monitor crack width every 2 minutes",         priority:"high"  },
//       { id:"c6", text:"Prepare incident documentation",              priority:"high"  },
//     ],
//   };

//   const priorityColor = { urgent:"#ef4444", high:"#f59e0b", medium:"#3b82f6", low:"#22c55e" };
//   const items = actions[status] || actions.SAFE;
//   const done  = items.filter(a => checked[a.id]).length;

//   return (
//     <div style={{ padding:14, backgroundColor:TOKEN.card, borderRadius:8, border:`1px solid ${TOKEN.border}` }}
//       role="region" aria-label="Action checklist">
//       <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
//         <div style={{ fontSize:11, fontWeight:600, color:colorOf(status === "CRITICAL" ? 6 : status === "WARNING" ? 4 : 0) }}>
//           ACTION CHECKLIST — {status}
//         </div>
//         <div style={{ fontSize:10, color:TOKEN.muted }}>{done}/{items.length} complete</div>
//       </div>

//       <div style={{ height:3, backgroundColor:"rgba(255,255,255,0.08)", borderRadius:2, marginBottom:12, overflow:"hidden" }}>
//         <div style={{
//           height:"100%", borderRadius:2, backgroundColor: colorOf(status === "CRITICAL" ? 6 : 4),
//           width:`${(done/items.length)*100}%`, transition:"width 0.4s ease",
//         }} />
//       </div>

//       {items.map(action => (
//         <label key={action.id} style={{
//           display:"flex", alignItems:"flex-start", gap:8, marginBottom:8,
//           cursor:"pointer", opacity: checked[action.id] ? 0.5 : 1,
//           transition:"opacity 0.2s",
//         }}>
//           <input
//             type="checkbox"
//             checked={!!checked[action.id]}
//             onChange={() => toggle(action.id)}
//             style={{ marginTop:2, accentColor: priorityColor[action.priority] }}
//             aria-label={action.text}
//           />
//           <span style={{
//             fontSize:11, color: checked[action.id] ? TOKEN.muted : TOKEN.text,
//             textDecoration: checked[action.id] ? "line-through" : "none",
//             transition:"color 0.2s",
//           }}>
//             <span style={{
//               display:"inline-block", width:6, height:6, borderRadius:"50%",
//               backgroundColor: priorityColor[action.priority], marginRight:6, verticalAlign:"middle",
//             }} />
//             {action.text}
//           </span>
//         </label>
//       ))}

//       {predictions && (
//         <div style={{ marginTop:12, padding:"8px 10px", backgroundColor:"rgba(59,130,246,0.08)", borderRadius:6 }}>
//           <div style={{ fontSize:9, color: TOKEN.blue, marginBottom:4 }}>⏱ TIME-TO-THRESHOLD FORECAST</div>
//           <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
//             <div style={{ fontSize:10, color:TOKEN.warning }}>
//               ⚠ Warning in: <strong>{predictions.hoursToWarning}h</strong>
//             </div>
//             <div style={{ fontSize:10, color:TOKEN.critical }}>
//               🔴 Critical in: <strong>{predictions.hoursToCritical}h</strong>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// /** Multi-metric correlation overlay using allowed columns */
// const MultiMetricChart = ({ readings, linkedPoint, onBrush }) => {
//   if (!readings || readings.length < 5) return null;

//   const data = readings.slice(-50).map((r, i) => ({
//     i,
//     crack:    +(r.crack_width || 0).toFixed(2),
//     rotationX: +((Math.abs(r.rotation_x || 0)) / 100 * 8).toFixed(2),
//     vibration: +((Math.abs(r.acceleration_x || 0)) / 0.5 * 8).toFixed(2),
//     soil20:   +((r.soil_20cm  || 0) / 100 * 8).toFixed(2),
//     ts: new Date(r.timestamp).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }),
//   }));

//   const CustomDot = (props) => {
//     const { cx, cy, payload } = props;
//     if (linkedPoint && linkedPoint.i === payload.i) {
//       return <circle cx={cx} cy={cy} r={6} fill={TOKEN.safe} stroke="#fff" strokeWidth={2} />;
//     }
//     return null;
//   };

//   return (
//     <div style={{ padding:16, backgroundColor:TOKEN.card, borderRadius:8, border:`1px solid ${TOKEN.border}` }}>
//       <div style={{ fontSize:10, fontWeight:600, color:TOKEN.muted, letterSpacing:"0.08em", marginBottom:12 }}>
//         MULTI-SENSOR OVERLAY (normalised 0–8 scale)
//       </div>
//       <div style={{ fontSize:9, color:TOKEN.muted, marginBottom:8 }}>
//         Click any data point to cross-highlight across all panels
//       </div>
//       <ResponsiveContainer width="100%" height={200}>
//         <LineChart data={data} onClick={(d) => d?.activePayload && onBrush(d.activePayload[0].payload)}>
//           <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
//           <XAxis dataKey="ts" stroke={TOKEN.muted} tick={{ fontSize:8 }} interval={9} />
//           <YAxis domain={[0,8]} stroke={TOKEN.muted} tick={{ fontSize:8 }} />
//           <Tooltip
//             contentStyle={{ backgroundColor:"#1A2030", border:"1px solid rgba(255,255,255,0.1)", fontSize:11, borderRadius:6 }}
//             labelStyle={{ color:TOKEN.muted }}
//           />
//           <Legend wrapperStyle={{ fontSize:10 }} />
//           <ReferenceLine y={TH_WARNING}  stroke={TOKEN.warning}  strokeDasharray="4 4" />
//           <ReferenceLine y={TH_CRITICAL} stroke={TOKEN.critical} strokeDasharray="4 4" />
//           <Line type="monotone" dataKey="crack"    stroke={TOKEN.safe}    strokeWidth={2.5} dot={false} activeDot={{ r:5 }} name="Crack (mm)" />
//           <Line type="monotone" dataKey="rotationX" stroke={TOKEN.warning} strokeWidth={1.5} dot={false} activeDot={{ r:4 }} strokeDasharray="4 3" name="|Rotation X| (norm)" />
//           <Line type="monotone" dataKey="vibration" stroke={TOKEN.purple}  strokeWidth={1.5} dot={false} activeDot={{ r:4 }} strokeDasharray="2 3" name="|Vibration| (norm)" />
//           <Line type="monotone" dataKey="soil20"    stroke={TOKEN.blue}    strokeWidth={1.5} dot={false} activeDot={{ r:4 }} strokeDasharray="6 3" name="Soil 20cm (norm)" />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// /** Radar chart using only allowed columns */
// const SensorRadar = ({ readings }) => {
//   if (!readings || readings.length < 3) return null;
//   const last10 = readings.slice(-10);

//   const avg = (fn) => last10.reduce((s,r) => s + (fn(r)||0), 0) / last10.length;

//   const data = [
//     { metric:"Crack Risk",   value: Math.min(avg(r => (r.crack_width||0)/TH_CRITICAL)*100, 100) },
//     { metric:"Soil 20cm",    value: Math.min(avg(r => (r.soil_20cm||0)),100) },
//     { metric:"Vibration", value: Math.min(avg(r => Math.abs(r.acceleration_x||0)) * 200, 100) },
//     { metric:"Rotation X",   value: Math.min(Math.abs(avg(r => r.rotation_x||0))/2,100) },
//     { metric:"Rotation Y",   value: Math.min(Math.abs(avg(r => r.rotation_y||0))/2,100) },
//     { metric:"Rotation Z",   value: Math.min(Math.abs(avg(r => r.rotation_z||0))/2,100) },
//   ];

//   return (
//     <div style={{ padding:14, backgroundColor:TOKEN.card, borderRadius:8, border:`1px solid ${TOKEN.border}` }}>
//       <div style={{ fontSize:10, fontWeight:600, color:TOKEN.muted, letterSpacing:"0.08em", marginBottom:4 }}>
//         SENSOR STATE SNAPSHOT
//       </div>
//       <div style={{ fontSize:9, color:TOKEN.muted, marginBottom:8 }}>Average of last 10 readings</div>
//       <ResponsiveContainer width="100%" height={200}>
//         <RadarChart data={data}>
//           <PolarGrid stroke="rgba(255,255,255,0.08)" />
//           <PolarAngleAxis dataKey="metric" tick={{ fill:TOKEN.muted, fontSize:9 }} />
//           <PolarRadiusAxis angle={30} domain={[0,100]} tick={{ fill:TOKEN.muted, fontSize:7 }} />
//           <Radar name="Current" dataKey="value"
//             stroke={TOKEN.safe} fill={TOKEN.safe} fillOpacity={0.15}
//             dot={{ fill:TOKEN.safe, r:3 }}
//           />
//         </RadarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// /** Scatter plot: Crack width vs Soil20cm */
// const CorrelationScatter = ({ readings }) => {
//   if (!readings || readings.length < 10) return null;

//   const data = readings.slice(-80).map(r => ({
//     soil: r.soil_20cm || 0,
//     crack: r.crack_width || 0,
//     risk: riskOf(r.crack_width || 0),
//   }));

//   const colorMap = { SAFE: TOKEN.safe, WARNING: TOKEN.warning, CRITICAL: TOKEN.critical };
//   const grouped = { SAFE:[], WARNING:[], CRITICAL:[] };
//   data.forEach(d => grouped[d.risk].push(d));

//   return (
//     <div style={{ padding:14, backgroundColor:TOKEN.card, borderRadius:8, border:`1px solid ${TOKEN.border}` }}>
//       <div style={{ fontSize:10, fontWeight:600, color:TOKEN.muted, letterSpacing:"0.08em", marginBottom:4 }}>
//         CRACK vs SOIL 20cm — CORRELATION
//       </div>
//       <div style={{ fontSize:9, color:TOKEN.muted, marginBottom:8 }}>
//         Each point = one reading. Colour = risk level.
//       </div>
//       <ResponsiveContainer width="100%" height={200}>
//         <ScatterChart margin={{ top:4, right:12, bottom:4, left:0 }}>
//           <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
//           <XAxis dataKey="soil" name="Soil 20cm (%)" stroke={TOKEN.muted} tick={{ fontSize:8 }} label={{ value:"Soil 20cm (%)", position:"insideBottom", fill:TOKEN.muted, fontSize:9, offset:-2 }} />
//           <YAxis dataKey="crack" name="Crack (mm)" stroke={TOKEN.muted} tick={{ fontSize:8 }} label={{ value:"mm", position:"insideLeft", fill:TOKEN.muted, fontSize:9 }} />
//           <ZAxis range={[20,20]} />
//           <Tooltip cursor={{ strokeDasharray:"3 3" }}
//             contentStyle={{ backgroundColor:"#1A2030", border:"1px solid rgba(255,255,255,0.1)", fontSize:11, borderRadius:6 }}
//             formatter={(v, n) => [fmt(v,2), n]}
//           />
//           <ReferenceLine y={TH_WARNING}  stroke={TOKEN.warning}  strokeDasharray="4 4" />
//           <ReferenceLine y={TH_CRITICAL} stroke={TOKEN.critical} strokeDasharray="4 4" />
//           {Object.entries(grouped).map(([risk, pts]) => (
//             <Scatter key={risk} name={risk} data={pts} fill={colorMap[risk]} fillOpacity={0.7} />
//           ))}
//         </ScatterChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// /** Hourly bar chart using only allowed columns */
// const HourlyPattern = ({ readings }) => {
//   if (!readings || readings.length < 24) return null;

//   const byHour = Array.from({ length:24 }, (_, h) => ({ hour:`${String(h).padStart(2,"0")}:00`, sum:0, count:0 }));
//   readings.forEach(r => {
//     const h = new Date(r.timestamp).getHours();
//     byHour[h].sum   += r.crack_width || 0;
//     byHour[h].count += 1;
//   });
//   const data = byHour.map(h => ({
//     hour:  h.hour,
//     avg:   h.count > 0 ? +(h.sum / h.count).toFixed(2) : 0,
//     fill:  h.count > 0 && (h.sum/h.count) >= TH_CRITICAL ? TOKEN.critical
//          : h.count > 0 && (h.sum/h.count) >= TH_WARNING  ? TOKEN.warning
//          : TOKEN.safe,
//   }));

//   return (
//     <div style={{ padding:14, backgroundColor:TOKEN.card, borderRadius:8, border:`1px solid ${TOKEN.border}` }}>
//       <div style={{ fontSize:10, fontWeight:600, color:TOKEN.muted, letterSpacing:"0.08em", marginBottom:4 }}>
//         CRACK WIDTH BY HOUR OF DAY
//       </div>
//       <div style={{ fontSize:9, color:TOKEN.muted, marginBottom:8 }}>
//         Identify diurnal patterns
//       </div>
//       <ResponsiveContainer width="100%" height={140}>
//         <BarChart data={data} margin={{ top:0, right:0, bottom:0, left:-20 }}>
//           <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
//           <XAxis dataKey="hour" stroke={TOKEN.muted} tick={{ fontSize:7 }} interval={3} />
//           <YAxis stroke={TOKEN.muted} tick={{ fontSize:8 }} domain={[0, "auto"]} />
//           <Tooltip
//             contentStyle={{ backgroundColor:"#1A2030", border:"1px solid rgba(255,255,255,0.1)", fontSize:11, borderRadius:6 }}
//             formatter={(v) => [`${fmt(v,2)} mm`, "Avg crack"]}
//           />
//           <ReferenceLine y={TH_WARNING}  stroke={TOKEN.warning}  strokeDasharray="3 3" />
//           <ReferenceLine y={TH_CRITICAL} stroke={TOKEN.critical} strokeDasharray="3 3" />
//           <Bar dataKey="avg" radius={[2,2,0,0]}>
//             {data.map((d, i) => <Cell key={i} fill={d.fill} fillOpacity={0.75} />)}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// // ─── Main Component ───────────────────────────────────────────────────────────
// export function CrackSensor() {

//   // ── State ─────────────────────────────────────────────────────────────────
//   const [dateRange,      setDateRange]      = useState("7d");
//   const [crackData,      setCrackData]      = useState([]);
//   const [crackHistory,   setCrackHistory]   = useState([]);
//   const [allReadings,    setAllReadings]     = useState([]);
//   const [latestCrack,    setLatestCrack]     = useState(0);
//   const [crackRate,      setCrackRate]       = useState(0);
//   const [predictions,    setPredictions]     = useState(null);
//   const [riskDist,       setRiskDist]        = useState([{ name:"Safe",value:0},{name:"Warning",value:0},{name:"Critical",value:0}]);
//   const [correlationData,setCorrelationData] = useState([]);
//   const [alertHistory,   setAlertHistory]    = useState([]);
//   const [linkedPoint,    setLinkedPoint]     = useState(null);
//   const [selectedNode,   setSelectedNode]    = useState("all");
//   const [showPredictions,setShowPredictions] = useState(false);
//   const [showFilters,    setShowFilters]     = useState(false);
//   const [showHelp,       setShowHelp]        = useState(false);
//   const [alertsMuted,    setAlertsMuted]     = useState(false);
//   const [expandedSections, setExpandedSections] = useState({
//     headline: true, story: true, trend: true, multiMetric: false,
//     patterns: false, correlations: false, scatter: false,
//     radar: false, heatmap: false, alerts: false, actions: true,
//     mlIntegration: true, 
//   });

//   const [comparisonMode, setComparisonMode] = useState(false);  

//   const isSensorHealthy = true;
//   const toggleSection   = (k) => setExpandedSections(p => ({ ...p, [k]: !p[k] }));

//   // ========== ADD THIS REF FOR CHART FORCED RERENDER ==========
//   const chartKey = useRef(0);

//   // Force chart redraw when dateRange changes
//   useEffect(() => {
//     chartKey.current = chartKey.current + 1;
//     console.log(`🔄 Chart key updated to: ${chartKey.current} for dateRange: ${dateRange}`);
//   }, [dateRange]);


//   // ── Calculations using only allowed columns ──────────────────────────────────────────
//   const calculatePredictions = useCallback((readings) => {
//     if (!readings || readings.length < 10) return null;
//     const last10 = readings.slice(-10);
//     let totalRate = 0;
//     for (let i = 1; i < last10.length; i++) {
//       const dt = (new Date(last10[i].timestamp) - new Date(last10[i-1].timestamp)) / 3_600_000;
//       if (dt > 0) totalRate += Math.abs((last10[i].crack_width - last10[i-1].crack_width) / dt);
//     }
//     const avgRate     = totalRate / 9;
//     const current     = readings[readings.length-1].crack_width || 0;
//     const toWarning   = avgRate > 0 ? Math.max(0,(TH_WARNING - current)/avgRate)  : Infinity;
//     const toCritical  = avgRate > 0 ? Math.max(0,(TH_CRITICAL - current)/avgRate) : Infinity;
//     return {
//       avgRate:          +avgRate.toFixed(3),
//       hoursToWarning:   isFinite(toWarning)  ? +toWarning.toFixed(1)  : "∞",
//       hoursToCritical:  isFinite(toCritical) ? +toCritical.toFixed(1) : "∞",
//       predictedNextHour:+(current + avgRate).toFixed(2),
//       predictedNextDay: +(current + avgRate*24).toFixed(2),
//       trend: avgRate > 0.02 ? "Rapidly Worsening" : avgRate > 0.005 ? "Gradually Worsening" : "Stable",
//     };
//   }, []);

//   const calculateCorrelations = useCallback((readings) => {
//     if (!readings || readings.length < 5) return [];
//     const correlate = (fn1, fn2) => {
//       const pairs = readings.map(r => [fn1(r), fn2(r)]);
//       const n = pairs.length;
//       const [mx,my] = [pairs.map(p=>p[0]).reduce((a,b)=>a+b,0)/n, pairs.map(p=>p[1]).reduce((a,b)=>a+b,0)/n];
//       const num = pairs.reduce((s,[x,y])=>s+(x-mx)*(y-my),0);
//       const den = Math.sqrt(pairs.reduce((s,[x])=>s+(x-mx)**2,0)*pairs.reduce((s,[,y])=>s+(y-my)**2,0));
//       return den === 0 ? 0 : Math.abs(num/den);
//     };
//     const crack = r => r.crack_width || 0;
//     return [
//       { factor:"Soil Moisture (20cm)", correlation:+correlate(crack,r=>r.soil_20cm||0).toFixed(2), icon:"💧", color:TOKEN.blue },
//       { factor:"Rotation X (abs)",     correlation:+correlate(crack,r=>Math.abs(r.rotation_x||0)).toFixed(2), icon:"📐", color:TOKEN.warning },
//       { factor:"Rotation Y (abs)",     correlation:+correlate(crack,r=>Math.abs(r.rotation_y||0)).toFixed(2), icon:"📐", color:TOKEN.warning },
//       { factor:"Rotation Z (abs)",     correlation:+correlate(crack,r=>Math.abs(r.rotation_z||0)).toFixed(2), icon:"📐", color:TOKEN.warning },
//       { factor:"Vibration",            correlation:+correlate(crack,r=>Math.abs(r.vibration||0)).toFixed(2), icon:"📳", color:TOKEN.critical },
//     ].sort((a,b) => b.correlation - a.correlation);
//   }, []);

//   const generateAlertHistory = useCallback((readings) => {
//     if (!readings || readings.length === 0) return [];
//     const alerts = [];
//     for (let i = readings.length-1; i >= 0 && alerts.length < 15; i--) {
//       const crack = readings[i].crack_width || 0;
//       if (crack >= TH_CRITICAL) alerts.push({
//         id: alerts.length+1,
//         time: new Date(readings[i].timestamp).toLocaleTimeString(),
//         date: new Date(readings[i].timestamp).toLocaleDateString(),
//         severity:"CRITICAL", color:TOKEN.critical,
//         message:`Crack width ${fmt(crack)}mm — exceeds ${TH_CRITICAL}mm emergency threshold`,
//         acked: false,
//       });
//       else if (crack >= TH_WARNING && alerts.length === 0) alerts.push({
//         id: alerts.length+1,
//         time: new Date(readings[i].timestamp).toLocaleTimeString(),
//         date: new Date(readings[i].timestamp).toLocaleDateString(),
//         severity:"WARNING", color:TOKEN.warning,
//         message:`Crack width ${fmt(crack)}mm — approaching critical level`,
//         acked: true,
//       });
//     }
//     return alerts;
//   }, []);

//   //── Data fetching ─────────────────────────────────────────────────────────
//   useEffect(() => {
//     getLatestReading((latest) => {
//       if (latest) setLatestCrack(latest.crack_width || 0);
//     });

//     getAllReadings((readings) => {
//       if (!readings || readings.length === 0) return;
//       let filtered = selectedNode !== "all"
//         ? readings.filter(r => r.node_name === selectedNode)
//         : readings;

//       setAllReadings(filtered);

//       const last30 = filtered.slice(-30);
//       setCrackData(last30.map((r,i) => ({ time:i, value:r.crack_width||0, timestamp:r.timestamp })));

//       const daysMap = { "7d":7, "14d":14, "30d":30 };
//       const limit = daysMap[dateRange] || 30;

//       // Get last N readings based on dateRange
//       const histData = filtered.slice(-limit).map((r, idx) => ({
//         id: idx,
//         date: new Date(r.timestamp).toLocaleDateString(),
//         value: r.crack_width || 0,
//         soil20: r.soil_20cm || 0,
//         rotationX: r.rotation_x || 0,
//         fullDate: new Date(r.timestamp)
//       }));
      
//       // IMPORTANT: Create a NEW array reference to trigger re-render
//       setCrackHistory([...histData]);
//       console.log(`📊 Date range: ${dateRange}, Showing ${histData.length} readings`);

//       let s=0,w=0,c=0;
//       filtered.forEach(r => {
//         const v = r.crack_width || 0;
//         if (v < TH_WARNING) s++; else if (v < TH_CRITICAL) w++; else c++;
//       });
//       const total = s+w+c || 1;
//       setRiskDist([
//         { name:"Safe",     value:Math.round(s/total*100) },
//         { name:"Warning",  value:Math.round(w/total*100) },
//         { name:"Critical", value:Math.round(c/total*100) },
//       ]);

//       if (filtered.length >= 2) {
//         const a = filtered[filtered.length-1], b = filtered[filtered.length-2];
//         const dt = (new Date(a.timestamp)-new Date(b.timestamp))/3_600_000;
//         if (dt > 0) setCrackRate(+Math.abs((a.crack_width-b.crack_width)/dt).toFixed(3));
//       }

//       setPredictions(calculatePredictions(filtered));
//       setCorrelationData(calculateCorrelations(filtered));
//       setAlertHistory(generateAlertHistory(filtered));
//     });
//   }, [dateRange, selectedNode, calculatePredictions, calculateCorrelations, generateAlertHistory]);

//   // ── Derived ───────────────────────────────────────────────────────────────
//   const status       = riskOf(latestCrack);
//   const statusColor  = colorOf(latestCrack);

//   const annotatedCrackData = crackData.map((d,i,arr) => {
//     const marks = {};
//     if (d.value >= TH_CRITICAL) marks.critical = d.value;
//     if (d.value >= TH_WARNING && d.value < TH_CRITICAL) marks.warning = d.value;
//     return { ...d, ...marks };
//   });

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (!active || !payload?.length) return null;
//     return (
//       <div style={{ backgroundColor:"#0f1521", padding:10, border:"1px solid rgba(255,255,255,0.12)", borderRadius:6, fontSize:11 }}>
//         <p style={{ margin:0, color:TOKEN.muted }}>Reading #{label}</p>
//         <p style={{ margin:"2px 0 0", color:TOKEN.safe }}><strong>Crack:</strong> {fmt(payload[0].value,2)} mm</p>
//         {payload[0].payload.timestamp && (
//           <p style={{ margin:"2px 0 0", color:TOKEN.muted, fontSize:9 }}>{new Date(payload[0].payload.timestamp).toLocaleTimeString()}</p>
//         )}
//         {linkedPoint?.time === payload[0].payload.time && (
//           <p style={{ margin:"2px 0 0", color:TOKEN.purple, fontSize:9 }}>● Linked across panels</p>
//         )}
//       </div>
//     );
//   };

//   const SectionHeader = ({ id, icon: Icon, iconColor, title, badge }) => (
//     <div
//       onClick={() => toggleSection(id)}
//       role="button" aria-expanded={expandedSections[id]}
//       tabIndex={0}
//       onKeyDown={(e) => e.key==="Enter" && toggleSection(id)}
//       style={{
//         display:"flex", justifyContent:"space-between", alignItems:"center",
//         padding:14, cursor:"pointer",
//         backgroundColor: `${iconColor}08`,
//         userSelect:"none",
//       }}
//     >
//       <div style={{ display:"flex", alignItems:"center", gap:8 }}>
//         {Icon && <Icon size={14} style={{ color:iconColor }} />}
//         <span style={{ fontSize:11, fontWeight:600, color:TOKEN.text }}>{title}</span>
//         {badge && (
//           <span style={{
//             fontSize:9, padding:"2px 6px", borderRadius:10,
//             backgroundColor:`${iconColor}22`, color:iconColor,
//           }}>{badge}</span>
//         )}
//       </div>
//       {expandedSections[id] ? <ChevronUp size={15} style={{ color:TOKEN.muted }} /> : <ChevronDown size={15} style={{ color:TOKEN.muted }} />}
//     </div>
//   );

//   // ── Render ────────────────────────────────────────────────────────────────
//   return (
//     <div
//       role="main"
//       aria-label="Crack sensor analytics dashboard"
//       style={{ display:"flex", flexDirection:"column", gap:16 }}
//     >

//       {/* HELP MODAL */}
//       {showHelp && (
//         <div
//           style={{
//             position:"fixed", inset:0, backgroundColor:"rgba(0,0,0,0.7)",
//             display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999,
//           }}
//           role="dialog" aria-modal="true" aria-label="Help overlay"
//           onClick={() => setShowHelp(false)}
//         >
//           <div
//             onClick={e => e.stopPropagation()}
//             style={{
//               backgroundColor:"#1A2030", border:`2px solid ${TOKEN.warning}`,
//               borderRadius:12, padding:24, width:460, maxWidth:"90vw", maxHeight:"80vh", overflowY:"auto",
//             }}
//           >
//             <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
//               <h2 style={{ color:TOKEN.warning, margin:0, fontSize:15, fontWeight:600 }}>Crack Sensor — Help Guide</h2>
//               <button onClick={()=>setShowHelp(false)} style={{ background:"none",border:"none",color:TOKEN.text,cursor:"pointer",fontSize:20,lineHeight:1 }} aria-label="Close help">✕</button>
//             </div>
//             <div style={{ fontSize:12, color:TOKEN.text, lineHeight:1.7 }}>
//               <p><strong style={{ color:TOKEN.safe }}>● SAFE (&lt;3.5 mm)</strong> — Normal. Routine monitoring.</p>
//               <p><strong style={{ color:TOKEN.warning }}>● WARNING (3.5–5 mm)</strong> — Elevated. Increase inspection frequency.</p>
//               <p><strong style={{ color:TOKEN.critical }}>● CRITICAL (&gt;5 mm)</strong> — Emergency. Evacuate and call engineer.</p>
//               <hr style={{ borderColor:"rgba(255,255,255,0.1)", margin:"12px 0" }} />
//               <p><strong>Brushing & Linking:</strong> Click any chart point to highlight that timestamp across all panels simultaneously.</p>
//               <p><strong>Heatmap:</strong> Each cell = one day. Hover for date + severity details.</p>
//               <p><strong>Radar Chart:</strong> Multi-sensor snapshot using Rotation X/Y/Z, Vibration, Soil20cm.</p>
//               <p><strong>Scatter Plot:</strong> Reveals whether soil saturation triggers crack widening.</p>
//               <p><strong>Hourly Pattern:</strong> Identify daily thermal-expansion or rain-cycle effects.</p>
//               <p><strong>Action Checklist:</strong> Check off completed actions. Resets on page reload.</p>
//               <p><strong>Predictions:</strong> Toggle ON to see trend-based time-to-threshold forecasts.</p>
//               <p><strong>Export CSV:</strong> Downloads the last 30 readings for offline analysis.</p>
//             </div>
//             <button
//               onClick={()=>setShowHelp(false)}
//               style={{ marginTop:16, padding:"8px 0", width:"100%", backgroundColor:TOKEN.warning, border:"none", borderRadius:6, color:"#000", cursor:"pointer", fontWeight:600, fontSize:12 }}
//             >
//               Got it
//             </button>
//           </div>
//         </div>
//       )}

//       {/* HEADLINE — STATUS STRIP */}
//       <div style={{
//         padding:"10px 16px", borderRadius:8,
//         backgroundColor:`${statusColor}15`,
//         border:`2px solid ${statusColor}`,
//         display:"flex", alignItems:"center", justifyContent:"space-between",
//         flexWrap:"wrap", gap:8,
//       }} role="banner" aria-label={`Current status: ${status}`}>
//         <div style={{ display:"flex", alignItems:"center", gap:10 }}>
//           <span style={{
//             width:12, height:12, borderRadius:"50%",
//             backgroundColor:statusColor,
//             boxShadow:`0 0 8px ${statusColor}`,
//             animation: status !== "SAFE" ? "pulse 1.5s infinite" : "none",
//             display:"inline-block",
//           }} />
//           <span style={{ fontSize:14, fontWeight:700, color:statusColor, letterSpacing:"0.05em" }}>
//             {status === "CRITICAL" ? "🚨 CRITICAL — IMMEDIATE ACTION" : status === "WARNING" ? "⚠ WARNING — MONITOR CLOSELY" : "✅ SAFE — NORMAL OPERATIONS"}
//           </span>
//         </div>
//         <div style={{ display:"flex", alignItems:"center", gap:16 }}>
//           <span style={{ fontSize:22, fontWeight:700, color:statusColor }}>{fmt(latestCrack)} mm</span>
//           <Sparkline data={crackData.slice(-15)} color={statusColor} />
//         </div>
//         <style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(1.3)}}`}</style>
//       </div>

//       {/* STAT CARDS */}
//       <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:12 }} role="region" aria-label="Key metrics">
//         <StatCard label="CRACK WIDTH"    value={`${fmt(latestCrack)} mm`}   sub={`Threshold: ${TH_WARNING}–${TH_CRITICAL}mm`} color={statusColor} />
//         <StatCard label="WIDENING RATE"  value={`${fmt(crackRate,3)} mm/hr`} sub={crackRate > 0.02 ? "Rapid change" : crackRate > 0 ? "Gradual change" : "Stable"} color={crackRate > 0.05 ? TOKEN.critical : crackRate > 0.01 ? TOKEN.warning : TOKEN.safe} />
//         <StatCard label="RISK STATUS"    value={status}                       sub={`Score: ${severityScore(allReadings[allReadings.length-1]||{})}/100`} color={statusColor} />
//         <StatCard label="SENSOR HEALTH"  value={isSensorHealthy ? "ONLINE" : "FAULT"} sub="ToF + IMU + Soil" color={isSensorHealthy ? TOKEN.safe : TOKEN.critical} />
//       </div>

//       {/* TOP BAR — CONTROLS */}
//       <div style={{
//         display:"flex", justifyContent:"space-between", alignItems:"center",
//         padding:"10px 14px", backgroundColor:TOKEN.bg3, borderRadius:8,
//         flexWrap:"wrap", gap:10,
//       }} role="toolbar" aria-label="Dashboard controls">
//         <div style={{ display:"flex", gap:8, alignItems:"center" }}>
//           <Filter size={12} style={{ color:TOKEN.muted }} />
//           <span style={{ fontSize:11, color:TOKEN.muted }}>Node:</span>
//           <select
//             value={selectedNode}
//             onChange={e=>setSelectedNode(e.target.value)}
//             style={{ padding:"3px 8px", borderRadius:4, fontSize:11, backgroundColor:TOKEN.bg2, border:`1px solid ${TOKEN.border}`, color:TOKEN.text }}
//             aria-label="Filter by node"
//           >
//             <option value="all">All Nodes</option>
//             <option value="Node1">Node 1</option>
//             <option value="Node2">Node 2</option>
//           </select>

//           <div style={{ display:"flex", gap:4 }}>
//             {[["7d","7 Days"],["14d","14 Days"],["30d","30 Days"]].map(([id,label]) => {
//               const daysMap = { "7d":7, "14d":14, "30d":30 };
//               const readingCount = crackHistory.length;
//               const isActive = dateRange === id;
              
//               return (
//                 <button key={id} onClick={() => setDateRange(id)}
//                   aria-pressed={isActive}
//                   style={{
//                     padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:600,
//                     backgroundColor: isActive ? `${TOKEN.safe}25` : TOKEN.bg2,
//                     border:`1px solid ${isActive ? TOKEN.safe : TOKEN.border}`,
//                     color: isActive ? TOKEN.safe : TOKEN.muted,
//                     cursor:"pointer",
//                     position:"relative",
//                   }}>
//                   {label}
//                   {isActive && readingCount > 0 && (
//                     <span style={{
//                       position:"absolute",
//                       top:"-6px",
//                       right:"-6px",
//                       background: TOKEN.safe,
//                       color: "#000",
//                       fontSize:"8px",
//                       borderRadius:"10px",
//                       padding:"0px 4px",
//                       fontWeight:"bold"
//                     }}>
//                       {readingCount}
//                     </span>
//                   )}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         <div style={{ display:"flex", gap:6 }}>

//           <button 
//             onClick={() => setComparisonMode(!comparisonMode)}
//             style={{
//               padding:"3px 10px",
//               borderRadius:4,
//               fontSize:10,
//               backgroundColor: comparisonMode ? `${TOKEN.blue}22` : TOKEN.bg2,
//               border: `1px solid ${comparisonMode ? TOKEN.blue : TOKEN.border}`,
//               color: comparisonMode ? TOKEN.blue : TOKEN.muted,
//               cursor:"pointer"
//             }}
//           >
//             {comparisonMode ? "📊 Normal View" : "📈 Compare Mode"}
//           </button>

//           <button onClick={()=>setShowPredictions(p=>!p)}
//             aria-pressed={showPredictions}
//             style={{
//               padding:"3px 10px", borderRadius:4, fontSize:10,
//               backgroundColor: showPredictions ? `${TOKEN.purple}22` : TOKEN.bg2,
//               border:`1px solid ${showPredictions ? TOKEN.purple : TOKEN.border}`,
//               color: showPredictions ? TOKEN.purple : TOKEN.muted,
//               cursor:"pointer", display:"flex", alignItems:"center", gap:4,
//             }}>
//             <TrendingUp size={11} /> Predictions
//           </button>

//           <button onClick={()=>setAlertsMuted(p=>!p)}
//             aria-pressed={alertsMuted}
//             style={{
//               padding:"3px 10px", borderRadius:4, fontSize:10,
//               backgroundColor: TOKEN.bg2, border:`1px solid ${TOKEN.border}`,
//               color: alertsMuted ? TOKEN.muted : TOKEN.warning, cursor:"pointer",
//               display:"flex", alignItems:"center", gap:4,
//             }}>
//             {alertsMuted ? <BellOff size={11}/> : <Bell size={11}/>}
//             {alertsMuted ? "Muted" : "Alerts"}
//           </button>

//           <button
//             onClick={() => {
//               const headers = ["Timestamp","Crack(mm)","Soil20","Rotation_X","Rotation_Y","Rotation_Z","Vibration","Risk"];
//               const rows = allReadings.slice(-30).map(r=>[
//                 r.timestamp, r.crack_width, r.soil_20cm, r.rotation_x, r.rotation_y, r.rotation_z, r.vibration, riskOf(r.crack_width||0)
//               ]);
//               const csv = [headers,...rows].map(r=>r.join(",")).join("\n");
//               const a = document.createElement("a");
//               a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
//               a.download = `crack_export_${new Date().toISOString().slice(0,10)}.csv`;
//               a.click();
//             }}
//             style={{
//               padding:"3px 10px", borderRadius:4, fontSize:10,
//               backgroundColor:TOKEN.bg2, border:`1px solid ${TOKEN.border}`,
//               color:TOKEN.muted, cursor:"pointer",
//               display:"flex", alignItems:"center", gap:4,
//             }}
//             aria-label="Export CSV"
//           >
//             <Download size={11}/> Export
//           </button>

//           <button onClick={()=>setShowHelp(true)}
//             style={{
//               padding:"3px 10px", borderRadius:4, fontSize:10,
//               backgroundColor:TOKEN.bg2, border:`1px solid ${TOKEN.border}`,
//               color:TOKEN.muted, cursor:"pointer",
//               display:"flex", alignItems:"center", gap:4,
//             }}
//             aria-label="Open help">
//             <HelpCircle size={11}/> Help
//           </button>
//         </div>
//       </div>

//       {/* LINKED POINT BANNER */}
//       {linkedPoint && (
//         <div style={{
//           padding:"7px 14px", borderRadius:6, fontSize:10,
//           backgroundColor:`${TOKEN.purple}15`, border:`1px solid ${TOKEN.purple}55`,
//           display:"flex", justifyContent:"space-between", alignItems:"center",
//         }} role="status">
//           <span style={{ color:TOKEN.purple }}>
//             🔗 Linked to reading #{linkedPoint.i} · {fmt(linkedPoint.value,2)}mm
//             {linkedPoint.timestamp && ` · ${new Date(linkedPoint.timestamp).toLocaleTimeString()}`}
//           </span>
//           <button onClick={()=>setLinkedPoint(null)}
//             style={{ background:"none", border:"none", color:TOKEN.purple, cursor:"pointer", fontSize:16, lineHeight:1 }}
//             aria-label="Clear linked selection">✕</button>
//         </div>
//       )}

//       {/* TWO-COLUMN LAYOUT: Gauges + Pie */}
//       <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:16 }}>
//         <div style={{ padding:16, backgroundColor:TOKEN.card, borderRadius:8, border:`1px solid ${TOKEN.border}`, display:"flex", flexDirection:"column", gap:16 }}>
//           <div style={{ fontSize:10, fontWeight:600, color:TOKEN.muted, letterSpacing:"0.08em" }}>SENSOR GAUGES</div>
//           <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
//             <RingGauge value={latestCrack} max={8} label="Crack" color={statusColor} unit="mm" />

//             <RingGauge value={allReadings[allReadings.length-1]?.soil_20cm||0} max={100} label="Soil 20cm" color={TOKEN.blue} unit="%" />

//             <RingGauge value={Math.abs(allReadings[allReadings.length-1]?.vibration||0)} max={100} label="Vibration" color={TOKEN.purple} unit="raw" />
    
//             <RingGauge value={Math.min(Math.abs(allReadings[allReadings.length-1]?.rotation_x||0), 10)} max={10} label="Rot X (abs)" color={TOKEN.warning} unit="°" />
//           </div>
//         </div>

//         <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
//           <div style={{ padding:14, backgroundColor:TOKEN.card, borderRadius:8, border:`1px solid ${TOKEN.border}`, textAlign:"center" }}>
//             <div style={{ fontSize:10, fontWeight:600, color:TOKEN.muted, letterSpacing:"0.08em", marginBottom:8 }}>RISK DISTRIBUTION</div>
//             <ResponsiveContainer width="100%" height={130}>
//               <PieChart>
//                 <Pie data={riskDist} dataKey="value" innerRadius={28} outerRadius={52} paddingAngle={3}
//                   label={({ name, value }) => value > 0 ? `${name}: ${value}%` : ""} labelLine={false}>
//                   {riskDist.map((_,i) => <Cell key={i} fill={[TOKEN.safe,TOKEN.warning,TOKEN.critical][i]} />)}
//                 </Pie>
//                 <Tooltip formatter={v=>[`${v}%`]} contentStyle={{ backgroundColor:TOKEN.card, border:`1px solid ${TOKEN.border}`, fontSize:10, borderRadius:6 }} />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           <div style={{
//             padding:14, backgroundColor:TOKEN.card, borderRadius:8,
//             border:`1px solid ${TOKEN.border}`,
//             display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center",
//           }}>
//             <div style={{ fontSize:10, fontWeight:600, color:TOKEN.muted, letterSpacing:"0.08em", marginBottom:12 }}>SENSOR HEALTH</div>
//             <div style={{
//               width:52, height:52, borderRadius:"50%",
//               backgroundColor: isSensorHealthy ? `${TOKEN.safe}20` : `${TOKEN.critical}20`,
//               border:`2px solid ${isSensorHealthy ? TOKEN.safe : TOKEN.critical}`,
//               display:"flex", alignItems:"center", justifyContent:"center", marginBottom:8,
//             }}>
//               {isSensorHealthy ? <CheckCircle size={24} color={TOKEN.safe} /> : <XCircle size={24} color={TOKEN.critical} />}
//             </div>
//             <div style={{ fontSize:11, fontWeight:600, color: isSensorHealthy ? TOKEN.safe : TOKEN.critical }}>
//               {isSensorHealthy ? "FUNCTIONING" : "FAULT"}
//             </div>
//             <div style={{ fontSize:9, color:TOKEN.muted, textAlign:"center", marginTop:6, lineHeight:1.5 }}>
//               {isSensorHealthy ? "ToF calibrated\nNo data loss" : "Check wiring"}
//             </div>
//             <div style={{ fontSize:9, color:TOKEN.muted, marginTop:6 }}>
//               Calibrated: {new Date().toLocaleDateString()}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* MAIN TREND CHART */}
//       <div style={{ backgroundColor:TOKEN.card, border:`1px solid ${TOKEN.border}`, borderRadius:8, overflow:"hidden" }}>
//         <SectionHeader id="trend" icon={TrendingUp} iconColor={TOKEN.safe} title="SENSOR TREND — LAST 30 READINGS" />
//         {expandedSections.trend && (
//           <div style={{ padding:16 }}>
//             <ResponsiveContainer width="100%" height={220}>
//               <ComposedChart
//                 data={annotatedCrackData}
//                 onClick={(d) => d?.activePayload && setLinkedPoint(d.activePayload[0].payload)}
//               >
//                 <defs>
//                   <linearGradient id="crackGrad" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%"   stopColor={TOKEN.safe} stopOpacity={0.3} />
//                     <stop offset="100%" stopColor={TOKEN.safe} stopOpacity={0}   />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
//                 <XAxis dataKey="time" stroke={TOKEN.muted} tick={{ fontSize:8 }} />
//                 <YAxis domain={[0,8]} stroke={TOKEN.muted} tick={{ fontSize:8 }} label={{ value:"mm", angle:-90, position:"insideLeft", fill:TOKEN.muted, fontSize:9 }} />
//                 <Tooltip content={<CustomTooltip />} />
//                 <ReferenceLine y={TH_CRITICAL} stroke={TOKEN.critical} strokeDasharray="5 4"
//                   label={{ value:`Critical (${TH_CRITICAL}mm)`, position:"right", fill:TOKEN.critical, fontSize:9 }} />
//                 <ReferenceLine y={TH_WARNING}  stroke={TOKEN.warning}  strokeDasharray="5 4"
//                   label={{ value:`Warning (${TH_WARNING}mm)`, position:"right", fill:TOKEN.warning, fontSize:9 }} />

//                 <Area type="monotone" dataKey="value" stroke={TOKEN.safe} strokeWidth={2.5}
//                   fill="url(#crackGrad)" dot={false} activeDot={{ r:6, fill:TOKEN.safe, stroke:"#fff", strokeWidth:2 }} />

//                 {linkedPoint && (
//                   <ReferenceDot x={linkedPoint.time} y={linkedPoint.value}
//                     r={8} fill={TOKEN.purple} stroke="#fff" strokeWidth={2} />
//                 )}

//                 {showPredictions && predictions && (
//                   <ReferenceLine
//                     y={predictions.predictedNextHour}
//                     stroke={TOKEN.purple} strokeDasharray="8 4"
//                     label={{ value:`Pred. 1hr: ${predictions.predictedNextHour}mm`, position:"insideTopRight", fill:TOKEN.purple, fontSize:9 }}
//                   />
//                 )}
//               </ComposedChart>
//             </ResponsiveContainer>

//             {crackHistory.length > 0 && (
//               <div style={{ marginTop:14, padding:"10px 12px", backgroundColor:`rgba(59,130,246,0.08)`, borderRadius:6 }}>
//                 <div style={{ fontSize:10, color:TOKEN.blue, marginBottom:6, fontWeight:600 }}>📖 VISUAL NARRATIVE</div>
//                 <div style={{ fontSize:11, color:TOKEN.text, lineHeight:1.6 }}>
//                   {latestCrack >= TH_CRITICAL
//                     ? `🔴 The crack width has surpassed the ${TH_CRITICAL}mm emergency threshold, reaching ${fmt(latestCrack)}mm. The trend line shows ${predictions?.trend || "worsening"} conditions. Immediate structural intervention is required.`
//                     : latestCrack >= TH_WARNING
//                     ? `⚠ Crack width is currently ${fmt(latestCrack)}mm — above the ${TH_WARNING}mm warning threshold. The ${crackRate > 0 ? "upward" : "stable"} trend at ${fmt(crackRate,3)} mm/hr suggests${crackRate > 0.02 ? " rapid deterioration" : " gradual change"}. Schedule an inspection within 24 hours.`
//                     : `✅ Crack width remains within safe bounds at ${fmt(latestCrack)}mm (threshold: ${TH_WARNING}mm). The stabilised trend over the last 30 readings supports continued normal operations with routine monitoring.`
//                   }
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* HISTORICAL AREA CHART */}
//       <div style={{ backgroundColor: TOKEN.card, border: `1px solid ${TOKEN.border}`, borderRadius: 8, overflow: "hidden" }}>
//         <SectionHeader id="story" icon={Calendar} iconColor={TOKEN.blue} title={`HISTORICAL TREND — ${dateRange.toUpperCase()}`} />
//         {expandedSections.story && (
//           <div style={{ padding: 16 }} key={`history-container-${dateRange}`}>
//             {/* Debug info - shows current data count */}
//             <div style={{ fontSize: 9, color: TOKEN.muted, marginBottom: 8, textAlign: 'right' }}>
//               📊 Showing {crackHistory.length} readings ({dateRange === '7d' ? 'Last 7 days' : dateRange === '14d' ? 'Last 14 days' : 'Last 30 days'})
//             </div>
            
//             <ResponsiveContainer width="100%" height={200}>
//               <AreaChart 
//                 key={`area-chart-${dateRange}-${crackHistory.length}`}
//                 data={crackHistory.slice()} 
//                 onClick={(d) => d?.activePayload && setLinkedPoint({ time: d.activePayload[0].payload.date, value: d.activePayload[0].payload.value })}
//               >
//                 <defs>
//                   <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor={statusColor} stopOpacity={0.3} />
//                     <stop offset="95%" stopColor={statusColor} stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
//                 <XAxis 
//                   dataKey="date" 
//                   stroke={TOKEN.muted} 
//                   tick={{ fontSize: 8 }} 
//                   interval={Math.floor(crackHistory.length / 8)} 
//                 />
//                 <YAxis domain={[0, 8]} stroke={TOKEN.muted} tick={{ fontSize: 8 }} />
//                 <Tooltip contentStyle={{ backgroundColor: TOKEN.card, border: `1px solid ${TOKEN.border}`, fontSize: 11, borderRadius: 6 }} />
//                 <Legend wrapperStyle={{ fontSize: 9 }} />
//                 <ReferenceLine y={TH_CRITICAL} stroke={TOKEN.critical} strokeDasharray="4 4" label={{ value: "CRITICAL", fill: TOKEN.critical, fontSize: 9 }} />
//                 <ReferenceLine y={TH_WARNING} stroke={TOKEN.warning} strokeDasharray="4 4" label={{ value: "WARNING", fill: TOKEN.warning, fontSize: 9 }} />
//                 <Area 
//                   type="monotone" 
//                   dataKey="value" 
//                   stroke={statusColor} 
//                   fill="url(#histGrad)" 
//                   strokeWidth={2} 
//                   name="Crack (mm)" 
//                   dot={false}
//                   isAnimationActive={false}  // Disable animation for immediate update
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         )}
//       </div>

//       {/* MULTI-METRIC OVERLAY */}
//       <div style={{ backgroundColor:TOKEN.card, border:`1px solid ${TOKEN.border}`, borderRadius:8, overflow:"hidden" }}>
//         <SectionHeader id="multiMetric" icon={Activity} iconColor={TOKEN.teal} title="MULTI-SENSOR OVERLAY" badge="Brushing & Linking" />
//         {expandedSections.multiMetric && (
//           <div style={{ padding:16 }}>
//             <MultiMetricChart readings={allReadings} linkedPoint={linkedPoint} onBrush={setLinkedPoint} />
//           </div>
//         )}
//       </div>

//       {/* PREDICTIONS */}
//       {showPredictions && predictions && (
//         <div style={{ backgroundColor:TOKEN.card, border:`1px solid ${TOKEN.border}`, borderRadius:8, overflow:"hidden" }}>
//           <SectionHeader id="predictions" icon={Zap} iconColor={TOKEN.warning} title="PREDICTIONS & TIME-TO-THRESHOLD" />
//           {expandedSections.predictions && (
//             <div style={{ padding:16 }}>
//               <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:14 }}>
//                 {[
//                   ["Rate",          `${predictions.avgRate} mm/hr`, predictions.avgRate > 0.02 ? TOKEN.critical : TOKEN.safe],
//                   ["In 1 hour",     `${predictions.predictedNextHour} mm`, colorOf(predictions.predictedNextHour)],
//                   ["→ Warning",     `${predictions.hoursToWarning}h`,  predictions.hoursToWarning < 24 ? TOKEN.warning : TOKEN.safe],
//                   ["→ Critical",    `${predictions.hoursToCritical}h`, predictions.hoursToCritical < 12 ? TOKEN.critical : TOKEN.warning],
//                 ].map(([label, value, color]) => (
//                   <div key={label} style={{ textAlign:"center", padding:"10px 8px", backgroundColor:TOKEN.bg3, borderRadius:6 }}>
//                     <div style={{ fontSize:9, color:TOKEN.muted, marginBottom:4 }}>{label}</div>
//                     <div style={{ fontSize:16, fontWeight:600, color }}>{value}</div>
//                   </div>
//                 ))}
//               </div>
//               <div style={{ padding:"10px 12px", backgroundColor:`${TOKEN.purple}12`, borderRadius:6 }}>
//                 <div style={{ fontSize:10, color:TOKEN.purple, marginBottom:6, fontWeight:600 }}>🤖 AI TREND ASSESSMENT</div>
//                 <div style={{ fontSize:11, color:TOKEN.text, lineHeight:1.6 }}>
//                   <strong style={{ color:TOKEN.purple }}>Trend: {predictions.trend}</strong> — average widening rate of {predictions.avgRate} mm/hr.
//                   {predictions.trend === "Rapidly Worsening"
//                     ? ` At this rate, critical threshold (${TH_CRITICAL}mm) will be reached in approximately ${predictions.hoursToCritical} hours. Escalate immediately.`
//                     : predictions.trend === "Gradually Worsening"
//                     ? ` Warning threshold (${TH_WARNING}mm) will be reached in approximately ${predictions.hoursToWarning} hours. Schedule inspection.`
//                     : ` No significant widening trend detected. Continue routine monitoring.`
//                   }
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* HOURLY PATTERN */}
//       <div style={{ backgroundColor:TOKEN.card, border:`1px solid ${TOKEN.border}`, borderRadius:8, overflow:"hidden" }}>
//         <SectionHeader id="patterns" icon={BarChart2} iconColor={TOKEN.warning} title="HOURLY CRACK PATTERN" badge="Temporal Analysis" />
//         {expandedSections.patterns && (
//           <div style={{ padding:16 }}>
//             <HourlyPattern readings={allReadings} />
//           </div>
//         )}
//       </div>

//       {/* SENSOR CORRELATIONS */}
//       <div style={{ backgroundColor:TOKEN.card, border:`1px solid ${TOKEN.border}`, borderRadius:8, overflow:"hidden" }}>
//         <SectionHeader id="correlations" icon={Info} iconColor={TOKEN.blue} title="SENSOR CORRELATIONS (Pearson r)" />
//         {expandedSections.correlations && (
//           <div style={{ padding:16 }}>
//             <div style={{ fontSize:9, color:TOKEN.muted, marginBottom:12 }}>
//               Pearson correlation coefficient between crack width and each sensor. 1.0 = perfect linear relationship.
//             </div>
//             {correlationData.map((item, idx) => (
//               <div key={idx} style={{ marginBottom:10 }}>
//                 <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4, alignItems:"center" }}>
//                   <span style={{ fontSize:11, color:TOKEN.text }}>{item.icon} {item.factor}</span>
//                   <div style={{ display:"flex", alignItems:"center", gap:8 }}>
//                     <span style={{ fontSize:10, color:item.color, fontWeight:600 }}>r = {item.correlation}</span>
//                     <span style={{ fontSize:9, color:TOKEN.muted }}>
//                       {item.correlation > 0.7 ? "Strong" : item.correlation > 0.4 ? "Moderate" : "Weak"}
//                     </span>
//                   </div>
//                 </div>
//                 <div style={{ height:6, backgroundColor:"rgba(255,255,255,0.07)", borderRadius:3, overflow:"hidden" }}>
//                   <div style={{
//                     width:`${item.correlation*100}%`, height:"100%",
//                     backgroundColor:item.color, borderRadius:3,
//                     transition:"width 0.6s ease",
//                   }} />
//                 </div>
//               </div>
//             ))}
//             <div style={{ fontSize:9, color:TOKEN.muted, marginTop:12, fontStyle:"italic" }}>
//               Tip: Strong correlations may indicate causal relationships.
//             </div>
//           </div>
//         )}
//       </div>

//       {/* SCATTER CORRELATION PLOT */}
//       <div style={{ backgroundColor:TOKEN.card, border:`1px solid ${TOKEN.border}`, borderRadius:8, overflow:"hidden" }}>
//         <SectionHeader id="scatter" icon={Eye} iconColor={TOKEN.teal} title="CRACK vs SOIL 20cm — SCATTER ANALYSIS" badge="Multi-dimensional" />
//         {expandedSections.scatter && (
//           <div style={{ padding:16 }}>
//             <CorrelationScatter readings={allReadings} />
//           </div>
//         )}
//       </div>

//       {/* RADAR SNAPSHOT */}
//       <div style={{ backgroundColor:TOKEN.card, border:`1px solid ${TOKEN.border}`, borderRadius:8, overflow:"hidden" }}>
//         <SectionHeader id="radar" icon={Activity} iconColor={TOKEN.purple} title="MULTI-SENSOR STATE RADAR" />
//         {expandedSections.radar && (
//           <div style={{ padding:16 }}>
//             <SensorRadar readings={allReadings} />
//           </div>
//         )}
//       </div>

//       {/* SEVERITY HEATMAP */}
//       <div style={{ backgroundColor:TOKEN.card, border:`1px solid ${TOKEN.border}`, borderRadius:8, overflow:"hidden" }}>
//         <SectionHeader id="heatmap" icon={Calendar} iconColor={TOKEN.warning} title="DAILY SEVERITY HEATMAP" badge="Calendar View" />
//         {expandedSections.heatmap && (
//           <div style={{ padding:16 }}>
//             <SeverityHeatmap readings={allReadings} />
//           </div>
//         )}
//       </div>

//       {/* EVENT TIMELINE */}
//       <div style={{ backgroundColor:TOKEN.card, border:`1px solid ${TOKEN.border}`, borderRadius:8, overflow:"hidden" }}>
//         <SectionHeader id="story" icon={Clock} iconColor={TOKEN.critical} title="THRESHOLD EVENT TIMELINE" badge={`${alertHistory.length} events`} />
//         {expandedSections.story !== undefined && (
//           <div style={{ padding:16 }}>
//             <EventTimeline readings={allReadings} linkedPoint={linkedPoint} />
//           </div>
//         )}
//       </div>

//       {/* ALERT HISTORY */}
//       <div style={{ backgroundColor:TOKEN.card, border:`1px solid ${TOKEN.border}`, borderRadius:8, overflow:"hidden" }}>
//         <SectionHeader id="alerts" icon={AlertTriangle} iconColor={TOKEN.critical} title="ALERT LOG" badge={alertsMuted ? "MUTED" : `${alertHistory.length} recent`} />
//         {expandedSections.alerts && (
//           <div style={{ padding:16 }}>
//             {alertsMuted ? (
//               <div style={{ textAlign:"center", padding:20, color:TOKEN.muted, fontSize:11 }}>🔕 Alerts muted. Click the bell icon in the toolbar to unmute.</div>
//             ) : alertHistory.length === 0 ? (
//               <div style={{ textAlign:"center", padding:20, color:TOKEN.safe, fontSize:11 }} role="status">
//                 ✅ No recent alerts detected. All parameters within normal range.
//               </div>
//             ) : (
//               <div role="list">
//                 {alertHistory.map(a => (
//                   <div key={a.id} role="listitem" style={{
//                     padding:"10px 12px", marginBottom:8, borderRadius:6,
//                     backgroundColor:`${a.color}12`, borderLeft:`3px solid ${a.color}`,
//                   }}>
//                     <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
//                       <span style={{ fontSize:10, color:a.color, fontWeight:700 }}>{a.severity}</span>
//                       <span style={{ fontSize:9, color:TOKEN.muted }}>{a.date} {a.time}</span>
//                     </div>
//                     <div style={{ fontSize:11, color:TOKEN.text }}>{a.message}</div>
//                     <div style={{ fontSize:9, marginTop:4, color: a.acked ? TOKEN.safe : TOKEN.warning }}>
//                       {a.acked ? "✓ Acknowledged" : "⚠ Pending acknowledgement"}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* ACTION CHECKLIST */}
//       <div style={{ backgroundColor:TOKEN.card, border:`1px solid ${TOKEN.border}`, borderRadius:8, overflow:"hidden" }}>
//         <SectionHeader id="actions" icon={CheckCircle} iconColor={statusColor} title="DECISION SUPPORT — ACTION CHECKLIST" />
//         {expandedSections.actions && (
//           <div style={{ padding:14 }}>
//             <ActionChecklist status={status} crackRate={crackRate} predictions={predictions} />
//           </div>
//         )}
//       </div>

//       {/* ML MODEL INTEGRATION - LINK TO ML PREDICTIONS PAGE */}
//       <div style={{ 
//         backgroundColor: TOKEN.card, 
//         border: `1px solid ${TOKEN.border}`, 
//         borderRadius: 8, 
//         padding: "12px 16px",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between"
//       }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <Brain size={18} style={{ color: TOKEN.purple }} />
//           <span style={{ fontSize: 11, fontWeight: 600, color: TOKEN.text }}>
//             ML-Powered Risk Predictions
//           </span>
//           <span style={{
//             fontSize: 9,
//             padding: "2px 6px",
//             borderRadius: 10,
//             backgroundColor: `${TOKEN.purple}22`,
//             color: TOKEN.purple
//           }}>
//             Logistic Regression
//           </span>
//         </div>
//         <button
//           onClick={() => window.location.href = '/ml-predictions'}
//           style={{
//             padding: "6px 16px",
//             borderRadius: 6,
//             backgroundColor: TOKEN.purple,
//             border: "none",
//             color: "#fff",
//             fontSize: 10,
//             fontWeight: 600,
//             cursor: "pointer",
//             display: "flex",
//             alignItems: "center",
//             gap: 6
//           }}
//         >
//           <Brain size={12} /> View ML Predictions
//         </button>
//       </div>
//       </div>
//   );
// }



//Refined UI

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
  Brain,
} from "lucide-react";

// ─── Design tokens (original colors preserved) ───────────────────────────────
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
  cardBorder: "rgba(255,255,255,0.07)",
  surface:  "rgba(20,28,48,0.9)",
  glassHover: "rgba(255,255,255,0.03)",
};

const GLOW = {
  safe:     "0 0 16px rgba(34,197,94,0.25), 0 0 40px rgba(34,197,94,0.08)",
  warning:  "0 0 16px rgba(245,158,11,0.25), 0 0 40px rgba(245,158,11,0.08)",
  critical: "0 0 16px rgba(239,68,68,0.30), 0 0 40px rgba(239,68,68,0.12)",
  blue:     "0 0 16px rgba(59,130,246,0.20)",
  purple:   "0 0 16px rgba(139,92,246,0.20)",
};

// Color-blind safe diverging palette
const CB_SAFE = ["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd"];

// Thresholds
const TH_WARNING  = 3.5;
const TH_CRITICAL = 5.0;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const riskOf = (v) =>
  v >= TH_CRITICAL ? "CRITICAL" : v >= TH_WARNING ? "WARNING" : "SAFE";

const colorOf = (v) =>
  v >= TH_CRITICAL ? TOKEN.critical : v >= TH_WARNING ? TOKEN.warning : TOKEN.safe;

const fmt = (v, d = 1) => (typeof v === "number" ? v.toFixed(d) : "—");

const severityScore = (r) => {
  let s = Math.min((r.crack_width || 0) / TH_CRITICAL, 1) * 60;
  s += Math.min((r.soil_20cm || 0) / 100, 1) * 20;
  s += Math.min(Math.abs(r.acceleration_x || 0) / 0.5, 1) * 20;
  return Math.round(s);
};

// ─── Global Styles ─────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap');

  @keyframes pulse-ring {
    0%   { transform: scale(1);   opacity: 1; }
    50%  { transform: scale(1.4); opacity: 0.4; }
    100% { transform: scale(1);   opacity: 1; }
  }
  @keyframes status-pulse {
    0%, 100% { box-shadow: 0 0 6px currentColor; }
    50%       { box-shadow: 0 0 18px currentColor, 0 0 36px currentColor; }
  }
  @keyframes slide-in {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes scan-line {
    0%   { top: 0%; }
    100% { top: 100%; }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }

  .cs-dashboard {
    font-family: 'Inter', -apple-system, sans-serif;
    background: linear-gradient(135deg, #060c1a 0%, #0b1528 40%, #0d1a2e 100%);
    min-height: 100vh;
    color: #e8edf5;
    position: relative;
    overflow-x: hidden;
  }
  .cs-dashboard::before {
    content: '';
    position: fixed;
    inset: 0;
    background: radial-gradient(ellipse at 20% 20%, rgba(34,197,94,0.04) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 80%, rgba(59,130,246,0.04) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }
  .cs-grid-bg {
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }
  .cs-content {
    position: relative;
    z-index: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    max-width: 1400px;
    margin: 0 auto;
  }

  /* Cards */
  .cs-card {
    background: rgba(14,20,38,0.80);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    backdrop-filter: blur(12px);
    transition: border-color 0.2s ease;
    overflow: hidden;
  }
  .cs-card:hover { border-color: rgba(255,255,255,0.13); }
  .cs-card-inner { padding: 16px; }

  /* Section headers */
  .cs-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    user-select: none;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.15s ease;
  }
  .cs-section-header:hover { background: rgba(255,255,255,0.02); }

  /* Stat cards row */
  .cs-stat-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
  .cs-stat-item {
    background: rgba(14,20,38,0.80);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px;
    padding: 14px 16px;
    position: relative;
    overflow: hidden;
    transition: transform 0.18s ease, border-color 0.18s ease;
  }
  .cs-stat-item:hover { transform: translateY(-2px); }
  .cs-stat-item::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--accent-color, #22c55e);
    opacity: 0.8;
  }
  .cs-stat-label {
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(160,170,190,0.65);
    margin-bottom: 6px;
    font-family: 'JetBrains Mono', monospace;
  }
  .cs-stat-value {
    font-size: 20px;
    font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    line-height: 1;
    margin-bottom: 4px;
  }
  .cs-stat-sub {
    font-size: 10px;
    color: rgba(160,170,190,0.55);
  }

  /* Toolbar */
  .cs-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    background: rgba(14,20,38,0.60);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px;
    flex-wrap: wrap;
    gap: 10px;
  }
  .cs-btn {
    padding: 5px 12px;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 500;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: rgba(160,170,190,0.8);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.15s ease;
    font-family: 'Inter', sans-serif;
  }
  .cs-btn:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.15); color: var(--text, #e8edf5); }
  .cs-btn.active { background: rgba(34,197,94,0.1); border-color: rgba(34,197,94,0.35); color: #22c55e; }
  .cs-btn.warning-active { background: rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.35); color: #f59e0b; }
  .cs-btn.purple-active  { background: rgba(139,92,246,0.1); border-color: rgba(139,92,246,0.35); color: #8b5cf6; }
  .cs-btn.blue-active    { background: rgba(59,130,246,0.1); border-color: rgba(59,130,246,0.35); color: #3b82f6; }

  .cs-range-btn {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 600;
    cursor: pointer;
    position: relative;
    transition: all 0.15s ease;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.05em;
  }

  /* Checklist */
  .cs-checklist-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 9px;
    cursor: pointer;
    padding: 7px 9px;
    border-radius: 6px;
    transition: background 0.15s ease;
  }
  .cs-checklist-item:hover { background: rgba(255,255,255,0.03); }

  /* Timeline events */
  .cs-event-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    transition: opacity 0.2s, transform 0.2s;
    animation: slide-in 0.3s ease;
  }
  .cs-event-item:hover { transform: translateX(3px); }

  /* Alert items */
  .cs-alert-item {
    padding: 11px 14px;
    margin-bottom: 9px;
    border-radius: 8px;
    transition: transform 0.15s ease;
  }
  .cs-alert-item:hover { transform: translateX(3px); }

  /* Correlation bars */
  .cs-correlation-bar {
    height: 5px;
    border-radius: 3px;
    transition: width 0.7s cubic-bezier(.4,0,.2,1);
  }

  /* Heatmap cells */
  .cs-heatmap-cell {
    width: 28px; height: 28px;
    border-radius: 5px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .cs-heatmap-cell:hover { transform: scale(1.28); z-index: 2; }

  /* Chart tooltip */
  .cs-tooltip {
    background: rgba(8,14,28,0.95);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 8px;
    padding: 10px 13px;
    font-size: 11px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  }

  /* Gauge */
  .cs-gauge-label {
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(160,170,190,0.6);
    font-family: 'JetBrains Mono', monospace;
  }

  /* Narrative block */
  .cs-narrative {
    padding: 13px 15px;
    border-radius: 8px;
    border-left: 3px solid;
    margin-top: 14px;
  }

  /* Mono text */
  .mono { font-family: 'JetBrains Mono', monospace; }

  /* Badge */
  .cs-badge {
    font-size: 9px;
    padding: 2px 7px;
    border-radius: 12px;
    font-weight: 600;
    letter-spacing: 0.06em;
    font-family: 'JetBrains Mono', monospace;
  }

  /* Progress bar */
  .cs-progress-track {
    height: 3px;
    background: rgba(255,255,255,0.07);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 13px;
  }
  .cs-progress-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.4s ease;
  }

  /* Divider */
  .cs-divider {
    border: none;
    border-top: 1px solid rgba(255,255,255,0.05);
    margin: 12px 0;
  }

  /* Status dot */
  .cs-dot-live {
    width: 8px; height: 8px;
    border-radius: 50%;
    display: inline-block;
    animation: blink 2s ease-in-out infinite;
  }

  /* Scatter & radar tooltip */
  .recharts-tooltip-wrapper { z-index: 100; }
`;

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Animated ring gauge — premium version */
const RingGauge = ({ value, max = 8, label, color, size = 110, unit = "mm" }) => {
  const r    = 38;
  const circ = 2 * Math.PI * r;
  const pct  = Math.min(value / max, 1);
  const dash = circ * pct;
  const trackColor = "rgba(255,255,255,0.06)";
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
      <div style={{ position:"relative", width:size, height:size }}>
        {/* Glow ring */}
        <div style={{
          position:"absolute", inset:0, borderRadius:"50%",
          background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
          pointerEvents:"none",
        }} />
        <svg width={size} height={size} viewBox="0 0 100 100" aria-label={`${label}: ${value}`}>
          {/* Track */}
          <circle cx="50" cy="50" r={r} fill="none" stroke={trackColor} strokeWidth="6" />
          {/* Progress arc */}
          <circle
            cx="50" cy="50" r={r}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            style={{
              transition: "stroke-dasharray 0.9s cubic-bezier(.4,0,.2,1)",
              filter: `drop-shadow(0 0 6px ${color}80)`,
            }}
          />
          {/* Inner value */}
          <text x="50" y="45" textAnchor="middle" fontSize="17" fontWeight="600"
            fill={color} fontFamily="'JetBrains Mono', monospace">{fmt(value)}</text>
          <text x="50" y="59" textAnchor="middle" fontSize="8.5" fill="rgba(255,255,255,0.35)"
            fontFamily="'JetBrains Mono', monospace">{unit}</text>
        </svg>
      </div>
      <span className="cs-gauge-label">{label}</span>
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
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.4"/>
          <stop offset="100%" stopColor={color} stopOpacity="1"/>
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke="url(#sparkGrad)" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
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
    if (!byDate[d] || byDate[d].score < s)
      byDate[d] = { date: d, score: s, crack: r.crack_width || 0 };
  });
  const days = Object.values(byDate).slice(-21);
  const cellColor = (score) => {
    if (score >= 70) return TOKEN.critical;
    if (score >= 40) return TOKEN.warning;
    if (score >= 10) return TOKEN.safe;
    return "rgba(255,255,255,0.06)";
  };
  return (
    <div role="img" aria-label="Severity heatmap over time">
      <div style={{ fontSize:9, color:TOKEN.muted, marginBottom:10, letterSpacing:"0.1em",
        fontFamily:"'JetBrains Mono',monospace", textTransform:"uppercase" }}>
        Daily max severity heatmap
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
        {days.map((d, i) => (
          <div key={i}
            className="cs-heatmap-cell"
            title={`${d.date}: severity ${d.score}, crack ${fmt(d.crack)}mm`}
            style={{
              backgroundColor: cellColor(d.score),
              opacity: 0.65 + (d.score / 220),
              boxShadow: d.score >= 40 ? `0 0 8px ${cellColor(d.score)}50` : "none",
            }}
          >
            <span style={{ fontSize:7.5, color:"rgba(255,255,255,0.75)", fontWeight:600,
              fontFamily:"'JetBrains Mono',monospace" }}>
              {new Date(d.date).getDate()}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:14, marginTop:10 }}>
        {[["Safe", TOKEN.safe], ["Warning", TOKEN.warning], ["Critical", TOKEN.critical]].map(([l,c]) => (
          <span key={l} style={{ fontSize:9, color:c, display:"flex", alignItems:"center", gap:5,
            fontFamily:"'JetBrains Mono',monospace" }}>
            <span style={{ width:9, height:9, borderRadius:2, backgroundColor:c, display:"inline-block",
              boxShadow:`0 0 6px ${c}80` }} />{l}
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
    const prevCrack = prev.crack_width || 0, curCrack = cur.crack_width || 0;
    if (prevCrack < TH_WARNING && curCrack >= TH_WARNING)
      events.push({ time:cur.timestamp, type:"threshold", label:"Crossed warning threshold",
        icon:"⚠", color:TOKEN.warning, value:curCrack });
    if (prevCrack < TH_CRITICAL && curCrack >= TH_CRITICAL)
      events.push({ time:cur.timestamp, type:"critical", label:"Critical threshold breached",
        icon:"🔴", color:TOKEN.critical, value:curCrack });
    if ((Math.abs(prev.acceleration_x||0)) === 0 && (Math.abs(cur.acceleration_x||0)) > 0.3)
      events.push({ time:cur.timestamp, type:"vibration", label:"Vibration spike detected",
        icon:"📳", color:TOKEN.purple, value:cur.vibration });
  }
  if (events.length === 0)
    return (
      <div style={{ fontSize:11, color:TOKEN.safe, padding:"14px", textAlign:"center",
        background:"rgba(34,197,94,0.05)", borderRadius:8, border:`1px solid ${TOKEN.safe}25` }}>
        ✅ No significant threshold events in this period.
      </div>
    );
  return (
    <div role="list" aria-label="Event timeline">
      {events.slice(-8).reverse().map((e, i) => (
        <div key={i} role="listitem" className="cs-event-item"
          style={{
            backgroundColor:`${e.color}0c`,
            borderLeft:`3px solid ${e.color}`,
            opacity: linkedPoint ? 0.65 : 1,
            boxShadow: `inset 0 0 20px ${e.color}06`,
          }}>
          <div style={{ fontSize:16 }}>{e.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, color:e.color, fontWeight:500 }}>{e.label}</div>
            <div style={{ fontSize:9, color:TOKEN.muted, marginTop:3,
              fontFamily:"'JetBrains Mono',monospace" }}>
              {new Date(e.time).toLocaleString()} · value: {fmt(e.value)}mm
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
      { id:"s1", text:"Continue routine monitoring every 30 min",  priority:"low"    },
      { id:"s2", text:"Document any visible surface changes",       priority:"low"    },
      { id:"s3", text:"Review monthly trend report",                priority:"low"    },
    ],
    WARNING: [
      { id:"w1", text:"Increase sensor polling to every 5 min",    priority:"high"   },
      { id:"w2", text:"Notify site supervisor of warning status",   priority:"high"   },
      { id:"w3", text:"Review evacuation procedure checklist",      priority:"medium" },
      { id:"w4", text:"Schedule structural inspection ≤ 24 hours",  priority:"high"   },
      { id:"w5", text:"Check soil moisture correlation",            priority:"medium" },
    ],
    CRITICAL: [
      { id:"c1", text:"EVACUATE Zone C immediately",                priority:"urgent" },
      { id:"c2", text:"Alert site supervisor & safety officer",     priority:"urgent" },
      { id:"c3", text:"Halt ALL construction / heavy activity",     priority:"urgent" },
      { id:"c4", text:"Call structural engineer for emergency review",priority:"urgent"},
      { id:"c5", text:"Monitor crack width every 2 minutes",        priority:"high"   },
      { id:"c6", text:"Prepare incident documentation",             priority:"high"   },
    ],
  };
  const priorityColor = { urgent:"#ef4444", high:"#f59e0b", medium:"#3b82f6", low:"#22c55e" };
  const priorityBg    = { urgent:"rgba(239,68,68,0.1)", high:"rgba(245,158,11,0.08)", medium:"rgba(59,130,246,0.08)", low:"rgba(34,197,94,0.08)" };
  const items = actions[status] || actions.SAFE;
  const done  = items.filter(a => checked[a.id]).length;
  const accentColor = colorOf(status === "CRITICAL" ? 6 : status === "WARNING" ? 4 : 0);

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <div style={{ fontSize:10, fontWeight:600, color:accentColor, letterSpacing:"0.1em",
          fontFamily:"'JetBrains Mono',monospace" }}>
          ACTION CHECKLIST — {status}
        </div>
        <div style={{ fontSize:10, color:TOKEN.muted, fontFamily:"'JetBrains Mono',monospace" }}>
          {done}/{items.length} complete
        </div>
      </div>
      <div className="cs-progress-track">
        <div className="cs-progress-fill"
          style={{ width:`${(done/items.length)*100}%`, background:`linear-gradient(90deg, ${accentColor}80, ${accentColor})` }} />
      </div>
      {items.map(action => (
        <label key={action.id} className="cs-checklist-item"
          style={{ opacity: checked[action.id] ? 0.45 : 1 }}>
          <input type="checkbox" checked={!!checked[action.id]} onChange={() => toggle(action.id)}
            style={{ marginTop:2, accentColor:priorityColor[action.priority], flexShrink:0 }}
            aria-label={action.text} />
          <span style={{
            fontSize:11, color: checked[action.id] ? TOKEN.muted : TOKEN.text,
            textDecoration: checked[action.id] ? "line-through" : "none",
            display:"flex", alignItems:"center", gap:7, lineHeight:1.4,
          }}>
            <span style={{
              flexShrink:0, fontSize:9, padding:"1px 6px", borderRadius:4,
              background:priorityBg[action.priority], color:priorityColor[action.priority],
              fontFamily:"'JetBrains Mono',monospace", fontWeight:600, letterSpacing:"0.05em",
            }}>
              {action.priority.toUpperCase()}
            </span>
            {action.text}
          </span>
        </label>
      ))}
      {predictions && (
        <div style={{ marginTop:13, padding:"10px 13px", borderRadius:8,
          background:"rgba(59,130,246,0.07)", border:"1px solid rgba(59,130,246,0.15)" }}>
          <div style={{ fontSize:9, color:TOKEN.blue, marginBottom:6, fontWeight:600,
            letterSpacing:"0.1em", fontFamily:"'JetBrains Mono',monospace" }}>
            TIME-TO-THRESHOLD FORECAST
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <div style={{ fontSize:11, color:TOKEN.warning, fontFamily:"'JetBrains Mono',monospace" }}>
              ⚠ Warning: <strong>{predictions.hoursToWarning}h</strong>
            </div>
            <div style={{ fontSize:11, color:TOKEN.critical, fontFamily:"'JetBrains Mono',monospace" }}>
              🔴 Critical: <strong>{predictions.hoursToCritical}h</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/** Multi-metric correlation overlay */
const MultiMetricChart = ({ readings, linkedPoint, onBrush }) => {
  if (!readings || readings.length < 5) return null;
  const data = readings.slice(-50).map((r, i) => ({
    i,
    crack:     +(r.crack_width || 0).toFixed(2),
    rotationX: +((Math.abs(r.rotation_x || 0)) / 100 * 8).toFixed(2),
    vibration: +((Math.abs(r.acceleration_x || 0)) / 0.5 * 8).toFixed(2),
    soil20:    +((r.soil_20cm  || 0) / 100 * 8).toFixed(2),
    ts: new Date(r.timestamp).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }),
  }));
  return (
    <div>
      <div style={{ fontSize:9, color:TOKEN.muted, marginBottom:10,
        fontFamily:"'JetBrains Mono',monospace" }}>
        Click any data point to cross-highlight across all panels
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} onClick={(d) => d?.activePayload && onBrush(d.activePayload[0].payload)}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="ts" stroke={TOKEN.muted} tick={{ fontSize:8, fontFamily:"'JetBrains Mono',monospace" }} interval={9} />
          <YAxis domain={[0,8]} stroke={TOKEN.muted} tick={{ fontSize:8, fontFamily:"'JetBrains Mono',monospace" }} />
          <Tooltip contentStyle={{ backgroundColor:"rgba(8,14,28,0.95)", border:"1px solid rgba(255,255,255,0.1)",
            fontSize:11, borderRadius:8, boxShadow:"0 8px 32px rgba(0,0,0,0.5)" }}
            labelStyle={{ color:TOKEN.muted }} />
          <Legend wrapperStyle={{ fontSize:10 }} />
          <ReferenceLine y={TH_WARNING}  stroke={TOKEN.warning}  strokeDasharray="4 4" />
          <ReferenceLine y={TH_CRITICAL} stroke={TOKEN.critical} strokeDasharray="4 4" />
          <Line type="monotone" dataKey="crack"     stroke={TOKEN.safe}    strokeWidth={2.5} dot={false} activeDot={{ r:5 }} name="Crack (mm)" />
          <Line type="monotone" dataKey="rotationX" stroke={TOKEN.warning} strokeWidth={1.5} dot={false} activeDot={{ r:4 }} strokeDasharray="4 3" name="|Rotation X| (norm)" />
          <Line type="monotone" dataKey="vibration" stroke={TOKEN.purple}  strokeWidth={1.5} dot={false} activeDot={{ r:4 }} strokeDasharray="2 3" name="|Vibration| (norm)" />
          <Line type="monotone" dataKey="soil20"    stroke={TOKEN.blue}    strokeWidth={1.5} dot={false} activeDot={{ r:4 }} strokeDasharray="6 3" name="Soil 20cm (norm)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

/** Radar chart */
const SensorRadar = ({ readings }) => {
  if (!readings || readings.length < 3) return null;
  const last10 = readings.slice(-10);
  const avg = (fn) => last10.reduce((s,r) => s + (fn(r)||0), 0) / last10.length;
  const data = [
    { metric:"Crack Risk",  value: Math.min(avg(r => (r.crack_width||0)/TH_CRITICAL)*100, 100) },
    { metric:"Soil 20cm",   value: Math.min(avg(r => (r.soil_20cm||0)),100) },
    { metric:"Vibration",   value: Math.min(avg(r => Math.abs(r.acceleration_x||0)) * 200, 100) },
    { metric:"Rotation X",  value: Math.min(Math.abs(avg(r => r.rotation_x||0))/2,100) },
    { metric:"Rotation Y",  value: Math.min(Math.abs(avg(r => r.rotation_y||0))/2,100) },
    { metric:"Rotation Z",  value: Math.min(Math.abs(avg(r => r.rotation_z||0))/2,100) },
  ];
  return (
    <div>
      <div style={{ fontSize:9, color:TOKEN.muted, marginBottom:10,
        fontFamily:"'JetBrains Mono',monospace" }}>
        Average of last 10 readings
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.07)" />
          <PolarAngleAxis dataKey="metric" tick={{ fill:TOKEN.muted, fontSize:9 }} />
          <PolarRadiusAxis angle={30} domain={[0,100]} tick={{ fill:TOKEN.muted, fontSize:7 }} />
          <Radar name="Current" dataKey="value" stroke={TOKEN.teal} fill={TOKEN.teal} fillOpacity={0.12}
            dot={{ fill:TOKEN.teal, r:3, filter:`drop-shadow(0 0 4px ${TOKEN.teal})` }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

/** Scatter plot: Crack vs Soil20cm */
const CorrelationScatter = ({ readings }) => {
  if (!readings || readings.length < 10) return null;
  const data = readings.slice(-80).map(r => ({
    soil: r.soil_20cm || 0, crack: r.crack_width || 0, risk: riskOf(r.crack_width || 0),
  }));
  const colorMap = { SAFE:TOKEN.safe, WARNING:TOKEN.warning, CRITICAL:TOKEN.critical };
  const grouped  = { SAFE:[], WARNING:[], CRITICAL:[] };
  data.forEach(d => grouped[d.risk].push(d));
  return (
    <div>
      <div style={{ fontSize:9, color:TOKEN.muted, marginBottom:10,
        fontFamily:"'JetBrains Mono',monospace" }}>
        Each point = one reading · colour = risk level
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <ScatterChart margin={{ top:4, right:12, bottom:4, left:0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="soil"  name="Soil 20cm (%)" stroke={TOKEN.muted} tick={{ fontSize:8 }}
            label={{ value:"Soil 20cm (%)", position:"insideBottom", fill:TOKEN.muted, fontSize:9, offset:-2 }} />
          <YAxis dataKey="crack" name="Crack (mm)"   stroke={TOKEN.muted} tick={{ fontSize:8 }}
            label={{ value:"mm", position:"insideLeft", fill:TOKEN.muted, fontSize:9 }} />
          <ZAxis range={[22,22]} />
          <Tooltip cursor={{ strokeDasharray:"3 3" }}
            contentStyle={{ backgroundColor:"rgba(8,14,28,0.95)", border:"1px solid rgba(255,255,255,0.1)",
              fontSize:11, borderRadius:8 }}
            formatter={(v,n) => [fmt(v,2), n]} />
          <ReferenceLine y={TH_WARNING}  stroke={TOKEN.warning}  strokeDasharray="4 4" />
          <ReferenceLine y={TH_CRITICAL} stroke={TOKEN.critical} strokeDasharray="4 4" />
          {Object.entries(grouped).map(([risk, pts]) => (
            <Scatter key={risk} name={risk} data={pts} fill={colorMap[risk]} fillOpacity={0.65} />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

/** Hourly bar chart */
const HourlyPattern = ({ readings }) => {
  if (!readings || readings.length < 24) return null;
  const byHour = Array.from({ length:24 }, (_,h) => ({ hour:`${String(h).padStart(2,"0")}:00`, sum:0, count:0 }));
  readings.forEach(r => {
    const h = new Date(r.timestamp).getHours();
    byHour[h].sum   += r.crack_width || 0;
    byHour[h].count += 1;
  });
  const data = byHour.map(h => ({
    hour: h.hour,
    avg:  h.count > 0 ? +(h.sum / h.count).toFixed(2) : 0,
    fill: h.count > 0 && (h.sum/h.count) >= TH_CRITICAL ? TOKEN.critical
        : h.count > 0 && (h.sum/h.count) >= TH_WARNING  ? TOKEN.warning
        : TOKEN.safe,
  }));
  return (
    <div>
      <div style={{ fontSize:9, color:TOKEN.muted, marginBottom:10,
        fontFamily:"'JetBrains Mono',monospace" }}>
        Identify diurnal thermal-expansion or rain-cycle patterns
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} margin={{ top:0, right:0, bottom:0, left:-20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="hour" stroke={TOKEN.muted} tick={{ fontSize:7, fontFamily:"'JetBrains Mono',monospace" }} interval={3} />
          <YAxis stroke={TOKEN.muted} tick={{ fontSize:8 }} domain={[0,"auto"]} />
          <Tooltip contentStyle={{ backgroundColor:"rgba(8,14,28,0.95)", border:"1px solid rgba(255,255,255,0.1)",
            fontSize:11, borderRadius:8 }} formatter={(v) => [`${fmt(v,2)} mm`, "Avg crack"]} />
          <ReferenceLine y={TH_WARNING}  stroke={TOKEN.warning}  strokeDasharray="3 3" />
          <ReferenceLine y={TH_CRITICAL} stroke={TOKEN.critical} strokeDasharray="3 3" />
          <Bar dataKey="avg" radius={[3,3,0,0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.fill} fillOpacity={0.7}
                style={{ filter:`drop-shadow(0 0 4px ${d.fill}60)` }} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────────
export function CrackSensor() {

  // ── State ───────────────────────────────────────────────────────────────────
  const [dateRange,       setDateRange]       = useState("7d");
  const [crackData,       setCrackData]       = useState([]);
  const [crackHistory,    setCrackHistory]    = useState([]);
  const [allReadings,     setAllReadings]     = useState([]);
  const [latestCrack,     setLatestCrack]     = useState(0);
  const [crackRate,       setCrackRate]       = useState(0);
  const [predictions,     setPredictions]     = useState(null);
  const [riskDist,        setRiskDist]        = useState([{name:"Safe",value:0},{name:"Warning",value:0},{name:"Critical",value:0}]);
  const [correlationData, setCorrelationData] = useState([]);
  const [alertHistory,    setAlertHistory]    = useState([]);
  const [linkedPoint,     setLinkedPoint]     = useState(null);
  const [selectedNode,    setSelectedNode]    = useState("all");
  const [showPredictions, setShowPredictions] = useState(false);
  const [showHelp,        setShowHelp]        = useState(false);
  const [alertsMuted,     setAlertsMuted]     = useState(false);
  const [comparisonMode,  setComparisonMode]  = useState(false);
  const [compareRange, setCompareRange] = useState("7d"); 
  const [previousPeriodData, setPreviousPeriodData] = useState([]); 
  const [comparisonType, setComparisonType] = useState("time"); 
  const [expandedSections,setExpandedSections] = useState({
    headline:true, story:true, trend:true, multiMetric:false,
    patterns:false, correlations:false, scatter:false,
    radar:false, heatmap:false, alerts:false, actions:true,
    mlIntegration:true,
  });

  const isSensorHealthy = true;
  const toggleSection   = (k) => setExpandedSections(p => ({ ...p, [k]: !p[k] }));
  const chartKey        = useRef(0);

  useEffect(() => {
    chartKey.current = chartKey.current + 1;
  }, [dateRange]);

  // ── Calculations ─────────────────────────────────────────────────────────────
  const calculatePredictions = useCallback((readings) => {
    if (!readings || readings.length < 10) return null;
    const last10 = readings.slice(-10);
    let totalRate = 0;
    for (let i = 1; i < last10.length; i++) {
      const dt = (new Date(last10[i].timestamp) - new Date(last10[i-1].timestamp)) / 3_600_000;
      if (dt > 0) totalRate += Math.abs((last10[i].crack_width - last10[i-1].crack_width) / dt);
    }
    const avgRate    = totalRate / 9;
    const current    = readings[readings.length-1].crack_width || 0;
    const toWarning  = avgRate > 0 ? Math.max(0,(TH_WARNING  - current)/avgRate) : Infinity;
    const toCritical = avgRate > 0 ? Math.max(0,(TH_CRITICAL - current)/avgRate) : Infinity;
    return {
      avgRate:          +avgRate.toFixed(3),
      hoursToWarning:   isFinite(toWarning)  ? +toWarning.toFixed(1)  : "∞",
      hoursToCritical:  isFinite(toCritical) ? +toCritical.toFixed(1) : "∞",
      predictedNextHour:+(current + avgRate).toFixed(2),
      predictedNextDay: +(current + avgRate*24).toFixed(2),
      trend: avgRate > 0.02 ? "Rapidly Worsening" : avgRate > 0.005 ? "Gradually Worsening" : "Stable",
    };
  }, []);

// Fetch previous period data for comparison
const fetchPreviousPeriodData = useCallback((readings, currentLimit) => {
  if (!readings || readings.length < currentLimit * 2) return [];
  
  // Get previous period readings (skip current period)
  const previousPeriod = readings.slice(currentLimit, currentLimit * 2);
  
  return previousPeriod.map((r, idx) => ({
    id: idx,
    date: new Date(r.timestamp).toLocaleDateString(),
    value: r.crack_width || 0,
    period: "Previous"
  }));
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
      { factor:"Soil Moisture (20cm)", correlation:+correlate(crack,r=>r.soil_20cm||0).toFixed(2),           icon:"💧", color:TOKEN.blue   },
      { factor:"Rotation X (abs)",     correlation:+correlate(crack,r=>Math.abs(r.rotation_x||0)).toFixed(2), icon:"📐", color:TOKEN.warning },
      { factor:"Rotation Y (abs)",     correlation:+correlate(crack,r=>Math.abs(r.rotation_y||0)).toFixed(2), icon:"📐", color:TOKEN.warning },
      { factor:"Rotation Z (abs)",     correlation:+correlate(crack,r=>Math.abs(r.rotation_z||0)).toFixed(2), icon:"📐", color:TOKEN.warning },
      { factor:"Vibration",            correlation:+correlate(crack,r=>Math.abs(r.vibration||0)).toFixed(2),  icon:"📳", color:TOKEN.critical },
    ].sort((a,b) => b.correlation - a.correlation);
  }, []);

  const generateAlertHistory = useCallback((readings) => {
    if (!readings || readings.length === 0) return [];
    const alerts = [];
    for (let i = readings.length-1; i >= 0 && alerts.length < 15; i--) {
      const crack = readings[i].crack_width || 0;
      if (crack >= TH_CRITICAL)
        alerts.push({ id:alerts.length+1,
          time: new Date(readings[i].timestamp).toLocaleTimeString(),
          date: new Date(readings[i].timestamp).toLocaleDateString(),
          severity:"CRITICAL", color:TOKEN.critical,
          message:`Crack width ${fmt(crack)}mm — exceeds ${TH_CRITICAL}mm emergency threshold`,
          acked:false });
      else if (crack >= TH_WARNING && alerts.length === 0)
        alerts.push({ id:alerts.length+1,
          time: new Date(readings[i].timestamp).toLocaleTimeString(),
          date: new Date(readings[i].timestamp).toLocaleDateString(),
          severity:"WARNING", color:TOKEN.warning,
          message:`Crack width ${fmt(crack)}mm — approaching critical level`,
          acked:true });
    }
    return alerts;
  }, []);

  // ── Data fetching ─────────────────────────────────────────────────────────────
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
      
      const daysMap = { "7d":7, "14d":14, "30d":30 };
      const limit = daysMap[dateRange] || 30;
      
      // For Sensor Trend chart - uses same limit as Historical chart
      const trendData = filtered.slice(-limit).map((r,i) => ({ 
        time:i, 
        value:r.crack_width||0, 
        timestamp:r.timestamp 
      }));
      setCrackData(trendData);
      
      // For Historical chart
      const histData = filtered.slice(-limit).map((r,idx) => ({
        id: idx,
        date: new Date(r.timestamp).toLocaleDateString(),
        value: r.crack_width || 0,
        soil20: r.soil_20cm || 0,
        rotationX: r.rotation_x || 0,
        fullDate: new Date(r.timestamp)
      }));
      setCrackHistory([...histData]);
      
      if (comparisonMode) {
        const prevData = fetchPreviousPeriodData(filtered, limit);
        setPreviousPeriodData(prevData);
      } else {
        setPreviousPeriodData([]);
      }
      let s=0,w=0,c=0;
      filtered.forEach(r => {
        const v = r.crack_width || 0;
        if (v < TH_WARNING) s++; else if (v < TH_CRITICAL) w++; else c++;
      });
      const total = s+w+c || 1;
      setRiskDist([
        { name:"Safe",    value:Math.round(s/total*100) },
        { name:"Warning", value:Math.round(w/total*100) },
        { name:"Critical",value:Math.round(c/total*100) },
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

  // ── Derived ───────────────────────────────────────────────────────────────────
  const status      = riskOf(latestCrack);
  const statusColor = colorOf(latestCrack);

  const annotatedCrackData = crackData.map((d) => {
    const marks = {};
    if (d.value >= TH_CRITICAL) marks.critical = d.value;
    if (d.value >= TH_WARNING && d.value < TH_CRITICAL) marks.warning = d.value;
    return { ...d, ...marks };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="cs-tooltip">
        <p style={{ margin:0, color:TOKEN.muted, fontSize:10, fontFamily:"'JetBrains Mono',monospace" }}>
          Reading #{label}
        </p>
        <p style={{ margin:"4px 0 0", color:TOKEN.safe, fontFamily:"'JetBrains Mono',monospace" }}>
          <strong>Crack:</strong> {fmt(payload[0].value,2)} mm
        </p>
        {payload[0].payload.timestamp && (
          <p style={{ margin:"3px 0 0", color:TOKEN.muted, fontSize:9, fontFamily:"'JetBrains Mono',monospace" }}>
            {new Date(payload[0].payload.timestamp).toLocaleTimeString()}
          </p>
        )}
        {linkedPoint?.time === payload[0].payload.time && (
          <p style={{ margin:"3px 0 0", color:TOKEN.purple, fontSize:9 }}>● Linked across panels</p>
        )}
      </div>
    );
  };

  const SectionHeader = ({ id, icon: Icon, iconColor, title, badge }) => (
    <div className="cs-section-header" onClick={() => toggleSection(id)}
      role="button" aria-expanded={expandedSections[id]} tabIndex={0}
      onKeyDown={(e) => e.key==="Enter" && toggleSection(id)}>
      <div style={{ display:"flex", alignItems:"center", gap:9 }}>
        {Icon && (
          <div style={{ width:26, height:26, borderRadius:6, backgroundColor:`${iconColor}15`,
            display:"flex", alignItems:"center", justifyContent:"center",
            border:`1px solid ${iconColor}25` }}>
            <Icon size={13} style={{ color:iconColor }} />
          </div>
        )}
        <span style={{ fontSize:11, fontWeight:500, color:TOKEN.text,
          letterSpacing:"0.04em", fontFamily:"'Inter',sans-serif" }}>
          {title}
        </span>
        {badge && (
          <span className="cs-badge"
            style={{ backgroundColor:`${iconColor}18`, color:iconColor, border:`1px solid ${iconColor}30` }}>
            {badge}
          </span>
        )}
      </div>
      {expandedSections[id]
        ? <ChevronUp  size={14} style={{ color:TOKEN.muted }} />
        : <ChevronDown size={14} style={{ color:TOKEN.muted }} />}
    </div>
  );

  // ── STATUS STRIP CONFIG ────────────────────────────────────────────────────────
  const statusConfig = {
    SAFE:     { label:"SAFE — NORMAL OPERATIONS",          bg:"rgba(34,197,94,0.07)" },
    WARNING:  { label:"WARNING — MONITOR CLOSELY",         bg:"rgba(245,158,11,0.07)" },
    CRITICAL: { label:"CRITICAL — IMMEDIATE ACTION",       bg:"rgba(239,68,68,0.10)" },
  };
  const sc = statusConfig[status];

  // ── Render ─────────────────────────────────────────────────────────────────────
  return (
    <div className="cs-dashboard" role="main" aria-label="Crack sensor analytics dashboard">
      <style>{GLOBAL_CSS}</style>
      <div className="cs-grid-bg" />

      <div className="cs-content">

        {/* ── HELP MODAL ──────────────────────────────────────────────────────── */}
        {showHelp && (
          <div
            style={{ position:"fixed", inset:0, backgroundColor:"rgba(0,0,0,0.75)",
              display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999,
              backdropFilter:"blur(4px)" }}
            role="dialog" aria-modal="true" aria-label="Help overlay"
            onClick={() => setShowHelp(false)}>
            <div onClick={e => e.stopPropagation()}
              style={{ background:"rgba(14,22,42,0.97)", border:`1px solid ${TOKEN.warning}50`,
                borderRadius:14, padding:26, width:480, maxWidth:"92vw", maxHeight:"80vh",
                overflowY:"auto", boxShadow:`0 24px 80px rgba(0,0,0,0.7), ${GLOW.warning}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:18 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:30, height:30, borderRadius:8, backgroundColor:`${TOKEN.warning}20`,
                    border:`1px solid ${TOKEN.warning}40`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <HelpCircle size={15} color={TOKEN.warning} />
                  </div>
                  <h2 style={{ color:TOKEN.warning, margin:0, fontSize:14, fontWeight:500,
                    fontFamily:"'Inter',sans-serif" }}>Crack Sensor — Help Guide</h2>
                </div>
                <button onClick={()=>setShowHelp(false)}
                  style={{ background:"none", border:"1px solid rgba(255,255,255,0.1)", color:TOKEN.text,
                    cursor:"pointer", fontSize:16, lineHeight:1, borderRadius:6, width:28, height:28,
                    display:"flex", alignItems:"center", justifyContent:"center" }}
                  aria-label="Close help">✕</button>
              </div>
              <div style={{ fontSize:12, color:TOKEN.text, lineHeight:1.75 }}>
                <div style={{ padding:"8px 12px", borderRadius:7, marginBottom:8,
                  background:"rgba(34,197,94,0.07)", border:`1px solid ${TOKEN.safe}25` }}>
                  <strong style={{ color:TOKEN.safe }}>● SAFE (&lt;3.5 mm)</strong> — Normal. Routine monitoring.
                </div>
                <div style={{ padding:"8px 12px", borderRadius:7, marginBottom:8,
                  background:"rgba(245,158,11,0.07)", border:`1px solid ${TOKEN.warning}25` }}>
                  <strong style={{ color:TOKEN.warning }}>● WARNING (3.5–5 mm)</strong> — Elevated. Increase inspection frequency.
                </div>
                <div style={{ padding:"8px 12px", borderRadius:7, marginBottom:14,
                  background:"rgba(239,68,68,0.07)", border:`1px solid ${TOKEN.critical}25` }}>
                  <strong style={{ color:TOKEN.critical }}>● CRITICAL (&gt;5 mm)</strong> — Emergency. Evacuate and call engineer.
                </div>
                <hr style={{ borderColor:"rgba(255,255,255,0.08)", margin:"12px 0" }} />
                {[
                  ["Brushing & Linking","Click any chart point to highlight that timestamp across all panels simultaneously."],
                  ["Heatmap","Each cell = one day. Hover for date + severity details."],
                  ["Radar Chart","Multi-sensor snapshot using Rotation X/Y/Z, Vibration, Soil20cm."],
                  ["Scatter Plot","Reveals whether soil saturation triggers crack widening."],
                  ["Hourly Pattern","Identify daily thermal-expansion or rain-cycle effects."],
                  ["Action Checklist","Check off completed actions. Resets on page reload."],
                  ["Predictions","Toggle ON to see trend-based time-to-threshold forecasts."],
                  ["Export CSV","Downloads the last 30 readings for offline analysis."],
                ].map(([title, desc]) => (
                  <p key={title} style={{ marginBottom:8 }}>
                    <strong style={{ color:TOKEN.blue }}>{title}:</strong>{" "}
                    <span style={{ color:"rgba(200,210,230,0.8)" }}>{desc}</span>
                  </p>
                ))}
              </div>
              <button onClick={()=>setShowHelp(false)}
                style={{ marginTop:16, padding:"9px 0", width:"100%",
                  background:`linear-gradient(135deg, ${TOKEN.warning}cc, ${TOKEN.warning})`,
                  border:"none", borderRadius:8, color:"#0b1020", cursor:"pointer",
                  fontWeight:600, fontSize:12, fontFamily:"'Inter',sans-serif" }}>
                Got it
              </button>
            </div>
          </div>
        )}

        {/* ── STATUS STRIP ─────────────────────────────────────────────────────── */}
        <div style={{
          padding:"14px 20px",
          borderRadius:12,
          backgroundColor: sc.bg,
          border:`1.5px solid ${statusColor}40`,
          boxShadow: GLOW[status === "CRITICAL" ? "critical" : status === "WARNING" ? "warning" : "safe"],
          display:"flex", alignItems:"center", justifyContent:"space-between",
          flexWrap:"wrap", gap:10,
          position:"relative", overflow:"hidden",
        }} role="banner" aria-label={`Current status: ${status}`}>
          {/* Subtle sweep line */}
          <div style={{ position:"absolute", top:0, left:0, right:0, height:"1px",
            background:`linear-gradient(90deg, transparent, ${statusColor}60, transparent)`,
            animation:"shimmer 3s ease infinite", backgroundSize:"200% 100%" }} />
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ position:"relative", width:16, height:16, display:"flex",
              alignItems:"center", justifyContent:"center" }}>
              <span style={{ position:"absolute", width:16, height:16, borderRadius:"50%",
                backgroundColor:statusColor, opacity:0.25,
                animation: status !== "SAFE" ? "pulse-ring 1.8s ease infinite" : "none" }} />
              <span style={{ width:8, height:8, borderRadius:"50%", backgroundColor:statusColor,
                boxShadow:`0 0 10px ${statusColor}`, display:"block" }} />
            </div>
            <span style={{ fontSize:13, fontWeight:600, color:statusColor, letterSpacing:"0.08em",
              fontFamily:"'JetBrains Mono',monospace" }}>
              {sc.icon} {sc.label}
            </span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:18 }}>
            <div style={{ textAlign:"right" }}>
              <span style={{ fontSize:28, fontWeight:600, color:statusColor,
                fontFamily:"'JetBrains Mono',monospace", lineHeight:1 }}>
                {fmt(latestCrack)}
              </span>
              <span style={{ fontSize:13, color:statusColor, opacity:0.7, marginLeft:4 }}>mm</span>
            </div>
            <Sparkline data={crackData.slice(-15)} color={statusColor} height={38} />
          </div>
        </div>

        {/* ── STAT CARDS ───────────────────────────────────────────────────────── */}
        <div className="cs-stat-grid" role="region" aria-label="Key metrics">
          {[
            { label:"CRACK WIDTH",    value:`${fmt(latestCrack)} mm`,    sub:`Threshold: ${TH_WARNING}–${TH_CRITICAL}mm`,  color:statusColor },
            { label:"WIDENING RATE",  value:`${fmt(crackRate,3)} mm/hr`, sub:crackRate > 0.02 ? "Rapid change" : crackRate > 0 ? "Gradual" : "Stable",
              color: crackRate > 0.05 ? TOKEN.critical : crackRate > 0.01 ? TOKEN.warning : TOKEN.safe },
            { label:"RISK STATUS",    value:status,                       sub:`Score: ${severityScore(allReadings[allReadings.length-1]||{})}/100`,
              color:statusColor },
            { label:"SENSOR HEALTH",  value:isSensorHealthy ? "ONLINE" : "FAULT", sub:"ToF + IMU + Soil",
              color:isSensorHealthy ? TOKEN.safe : TOKEN.critical },
          ].map((s,i) => (
            <div key={i} className="cs-stat-item" style={{ "--accent-color":s.color }}>
              <div className="cs-stat-label">{s.label}</div>
              <div className="cs-stat-value" style={{ color:s.color }}>{s.value}</div>
              <div className="cs-stat-sub">{s.sub}</div>
              {/* Decorative corner glyph */}
              <div style={{ position:"absolute", bottom:8, right:10, fontSize:16,
                color:s.color, opacity:0.12, fontFamily:"'JetBrains Mono',monospace",
                lineHeight:1 }}>◈</div>
            </div>
          ))}
        </div>

        {/* ── TOOLBAR ───────────────────────────────────────────────────────────── */}
        <div className="cs-toolbar" role="toolbar" aria-label="Dashboard controls">
          <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
            <Filter size={12} style={{ color:TOKEN.muted }} />
            <span style={{ fontSize:10, color:TOKEN.muted, fontFamily:"'JetBrains Mono',monospace" }}>
              NODE:
            </span>
            <select value={selectedNode} onChange={e=>setSelectedNode(e.target.value)}
              style={{ padding:"4px 9px", borderRadius:6, fontSize:10,
                backgroundColor:TOKEN.bg2, border:`1px solid ${TOKEN.border}`,
                color:TOKEN.text, cursor:"pointer",
                fontFamily:"'JetBrains Mono',monospace" }}
              aria-label="Filter by node">
              <option value="all">All Nodes</option>
              <option value="Node1">Node 1</option>
              <option value="Node2">Node 2</option>
            </select>

            <div style={{ display:"flex", gap:4, marginLeft:4 }}>
              {[["7d","7D"],["14d","14D"],["30d","30D"]].map(([id,label]) => {
                const isActive = dateRange === id;
                return (
                  <button key={id} onClick={() => setDateRange(id)}
                    className="cs-range-btn"
                    aria-pressed={isActive}
                    style={{
                      backgroundColor: isActive ? `${TOKEN.safe}18` : "rgba(255,255,255,0.04)",
                      border:`1px solid ${isActive ? TOKEN.safe+"50" : "rgba(255,255,255,0.08)"}`,
                      color: isActive ? TOKEN.safe : TOKEN.muted,
                      boxShadow: isActive ? `0 0 10px ${TOKEN.safe}20` : "none",
                    }}>
                    {label}
                    {isActive && crackHistory.length > 0 && (
                      <span style={{ position:"absolute", top:-6, right:-6,
                        background:TOKEN.safe, color:"#020e08", fontSize:7,
                        borderRadius:10, padding:"0px 4px", fontWeight:700,
                        boxShadow:`0 0 6px ${TOKEN.safe}80` }}>
                        {crackHistory.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
            <button onClick={() => setComparisonMode(!comparisonMode)}
              className={`cs-btn ${comparisonMode ? "blue-active" : ""}`}>
              <BarChart2 size={11} /> {comparisonMode ? "Normal View" : "Compare"}
            </button>
            <button onClick={()=>setShowPredictions(p=>!p)}
              className={`cs-btn ${showPredictions ? "purple-active" : ""}`}
              aria-pressed={showPredictions}>
              <TrendingUp size={11} /> Predictions
            </button>
            <button onClick={()=>setAlertsMuted(p=>!p)}
              className={`cs-btn ${alertsMuted ? "" : "warning-active"}`}
              aria-pressed={alertsMuted}>
              {alertsMuted ? <BellOff size={11}/> : <Bell size={11}/>}
              {alertsMuted ? "Muted" : "Alerts"}
            </button>
            <button
              className="cs-btn"
              onClick={() => {
                const headers = ["Timestamp","Crack(mm)","Soil20","Rotation_X","Rotation_Y","Rotation_Z","Vibration","Risk"];
                const rows = allReadings.slice(-30).map(r=>[
                  r.timestamp,r.crack_width,r.soil_20cm,r.rotation_x,r.rotation_y,r.rotation_z,r.vibration,riskOf(r.crack_width||0)
                ]);
                const csv = [headers,...rows].map(r=>r.join(",")).join("\n");
                const a = document.createElement("a");
                a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
                a.download = `crack_export_${new Date().toISOString().slice(0,10)}.csv`;
                a.click();
              }}
              aria-label="Export CSV">
              <Download size={11}/> Export
            </button>
            <button onClick={()=>setShowHelp(true)} className="cs-btn" aria-label="Open help">
              <HelpCircle size={11}/> Help
            </button>
          </div>
        </div>

        {/* ── LINKED POINT BANNER ────────────────────────────────────────────────── */}
        {linkedPoint && (
          <div style={{ padding:"8px 14px", borderRadius:8, fontSize:10,
            backgroundColor:"rgba(139,92,246,0.08)", border:"1px solid rgba(139,92,246,0.25)",
            display:"flex", justifyContent:"space-between", alignItems:"center",
            boxShadow:GLOW.purple }}
            role="status">
            <span style={{ color:TOKEN.purple, fontFamily:"'JetBrains Mono',monospace" }}>
              ⬡ Linked to reading #{linkedPoint.i} · {fmt(linkedPoint.value,2)}mm
              {linkedPoint.timestamp && ` · ${new Date(linkedPoint.timestamp).toLocaleTimeString()}`}
            </span>
            <button onClick={()=>setLinkedPoint(null)}
              style={{ background:"none", border:"1px solid rgba(139,92,246,0.3)",
                color:TOKEN.purple, cursor:"pointer", fontSize:14, lineHeight:1,
                borderRadius:6, width:24, height:24, display:"flex",
                alignItems:"center", justifyContent:"center" }}
              aria-label="Clear linked selection">✕</button>
          </div>
        )}

        {/* ── GAUGES + PIE ROW ───────────────────────────────────────────────────── */}
        <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:14 }}>
          {/* Gauges panel */}
          <div className="cs-card">
            <div className="cs-card-inner">
              <div style={{ fontSize:9, fontWeight:600, color:TOKEN.muted, letterSpacing:"0.12em",
                marginBottom:14, fontFamily:"'JetBrains Mono',monospace", textTransform:"uppercase" }}>
                Sensor Gauges
              </div>
              <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
                <RingGauge value={latestCrack}                                                  max={8}   label="Crack Width"  color={statusColor} unit="mm" />
                <RingGauge value={allReadings[allReadings.length-1]?.soil_20cm||0}              max={100} label="Soil 20cm"    color={TOKEN.blue}  unit="%" />
                <RingGauge value={Math.abs(allReadings[allReadings.length-1]?.vibration||0)}    max={100} label="Vibration"    color={TOKEN.purple} unit="raw" />
                <RingGauge value={Math.min(Math.abs(allReadings[allReadings.length-1]?.rotation_x||0),10)} max={10} label="Rotation X" color={TOKEN.warning} unit="°" />
              </div>
            </div>
          </div>

          {/* Risk Dist + Health */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {/* Risk donut */}
            <div className="cs-card">
              <div className="cs-card-inner">
                <div style={{ fontSize:9, fontWeight:600, color:TOKEN.muted, letterSpacing:"0.12em",
                  marginBottom:10, fontFamily:"'JetBrains Mono',monospace", textTransform:"uppercase" }}>
                  Risk Distribution
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie 
                        data={riskDist} 
                        dataKey="value" 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={30} 
                        outerRadius={55} 
                        paddingAngle={4}
                        label={false}
                      >
                        {riskDist.map((entry, index) => {
                          const colors = [TOKEN.safe, TOKEN.warning, TOKEN.critical];
                          return (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={colors[index]} 
                              stroke="rgba(0,0,0,0.3)"
                              strokeWidth={1}
                              style={{ 
                                filter: `drop-shadow(0 0 6px ${colors[index]}60)`,
                                cursor: "pointer"
                              }} 
                            />
                          );
                        })}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, "Percentage"]}
                        contentStyle={{ 
                          backgroundColor: "rgba(8,14,28,0.95)", 
                          border: "1px solid rgba(255,255,255,0.1)",
                          fontSize: 11, 
                          borderRadius: 8 
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Legend below the pie chart - No percentage labels on the pie itself */}
                <div style={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  gap: 20, 
                  marginTop: 8,
                  flexWrap: "wrap"
                }}>
                  {riskDist.map((item, idx) => {
                    const colors = [TOKEN.safe, TOKEN.warning, TOKEN.critical];
                    const labels = ["Safe", "Warning", "Critical"];
                    return (
                      <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ 
                          width: 10, 
                          height: 10, 
                          borderRadius: "50%", 
                          backgroundColor: colors[idx],
                          boxShadow: `0 0 6px ${colors[idx]}80`
                        }} />
                        <span style={{ fontSize: 10, color: TOKEN.text, fontFamily: "'JetBrains Mono',monospace" }}>
                          {labels[idx]}: <span style={{ color: colors[idx], fontWeight: 600 }}>{item.value}%</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sensor health */}
            <div className="cs-card" style={{ display:"flex", flexDirection:"column",
              justifyContent:"center", alignItems:"center" }}>
              <div style={{ fontSize:9, fontWeight:600, color:TOKEN.muted, letterSpacing:"0.12em",
                marginBottom:14, fontFamily:"'JetBrains Mono',monospace", textTransform:"uppercase" }}>
                Sensor Health
              </div>
              <div style={{ position:"relative", width:60, height:60, marginBottom:12 }}>
                {isSensorHealthy && (
                  <div style={{ position:"absolute", inset:-6, borderRadius:"50%",
                    border:`2px solid ${TOKEN.safe}25`,
                    animation:"pulse-ring 3s ease infinite" }} />
                )}
                <div style={{ width:60, height:60, borderRadius:"50%",
                  backgroundColor: isSensorHealthy ? `${TOKEN.safe}15` : `${TOKEN.critical}15`,
                  border:`2px solid ${isSensorHealthy ? TOKEN.safe : TOKEN.critical}50`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:`0 0 20px ${isSensorHealthy ? TOKEN.safe : TOKEN.critical}30` }}>
                  {isSensorHealthy
                    ? <CheckCircle size={26} color={TOKEN.safe} />
                    : <XCircle     size={26} color={TOKEN.critical} />}
                </div>
              </div>
              <div style={{ fontSize:12, fontWeight:600,
                color:isSensorHealthy ? TOKEN.safe : TOKEN.critical,
                fontFamily:"'JetBrains Mono',monospace", letterSpacing:"0.1em" }}>
                {isSensorHealthy ? "FUNCTIONING" : "FAULT"}
              </div>
              <div style={{ fontSize:9, color:TOKEN.muted, textAlign:"center", marginTop:6, lineHeight:1.6 }}>
                {isSensorHealthy ? "ToF calibrated · No data loss" : "Check wiring"}
              </div>
              <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:5 }}>
                <span className="cs-dot-live" style={{ backgroundColor:isSensorHealthy ? TOKEN.safe : TOKEN.critical }} />
                <span style={{ fontSize:9, color:TOKEN.muted, fontFamily:"'JetBrains Mono',monospace" }}>
                  Cal: {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN TREND CHART ────────────────────────────────────────────────────── */}
        <div className="cs-card">
          <SectionHeader id="trend" icon={TrendingUp} iconColor={TOKEN.safe}
            title={`Sensor Trend — Last ${dateRange === "7d" ? "7" : dateRange === "14d" ? "14" : "30"} Readings`} />
          {expandedSections.trend && (
            <div className="cs-card-inner">
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart key={`trend-chart-${dateRange}-${crackData.length}`} data={annotatedCrackData}
                  onClick={(d) => d?.activePayload && setLinkedPoint(d.activePayload[0].payload)}>
                  <defs>
                    <linearGradient id="crackGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={TOKEN.safe} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={TOKEN.safe} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="time" stroke={TOKEN.muted}
                    tick={{ fontSize:8, fontFamily:"'JetBrains Mono',monospace" }} />
                  <YAxis domain={[0,8]} stroke={TOKEN.muted}
                    tick={{ fontSize:8, fontFamily:"'JetBrains Mono',monospace" }}
                    label={{ value:"mm", angle:-90, position:"insideLeft", fill:TOKEN.muted, fontSize:9 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={TH_CRITICAL} stroke={TOKEN.critical} strokeDasharray="5 4"
                    label={{ value:`Critical (${TH_CRITICAL}mm)`, position:"right", fill:TOKEN.critical, fontSize:9 }} />
                  <ReferenceLine y={TH_WARNING}  stroke={TOKEN.warning}  strokeDasharray="5 4"
                    label={{ value:`Warning (${TH_WARNING}mm)`, position:"right", fill:TOKEN.warning, fontSize:9 }} />
                  <Area type="monotone" dataKey="value" stroke={TOKEN.safe} strokeWidth={2.5}
                    fill="url(#crackGrad)" dot={false}
                    activeDot={{ r:6, fill:TOKEN.safe, stroke:"#fff", strokeWidth:2,
                      style:{ filter:`drop-shadow(0 0 6px ${TOKEN.safe})` } }} />
                  {linkedPoint && (
                    <ReferenceDot x={linkedPoint.time} y={linkedPoint.value}
                      r={8} fill={TOKEN.purple} stroke="#fff" strokeWidth={2}
                      style={{ filter:`drop-shadow(0 0 8px ${TOKEN.purple})` }} />
                  )}
                  {showPredictions && predictions && (
                    <ReferenceLine y={predictions.predictedNextHour}
                      stroke={TOKEN.purple} strokeDasharray="8 4"
                      label={{ value:`Pred. 1hr: ${predictions.predictedNextHour}mm`,
                        position:"insideTopRight", fill:TOKEN.purple, fontSize:9 }} />
                  )}
                </ComposedChart>
              </ResponsiveContainer>

              {crackHistory.length > 0 && (
                <div className="cs-narrative" style={{
                  borderColor: statusColor,
                  background:`${statusColor}08`,
                }}>
                  <div style={{ fontSize:9, color:statusColor, marginBottom:5, fontWeight:600,
                    letterSpacing:"0.1em", fontFamily:"'JetBrains Mono',monospace" }}>
                    VISUAL NARRATIVE
                  </div>
                  <div style={{ fontSize:11, color:TOKEN.text, lineHeight:1.7 }}>
                    {latestCrack >= TH_CRITICAL
                      ? `🔴 Crack width has surpassed the ${TH_CRITICAL}mm emergency threshold, reaching ${fmt(latestCrack)}mm. Trend: ${predictions?.trend || "worsening"}. Immediate structural intervention required.`
                      : latestCrack >= TH_WARNING
                      ? `⚠ Crack width is ${fmt(latestCrack)}mm — above the ${TH_WARNING}mm warning threshold. ${crackRate > 0 ? "Upward" : "Stable"} trend at ${fmt(crackRate,3)} mm/hr suggests${crackRate > 0.02 ? " rapid deterioration" : " gradual change"} over the last ${dateRange === "7d" ? "7" : dateRange === "14d" ? "14" : "30"} readings. Schedule inspection within 24 hours.`
                      : `✅ Crack width remains within safe bounds at ${fmt(latestCrack)}mm (threshold: ${TH_WARNING}mm). The stabilised trend over the last ${dateRange === "7d" ? "7" : dateRange === "14d" ? "14" : "30"} readings supports continued normal operations.`
                    }
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── COMPARE MODE PANEL ───────────────────────────────────────────────── */}
        {comparisonMode && (
          <div className="cs-card">
            <div className="cs-card-inner">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <BarChart2 size={16} style={{ color: TOKEN.blue }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: TOKEN.text }}>Comparison View</span>
                  <span className="cs-badge" style={{ backgroundColor: `${TOKEN.blue}20`, color: TOKEN.blue }}>
                    Current vs Previous
                  </span>
                </div>
                <button 
                  onClick={() => setComparisonMode(false)}
                  className="cs-btn"
                  style={{ padding: "4px 10px" }}
                >
                  <Eye size={11} /> Exit Compare
                </button>
              </div>

              {/* Comparison Chart - Side by Side */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {/* Current Period */}
                <div>
                  <div style={{ 
                    fontSize: 10, fontWeight: 600, color: statusColor, marginBottom: 10,
                    fontFamily: "'JetBrains Mono', monospace", display: "flex", alignItems: "center", gap: 6
                  }}>
                    <span className="cs-dot-live" style={{ backgroundColor: statusColor }} />
                    CURRENT PERIOD ({dateRange === "7d" ? "Last 7" : dateRange === "14d" ? "Last 14" : "Last 30"} readings)
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={crackHistory.slice(-Math.min(30, crackHistory.length))}>
                      <defs>
                        <linearGradient id="currentGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={statusColor} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={statusColor} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" stroke={TOKEN.muted} tick={{ fontSize: 8 }} />
                      <YAxis domain={[0, 8]} stroke={TOKEN.muted} tick={{ fontSize: 8 }} />
                      <Tooltip contentStyle={{ backgroundColor: "rgba(8,14,28,0.95)", border: "1px solid rgba(255,255,255,0.1)" }} />
                      <Area type="monotone" dataKey="value" stroke={statusColor} fill="url(#currentGrad)" strokeWidth={2} />
                      <ReferenceLine y={TH_WARNING} stroke={TOKEN.warning} strokeDasharray="4 4" />
                      <ReferenceLine y={TH_CRITICAL} stroke={TOKEN.critical} strokeDasharray="4 4" />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div style={{ fontSize: 9, color: TOKEN.muted, marginTop: 8, textAlign: "center" }}>
                    Avg: {crackHistory.length > 0 ? (crackHistory.reduce((s, d) => s + d.value, 0) / crackHistory.length).toFixed(2) : 0}mm
                  </div>
                </div>

                {/* Previous Period */}
                <div>
                  <div style={{ 
                    fontSize: 10, fontWeight: 600, color: TOKEN.muted, marginBottom: 10,
                    fontFamily: "'JetBrains Mono', monospace", display: "flex", alignItems: "center", gap: 6
                  }}>
                    <span className="cs-dot-live" style={{ backgroundColor: TOKEN.muted }} />
                    PREVIOUS PERIOD (prior {dateRange === "7d" ? "7" : dateRange === "14d" ? "14" : "30"} readings)
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={previousPeriodData.length > 0 ? previousPeriodData : crackHistory.slice(0, Math.min(30, crackHistory.length))}>
                      <defs>
                        <linearGradient id="previousGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={TOKEN.muted} stopOpacity={0.2} />
                          <stop offset="95%" stopColor={TOKEN.muted} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" stroke={TOKEN.muted} tick={{ fontSize: 8 }} />
                      <YAxis domain={[0, 8]} stroke={TOKEN.muted} tick={{ fontSize: 8 }} />
                      <Tooltip contentStyle={{ backgroundColor: "rgba(8,14,28,0.95)", border: "1px solid rgba(255,255,255,0.1)" }} />
                      <Area type="monotone" dataKey="value" stroke={TOKEN.muted} fill="url(#previousGrad)" strokeWidth={2} />
                      <ReferenceLine y={TH_WARNING} stroke={TOKEN.warning} strokeDasharray="4 4" />
                      <ReferenceLine y={TH_CRITICAL} stroke={TOKEN.critical} strokeDasharray="4 4" />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div style={{ fontSize: 9, color: TOKEN.muted, marginTop: 8, textAlign: "center" }}>
                    Avg: {previousPeriodData.length > 0 ? (previousPeriodData.reduce((s, d) => s + d.value, 0) / previousPeriodData.length).toFixed(2) : 
                      crackHistory.length > 0 ? (crackHistory.slice(0, Math.min(15, crackHistory.length)).reduce((s, d) => s + d.value, 0) / Math.min(15, crackHistory.length)).toFixed(2) : 0}mm
                  </div>
                </div>
              </div>

              {/* Comparison Insights */}
              <div style={{ 
                marginTop: 16, 
                padding: "12px 14px", 
                borderRadius: 8,
                background: `${TOKEN.blue}08`,
                borderLeft: `3px solid ${TOKEN.blue}`
              }}>
                <div style={{ fontSize: 9, color: TOKEN.blue, marginBottom: 6, fontWeight: 600 }}>
                  📊 COMPARISON INSIGHTS
                </div>
                <div style={{ fontSize: 11, color: TOKEN.text, lineHeight: 1.6 }}>
                  {(() => {
                    const currentAvg = crackHistory.length > 0 ? crackHistory.reduce((s, d) => s + d.value, 0) / crackHistory.length : 0;
                    const prevAvg = previousPeriodData.length > 0 ? previousPeriodData.reduce((s, d) => s + d.value, 0) / previousPeriodData.length : 
                      crackHistory.length > 0 ? crackHistory.slice(0, Math.min(15, crackHistory.length)).reduce((s, d) => s + d.value, 0) / Math.min(15, crackHistory.length) : 0;
                    const percentChange = currentAvg > 0 ? ((currentAvg - prevAvg) / prevAvg * 100).toFixed(1) : 0;
                    const isIncreasing = currentAvg > prevAvg;
                    
                    if (crackHistory.length === 0) return "Insufficient data for comparison.";
                    
                    return (
                      <>
                        <strong>Average crack width {isIncreasing ? "increased" : "decreased"} by {Math.abs(percentChange)}%</strong> compared to the previous period.
                        {isIncreasing && parseFloat(percentChange) > 10 ? (
                          " ⚠️ Significant deterioration detected. Immediate inspection recommended."
                        ) : isIncreasing ? (
                          " ⚠️ Gradual increase observed. Increase monitoring frequency."
                        ) : (
                          " ✅ Conditions are improving. Continue routine monitoring."
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── HISTORICAL AREA CHART ─────────────────────────────────────────────── */}
        <div className="cs-card">
          <SectionHeader id="story" icon={Calendar} iconColor={TOKEN.blue}
            title={`Historical Trend — ${dateRange.toUpperCase()}`} />
          {expandedSections.story && (
            <div className="cs-card-inner" key={`history-container-${dateRange}`}>
              <div style={{ fontSize:9, color:TOKEN.muted, marginBottom:8, textAlign:"right",
                fontFamily:"'JetBrains Mono',monospace" }}>
                Showing {crackHistory.length} readings
                ({dateRange === "7d" ? "Last 7 days" : dateRange === "14d" ? "Last 14 days" : "Last 30 days"})
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart
                  key={`area-chart-${dateRange}-${crackHistory.length}`}
                  data={crackHistory.slice()}
                  onClick={(d) => d?.activePayload && setLinkedPoint({
                    time:d.activePayload[0].payload.date,
                    value:d.activePayload[0].payload.value
                  })}>
                  <defs>
                    <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={statusColor} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={statusColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" stroke={TOKEN.muted}
                    tick={{ fontSize:8, fontFamily:"'JetBrains Mono',monospace" }}
                    interval={Math.floor(crackHistory.length / 8)} />
                  <YAxis domain={[0,8]} stroke={TOKEN.muted}
                    tick={{ fontSize:8, fontFamily:"'JetBrains Mono',monospace" }} />
                  <Tooltip contentStyle={{ backgroundColor:"rgba(8,14,28,0.95)",
                    border:"1px solid rgba(255,255,255,0.1)", fontSize:11, borderRadius:8 }} />
                  <Legend wrapperStyle={{ fontSize:9 }} />
                  <ReferenceLine y={TH_CRITICAL} stroke={TOKEN.critical} strokeDasharray="4 4"
                    label={{ value:"CRITICAL", fill:TOKEN.critical, fontSize:9 }} />
                  <ReferenceLine y={TH_WARNING}  stroke={TOKEN.warning}  strokeDasharray="4 4"
                    label={{ value:"WARNING", fill:TOKEN.warning, fontSize:9 }} />
                  <Area type="monotone" dataKey="value" stroke={statusColor} fill="url(#histGrad)"
                    strokeWidth={2} name="Crack (mm)" dot={false} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* ── MULTI-SENSOR OVERLAY ─────────────────────────────────────────────── */}
        <div className="cs-card">
          <SectionHeader id="multiMetric" icon={Activity} iconColor={TOKEN.teal}
            title="Multi-Sensor Overlay" badge="Brushing & Linking" />
          {expandedSections.multiMetric && (
            <div className="cs-card-inner">
              <MultiMetricChart readings={allReadings} linkedPoint={linkedPoint} onBrush={setLinkedPoint} />
            </div>
          )}
        </div>

        {/* ── PREDICTIONS ──────────────────────────────────────────────────────── */}
        {showPredictions && predictions && (
          <div className="cs-card">
            <SectionHeader id="predictions" icon={Zap} iconColor={TOKEN.warning}
              title="Predictions & Time-to-Threshold" />
            {expandedSections.predictions && (
              <div className="cs-card-inner">
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:14 }}>
                  {[
                    ["Rate",        `${predictions.avgRate} mm/hr`,       predictions.avgRate > 0.02 ? TOKEN.critical : TOKEN.safe],
                    ["In 1 hour",   `${predictions.predictedNextHour} mm`, colorOf(predictions.predictedNextHour)],
                    ["→ Warning",   `${predictions.hoursToWarning}h`,      predictions.hoursToWarning < 24 ? TOKEN.warning : TOKEN.safe],
                    ["→ Critical",  `${predictions.hoursToCritical}h`,     predictions.hoursToCritical < 12 ? TOKEN.critical : TOKEN.warning],
                  ].map(([label,value,color]) => (
                    <div key={label} style={{ textAlign:"center", padding:"12px 8px",
                      backgroundColor:"rgba(255,255,255,0.04)", borderRadius:8,
                      border:"1px solid rgba(255,255,255,0.07)" }}>
                      <div style={{ fontSize:9, color:TOKEN.muted, marginBottom:5,
                        fontFamily:"'JetBrains Mono',monospace" }}>{label}</div>
                      <div style={{ fontSize:17, fontWeight:600, color,
                        fontFamily:"'JetBrains Mono',monospace",
                        textShadow:`0 0 14px ${color}60` }}>{value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ padding:"12px 14px", borderRadius:8,
                  background:"rgba(139,92,246,0.07)", border:"1px solid rgba(139,92,246,0.18)" }}>
                  <div style={{ fontSize:9, color:TOKEN.purple, marginBottom:6, fontWeight:600,
                    letterSpacing:"0.1em", fontFamily:"'JetBrains Mono',monospace" }}>
                    AI TREND ASSESSMENT
                  </div>
                  <div style={{ fontSize:11, color:TOKEN.text, lineHeight:1.7 }}>
                    <strong style={{ color:TOKEN.purple }}>Trend: {predictions.trend}</strong>
                    {" "}— average widening rate of {predictions.avgRate} mm/hr.
                    {predictions.trend === "Rapidly Worsening"
                      ? ` At this rate, critical threshold (${TH_CRITICAL}mm) will be reached in approximately ${predictions.hoursToCritical} hours. Escalate immediately.`
                      : predictions.trend === "Gradually Worsening"
                      ? ` Warning threshold (${TH_WARNING}mm) will be reached in approximately ${predictions.hoursToWarning} hours. Schedule inspection.`
                      : ` No significant widening trend detected. Continue routine monitoring.`}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── HOURLY PATTERN ─────────────────────────────────────────────────────── */}
        <div className="cs-card">
          <SectionHeader id="patterns" icon={BarChart2} iconColor={TOKEN.warning}
            title="Hourly Crack Pattern" badge="Temporal Analysis" />
          {expandedSections.patterns && (
            <div className="cs-card-inner">
              <HourlyPattern readings={allReadings} />
            </div>
          )}
        </div>

        {/* ── SENSOR CORRELATIONS ─────────────────────────────────────────────────── */}
        <div className="cs-card">
          <SectionHeader id="correlations" icon={Info} iconColor={TOKEN.blue}
            title="Sensor Correlations (Pearson r)" />
          {expandedSections.correlations && (
            <div className="cs-card-inner">
              <div style={{ fontSize:9, color:TOKEN.muted, marginBottom:12,
                fontFamily:"'JetBrains Mono',monospace" }}>
                Pearson correlation between crack width and each sensor · 1.0 = perfect linear relationship
              </div>
              {correlationData.map((item, idx) => (
                <div key={idx} style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5,
                    alignItems:"center" }}>
                    <span style={{ fontSize:11, color:TOKEN.text }}>
                      {item.icon} {item.factor}
                    </span>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:11, color:item.color, fontWeight:600,
                        fontFamily:"'JetBrains Mono',monospace" }}>
                        r = {item.correlation}
                      </span>
                      <span className="cs-badge"
                        style={{ backgroundColor:`${item.color}15`, color:item.color, border:`1px solid ${item.color}30` }}>
                        {item.correlation > 0.7 ? "STRONG" : item.correlation > 0.4 ? "MODERATE" : "WEAK"}
                      </span>
                    </div>
                  </div>
                  <div style={{ height:5, backgroundColor:"rgba(255,255,255,0.06)", borderRadius:3, overflow:"hidden" }}>
                    <div className="cs-correlation-bar"
                      style={{ width:`${item.correlation*100}%`,
                        background:`linear-gradient(90deg, ${item.color}60, ${item.color})` }} />
                  </div>
                </div>
              ))}
              <div style={{ fontSize:9, color:TOKEN.muted, marginTop:10, fontStyle:"italic" }}>
                Tip: Strong correlations may indicate causal relationships.
              </div>
            </div>
          )}
        </div>

        {/* ── SCATTER ANALYSIS ─────────────────────────────────────────────────── */}
        <div className="cs-card">
          <SectionHeader id="scatter" icon={Eye} iconColor={TOKEN.teal}
            title="Crack vs Soil 20cm — Scatter Analysis" badge="Multi-dimensional" />
          {expandedSections.scatter && (
            <div className="cs-card-inner">
              <CorrelationScatter readings={allReadings} />
            </div>
          )}
        </div>

        {/* ── RADAR SNAPSHOT ────────────────────────────────────────────────────── */}
        <div className="cs-card">
          <SectionHeader id="radar" icon={Activity} iconColor={TOKEN.purple}
            title="Multi-Sensor State Radar" />
          {expandedSections.radar && (
            <div className="cs-card-inner">
              <SensorRadar readings={allReadings} />
            </div>
          )}
        </div>

        {/* ── SEVERITY HEATMAP ─────────────────────────────────────────────────── */}
        <div className="cs-card">
          <SectionHeader id="heatmap" icon={Calendar} iconColor={TOKEN.warning}
            title="Daily Severity Heatmap" badge="Calendar View" />
          {expandedSections.heatmap && (
            <div className="cs-card-inner">
              <SeverityHeatmap readings={allReadings} />
            </div>
          )}
        </div>

        {/* ── EVENT TIMELINE ───────────────────────────────────────────────────── */}
        <div className="cs-card">
          <SectionHeader id="story" icon={Clock} iconColor={TOKEN.critical}
            title="Threshold Event Timeline" badge={`${alertHistory.length} events`} />
          {expandedSections.story !== undefined && (
            <div className="cs-card-inner">
              <EventTimeline readings={allReadings} linkedPoint={linkedPoint} />
            </div>
          )}
        </div>

        {/* ── ALERT LOG ────────────────────────────────────────────────────────── */}
        <div className="cs-card">
          <SectionHeader id="alerts" icon={AlertTriangle} iconColor={TOKEN.critical}
            title="Alert Log" badge={alertsMuted ? "MUTED" : `${alertHistory.length} recent`} />
          {expandedSections.alerts && (
            <div className="cs-card-inner">
              {alertsMuted ? (
                <div style={{ textAlign:"center", padding:20, color:TOKEN.muted, fontSize:11 }}>
                  🔕 Alerts muted. Click the bell icon in the toolbar to unmute.
                </div>
              ) : alertHistory.length === 0 ? (
                <div style={{ textAlign:"center", padding:20, color:TOKEN.safe, fontSize:11,
                  background:"rgba(34,197,94,0.05)", borderRadius:8, border:`1px solid ${TOKEN.safe}25` }}
                  role="status">
                  ✅ No recent alerts detected. All parameters within normal range.
                </div>
              ) : (
                <div role="list">
                  {alertHistory.map(a => (
                    <div key={a.id} role="listitem" className="cs-alert-item"
                      style={{ backgroundColor:`${a.color}0a`, borderLeft:`3px solid ${a.color}`,
                        boxShadow:`inset 0 0 24px ${a.color}06` }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                        <span className="cs-badge"
                          style={{ backgroundColor:`${a.color}20`, color:a.color, border:`1px solid ${a.color}40` }}>
                          {a.severity}
                        </span>
                        <span style={{ fontSize:9, color:TOKEN.muted,
                          fontFamily:"'JetBrains Mono',monospace" }}>
                          {a.date} {a.time}
                        </span>
                      </div>
                      <div style={{ fontSize:11, color:TOKEN.text, marginBottom:4 }}>{a.message}</div>
                      <div style={{ fontSize:9, color: a.acked ? TOKEN.safe : TOKEN.warning,
                        fontFamily:"'JetBrains Mono',monospace" }}>
                        {a.acked ? "✓ Acknowledged" : "⚠ Pending acknowledgement"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── ACTION CHECKLIST ─────────────────────────────────────────────────── */}
        <div className="cs-card">
          <SectionHeader id="actions" icon={CheckCircle} iconColor={statusColor}
            title="Decision Support — Action Checklist" />
          {expandedSections.actions && (
            <div className="cs-card-inner">
              <ActionChecklist status={status} crackRate={crackRate} predictions={predictions} />
            </div>
          )}
        </div>

        {/* ── ML MODEL INTEGRATION ─────────────────────────────────────────────── */}
        <div className="cs-card" style={{ padding:"14px 18px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:36, height:36, borderRadius:8,
                background:"rgba(139,92,246,0.12)", border:"1px solid rgba(139,92,246,0.25)",
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:GLOW.purple }}>
                <Brain size={18} style={{ color:TOKEN.purple }} />
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:500, color:TOKEN.text,
                  fontFamily:"'Inter',sans-serif" }}>
                  ML-Powered Risk Predictions
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:3 }}>
                  <span className="cs-badge"
                    style={{ backgroundColor:"rgba(139,92,246,0.12)", color:TOKEN.purple,
                      border:"1px solid rgba(139,92,246,0.25)" }}>
                    LOGISTIC REGRESSION
                  </span>
                  <span className="cs-dot-live" style={{ backgroundColor:TOKEN.purple }} />
                  <span style={{ fontSize:9, color:TOKEN.muted,
                    fontFamily:"'JetBrains Mono',monospace" }}>ACTIVE</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => window.location.href = "/ml-predictions"}
              style={{ padding:"8px 18px", borderRadius:8,
                background:`linear-gradient(135deg, ${TOKEN.purple}cc, ${TOKEN.purple})`,
                border:"none", color:"#fff", fontSize:11, fontWeight:600,
                cursor:"pointer", display:"flex", alignItems:"center", gap:6,
                fontFamily:"'Inter',sans-serif",
                boxShadow:`0 4px 20px ${TOKEN.purple}40`,
                transition:"box-shadow 0.2s ease, transform 0.15s ease" }}
              onMouseEnter={e => { e.target.style.boxShadow = `0 6px 28px ${TOKEN.purple}60`; e.target.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.target.style.boxShadow = `0 4px 20px ${TOKEN.purple}40`; e.target.style.transform = "translateY(0)"; }}>
              <Brain size={13} /> View ML Predictions
            </button>
          </div>
        </div>

      </div>{/* cs-content */}
    </div>
  );
}


