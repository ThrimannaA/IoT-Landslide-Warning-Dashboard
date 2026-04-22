// import { useState } from "react";
// import { StatCard } from "../../components/StatCard";
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
//   ComposedChart,
// } from "recharts";

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

// export function SoilMoistureSensor() {
//   const [supAcked, setSupAcked] = useState(false);
//   const [supAckedTime, setSupAckedTime] = useState("");

//   function handleSupAck() {
//     const t = new Date().toLocaleTimeString("en-GB", {
//       hour: "2-digit", minute: "2-digit", second: "2-digit",
//     });
//     setSupAckedTime(t);
//     setSupAcked(true);
//   }

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//       {/* Stat cards - 3 columns */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
//         <StatCard label="CURRENT VALUE" value="87%" sub="Soil saturation" color="var(--red)" />
//         <StatCard label="30-MIN AVERAGE" value="71%" sub="Trending upward ↑" color="var(--amber)" />
//         <StatCard label="TIME IN CRITICAL" value="4m 22s" sub="Since 14:18:45" color="var(--red)" />
//       </div>

//       <div style={{ height: "20px" }}></div>

//       {/* 30-min trend chart */}
//       <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030" }}>
//         <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: "Barlow, sans-serif" }}>
//           SENSOR TREND — LAST 30 MINUTES
//         </div>
//         <ResponsiveContainer width="100%" height={150}>
//           <AreaChart data={soilData}>
//             <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 51, 71, 0.5)" />
//             <XAxis dataKey="time" stroke="var(--muted)"
//               style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }}
//               tickFormatter={(v) => `${v}m`} />
//             <YAxis domain={[40, 100]} stroke="var(--muted)"
//               style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
//             <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.8}
//               label={{ value: "Critical 80%", position: "insideTopRight", fill: "#ef4444", fontSize: 9, dy: -6 }} />
//             <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.8}
//               label={{ value: "Warning 60%", position: "insideTopRight", fill: "#f59e0b", fontSize: 9, dy: -6 }} />
//             <Area type="monotone" dataKey="value" stroke="#ef4444" fill="rgba(239, 68, 68, 0.08)" strokeWidth={2} />
//           </AreaChart>
//         </ResponsiveContainer>
//       </div>

//       <div style={{ height: "20px" }}></div>

//       {/* Threshold levels */}
//       <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
//         <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: "Barlow, sans-serif" }}>
//           THRESHOLD LEVELS
//         </div>
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//           {[
//             { label: "SAFE", color: "var(--green)", width: "60%", range: "0 – 60%", marker: false },
//             { label: "WARNING", color: "var(--amber)", width: "80%", range: "60 – 80%", marker: false },
//             { label: "CRITICAL", color: "var(--red)", width: "100%", range: "> 80%", marker: true },
//           ].map((t) => (
//             <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//               <div style={{ width: "80px", fontSize: "11px", fontFamily: "Share Tech Mono, monospace", color: t.color, fontWeight: 600 }}>
//                 {t.label}
//               </div>
//               <div style={{ flex: 1, height: "24px", borderRadius: "4px", position: "relative", backgroundColor: "var(--bg3)" }}>
//                 <div style={{ height: "100%", borderRadius: "4px", width: t.width, backgroundColor: t.color }} />
//                 {t.marker && (
//                   <div style={{ position: "absolute", top: "50%", width: "2px", height: "32px", backgroundColor: "white", left: "80%", transform: "translateY(-50%)" }} />
//                 )}
//               </div>
//               <div style={{ fontSize: "11px", fontFamily: "Share Tech Mono, monospace", color: "var(--muted)", width: "80px", textAlign: "right" }}>
//                 {t.range}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div style={{ height: "20px" }}></div>

//       {/* Decision support */}
//       <div style={{ padding: "16px", borderRadius: "8px", backgroundColor: "rgba(239, 68, 68, 0.08)", border: "1px solid var(--red)" }}>
//         <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
//           <div style={{ fontSize: "24px", color: "var(--red)" }}>⬥</div>
//           <div style={{ flex: 1 }}>
//             <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--red)", marginBottom: "8px" }}>
//               Immediate Action Required
//             </div>
//             <div style={{ fontSize: "12px", color: "var(--text)", lineHeight: 1.5 }}>
//               Soil saturation at 87% indicates high landslide risk. Supervisor should consider
//               halting load-bearing work and reinforcing the Zone C perimeter. If tilt also
//               increases, initiate evacuation protocol.
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* STAKEHOLDER SECTIONS */}
//       <div style={{ height: "32px" }}></div>
//       <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px" }}>

//         {/* SUPERVISOR VIEW */}
//         <RoleHeader
//           role="SUPERVISOR VIEW — Operational Decision Support"
//           color="var(--amber)"
//           bg="rgba(245,158,11,0.06)"
//         />

//         {/* Trend + rate of change cards - 3 columns */}
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: "12px" }}>
//           {[
//             { label: "TREND DIRECTION", value: "↑", sub: "Rising", color: "var(--red)", size: "28px" },
//             { label: "RATE OF CHANGE", value: "+2.1%", sub: "per minute", color: "var(--red)", size: "22px" },
//             { label: "EST. TIME TO CRITICAL", value: "~6 min", sub: "if trend continues", color: "var(--amber)", size: "22px" },
//           ].map((c) => (
//             <div key={c.label} style={{ padding: "12px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)", textAlign: "center" }}>
//               <div style={{ fontSize: "9px", color: "var(--muted)", fontFamily: "Barlow, sans-serif", letterSpacing: "0.1em", marginBottom: "4px" }}>
//                 {c.label}
//               </div>
//               <div style={{ fontSize: c.size, color: c.color, fontFamily: "Share Tech Mono, monospace", lineHeight: 1 }}>
//                 {c.value}
//               </div>
//               <div style={{ fontSize: "10px", color: "var(--muted)", fontFamily: "Share Tech Mono, monospace", marginTop: "2px" }}>
//                 {c.sub}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Moisture vs rainfall dual-axis chart */}
//         <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)", marginBottom: "12px" }}>
//           <div style={{
//             fontSize: "10px", fontWeight: 600, color: "var(--muted)",
//             letterSpacing: "0.1em", marginBottom: "8px", fontFamily: "Barlow, sans-serif",
//             display: "flex", justifyContent: "space-between", alignItems: "center",
//           }}>
//             <span>MOISTURE vs RAINFALL CORRELATION</span>
//             <span style={{ fontWeight: 400, fontSize: "9px" }}>
//               <span style={{ color: "#ef4444" }}>— </span>Moisture %  
//               <span style={{ color: "#3b82f6" }}>▪ </span>Rainfall mm/hr
//             </span>
//           </div>
//           <ResponsiveContainer width="100%" height={140}>
//             <ComposedChart data={soilRainfallData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,51,71,0.5)" />
//               <XAxis dataKey="time" stroke="var(--muted)"
//                 style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }}
//                 tickFormatter={(v) => `${v}m`} />
//               <YAxis yAxisId="moisture" domain={[40, 100]} stroke="#ef4444"
//                 style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
//               <YAxis yAxisId="rain" orientation="right" domain={[0, 16]} stroke="#3b82f6"
//                 style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
//               <ReferenceLine yAxisId="moisture" y={80} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.6} />
//               <ReferenceLine yAxisId="moisture" y={60} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.6} />
//               <Bar yAxisId="rain" dataKey="rainfall" fill="rgba(59,130,246,0.25)"
//                 stroke="#3b82f6" strokeWidth={0.5} radius={[2, 2, 0, 0]} />
//               <Line yAxisId="moisture" type="monotone" dataKey="moisture"
//                 stroke="#ef4444" strokeWidth={2} dot={false} />
//             </ComposedChart>
//           </ResponsiveContainer>
//           <div style={{ fontSize: "10px", color: "var(--muted)", marginTop: "8px", fontFamily: "Share Tech Mono, monospace" }}>
//             Rainfall started at 10m mark — moisture rising 8 min later. Correlation confirmed.
//           </div>
//         </div>

//         {/* Supervisor acknowledge alert */}
//         <div style={{
//           padding: "14px", borderRadius: "8px",
//           backgroundColor: supAcked ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.08)",
//           border: `1px solid ${supAcked ? "var(--green)" : "var(--red)"}`,
//           transition: "all 0.3s ease",
//         }}>
//           <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
//             <div style={{ fontSize: "20px", color: supAcked ? "var(--green)" : "var(--red)", marginTop: "2px" }}>
//               {supAcked ? "✓" : "⬥"}
//             </div>
//             <div style={{ flex: 1 }}>
//               <div style={{ fontSize: "12px", fontWeight: 500, color: supAcked ? "var(--green)" : "var(--red)", marginBottom: "4px" }}>
//                 {supAcked ? "Alert Acknowledged" : "Active Alert — Supervisor Response Required"}
//               </div>
//               <div style={{ fontSize: "11px", color: "var(--text)", lineHeight: 1.5, marginBottom: "8px" }}>
//                 Soil moisture at 87% has exceeded the critical threshold (80%). Rainfall is ongoing.
//                 Moisture is rising at +2.1%/min. Estimated to reach 95% in 6 minutes if unchanged.
//               </div>
//               {!supAcked ? (
//                 <button
//                   onClick={handleSupAck}
//                   style={{
//                     fontSize: "9px", fontWeight: 600, fontFamily: "Barlow, sans-serif",
//                     letterSpacing: "0.08em", padding: "4px 14px", borderRadius: "4px",
//                     border: "1px solid var(--red)", background: "transparent",
//                     color: "var(--red)", cursor: "pointer",
//                   }}
//                 >
//                   ACKNOWLEDGE ALERT
//                 </button>
//               ) : (
//                 <div style={{ fontSize: "10px", color: "var(--green)", fontFamily: "Share Tech Mono, monospace" }}>
//                   Acknowledged at {supAckedTime}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* MANAGER VIEW */}
//         <div style={{ height: "32px" }}></div>
//         <RoleHeader
//           role="MANAGER VIEW — Historical Analytics & Reporting"
//           color="#3b82f6"
//           bg="rgba(59,130,246,0.06)"
//         />

//         {/* KPI summary cards - 4 columns */}
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: "12px" }}>
//           {[
//             { label: "7-DAY AVG", value: "54%", color: "var(--amber)" },
//             { label: "7-DAY MAX", value: "87%", color: "var(--red)" },
//             { label: "TOTAL ALERTS", value: "11", color: "var(--red)" },
//             { label: "DAYS ≥ WARNING", value: "4", color: "var(--amber)" },
//           ].map((k) => (
//             <div key={k.label} style={{ padding: "12px", borderRadius: "8px", textAlign: "center", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
//               <div style={{ fontSize: "9px", color: "var(--muted)", fontFamily: "Barlow, sans-serif", letterSpacing: "0.1em", marginBottom: "4px" }}>
//                 {k.label}
//               </div>
//               <div style={{ fontSize: "20px", fontFamily: "Share Tech Mono, monospace", color: k.color, lineHeight: 1 }}>
//                 {k.value}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* 7-day historical chart */}
//         <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)", marginBottom: "12px" }}>
//           <div style={{
//             fontSize: "10px", fontWeight: 600, color: "var(--muted)",
//             letterSpacing: "0.1em", marginBottom: "8px", fontFamily: "Barlow, sans-serif",
//             display: "flex", justifyContent: "space-between",
//           }}>
//             <span>SOIL MOISTURE — 7-DAY HISTORICAL TREND</span>
//             <span style={{ fontWeight: 400, fontSize: "9px" }}>
//               <span style={{ color: "#ef4444" }}>— </span>Max  
//               <span style={{ color: "#f59e0b" }}>— </span>Avg
//             </span>
//           </div>
//           <ResponsiveContainer width="100%" height={140}>
//             <ComposedChart data={soilHistory7d}>
//               <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,51,71,0.5)" />
//               <XAxis dataKey="date" stroke="var(--muted)"
//                 style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
//               <YAxis domain={[0, 100]} stroke="var(--muted)"
//                 style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
//               <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.6} />
//               <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.6} />
//               <Bar dataKey="alerts" fill="rgba(239,68,68,0.15)" radius={[2, 2, 0, 0]} />
//               <Line type="monotone" dataKey="max" stroke="#ef4444" strokeWidth={2} dot={true} />
//               <Line type="monotone" dataKey="avg" stroke="#f59e0b" strokeWidth={2} dot={true} strokeDasharray="4 3" />
//             </ComposedChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Export buttons */}
//         <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
//           <button
//             onClick={() => alert("PDF export — connect to your export logic here")}
//             style={{
//               fontSize: "10px", fontWeight: 600, fontFamily: "Barlow, sans-serif",
//               letterSpacing: "0.08em", padding: "6px 16px", borderRadius: "4px",
//               border: "1px solid #3b82f6", background: "rgba(59,130,246,0.1)",
//               color: "#3b82f6", cursor: "pointer",
//             }}
//           >
//             EXPORT PDF
//           </button>
//           <button
//             onClick={() => alert("CSV export — connect to your export logic here")}
//             style={{
//               fontSize: "10px", fontWeight: 600, fontFamily: "Barlow, sans-serif",
//               letterSpacing: "0.08em", padding: "6px 16px", borderRadius: "4px",
//               border: "1px solid var(--border)", background: "transparent",
//               color: "var(--muted)", cursor: "pointer",
//             }}
//           >
//             EXPORT CSV
//           </button>
//         </div>

//         {/* WORKER VIEW */}
//         <div style={{ height: "32px" }}></div>
//         <RoleHeader
//           role="WORKER VIEW — Personal Safety Alert"
//           color="var(--green)"
//           bg="rgba(34,197,94,0.06)"
//         />

//         {/* DANGER card */}
//         <div style={{
//           padding: "20px", borderRadius: "8px",
//           backgroundColor: "rgba(239,68,68,0.12)",
//           border: "2px solid var(--red)",
//           textAlign: "center",
//         }}>
//           <div style={{
//             fontSize: "48px", fontWeight: 700, color: "var(--red)",
//             lineHeight: 1, marginBottom: "8px",
//             fontFamily: "Barlow, sans-serif", letterSpacing: "0.05em",
//           }}>
//             DANGER
//           </div>
//           <div style={{
//             fontSize: "13px", color: "var(--red)",
//             fontFamily: "Share Tech Mono, monospace",
//             marginBottom: "16px", opacity: 0.85,
//           }}>
//             High soil moisture detected — 87%
//           </div>
//           <div style={{
//             backgroundColor: "rgba(239,68,68,0.15)",
//             border: "1px solid rgba(239,68,68,0.3)",
//             borderRadius: "8px", padding: "12px 16px", marginBottom: "14px",
//           }}>
//             <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", lineHeight: 1.6 }}>
//               Stop work immediately.<br />
//               Move away from the excavation area.<br />
//               Contact your supervisor now.
//             </div>
//           </div>
//           <div style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "Share Tech Mono, monospace" }}>
//             Zone C · Sensor S-01 · Last updated: 14:21:03
//           </div>
//         </div>

//         {/* Safe state preview */}
//         <div style={{
//           padding: "16px", borderRadius: "8px",
//           backgroundColor: "rgba(34,197,94,0.08)",
//           border: "1px solid var(--green)",
//           textAlign: "center", marginTop: "10px",
//         }}>
//           <div style={{ fontSize: "9px", color: "var(--muted)", fontFamily: "Barlow, sans-serif", letterSpacing: "0.1em", marginBottom: "6px" }}>
//             SAFE STATE PREVIEW
//           </div>
//           <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--green)", fontFamily: "Barlow, sans-serif", lineHeight: 1, marginBottom: "4px" }}>
//             SAFE
//           </div>
//           <div style={{ fontSize: "11px", color: "var(--green)", fontFamily: "Share Tech Mono, monospace" }}>
//             Work may continue normally
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { StatCard } from "../../components/StatCard";
import { getAllReadings, getLatestReading } from "../../../services/firebaseService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
  BarChart,
  Bar,
  ReferenceLine,
  ComposedChart,
} from "recharts";

function RoleHeader({ role, color, bg }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "10px",
      padding: "8px 14px", borderRadius: "6px",
      backgroundColor: bg, border: `1px solid ${color}`,
      marginBottom: "12px",
    }}>
      <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: color, flexShrink: 0 }} />
      <div style={{ fontSize: "10px", fontWeight: 600, color, letterSpacing: "0.12em", fontFamily: "Barlow, sans-serif" }}>
        {role}
      </div>
    </div>
  );
}

export function SoilMoistureSensor() {
  const [supAcked, setSupAcked] = useState(false);
  const [supAckedTime, setSupAckedTime] = useState("");
  const [currentMoisture, setCurrentMoisture] = useState(0);
  const [moistureData, setMoistureData] = useState([]);
  const [soilHistory7d, setSoilHistory7d] = useState([]);
  const [soilRainfallData, setSoilRainfallData] = useState([]);
  const [stats, setStats] = useState({
    avg30min: 0,
    timeInCritical: "0m 0s",
    rateOfChange: 0,
    timeToCritical: 0
  });

  useEffect(() => {
    // Get latest reading
    getLatestReading((latest) => {
      if (latest) {
        setCurrentMoisture(latest.soil_20cm || 0);
      }
    });

    // Get all readings for trends
    getAllReadings((readings) => {
      if (readings && readings.length > 0) {
        // Last 30 readings for trend
        const last30 = readings.slice(-30);
        const trendData = last30.map((reading, index) => ({
          time: index,
          value: reading.soil_20cm || 0
        }));
        setMoistureData(trendData);

        // Calculate 30-min average
        const sum = last30.reduce((acc, r) => acc + (r.soil_20cm || 0), 0);
        const avg = sum / last30.length;
        setStats(prev => ({ ...prev, avg30min: Math.round(avg) }));

        // Calculate rate of change (last 5 readings)
        if (last30.length >= 5) {
          const last5 = last30.slice(-5);
          const first = last5[0].soil_20cm || 0;
          const last = last5[4].soil_20cm || 0;
          const rate = (last - first) / 5;
          setStats(prev => ({ ...prev, rateOfChange: rate.toFixed(1) }));
          
          // Estimate time to critical (80%)
          if (rate > 0) {
            const timeTo80 = ((80 - last) / rate) * 5; // minutes
            setStats(prev => ({ ...prev, timeToCritical: Math.max(0, Math.round(timeTo80)) }));
          }
        }

        // Calculate time in critical (soil > 80%)
        let criticalMinutes = 0;
        for (let i = last30.length - 1; i >= 0; i--) {
          if ((last30[i].soil_20cm || 0) > 80) {
            criticalMinutes += 5; // assuming 5 min intervals
          } else {
            break;
          }
        }
        const minutes = criticalMinutes % 60;
        const seconds = 0;
        setStats(prev => ({ ...prev, timeInCritical: `${minutes}m ${seconds}s` }));

        // Prepare 7-day historical data
        const last7Days = readings.slice(-50);
        const dailyData = {};
        last7Days.forEach(reading => {
          const date = new Date(reading.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          if (!dailyData[date]) {
            dailyData[date] = { values: [], max: 0, alerts: 0 };
          }
          const moisture = reading.soil_20cm || 0;
          dailyData[date].values.push(moisture);
          if (moisture > dailyData[date].max) dailyData[date].max = moisture;
          if (moisture > 60) dailyData[date].alerts++;
        });
        
        const historyArray = Object.keys(dailyData).slice(-7).map(date => {
          const values = dailyData[date].values;
          const avg = values.reduce((a, b) => a + b, 0) / values.length;
          return {
            date: date,
            avg: Math.round(avg),
            max: dailyData[date].max,
            alerts: dailyData[date].alerts
          };
        });
        setSoilHistory7d(historyArray);

        // Prepare moisture vs rainfall data (using raindrop as proxy)
        const rainData = last30.map((reading, index) => ({
          time: index,
          moisture: reading.soil_20cm || 0,
          rainfall: reading.raindrop || 0
        }));
        setSoilRainfallData(rainData);
      }
    });
  }, []);

  function handleSupAck() {
    const t = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
    setSupAckedTime(t);
    setSupAcked(true);
  }

  const getStatusColor = () => {
    if (currentMoisture > 80) return "var(--red)";
    if (currentMoisture > 60) return "var(--amber)";
    return "var(--green)";
  };

  const getStatusText = () => {
    if (currentMoisture > 80) return "CRITICAL";
    if (currentMoisture > 60) return "WARNING";
    return "SAFE";
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Stat cards - 3 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <StatCard label="CURRENT VALUE" value={`${currentMoisture}%`} sub="Soil saturation" color={getStatusColor()} />
        <StatCard label="30-MIN AVERAGE" value={`${stats.avg30min}%`} sub={`Trending ${stats.rateOfChange > 0 ? "upward ↑" : stats.rateOfChange < 0 ? "downward ↓" : "stable →"}`} color={stats.rateOfChange > 0 ? "var(--amber)" : "var(--green)"} />
        <StatCard label="TIME IN CRITICAL" value={stats.timeInCritical} sub="Above 80% threshold" color={currentMoisture > 80 ? "var(--red)" : "var(--muted)"} />
      </div>

      <div style={{ height: "20px" }}></div>

      {/* 30-min trend chart */}
      <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030" }}>
        <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: "Barlow, sans-serif" }}>
          SENSOR TREND — LAST 30 READINGS
        </div>
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={moistureData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 51, 71, 0.5)" />
            <XAxis dataKey="time" stroke="var(--muted)"
              style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
            <YAxis domain={[0, 100]} stroke="var(--muted)"
              style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
            <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.8}
              label={{ value: "Critical 80%", position: "insideTopRight", fill: "#ef4444", fontSize: 9, dy: -6 }} />
            <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.8}
              label={{ value: "Warning 60%", position: "insideTopRight", fill: "#f59e0b", fontSize: 9, dy: -6 }} />
            <Area type="monotone" dataKey="value" stroke="#ef4444" fill="rgba(239, 68, 68, 0.08)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ height: "20px" }}></div>

      {/* Threshold levels */}
      <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
        <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: "Barlow, sans-serif" }}>
          THRESHOLD LEVELS
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { label: "SAFE", color: "var(--green)", width: `${Math.min(60, currentMoisture)}%`, range: "0 – 60%", marker: false },
            { label: "WARNING", color: "var(--amber)", width: `${Math.min(80, Math.max(0, currentMoisture - 60))}%`, range: "60 – 80%", marker: false },
            { label: "CRITICAL", color: "var(--red)", width: `${Math.max(0, currentMoisture - 80)}%`, range: "> 80%", marker: currentMoisture > 80 },
          ].map((t) => (
            <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: "80px", fontSize: "11px", fontFamily: "Share Tech Mono, monospace", color: t.color, fontWeight: 600 }}>
                {t.label}
              </div>
              <div style={{ flex: 1, height: "24px", borderRadius: "4px", position: "relative", backgroundColor: "var(--bg3)" }}>
                <div style={{ height: "100%", borderRadius: "4px", width: `${(currentMoisture / 100) * 100}%`, backgroundColor: currentMoisture > 80 ? "var(--red)" : currentMoisture > 60 ? "var(--amber)" : "var(--green)" }} />
                {t.marker && (
                  <div style={{ position: "absolute", top: "50%", width: "2px", height: "32px", backgroundColor: "white", left: `${(80 / 100) * 100}%`, transform: "translateY(-50%)" }} />
                )}
              </div>
              <div style={{ fontSize: "11px", fontFamily: "Share Tech Mono, monospace", color: "var(--muted)", width: "80px", textAlign: "right" }}>
                {t.range}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: "20px" }}></div>

      {/* Decision support */}
      <div style={{ padding: "16px", borderRadius: "8px", backgroundColor: currentMoisture > 80 ? "rgba(239, 68, 68, 0.08)" : currentMoisture > 60 ? "rgba(245, 158, 11, 0.08)" : "rgba(34, 197, 94, 0.08)", border: `1px solid ${getStatusColor()}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ fontSize: "24px", color: getStatusColor() }}>{currentMoisture > 80 ? "⬥" : currentMoisture > 60 ? "⬦" : "●"}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "13px", fontWeight: 500, color: getStatusColor(), marginBottom: "8px" }}>
              {currentMoisture > 80 ? "Immediate Action Required" : currentMoisture > 60 ? "Caution — Monitor Closely" : "Normal Conditions"}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text)", lineHeight: 1.5 }}>
              {currentMoisture > 80 
                ? `Soil saturation at ${currentMoisture}% indicates high landslide risk. Supervisor should consider halting load-bearing work and reinforcing the Zone C perimeter.`
                : currentMoisture > 60 
                ? `Soil moisture at ${currentMoisture}% is approaching critical threshold. Increase monitoring frequency.`
                : `Soil moisture at ${currentMoisture}% is within safe range. Continue routine monitoring.`}
            </div>
          </div>
        </div>
      </div>

      {/* STAKEHOLDER SECTIONS */}
      <div style={{ height: "32px" }}></div>
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px" }}>

        {/* SUPERVISOR VIEW */}
        <RoleHeader role="SUPERVISOR VIEW — Operational Decision Support" color="var(--amber)" bg="rgba(245,158,11,0.06)" />

        {/* Trend + rate of change cards - 3 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: "12px" }}>
          <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)", textAlign: "center" }}>
            <div style={{ fontSize: "9px", color: "var(--muted)", fontFamily: "Barlow, sans-serif", letterSpacing: "0.1em", marginBottom: "4px" }}>TREND DIRECTION</div>
            <div style={{ fontSize: "28px", color: stats.rateOfChange > 0 ? "var(--red)" : stats.rateOfChange < 0 ? "var(--green)" : "var(--muted)", fontFamily: "Share Tech Mono, monospace", lineHeight: 1 }}>{stats.rateOfChange > 0 ? "↑" : stats.rateOfChange < 0 ? "↓" : "→"}</div>
            <div style={{ fontSize: "10px", color: "var(--muted)", fontFamily: "Share Tech Mono, monospace", marginTop: "2px" }}>{stats.rateOfChange > 0 ? "Rising" : stats.rateOfChange < 0 ? "Falling" : "Stable"}</div>
          </div>
          <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)", textAlign: "center" }}>
            <div style={{ fontSize: "9px", color: "var(--muted)", fontFamily: "Barlow, sans-serif", letterSpacing: "0.1em", marginBottom: "4px" }}>RATE OF CHANGE</div>
            <div style={{ fontSize: "22px", color: stats.rateOfChange > 0 ? "var(--red)" : "var(--green)", fontFamily: "Share Tech Mono, monospace", lineHeight: 1 }}>{stats.rateOfChange > 0 ? `+${stats.rateOfChange}` : stats.rateOfChange}%/reading</div>
            <div style={{ fontSize: "10px", color: "var(--muted)", fontFamily: "Share Tech Mono, monospace", marginTop: "2px" }}>per 5 min interval</div>
          </div>
          <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)", textAlign: "center" }}>
            <div style={{ fontSize: "9px", color: "var(--muted)", fontFamily: "Barlow, sans-serif", letterSpacing: "0.1em", marginBottom: "4px" }}>EST. TIME TO CRITICAL</div>
            <div style={{ fontSize: "22px", color: stats.timeToCritical < 30 ? "var(--red)" : "var(--amber)", fontFamily: "Share Tech Mono, monospace", lineHeight: 1 }}>~{stats.timeToCritical} min</div>
            <div style={{ fontSize: "10px", color: "var(--muted)", fontFamily: "Share Tech Mono, monospace", marginTop: "2px" }}>if trend continues</div>
          </div>
        </div>

        {/* Moisture vs rainfall dual-axis chart */}
        <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)", marginBottom: "12px" }}>
          <div style={{
            fontSize: "10px", fontWeight: 600, color: "var(--muted)",
            letterSpacing: "0.1em", marginBottom: "8px", fontFamily: "Barlow, sans-serif",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span>MOISTURE vs RAINFALL CORRELATION</span>
            <span style={{ fontWeight: 400, fontSize: "9px" }}>
              <span style={{ color: "#ef4444" }}>— </span>Moisture %  
              <span style={{ color: "#3b82f6" }}>▪ </span>Rainfall
            </span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <ComposedChart data={soilRainfallData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,51,71,0.5)" />
              <XAxis dataKey="time" stroke="var(--muted)"
                style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
              <YAxis yAxisId="moisture" domain={[0, 100]} stroke="#ef4444"
                style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
              <YAxis yAxisId="rain" orientation="right" domain={[0, 100]} stroke="#3b82f6"
                style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
              <ReferenceLine yAxisId="moisture" y={80} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.6} />
              <ReferenceLine yAxisId="moisture" y={60} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.6} />
              <Bar yAxisId="rain" dataKey="rainfall" fill="rgba(59,130,246,0.25)" stroke="#3b82f6" strokeWidth={0.5} radius={[2, 2, 0, 0]} />
              <Line yAxisId="moisture" type="monotone" dataKey="moisture" stroke="#ef4444" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
          <div style={{ fontSize: "10px", color: "var(--muted)", marginTop: "8px", fontFamily: "Share Tech Mono, monospace" }}>
            Rainfall correlates with moisture rise. {stats.rateOfChange > 0 ? "Moisture currently rising." : "Moisture currently stable."}
          </div>
        </div>

        {/* Supervisor acknowledge alert */}
        <div style={{
          padding: "14px", borderRadius: "8px",
          backgroundColor: supAcked ? "rgba(34,197,94,0.06)" : currentMoisture > 80 ? "rgba(239,68,68,0.08)" : "rgba(245,158,11,0.08)",
          border: `1px solid ${supAcked ? "var(--green)" : currentMoisture > 80 ? "var(--red)" : "var(--amber)"}`,
          transition: "all 0.3s ease",
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ fontSize: "20px", color: supAcked ? "var(--green)" : currentMoisture > 80 ? "var(--red)" : "var(--amber)", marginTop: "2px" }}>
              {supAcked ? "✓" : currentMoisture > 80 ? "⬥" : "⬦"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "12px", fontWeight: 500, color: supAcked ? "var(--green)" : currentMoisture > 80 ? "var(--red)" : "var(--amber)", marginBottom: "4px" }}>
                {supAcked ? "Alert Acknowledged" : currentMoisture > 80 ? "Active Alert — Supervisor Response Required" : "Monitoring Mode — No Immediate Action"}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text)", lineHeight: 1.5, marginBottom: "8px" }}>
                {currentMoisture > 80 
                  ? `Soil moisture at ${currentMoisture}% has exceeded the critical threshold (80%). ${stats.rateOfChange > 0 ? `Rising at ${stats.rateOfChange}%/reading.` : ""}`
                  : currentMoisture > 60
                  ? `Soil moisture at ${currentMoisture}% is above warning threshold (60%). Monitor closely.`
                  : `Soil moisture at ${currentMoisture}% is within safe range.`}
              </div>
              {!supAcked && currentMoisture > 60 && (
                <button
                  onClick={handleSupAck}
                  style={{
                    fontSize: "9px", fontWeight: 600, fontFamily: "Barlow, sans-serif",
                    letterSpacing: "0.08em", padding: "4px 14px", borderRadius: "4px",
                    border: `1px solid ${currentMoisture > 80 ? "var(--red)" : "var(--amber)"}`,
                    background: "transparent",
                    color: currentMoisture > 80 ? "var(--red)" : "var(--amber)",
                    cursor: "pointer",
                  }}
                >
                  ACKNOWLEDGE ALERT
                </button>
              )}
              {supAcked && (
                <div style={{ fontSize: "10px", color: "var(--green)", fontFamily: "Share Tech Mono, monospace" }}>
                  Acknowledged at {supAckedTime}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MANAGER VIEW */}
        <div style={{ height: "32px" }}></div>
        <RoleHeader role="MANAGER VIEW — Historical Analytics & Reporting" color="#3b82f6" bg="rgba(59,130,246,0.06)" />

        {/* KPI summary cards - 4 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: "12px" }}>
          {[
            { label: "7-DAY AVG", value: soilHistory7d.length > 0 ? `${soilHistory7d.reduce((a, b) => a + b.avg, 0) / soilHistory7d.length}%` : "0%", color: "var(--amber)" },
            { label: "7-DAY MAX", value: soilHistory7d.length > 0 ? `${Math.max(...soilHistory7d.map(d => d.max))}%` : "0%", color: "var(--red)" },
            { label: "TOTAL ALERTS", value: soilHistory7d.reduce((a, b) => a + b.alerts, 0), color: "var(--red)" },
            { label: "DAYS ≥ WARNING", value: soilHistory7d.filter(d => d.max >= 60).length, color: "var(--amber)" },
          ].map((k) => (
            <div key={k.label} style={{ padding: "12px", borderRadius: "8px", textAlign: "center", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "9px", color: "var(--muted)", fontFamily: "Barlow, sans-serif", letterSpacing: "0.1em", marginBottom: "4px" }}>{k.label}</div>
              <div style={{ fontSize: "20px", fontFamily: "Share Tech Mono, monospace", color: k.color, lineHeight: 1 }}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* 7-day historical chart */}
        <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)", marginBottom: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", fontFamily: "Barlow, sans-serif" }}>SOIL MOISTURE — 7-DAY HISTORICAL TREND</span>
            <span style={{ fontWeight: 400, fontSize: "9px" }}><span style={{ color: "#ef4444" }}>— </span>Max <span style={{ color: "#f59e0b" }}>— </span>Avg</span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <ComposedChart data={soilHistory7d}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,51,71,0.5)" />
              <XAxis dataKey="date" stroke="var(--muted)" style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
              <YAxis domain={[0, 100]} stroke="var(--muted)" style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
              <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.6} />
              <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.6} />
              <Bar dataKey="alerts" fill="rgba(239,68,68,0.15)" radius={[2, 2, 0, 0]} />
              <Line type="monotone" dataKey="max" stroke="#ef4444" strokeWidth={2} dot={true} />
              <Line type="monotone" dataKey="avg" stroke="#f59e0b" strokeWidth={2} dot={true} strokeDasharray="4 3" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Export buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <button onClick={() => alert("PDF export — connect to your export logic here")} style={{ fontSize: "10px", fontWeight: 600, fontFamily: "Barlow, sans-serif", letterSpacing: "0.08em", padding: "6px 16px", borderRadius: "4px", border: "1px solid #3b82f6", background: "rgba(59,130,246,0.1)", color: "#3b82f6", cursor: "pointer" }}>EXPORT PDF</button>
          <button onClick={() => alert("CSV export — connect to your export logic here")} style={{ fontSize: "10px", fontWeight: 600, fontFamily: "Barlow, sans-serif", letterSpacing: "0.08em", padding: "6px 16px", borderRadius: "4px", border: "1px solid var(--border)", background: "transparent", color: "var(--muted)", cursor: "pointer" }}>EXPORT CSV</button>
        </div>

        {/* WORKER VIEW */}
        <div style={{ height: "32px" }}></div>
        <RoleHeader role="WORKER VIEW — Personal Safety Alert" color="var(--green)" bg="rgba(34,197,94,0.06)" />

        {/* DANGER card */}
        <div style={{
          padding: "20px", borderRadius: "8px",
          backgroundColor: currentMoisture > 80 ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.08)",
          border: `2px solid ${currentMoisture > 80 ? "var(--red)" : "var(--green)"}`,
          textAlign: "center",
        }}>
          <div style={{ fontSize: "48px", fontWeight: 700, color: currentMoisture > 80 ? "var(--red)" : "var(--green)", lineHeight: 1, marginBottom: "8px", fontFamily: "Barlow, sans-serif", letterSpacing: "0.05em" }}>
            {currentMoisture > 80 ? "DANGER" : "SAFE"}
          </div>
          <div style={{ fontSize: "13px", color: currentMoisture > 80 ? "var(--red)" : "var(--green)", fontFamily: "Share Tech Mono, monospace", marginBottom: "16px", opacity: 0.85 }}>
            {currentMoisture > 80 ? `High soil moisture detected — ${currentMoisture}%` : `Soil moisture normal — ${currentMoisture}%`}
          </div>
          <div style={{
            backgroundColor: currentMoisture > 80 ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.1)",
            border: `1px solid ${currentMoisture > 80 ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
            borderRadius: "8px", padding: "12px 16px", marginBottom: "14px",
          }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", lineHeight: 1.6 }}>
              {currentMoisture > 80 
                ? "Stop work immediately.\nMove away from the excavation area.\nContact your supervisor now."
                : "Work may continue normally.\nContinue monitoring conditions.\nReport any changes."}
            </div>
          </div>
          <div style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "Share Tech Mono, monospace" }}>
            Zone C · Sensor S-01 · Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}