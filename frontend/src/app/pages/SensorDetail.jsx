// import { useState, useMemo } from "react";
// import { useSearchParams } from "react-router-dom";
// import { StatCard } from "../components/StatCard";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   ResponsiveContainer,
//   CartesianGrid,
//   Area,
//   AreaChart,
//   BarChart,
//   Bar,
//   ReferenceLine,
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   ComposedChart,
//   Legend,
// } from "recharts";

// const tabs = [
//   { id: "soil", label: "Soil Moisture" },
//   { id: "vibration", label: "Vibration" },
//   { id: "tilt", label: "Tilt / MPU6050" },
//   { id: "crack", label: "Crack Displacement" },
// ];

// // Soil moisture 30-min trend
// const soilData = Array.from({ length: 30 }, (_, i) => ({
//   time: i * 1,
//   value: 58 + i * 0.97,
// }));

// // Soil + rainfall dual-axis
// const soilRainfallData = Array.from({ length: 30 }, (_, i) => ({
//   time: i,
//   moisture: 58 + i * 0.97,
//   rainfall: i < 10 ? 0 : i < 18 ? (i - 10) * 1.4 : 11 - (i - 18) * 0.9,
// }));

// // 7-day historical moisture
// const soilHistory7d = [
//   { date: "Mar 9", avg: 42, max: 55, alerts: 0 },
//   { date: "Mar 10", avg: 48, max: 61, alerts: 1 },
//   { date: "Mar 11", avg: 45, max: 58, alerts: 0 },
//   { date: "Mar 12", avg: 52, max: 67, alerts: 1 },
//   { date: "Mar 13", avg: 58, max: 74, alerts: 2 },
//   { date: "Mar 14", avg: 63, max: 79, alerts: 3 },
//   { date: "Mar 15", avg: 71, max: 87, alerts: 4 },
// ];

// const vibrationData = Array.from({ length: 30 }, (_, i) => ({
//   time: i, value: 8 + Math.random() * 10,
// }));

// const tiltData = Array.from({ length: 30 }, (_, i) => ({
//   time: i, x: 3 + i * 0.18, y: 2.1 + (Math.random() * 0.2 - 0.1),
// }));

// const crackData = Array.from({ length: 30 }, (_, i) => ({
//   time: i, value: 3.1 + (Math.random() * 0.1 - 0.05),
// }));

// const crackHistory = [
//   { date: "Feb 15", value: 2.4 }, { date: "Feb 16", value: 2.4 },
//   { date: "Feb 17", value: 2.5 }, { date: "Feb 18", value: 2.5 },
//   { date: "Feb 19", value: 2.6 }, { date: "Feb 20", value: 2.6 },
//   { date: "Feb 21", value: 2.6 }, { date: "Feb 22", value: 2.7 },
//   { date: "Feb 23", value: 2.7 }, { date: "Feb 24", value: 2.7 },
//   { date: "Feb 25", value: 2.8 }, { date: "Feb 26", value: 2.8 },
//   { date: "Feb 27", value: 2.8 }, { date: "Feb 28", value: 2.9 },
//   { date: "Mar 1", value: 2.9 }, { date: "Mar 2", value: 2.9 },
//   { date: "Mar 3", value: 3.0 }, { date: "Mar 4", value: 3.0 },
//   { date: "Mar 5", value: 3.0 }, { date: "Mar 6", value: 3.0 },
//   { date: "Mar 7", value: 3.0 }, { date: "Mar 8", value: 3.0 },
//   { date: "Mar 9", value: 3.0 }, { date: "Mar 10", value: 3.1 },
//   { date: "Mar 11", value: 3.1 }, { date: "Mar 12", value: 3.1 },
//   { date: "Mar 13", value: 3.2 }, { date: "Mar 14", value: 3.2 },
//   { date: "Mar 15", value: 3.0 },
// ];

// const riskDistribution = [{ name: "Safe", value: 22 }, { name: "Warning", value: 6 }, { name: "Critical", value: 2 }];
// const riskColors = ["#22c55e", "#f59e0b", "#ef4444"];
// const vibrationDistribution = [{ name: "Low", value: 45 }, { name: "Medium", value: 35 }, { name: "High", value: 20 }];
// const vibrationColors = ["#22c55e", "#f59e0b", "#ef4444"];

// function RoleHeader({ role, color, bg }) {
//   return (
//     <div style={{
//       display: "flex", alignItems: "center", gap: "10px",
//       padding: "8px 14px", borderRadius: "6px",
//       backgroundColor: bg, border: `1px solid ${color}`,
//       marginBottom: "12px",
//     }}>
//       <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: color, flexShrink: 0 }} />
//       <div style={{ fontSize: "10px", fontWeight: 600, color, letterSpacing: "0.12em", fontFamily: "Barlow, sans-serif" }}>
//         {role}
//       </div>
//     </div>
//   );
// }

// export function SensorDetail() {
//   const [searchParams] = useSearchParams();
//   const tabFromUrl = searchParams.get("tab");
//   const [activeTab, setActiveTab] = useState(tabFromUrl || "soil");
//   const [dateRange, setDateRange] = useState("7d");
//   const [supAcked, setSupAcked] = useState(false);
//   const [supAckedTime, setSupAckedTime] = useState("");
//   const isSensorHealthy = true;

//   const filteredCrackHistory = useMemo(() => {
//     if (dateRange === "7d") return crackHistory.slice(-7);
//     if (dateRange === "14d") return crackHistory.slice(-14);
//     return crackHistory;
//   }, [dateRange]);

//   function handleSupAck() {
//     const t = new Date().toLocaleTimeString("en-GB", {
//       hour: "2-digit", minute: "2-digit", second: "2-digit",
//     });
//     setSupAckedTime(t);
//     setSupAcked(true);
//   }

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//       {/* Tab Bar */}
//       <div style={{ display: 'flex', gap: '32px' }}>
//         {tabs.map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id)}
//             style={{
//               padding: "4px 12px",
//               borderRadius: "4px",
//               fontSize: "11px",
//               fontWeight: 600,
//               fontFamily: "Barlow, sans-serif",
//               letterSpacing: "0.05em",
//               backgroundColor: activeTab === tab.id ? "rgba(245, 158, 11, 0.15)" : "var(--bg3)",
//               border: `1px solid ${activeTab === tab.id ? "var(--amber)" : "var(--border)"}`,
//               color: activeTab === tab.id ? "var(--amber)" : "var(--text)",
//               cursor: "pointer",
//               transition: "all 0.2s ease"
//             }}
//           >
//             {tab.label.toUpperCase()}
//           </button>
//         ))}
//       </div>

//       <div style={{ height: "16px" }}></div>

//       {/* SOIL MOISTURE TAB */}
//       {activeTab === "soil" && (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

//           {/* Stat cards - 3 columns */}
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
//             <StatCard label="CURRENT VALUE" value="87%" sub="Soil saturation" color="var(--red)" />
//             <StatCard label="30-MIN AVERAGE" value="71%" sub="Trending upward ↑" color="var(--amber)" />
//             <StatCard label="TIME IN CRITICAL" value="4m 22s" sub="Since 14:18:45" color="var(--red)" />
//           </div>

//           <div style={{ height: "20px" }}></div>

//           {/* 30-min trend chart */}
//           <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030" }}>
//             <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: "Barlow, sans-serif" }}>
//               SENSOR TREND — LAST 30 MINUTES
//             </div>
//             <ResponsiveContainer width="100%" height={150}>
//               <AreaChart data={soilData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 51, 71, 0.5)" />
//                 <XAxis dataKey="time" stroke="var(--muted)"
//                   style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }}
//                   tickFormatter={(v) => `${v}m`} />
//                 <YAxis domain={[40, 100]} stroke="var(--muted)"
//                   style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
//                 <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.8}
//                   label={{ value: "Critical 80%", position: "insideTopRight", fill: "#ef4444", fontSize: 9, dy: -6 }} />
//                 <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.8}
//                   label={{ value: "Warning 60%", position: "insideTopRight", fill: "#f59e0b", fontSize: 9, dy: -6 }} />
//                 <Area type="monotone" dataKey="value" stroke="#ef4444" fill="rgba(239, 68, 68, 0.08)" strokeWidth={2} />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>

//           <div style={{ height: "20px" }}></div>

//           {/* Threshold levels */}
//           <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
//             <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: "Barlow, sans-serif" }}>
//               THRESHOLD LEVELS
//             </div>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//               {[
//                 { label: "SAFE", color: "var(--green)", width: "60%", range: "0 – 60%", marker: false },
//                 { label: "WARNING", color: "var(--amber)", width: "80%", range: "60 – 80%", marker: false },
//                 { label: "CRITICAL", color: "var(--red)", width: "100%", range: "> 80%", marker: true },
//               ].map((t) => (
//                 <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//                   <div style={{ width: "80px", fontSize: "11px", fontFamily: "Share Tech Mono, monospace", color: t.color, fontWeight: 600 }}>
//                     {t.label}
//                   </div>
//                   <div style={{ flex: 1, height: "24px", borderRadius: "4px", position: "relative", backgroundColor: "var(--bg3)" }}>
//                     <div style={{ height: "100%", borderRadius: "4px", width: t.width, backgroundColor: t.color }} />
//                     {t.marker && (
//                       <div style={{ position: "absolute", top: "50%", width: "2px", height: "32px", backgroundColor: "white", left: "80%", transform: "translateY(-50%)" }} />
//                     )}
//                   </div>
//                   <div style={{ fontSize: "11px", fontFamily: "Share Tech Mono, monospace", color: "var(--muted)", width: "80px", textAlign: "right" }}>
//                     {t.range}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div style={{ height: "20px" }}></div>

//           {/* Decision support */}
//           <div style={{ padding: "16px", borderRadius: "8px", backgroundColor: "rgba(239, 68, 68, 0.08)", border: "1px solid var(--red)" }}>
//             <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
//               <div style={{ fontSize: "24px", color: "var(--red)" }}>⬥</div>
//               <div style={{ flex: 1 }}>
//                 <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--red)", marginBottom: "8px" }}>
//                   Immediate Action Required
//                 </div>
//                 <div style={{ fontSize: "12px", color: "var(--text)", lineHeight: 1.5 }}>
//                   Soil saturation at 87% indicates high landslide risk. Supervisor should consider
//                   halting load-bearing work and reinforcing the Zone C perimeter. If tilt also
//                   increases, initiate evacuation protocol.
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* STAKEHOLDER SECTIONS */}
//           <div style={{ height: "32px" }}></div>
//           <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px" }}>

//             {/* SUPERVISOR VIEW */}
//             <RoleHeader
//               role="SUPERVISOR VIEW — Operational Decision Support"
//               color="var(--amber)"
//               bg="rgba(245,158,11,0.06)"
//             />

//             {/* Trend + rate of change cards - 3 columns */}
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: "12px" }}>
//               {[
//                 { label: "TREND DIRECTION", value: "↑", sub: "Rising", color: "var(--red)", size: "28px" },
//                 { label: "RATE OF CHANGE", value: "+2.1%", sub: "per minute", color: "var(--red)", size: "22px" },
//                 { label: "EST. TIME TO CRITICAL", value: "~6 min", sub: "if trend continues", color: "var(--amber)", size: "22px" },
//               ].map((c) => (
//                 <div key={c.label} style={{ padding: "12px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)", textAlign: "center" }}>
//                   <div style={{ fontSize: "9px", color: "var(--muted)", fontFamily: "Barlow, sans-serif", letterSpacing: "0.1em", marginBottom: "4px" }}>
//                     {c.label}
//                   </div>
//                   <div style={{ fontSize: c.size, color: c.color, fontFamily: "Share Tech Mono, monospace", lineHeight: 1 }}>
//                     {c.value}
//                   </div>
//                   <div style={{ fontSize: "10px", color: "var(--muted)", fontFamily: "Share Tech Mono, monospace", marginTop: "2px" }}>
//                     {c.sub}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Moisture vs rainfall dual-axis chart */}
//             <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)", marginBottom: "12px" }}>
//               <div style={{
//                 fontSize: "10px", fontWeight: 600, color: "var(--muted)",
//                 letterSpacing: "0.1em", marginBottom: "8px", fontFamily: "Barlow, sans-serif",
//                 display: "flex", justifyContent: "space-between", alignItems: "center",
//               }}>
//                 <span>MOISTURE vs RAINFALL CORRELATION</span>
//                 <span style={{ fontWeight: 400, fontSize: "9px" }}>
//                   <span style={{ color: "#ef4444" }}>— </span>Moisture %  
//                   <span style={{ color: "#3b82f6" }}>▪ </span>Rainfall mm/hr
//                 </span>
//               </div>
//               <ResponsiveContainer width="100%" height={140}>
//                 <ComposedChart data={soilRainfallData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,51,71,0.5)" />
//                   <XAxis dataKey="time" stroke="var(--muted)"
//                     style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }}
//                     tickFormatter={(v) => `${v}m`} />
//                   <YAxis yAxisId="moisture" domain={[40, 100]} stroke="#ef4444"
//                     style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
//                   <YAxis yAxisId="rain" orientation="right" domain={[0, 16]} stroke="#3b82f6"
//                     style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
//                   <ReferenceLine yAxisId="moisture" y={80} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.6} />
//                   <ReferenceLine yAxisId="moisture" y={60} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.6} />
//                   <Bar yAxisId="rain" dataKey="rainfall" fill="rgba(59,130,246,0.25)"
//                     stroke="#3b82f6" strokeWidth={0.5} radius={[2, 2, 0, 0]} />
//                   <Line yAxisId="moisture" type="monotone" dataKey="moisture"
//                     stroke="#ef4444" strokeWidth={2} dot={false} />
//                 </ComposedChart>
//               </ResponsiveContainer>
//               <div style={{ fontSize: "10px", color: "var(--muted)", marginTop: "8px", fontFamily: "Share Tech Mono, monospace" }}>
//                 Rainfall started at 10m mark — moisture rising 8 min later. Correlation confirmed.
//               </div>
//             </div>

//             {/* Supervisor acknowledge alert */}
//             <div style={{
//               padding: "14px", borderRadius: "8px",
//               backgroundColor: supAcked ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.08)",
//               border: `1px solid ${supAcked ? "var(--green)" : "var(--red)"}`,
//               transition: "all 0.3s ease",
//             }}>
//               <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
//                 <div style={{ fontSize: "20px", color: supAcked ? "var(--green)" : "var(--red)", marginTop: "2px" }}>
//                   {supAcked ? "✓" : "⬥"}
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontSize: "12px", fontWeight: 500, color: supAcked ? "var(--green)" : "var(--red)", marginBottom: "4px" }}>
//                     {supAcked ? "Alert Acknowledged" : "Active Alert — Supervisor Response Required"}
//                   </div>
//                   <div style={{ fontSize: "11px", color: "var(--text)", lineHeight: 1.5, marginBottom: "8px" }}>
//                     Soil moisture at 87% has exceeded the critical threshold (80%). Rainfall is ongoing.
//                     Moisture is rising at +2.1%/min. Estimated to reach 95% in 6 minutes if unchanged.
//                   </div>
//                   {!supAcked ? (
//                     <button
//                       onClick={handleSupAck}
//                       style={{
//                         fontSize: "9px", fontWeight: 600, fontFamily: "Barlow, sans-serif",
//                         letterSpacing: "0.08em", padding: "4px 14px", borderRadius: "4px",
//                         border: "1px solid var(--red)", background: "transparent",
//                         color: "var(--red)", cursor: "pointer",
//                       }}
//                     >
//                       ACKNOWLEDGE ALERT
//                     </button>
//                   ) : (
//                     <div style={{ fontSize: "10px", color: "var(--green)", fontFamily: "Share Tech Mono, monospace" }}>
//                       Acknowledged at {supAckedTime}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* MANAGER VIEW */}
//             <div style={{ height: "32px" }}></div>
//             <RoleHeader
//               role="MANAGER VIEW — Historical Analytics & Reporting"
//               color="#3b82f6"
//               bg="rgba(59,130,246,0.06)"
//             />

//             {/* KPI summary cards - 4 columns */}
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: "12px" }}>
//               {[
//                 { label: "7-DAY AVG", value: "54%", color: "var(--amber)" },
//                 { label: "7-DAY MAX", value: "87%", color: "var(--red)" },
//                 { label: "TOTAL ALERTS", value: "11", color: "var(--red)" },
//                 { label: "DAYS ≥ WARNING", value: "4", color: "var(--amber)" },
//               ].map((k) => (
//                 <div key={k.label} style={{ padding: "12px", borderRadius: "8px", textAlign: "center", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
//                   <div style={{ fontSize: "9px", color: "var(--muted)", fontFamily: "Barlow, sans-serif", letterSpacing: "0.1em", marginBottom: "4px" }}>
//                     {k.label}
//                   </div>
//                   <div style={{ fontSize: "20px", fontFamily: "Share Tech Mono, monospace", color: k.color, lineHeight: 1 }}>
//                     {k.value}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* 7-day historical chart */}
//             <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)", marginBottom: "12px" }}>
//               <div style={{
//                 fontSize: "10px", fontWeight: 600, color: "var(--muted)",
//                 letterSpacing: "0.1em", marginBottom: "8px", fontFamily: "Barlow, sans-serif",
//                 display: "flex", justifyContent: "space-between",
//               }}>
//                 <span>SOIL MOISTURE — 7-DAY HISTORICAL TREND</span>
//                 <span style={{ fontWeight: 400, fontSize: "9px" }}>
//                   <span style={{ color: "#ef4444" }}>— </span>Max  
//                   <span style={{ color: "#f59e0b" }}>— </span>Avg
//                 </span>
//               </div>
//               <ResponsiveContainer width="100%" height={140}>
//                 <ComposedChart data={soilHistory7d}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,51,71,0.5)" />
//                   <XAxis dataKey="date" stroke="var(--muted)"
//                     style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
//                   <YAxis domain={[0, 100]} stroke="var(--muted)"
//                     style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
//                   <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.6} />
//                   <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.6} />
//                   <Bar dataKey="alerts" fill="rgba(239,68,68,0.15)" radius={[2, 2, 0, 0]} />
//                   <Line type="monotone" dataKey="max" stroke="#ef4444" strokeWidth={2} dot={true} />
//                   <Line type="monotone" dataKey="avg" stroke="#f59e0b" strokeWidth={2} dot={true} strokeDasharray="4 3" />
//                 </ComposedChart>
//               </ResponsiveContainer>
//             </div>

//             {/* Export buttons */}
//             <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
//               <button
//                 onClick={() => alert("PDF export — connect to your export logic here")}
//                 style={{
//                   fontSize: "10px", fontWeight: 600, fontFamily: "Barlow, sans-serif",
//                   letterSpacing: "0.08em", padding: "6px 16px", borderRadius: "4px",
//                   border: "1px solid #3b82f6", background: "rgba(59,130,246,0.1)",
//                   color: "#3b82f6", cursor: "pointer",
//                 }}
//               >
//                 EXPORT PDF
//               </button>
//               <button
//                 onClick={() => alert("CSV export — connect to your export logic here")}
//                 style={{
//                   fontSize: "10px", fontWeight: 600, fontFamily: "Barlow, sans-serif",
//                   letterSpacing: "0.08em", padding: "6px 16px", borderRadius: "4px",
//                   border: "1px solid var(--border)", background: "transparent",
//                   color: "var(--muted)", cursor: "pointer",
//                 }}
//               >
//                 EXPORT CSV
//               </button>
//             </div>

//             {/* WORKER VIEW */}
//             <div style={{ height: "32px" }}></div>
//             <RoleHeader
//               role="WORKER VIEW — Personal Safety Alert"
//               color="var(--green)"
//               bg="rgba(34,197,94,0.06)"
//             />

//             {/* DANGER card */}
//             <div style={{
//               padding: "20px", borderRadius: "8px",
//               backgroundColor: "rgba(239,68,68,0.12)",
//               border: "2px solid var(--red)",
//               textAlign: "center",
//             }}>
//               <div style={{
//                 fontSize: "48px", fontWeight: 700, color: "var(--red)",
//                 lineHeight: 1, marginBottom: "8px",
//                 fontFamily: "Barlow, sans-serif", letterSpacing: "0.05em",
//               }}>
//                 DANGER
//               </div>
//               <div style={{
//                 fontSize: "13px", color: "var(--red)",
//                 fontFamily: "Share Tech Mono, monospace",
//                 marginBottom: "16px", opacity: 0.85,
//               }}>
//                 High soil moisture detected — 87%
//               </div>
//               <div style={{
//                 backgroundColor: "rgba(239,68,68,0.15)",
//                 border: "1px solid rgba(239,68,68,0.3)",
//                 borderRadius: "8px", padding: "12px 16px", marginBottom: "14px",
//               }}>
//                 <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", lineHeight: 1.6 }}>
//                   Stop work immediately.<br />
//                   Move away from the excavation area.<br />
//                   Contact your supervisor now.
//                 </div>
//               </div>
//               <div style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "Share Tech Mono, monospace" }}>
//                 Zone C · Sensor S-01 · Last updated: 14:21:03
//               </div>
//             </div>

//             {/* Safe state preview */}
//             <div style={{
//               padding: "16px", borderRadius: "8px",
//               backgroundColor: "rgba(34,197,94,0.08)",
//               border: "1px solid var(--green)",
//               textAlign: "center", marginTop: "10px",
//             }}>
//               <div style={{ fontSize: "9px", color: "var(--muted)", fontFamily: "Barlow, sans-serif", letterSpacing: "0.1em", marginBottom: "6px" }}>
//                 SAFE STATE PREVIEW
//               </div>
//               <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--green)", fontFamily: "Barlow, sans-serif", lineHeight: 1, marginBottom: "4px" }}>
//                 SAFE
//               </div>
//               <div style={{ fontSize: "11px", color: "var(--green)", fontFamily: "Share Tech Mono, monospace" }}>
//                 Work may continue normally
//               </div>
//             </div>

//           </div>
//         </div>
//       )}

//       {/* VIBRATION TAB */}
//       {activeTab === "vibration" && (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
//             <StatCard label="PULSE EVENTS/MIN" value="14.2" sub="Current vibration rate" color="var(--amber)" />
//             <StatCard label="PEAK INTENSITY" value="HIGH" sub="Last 30 minutes" color="var(--red)" />
//             <StatCard label="RISK LEVEL" value="MODERATE" sub="Based on vibration pattern" color="var(--amber)" />
//           </div>

//           <div style={{ height: "20px" }}></div>

//           <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
//             <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: "Barlow, sans-serif" }}>
//               REAL-TIME VIBRATION TREND
//             </div>
//             <ResponsiveContainer width="100%" height={160}>
//               <LineChart data={vibrationData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 51, 71, 0.5)" />
//                 <XAxis dataKey="time" stroke="var(--muted)" />
//                 <YAxis stroke="var(--muted)" />
//                 <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} dot={false} />
//                 <ReferenceLine y={15} stroke="red" strokeDasharray="4 4" label={{ value: "CRITICAL LIMIT", position: "right", fill: "red", fontSize: 10 }} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//           <div style={{ height: "20px" }}></div>

//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
//             <div style={{ gridColumn: 'span 3', padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
//               <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: "Barlow, sans-serif" }}>
//                 VIBRATION PULSE FREQUENCY - LAST 30 MINUTES
//               </div>
//               <ResponsiveContainer width="100%" height={150}>
//                 <BarChart data={vibrationData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 51, 71, 0.5)" />
//                   <XAxis dataKey="time" stroke="var(--muted)" />
//                   <YAxis stroke="var(--muted)" />
//                   <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>

//             <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
//               <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: "Barlow, sans-serif" }}>
//                 VIBRATION INTENSITY DISTRIBUTION
//               </div>
//               <ResponsiveContainer width="100%" height={175}>
//                 <PieChart>
//                   <Pie data={vibrationDistribution} cx="50%" cy="50%" innerRadius={25} outerRadius={45} dataKey="value" nameKey="name" label>
//                     {vibrationDistribution.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={vibrationColors[index % vibrationColors.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           <div style={{ height: "20px" }}></div>

//           <div style={{ padding: "16px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
//             <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "10px", fontFamily: "Barlow, sans-serif" }}>
//               LANDSLIDE RISK PROBABILITY (BASED ON VIBRATION)
//             </div>
//             <div style={{ width: "100%", height: "20px", borderRadius: "4px", backgroundColor: "gray", position: "relative" }}>
//               <div style={{ width: "65%", backgroundColor: "#f59e0b", height: "100%", borderRadius: "4px" }} />
//               <div style={{ position: "absolute", right: "5px", top: "-18px", fontSize: "11px", color: "var(--text)" }}>
//                 65%
//               </div>
//             </div>
//           </div>

//           <div style={{ height: "16px" }}></div>

//           <div style={{ padding: "16px", borderRadius: "8px", backgroundColor: "rgba(245, 158, 11, 0.08)", border: "1px solid var(--amber)" }}>
//             <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
//               <div style={{ fontSize: "24px", color: "var(--amber)" }}>⬦</div>
//               <div style={{ flex: 1 }}>
//                 <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--amber)", marginBottom: "8px" }}>
//                   Monitor Ground Stability
//                 </div>
//                 <div style={{ fontSize: "12px", color: "var(--text)", lineHeight: 1.5 }}>
//                   Elevated vibration patterns may indicate early-stage ground instability.
//                   Correlate with soil moisture and tilt sensor data. If vibration intensity
//                   continues rising for more than 15 minutes, restrict heavy machinery
//                   operation and inspect nearby slope areas.
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* TILT TAB */}
//       {activeTab === "tilt" && (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
//             <StatCard label="X-AXIS TILT" value="8.4°" sub="Current deviation" color="var(--amber)" />
//             <StatCard label="Y-AXIS TILT" value="2.1°" sub="Within safe range" color="var(--green)" />
//             <StatCard label="ANGULAR VELOCITY" value="0.3 °/s" sub="Rate of change" color="var(--text)" />
//           </div>

//           <div style={{ height: "20px" }}></div>

//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
//             <StatCard label="RATE OF CHANGE" value="+0.18°" sub="per minute" color="var(--amber)" />
//             <StatCard label="EST. TIME TO CRITICAL" value="~9 min" sub="at current rate" color="var(--amber)" />
//             <StatCard label="THRESHOLD PROXIMITY" value="84%" sub="of critical limit" color="var(--red)" />
//           </div>

//           <div style={{ height: "20px" }}></div>

//           <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030" }}>
//             <div style={{
//               fontSize: "10px", fontWeight: 600, color: "var(--muted)",
//               letterSpacing: "0.1em", marginBottom: "8px", fontFamily: "Barlow, sans-serif",
//               display: "flex", justifyContent: "space-between", alignItems: "center",
//             }}>
//               <span>TILT ANGLE — LAST 30 MINUTES</span>
//               <span style={{ fontWeight: 400, fontSize: "9px" }}>
//                 <span style={{ color: "#f59e0b" }}>— </span>X-axis  
//                 <span style={{ color: "#22c55e" }}>— </span>Y-axis  
//                 <span style={{ color: "#ef4444", opacity: 0.8 }}>— — </span>Critical  
//                 <span style={{ color: "#f59e0b", opacity: 0.8 }}>— — </span>Warning
//               </span>
//             </div>
//             <ResponsiveContainer width="100%" height={150}>
//               <LineChart data={tiltData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 51, 71, 0.5)" />
//                 <XAxis dataKey="time" stroke="var(--muted)"
//                   style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }}
//                   tickFormatter={(v) => `${v}m`} />
//                 <YAxis domain={[0, 12]} stroke="var(--muted)"
//                   style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
//                 <ReferenceLine y={10} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.8}
//                   label={{ value: "10°", position: "insideTopRight", fill: "#ef4444", fontSize: 9, dy: -6 }} />
//                 <ReferenceLine y={7} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.8}
//                   label={{ value: "7°", position: "insideTopRight", fill: "#f59e0b", fontSize: 9, dy: -6 }} />
//                 <Line type="monotone" dataKey="x" stroke="#f59e0b" strokeWidth={2} dot={false} />
//                 <Line type="monotone" dataKey="y" stroke="#22c55e" strokeWidth={2} dot={false} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//           <div style={{ height: "20px" }}></div>

//           <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
//             <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: "Barlow, sans-serif" }}>
//               X-AXIS THRESHOLD PROXIMITY
//             </div>
//             <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
//               <div style={{ fontSize: "10px", fontFamily: "Share Tech Mono, monospace", color: "var(--muted)", width: "24px" }}>0°</div>
//               <div style={{ flex: 1, height: "18px", borderRadius: "4px", backgroundColor: "var(--bg3)", position: "relative", overflow: "visible" }}>
//                 <div style={{
//                   position: "absolute", left: 0, top: 0, height: "100%",
//                   width: "84%",
//                   background: "linear-gradient(to right, #22c55e 0%, #f59e0b 60%, #ef4444 100%)",
//                   borderRadius: "4px",
//                 }} />
//                 <div style={{ position: "absolute", left: "70%", top: "-3px", height: "24px", width: "1.5px", backgroundColor: "#f59e0b", opacity: 0.7 }} />
//                 <div style={{ position: "absolute", left: "84%", top: "-5px", height: "28px", width: "2.5px", backgroundColor: "white", borderRadius: "2px" }} />
//               </div>
//               <div style={{ fontSize: "10px", fontFamily: "Share Tech Mono, monospace", color: "var(--muted)", width: "24px" }}>10°</div>
//             </div>
//             <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", fontFamily: "Share Tech Mono, monospace", color: "var(--muted)" }}>
//               <span><span style={{ color: "#22c55e" }}>●</span> Safe {"<"}7°</span>
//               <span style={{ color: "var(--amber)" }}>Current: 8.4° — 84% to critical</span>
//               <span><span style={{ color: "#ef4444" }}>●</span> Critical 10°</span>
//             </div>
//           </div>

//           <div style={{ height: "20px" }}></div>

//           <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
//             <div style={{
//               fontSize: "10px", fontWeight: 600, color: "var(--muted)",
//               letterSpacing: "0.1em", marginBottom: "8px", fontFamily: "Barlow, sans-serif",
//               display: "flex", justifyContent: "space-between",
//             }}>
//               <span>X-AXIS TILT — 7-DAY TREND</span>
//               <span style={{ fontWeight: 400, fontSize: "9px", color: "var(--amber)" }}>+5.2° over 7 days</span>
//             </div>
//             <ResponsiveContainer width="100%" height={120}>
//               <LineChart data={[
//                 { date: "Mar 9", x: 3.2 }, { date: "Mar 10", x: 4.1 },
//                 { date: "Mar 11", x: 4.8 }, { date: "Mar 12", x: 5.6 },
//                 { date: "Mar 13", x: 6.4 }, { date: "Mar 14", x: 7.2 },
//                 { date: "Mar 15", x: 8.4 },
//               ]}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,51,71,0.5)" />
//                 <XAxis dataKey="date" stroke="var(--muted)"
//                   style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
//                 <YAxis domain={[0, 12]} stroke="var(--muted)"
//                   style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
//                 <ReferenceLine y={10} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.6} />
//                 <ReferenceLine y={7} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.6} />
//                 <Line type="monotone" dataKey="x" stroke="#f59e0b" strokeWidth={2} dot={true} />
//               </LineChart>
//             </ResponsiveContainer>
//             <div style={{ fontSize: "10px", color: "var(--muted)", marginTop: "6px", fontFamily: "Share Tech Mono, monospace" }}>
//               Consistent upward trend — structural review recommended before tilt reaches critical threshold.
//             </div>
//           </div>

//           <div style={{ height: "20px" }}></div>

//           <div style={{ padding: "16px", borderRadius: "8px", backgroundColor: "rgba(245, 158, 11, 0.08)", border: "1px solid var(--amber)" }}>
//             <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
//               <div style={{ fontSize: "24px", color: "var(--amber)" }}>⬦</div>
//               <div style={{ flex: 1 }}>
//                 <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--amber)", marginBottom: "8px" }}>
//                   Caution — Approaching Limit
//                 </div>
//                 <div style={{ fontSize: "12px", color: "var(--text)", lineHeight: 1.5 }}>
//                   X-axis tilt at 8.4° is 84% of the way to the 10° critical threshold and rising at +0.18°/min.
//                   At this rate, critical will be reached in approximately 9 minutes. Monitor structural
//                   integrity of west wall and consider reinforcement. Cross-correlate with soil moisture —
//                   if both are elevated simultaneously, initiate evacuation protocol immediately.
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* CRACK TAB */}
//       {activeTab === "crack" && (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
//             <StatCard label="GAP WIDTH" value="3.1 mm" sub="Current measurement" color="var(--green)" />
//             <StatCard label="WIDENING RATE" value="0.02 mm/hr" sub="Minimal change" color="var(--green)" />
//             <StatCard label="STATUS" value="SAFE" sub="Within tolerance" color="var(--green)" />
//           </div>

//           <div style={{ height: "20px" }}></div>

//           <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030" }}>
//             <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: "Barlow, sans-serif" }}>
//               SENSOR TREND — LAST 30 MINUTES
//             </div>
//             <ResponsiveContainer width="100%" height={150}>
//               <LineChart data={crackData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 51, 71, 0.5)" />
//                 <XAxis dataKey="time" stroke="var(--muted)"
//                   style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }}
//                   tickFormatter={(v) => `${v}m`} />
//                 <YAxis domain={[2.8, 6]} stroke="var(--muted)"
//                   style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
//                 <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={false} />
//                 <ReferenceLine y={5} stroke="red" strokeDasharray="4 4"
//                   label={{ value: "CRITICAL (5mm)", position: "right", fill: "red", fontSize: 10 }} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//           <div style={{ height: "20px" }}></div>

//           <div style={{ display: 'flex', gap: '8px' }}>
//             {[{ id: "7d", label: "Last 7 Days" }, { id: "14d", label: "Last 14 Days" }, { id: "30d", label: "Last 30 Days" }].map((range) => (
//               <button key={range.id} onClick={() => setDateRange(range.id)} style={{
//                 padding: "4px 12px", borderRadius: "4px",
//                 fontSize: "11px", fontWeight: 600, fontFamily: "Barlow, sans-serif", letterSpacing: "0.05em",
//                 backgroundColor: dateRange === range.id ? "rgba(34, 197, 94, 0.15)" : "var(--bg3)",
//                 border: `1px solid ${dateRange === range.id ? "var(--green)" : "var(--border)"}`,
//                 color: dateRange === range.id ? "var(--green)" : "var(--text)",
//                 cursor: "pointer"
//               }}>
//                 {range.label.toUpperCase()}
//               </button>
//             ))}
//           </div>

//           <div style={{ height: "12px" }}></div>

//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
//             <div style={{ gridColumn: 'span 3', padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
//               <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: "Barlow, sans-serif" }}>
//                 CRACK DISPLACEMENT — HISTORICAL TREND ({dateRange.toUpperCase()})
//               </div>
//               <ResponsiveContainer width="100%" height={150}>
//                 <LineChart data={filteredCrackHistory}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 51, 71, 0.5)" />
//                   <XAxis dataKey="date" stroke="var(--muted)" style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
//                   <YAxis stroke="var(--muted)" style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
//                   <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={false} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>

//             <div style={{ padding: "14px", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
//               <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "10px", fontFamily: "Barlow, sans-serif", textAlign: "center" }}>
//                 RISK LEVEL DISTRIBUTION
//               </div>
//               <ResponsiveContainer width="100%" height={120}>
//                 <PieChart>
//                   <Pie data={riskDistribution} dataKey="value" innerRadius={25} outerRadius={45} paddingAngle={3}>
//                     {riskDistribution.map((_, index) => (
//                       <Cell key={`cell-${index}`} fill={riskColors[index]} />
//                     ))}
//                   </Pie>
//                 </PieChart>
//               </ResponsiveContainer>
//               <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "8px" }}>
//                 {[["#22c55e", "SAFE"], ["#f59e0b", "WARNING"], ["#ef4444", "CRITICAL"]].map(([color, label]) => (
//                   <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                     <div style={{ width: "10px", height: "10px", backgroundColor: color, borderRadius: "2px" }} />
//                     <span style={{ fontSize: "6px", color: "var(--muted)", fontFamily: "Share Tech Mono, monospace" }}>{label}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div style={{ padding: "14px", borderRadius: "8px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
//               <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "20px", fontFamily: "Barlow, sans-serif" }}>
//                 SENSOR HEALTH
//               </div>
//               <div style={{ fontSize: "18px", fontWeight: 600, color: isSensorHealthy ? "var(--green)" : "var(--red)", marginBottom: "6px" }}>
//                 {isSensorHealthy ? "FUNCTIONING" : "FAULT DETECTED"}
//               </div>
//               <div style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.4 }}>
//                 {isSensorHealthy ? "Signal stable. No data loss detected." : "Check wiring, power supply, or sensor module."}
//               </div>
//             </div>
//           </div>

//           <div style={{ height: "8px" }}></div>

//           <div style={{ padding: "16px", borderRadius: "8px", backgroundColor: "rgba(59, 130, 246, 0.08)", border: "1px solid var(--blue)" }}>
//             <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
//               <div style={{ fontSize: "24px", color: "var(--blue)" }}>◆</div>
//               <div style={{ flex: 1 }}>
//                 <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--blue)", marginBottom: "8px" }}>No Action Required</div>
//                 <div style={{ fontSize: "12px", color: "var(--text)", lineHeight: 1.5 }}>
//                   Crack displacement is stable at 3.1mm with minimal widening rate. Continue routine monitoring.
//                   Alert will trigger if gap exceeds 5mm or widening rate exceeds 0.1mm/hr.
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  SoilMoistureSensor,
  VibrationSensor,
  TiltSensor,
  CrackSensor,
} from "./sensors";

const tabs = [
  { id: "soil", label: "Soil Moisture", component: SoilMoistureSensor },
  { id: "vibration", label: "Vibration", component: VibrationSensor },
  { id: "tilt", label: "Tilt / MPU6050", component: TiltSensor },
  { id: "crack", label: "Crack Displacement", component: CrackSensor },
];

export function SensorDetail() {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || "soil");

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || SoilMoistureSensor;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: '32px' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "4px 12px",
              borderRadius: "4px",
              fontSize: "11px",
              fontWeight: 600,
              fontFamily: "Barlow, sans-serif",
              letterSpacing: "0.05em",
              backgroundColor: activeTab === tab.id ? "rgba(245, 158, 11, 0.15)" : "var(--bg3)",
              border: `1px solid ${activeTab === tab.id ? "var(--amber)" : "var(--border)"}`,
              color: activeTab === tab.id ? "var(--amber)" : "var(--text)",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            {tab.label.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ height: "16px" }}></div>

      {/* Render the selected sensor component */}
      <ActiveComponent />
    </div>
  );
}