// import { useNavigate } from "react-router-dom";
// import { SensorCard } from "../components/SensorCard";
// import { AlertItem } from "../components/AlertItem";
// import { getLatestReading, calculateRiskScore } from "../../services/firebaseService";
// import { useEffect, useState } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   ResponsiveContainer,
//   CartesianGrid,
//   ReferenceLine,
// } from "recharts";
// import { useBrushing } from "../context/BrushingContext";

// export function LiveOverview() {
//   const navigate = useNavigate();
//   const [sensorData, setSensorData] = useState({
//     soil_moisture: 0,
//     crack_width: 0,
//     tilt: 0,
//     vibration: 0,
//     riskScore: 0
//   });
//   const [trendData, setTrendData] = useState([]);

//   useEffect(() => {
//     // Listen for real-time updates
//     getLatestReading((latest) => {
//       if (latest) {
//         setSensorData({
//           soil_moisture: latest.soil_20cm || 0,
//           crack_width: latest.crack_width || 0,
//           tilt: Math.abs(latest.rotation_x) || 0,
//           vibration: Math.abs(latest.acceleration_x) || 0,
//           riskScore: calculateRiskScore(latest)
//         });
//       }
//     });

//     // Load trend data for chart
//     const loadTrendData = async () => {
//       const { getAllReadings } = await import("../../services/firebaseService");
//       getAllReadings((readings) => {
//         if (readings && readings.length > 0) {
//           // Get last 30 readings for trend
//           const last30 = readings.slice(-30);
//           const trend = last30.map((reading, index) => ({
//             time: index,
//             soil: reading.soil_20cm || 0,
//             tilt: Math.abs(reading.rotation_x) || 0,
//             vibration: Math.abs(reading.acceleration_x) || 0,
//             crack: reading.crack_width || 0
//           }));
//           setTrendData(trend);
//         }
//       });
//     };
    
//     loadTrendData();
//   }, []);

//   // Determine status based on values
//   const getSoilStatus = () => {
//     if (sensorData.soil_moisture > 80) return "critical";
//     if (sensorData.soil_moisture > 60) return "warning";
//     return "safe";
//   };
  
//   const getCrackStatus = () => {
//     if (sensorData.crack_width > 5) return "critical";
//     if (sensorData.crack_width > 3.5) return "warning";
//     return "safe";
//   };
  
//   const getTiltStatus = () => {
//     if (sensorData.tilt > 8) return "critical";
//     if (sensorData.tilt > 5) return "warning";
//     return "safe";
//   };
  
//   const getVibrationStatus = () => {
//     if (sensorData.vibration > 0.4) return "critical";
//     if (sensorData.vibration > 0.2) return "warning";
//     return "safe";
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//       {/* Sensor Cards Row - 4 columns */}
//       <div style={{ 
//         display: 'grid', 
//         gridTemplateColumns: 'repeat(4, 1fr)', 
//         gap: '12px'
//       }}>
//         <SensorCard
//           label="SOIL MOISTURE"
//           value={sensorData.soil_moisture}
//           unit="% saturation"
//           status={getSoilStatus()}
//           onClick={() => navigate("/sensors?tab=soil")}
//         />
//         <SensorCard
//           label="VIBRATION"
//           value={sensorData.vibration.toFixed(2)}
//           unit="g-force"
//           status={getVibrationStatus()}
//           onClick={() => navigate("/sensors?tab=vibration")}
//         />
//         <SensorCard
//           label="TILT / MPU6050"
//           value={sensorData.tilt.toFixed(1)}
//           unit="° deviation (X axis)"
//           status={getTiltStatus()}
//           onClick={() => navigate("/sensors?tab=tilt")}
//         />
//         <SensorCard
//           label="CRACK DISPLACEMENT"
//           value={sensorData.crack_width.toFixed(1)}
//           unit="mm gap width (ToF)"
//           status={getCrackStatus()}
//           onClick={() => navigate("/sensors?tab=crack")}
//         />
//       </div>

//       <div style={{ height: '12px' }}></div>

//       {/* Charts Row - 3 columns */}
//       <div style={{ 
//         display: 'grid', 
//         gridTemplateColumns: 'repeat(3, 1fr)', 
//         gap: '12px'
//       }}>
//         {/* Sensor Trend Chart - spans 2 columns */}
//         <div
//           style={{ 
//             gridColumn: 'span 2',
//             padding: '14px',
//             borderRadius: '8px',
//             backgroundColor: "#1A2030"
//           }}
//         >
//           <div
//             style={{
//               fontSize: "10px",
//               fontWeight: 600,
//               color: "var(--muted)",
//               letterSpacing: "0.1em",
//               marginBottom: "8px",
//               fontFamily: "Barlow, sans-serif",
//             }}
//           >
//             SENSOR TREND — LAST 30 READINGS
//           </div>

//           <div
//             style={{
//               display: "flex",
//               gap: "14px",
//               marginBottom: "10px",
//               fontSize: "9px",
//               fontFamily: "Share Tech Mono, monospace",
//               color: "var(--muted)",
//               flexWrap: "wrap",
//             }}
//           >
//             <span><span style={{ color: "#ef4444" }}>●</span> Soil</span>
//             <span><span style={{ color: "#f59e0b" }}>●</span> Tilt</span>
//             <span><span style={{ color: "#3b82f6" }}>●</span> Vibration</span>
//             <span><span style={{ color: "#22c55e" }}>●</span> Crack</span>
//             <span style={{ marginLeft: "auto" }}>
//               <span style={{ color: "#ef4444", opacity: 0.7 }}>— —</span> Critical 80%
//               &nbsp;&nbsp;
//               <span style={{ color: "#f59e0b", opacity: 0.7 }}>— —</span> Warning 60%
//             </span>
//           </div>

//           <ResponsiveContainer width="100%" height={160}>
//             <LineChart data={trendData}>
//               <CartesianGrid
//                 strokeDasharray="3 3"
//                 stroke="rgba(42, 51, 71, 0.5)"
//               />
//               <XAxis
//                 dataKey="time"
//                 stroke="var(--muted)"
//                 style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }}
//               />
//               <YAxis
//                 stroke="var(--muted)"
//                 style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }}
//                 domain={[0, 100]}
//               />
//               <ReferenceLine
//                 y={80}
//                 stroke="#ef4444"
//                 strokeDasharray="4 4"
//                 strokeOpacity={0.8}
//                 label={{
//                   value: "80%",
//                   position: "insideTopRight",
//                   fill: "#ef4444",
//                   fontSize: 9,
//                   fontFamily: "Share Tech Mono, monospace",
//                   dy: -6,
//                 }}
//               />
//               <ReferenceLine
//                 y={60}
//                 stroke="#f59e0b"
//                 strokeDasharray="4 4"
//                 strokeOpacity={0.8}
//                 label={{
//                   value: "60%",
//                   position: "insideTopRight",
//                   fill: "#f59e0b",
//                   fontSize: 9,
//                   fontFamily: "Share Tech Mono, monospace",
//                   dy: -6,
//                 }}
//               />
//               <Line type="monotone" dataKey="soil" stroke="#ef4444" strokeWidth={2} dot={false} />
//               <Line type="monotone" dataKey="tilt" stroke="#f59e0b" strokeWidth={2} dot={false} />
//               <Line type="monotone" dataKey="vibration" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
//               <Line type="monotone" dataKey="crack" stroke="#22c55e" strokeWidth={2} dot={false} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Composite Risk Score */}
//         <div
//           style={{
//             padding: "14px",
//             borderRadius: "8px",
//             backgroundColor: "#1A2030",
//             border: "1px solid var(--border)"
//           }}
//         >
//           <div
//             style={{
//               fontSize: "10px",
//               fontWeight: 600,
//               color: "var(--muted)",
//               letterSpacing: "0.1em",
//               marginBottom: "12px",
//               fontFamily: "Barlow, sans-serif",
//             }}
//           >
//             COMPOSITE RISK SCORE
//           </div>

//           <div style={{ textAlign: "center", marginBottom: "12px" }}>
//             <div style={{ fontSize: "38px", fontFamily: "Share Tech Mono, monospace", color: sensorData.riskScore > 70 ? "var(--red)" : sensorData.riskScore > 50 ? "var(--amber)" : "var(--green)", lineHeight: 1 }}>
//               {sensorData.riskScore}
//             </div>
//             <div style={{ fontSize: "10px", color: "var(--muted)", fontFamily: "Share Tech Mono, monospace", marginTop: "4px" }}>
//               / 100 — {sensorData.riskScore > 70 ? "HIGH RISK" : sensorData.riskScore > 50 ? "MEDIUM RISK" : "LOW RISK"}
//             </div>
//           </div>

//           <div style={{ position: "relative", marginBottom: "8px" }}>
//             <div
//               style={{
//                 height: "6px",
//                 borderRadius: "999px",
//                 background: "linear-gradient(to right, #22c55e 0%, #22c55e 33%, #f59e0b 33%, #f59e0b 66%, #ef4444 66%, #ef4444 100%)",
//               }}
//             />
//             <div
//               style={{
//                 position: "absolute",
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 width: "8px",
//                 height: "8px",
//                 borderRadius: "50%",
//                 backgroundColor: "white",
//                 left: `${sensorData.riskScore}%`,
//                 marginLeft: "-4px"
//               }}
//             />
//           </div>

//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               marginBottom: "12px",
//               fontSize: "9px",
//               fontFamily: "Share Tech Mono, monospace",
//               color: "var(--muted)"
//             }}
//           >
//             <span>SAFE</span>
//             <span>WARN</span>
//             <span>CRITICAL</span>
//           </div>

//           <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
//             {[
//               { label: "Soil", value: `${sensorData.soil_moisture}%`, color: getSoilStatus() === "critical" ? "var(--red)" : getSoilStatus() === "warning" ? "var(--amber)" : "var(--green)" },
//               { label: "Vib", value: `${sensorData.vibration.toFixed(2)}g`, color: getVibrationStatus() === "critical" ? "var(--red)" : getVibrationStatus() === "warning" ? "var(--amber)" : "var(--green)" },
//               { label: "Tilt", value: `${sensorData.tilt.toFixed(1)}°`, color: getTiltStatus() === "critical" ? "var(--red)" : getTiltStatus() === "warning" ? "var(--amber)" : "var(--green)" },
//               { label: "Crack", value: `${sensorData.crack_width.toFixed(1)}mm`, color: getCrackStatus() === "critical" ? "var(--red)" : getCrackStatus() === "warning" ? "var(--amber)" : "var(--green)" },
//             ].map((stat) => (
//               <div
//                 key={stat.label}
//                 style={{
//                   padding: "8px",
//                   borderRadius: "4px",
//                   textAlign: "center",
//                   backgroundColor: "var(--bg3)"
//                 }}
//               >
//                 <div style={{ fontSize: "9px", color: "var(--muted)", marginBottom: "2px" }}>
//                   {stat.label}
//                 </div>
//                 <div style={{ fontSize: "14px", fontFamily: "Share Tech Mono, monospace", color: stat.color }}>
//                   {stat.value}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div style={{ height: "12px" }}></div>

//       {/* Alerts + Site Map Row - 2 columns */}
//       <div style={{ 
//         display: 'grid', 
//         gridTemplateColumns: 'repeat(2, 1fr)', 
//         gap: '12px'
//       }}>
//         {/* Active Alerts - Generated dynamically */}
//         <div
//           style={{
//             padding: "14px",
//             borderRadius: "8px",
//             backgroundColor: "#1A2030",
//             border: "1px solid var(--border)"
//           }}
//         >
//           <div
//             style={{
//               fontSize: "10px",
//               fontWeight: 600,
//               color: "var(--muted)",
//               letterSpacing: "0.1em",
//               marginBottom: "12px",
//               fontFamily: "Barlow, sans-serif",
//             }}
//           >
//             ACTIVE ALERTS
//           </div>
          
//           {sensorData.soil_moisture > 80 && (
//             <>
//               <AlertItem
//                 severity="critical"
//                 message={`Soil moisture exceeded critical threshold (${sensorData.soil_moisture}% > 80%)`}
//                 timestamp={new Date().toLocaleTimeString()}
//                 location="Sensor S-01 Zone B"
//               />
//               <div style={{ height: "8px" }}></div>
//             </>
//           )}
          
//           {sensorData.tilt > 7 && (
//             <>
//               <AlertItem
//                 severity="warning"
//                 message={`Tilt angle approaching warning limit (${sensorData.tilt.toFixed(1)}° of 10° limit)`}
//                 timestamp={new Date().toLocaleTimeString()}
//                 location="MPU6050 Node 2"
//               />
//               <div style={{ height: "8px" }}></div>
//             </>
//           )}
          
//           {sensorData.vibration > 0.3 && (
//             <AlertItem
//               severity="warning"
//               message={`Vibration spike detected — possible excavation impact (${sensorData.vibration.toFixed(2)}g)`}
//               timestamp={new Date().toLocaleTimeString()}
//               location="SW-420 Node A"
//             />
//           )}
          
//           {sensorData.soil_moisture <= 80 && sensorData.tilt <= 7 && sensorData.vibration <= 0.3 && (
//             <div style={{ textAlign: "center", padding: "20px", color: "var(--green)" }}>
//               ✓ No active alerts. All systems normal.
//             </div>
//           )}
//         </div>

//         {/* Site Map - same as before */}
//         <div
//           style={{
//             padding: "14px",
//             borderRadius: "8px",
//             backgroundColor: "#1A2030",
//             border: "1px solid var(--border)"
//           }}
//         >
//           <div
//             style={{
//               fontSize: "10px",
//               fontWeight: 600,
//               color: "var(--muted)",
//               letterSpacing: "0.1em",
//               marginBottom: "12px",
//               fontFamily: "Barlow, sans-serif",
//             }}
//           >
//             SITE MAP — SENSOR LOCATIONS
//           </div>

//           <div
//             style={{
//               borderRadius: "6px",
//               padding: "16px",
//               position: "relative",
//               backgroundColor: "var(--bg3)",
//               height: "220px"
//             }}
//           >
//             <div
//               style={{
//                 position: "absolute",
//                 inset: "16px",
//                 borderRadius: "4px",
//                 border: "2px dashed white"
//               }}
//             >
//               {/* Block A */}
//               <div
//                 style={{
//                   position: "absolute",
//                   top: "8px",
//                   left: "8px",
//                   width: "240px",
//                   height: "64px",
//                   border: `1px dashed ${getCrackStatus() === "critical" ? "var(--red)" : getCrackStatus() === "warning" ? "var(--amber)" : "var(--green)"}`,
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                   transition: "background 0.2s"
//                 }}
//                 onClick={() => navigate("/sensors?tab=crack")}
//                 onMouseEnter={e => (e.currentTarget.style.background = "rgba(59,130,246,0.08)")}
//                 onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
//               >
//                 <div style={{ fontSize: "9px", color: "var(--blue)", padding: "4px" }}>
//                   Block A
//                 </div>
//                 <div style={{ fontSize: "8px", color: "var(--muted)", paddingLeft: "4px", fontFamily: "Share Tech Mono, monospace" }}>
//                   Crack · {getCrackStatus().toUpperCase()} {getCrackStatus() === "critical" ? "🔴" : getCrackStatus() === "warning" ? "🟠" : "🟢"}
//                 </div>
//                 <div style={{ position: "absolute", bottom: "8px", right: "8px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: getCrackStatus() === "critical" ? "var(--red)" : getCrackStatus() === "warning" ? "var(--amber)" : "var(--green)", border: "2px solid var(--bg3)" }} />
//               </div>

//               {/* Block B */}
//               <div
//                 style={{
//                   position: "absolute",
//                   top: "8px",
//                   right: "8px",
//                   width: "160px",
//                   height: "64px",
//                   border: `1px dashed ${getTiltStatus() === "critical" ? "var(--red)" : getTiltStatus() === "warning" ? "var(--amber)" : "var(--green)"}`,
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                   transition: "background 0.2s"
//                 }}
//                 onClick={() => navigate("/sensors?tab=tilt")}
//                 onMouseEnter={e => (e.currentTarget.style.background = "rgba(245,158,11,0.08)")}
//                 onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
//               >
//                 <div style={{ fontSize: "9px", color: "var(--amber)", padding: "4px" }}>
//                   Block B
//                 </div>
//                 <div style={{ fontSize: "8px", color: "var(--muted)", paddingLeft: "4px", fontFamily: "Share Tech Mono, monospace" }}>
//                   Tilt · {getTiltStatus().toUpperCase()} {getTiltStatus() === "critical" ? "🔴" : getTiltStatus() === "warning" ? "🟠" : "🟢"}
//                 </div>
//                 <div style={{ position: "absolute", bottom: "8px", left: "8px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: getTiltStatus() === "critical" ? "var(--red)" : getTiltStatus() === "warning" ? "var(--amber)" : "var(--green)", border: "2px solid var(--bg3)" }} />
//               </div>

//               {/* Zone C */}
//               <div
//                 style={{
//                   position: "absolute",
//                   bottom: "8px",
//                   left: "8px",
//                   right: "8px",
//                   height: "80px",
//                   border: `2px dashed ${getSoilStatus() === "critical" ? "var(--red)" : getSoilStatus() === "warning" ? "var(--amber)" : "var(--green)"}`,
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                   transition: "background 0.2s"
//                 }}
//                 onClick={() => navigate("/sensors?tab=soil")}
//                 onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
//                 onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
//               >
//                 <div style={{ fontSize: "9px", color: "var(--red)", fontWeight: 600, padding: "4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                   <span>Zone C — {getSoilStatus() === "critical" ? "HIGH RISK" : getSoilStatus() === "warning" ? "MEDIUM RISK" : "LOW RISK"}</span>
//                   <span style={{ fontSize: "8px", fontFamily: "Share Tech Mono, monospace", fontWeight: 400, color: "var(--muted)", paddingRight: "4px" }}>
//                     tap to inspect ↗
//                   </span>
//                 </div>
//                 <div style={{ position: "absolute", top: "40px", left: "16px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: getSoilStatus() === "critical" ? "var(--red)" : getSoilStatus() === "warning" ? "var(--amber)" : "var(--green)", border: "2px solid var(--bg3)" }} />
//                 <div style={{ position: "absolute", top: "40px", right: "16px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: getVibrationStatus() === "critical" ? "var(--red)" : getVibrationStatus() === "warning" ? "var(--amber)" : "var(--green)", border: "2px solid var(--bg3)" }} />
//               </div>
//             </div>
//           </div>

//           {/* Legend */}
//           <div
//             style={{
//               display: "flex",
//               gap: "12px",
//               marginTop: "8px",
//               fontSize: "9px",
//               fontFamily: "Share Tech Mono, monospace",
//               color: "var(--muted)"
//             }}
//           >
//             <span><span style={{ color: "var(--red)" }}>●</span> Soil</span>
//             <span><span style={{ color: "var(--amber)" }}>●</span> Vibration</span>
//             <span><span style={{ color: "var(--amber)" }}>●</span> Tilt</span>
//             <span><span style={{ color: "var(--green)" }}>●</span> Crack</span>
//             <span style={{ marginLeft: "auto", opacity: 0.6 }}>click zone to inspect</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useNavigate } from "react-router-dom";
import { SensorCard } from "../components/SensorCard";
import { AlertItem } from "../components/AlertItem";
import { SafetyRecommendations } from "../components/SafetyRecommendations";
import { getLatestReading, calculateRiskScore, getAllReadings } from "../../services/firebaseService";
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  Area,
  ComposedChart,
  BarChart,
  Bar,
  Tooltip,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { useBrushing } from "../context/BrushingContext";
import { Activity, TrendingUp, AlertTriangle, Info, Download, Filter, Brain } from "lucide-react";

// ─── Narrative Annotation Component ─────────────────────────────────────────
function NarrativeAnnotation({ title, content, color, icon }) {
  return (
    <div style={{
      padding: '14px 18px',
      borderRadius: '10px',
      backgroundColor: `${color}10`,
      borderLeft: `4px solid ${color}`,
      marginBottom: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontSize: '16px' }}>{icon}</span>
        <span style={{ fontSize: '13px', fontWeight: 700, color }}>{title}</span>
      </div>
      <div style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.6 }}>
        {content}
      </div>
    </div>
  );
}

// ─── Comparative View Component (for assignment requirement) ────────────────
function ComparativeView({ currentData, historicalData }) {
  const [selectedComparison, setSelectedComparison] = useState("all");
  
  const comparisonStats = useMemo(() => {
    if (!historicalData || historicalData.length === 0) return null;
    
    const avgSoil = historicalData.reduce((sum, r) => sum + (r.soil || 0), 0) / historicalData.length;
    const avgCrack = historicalData.reduce((sum, r) => sum + (r.crack || 0), 0) / historicalData.length;
    const avgTilt = historicalData.reduce((sum, r) => sum + (r.tilt || 0), 0) / historicalData.length;
    
    return {
      soil: { current: currentData.soil_moisture, historical: Math.round(avgSoil), change: currentData.soil_moisture - avgSoil },
      crack: { current: currentData.crack_width, historical: avgCrack.toFixed(1), change: (currentData.crack_width - avgCrack).toFixed(1) },
      tilt: { current: currentData.tilt, historical: avgTilt.toFixed(1), change: (currentData.tilt - avgTilt).toFixed(1) }
    };
  }, [currentData, historicalData]);
  
  return (
    <div style={{ marginTop: "16px", padding: "16px", backgroundColor: "var(--bg3)", borderRadius: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <Activity size={14} style={{ color: "var(--blue)" }} />
        <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em" }}>
          COMPARATIVE ANALYSIS — Current vs Historical Average
        </span>
      </div>
      
      {comparisonStats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          <div style={{ textAlign: "center", padding: "10px", backgroundColor: "var(--bg2)", borderRadius: "8px" }}>
            <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "4px" }}>Soil Moisture</div>
            <div style={{ fontSize: "22px", fontWeight: 600, color: comparisonStats.soil.change > 5 ? "var(--red)" : comparisonStats.soil.change < -5 ? "var(--green)" : "var(--text)" }}>
              {comparisonStats.soil.current}%
            </div>
            <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px" }}>
              {comparisonStats.soil.change > 0 ? `↑ +${comparisonStats.soil.change.toFixed(1)}%` : `↓ ${comparisonStats.soil.change.toFixed(1)}%`} vs avg
            </div>
          </div>
          <div style={{ textAlign: "center", padding: "10px", backgroundColor: "var(--bg2)", borderRadius: "8px" }}>
            <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "4px" }}>Crack Width</div>
            <div style={{ fontSize: "22px", fontWeight: 600, color: comparisonStats.crack.change > 0.5 ? "var(--red)" : "var(--text)" }}>
              {comparisonStats.crack.current}mm
            </div>
            <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px" }}>
              {comparisonStats.crack.change > 0 ? `↑ +${comparisonStats.crack.change}mm` : `↓ ${comparisonStats.crack.change}mm`} vs avg
            </div>
          </div>
          <div style={{ textAlign: "center", padding: "10px", backgroundColor: "var(--bg2)", borderRadius: "8px" }}>
            <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "4px" }}>Tilt Angle</div>
            <div style={{ fontSize: "22px", fontWeight: 600, color: comparisonStats.tilt.change > 1 ? "var(--amber)" : "var(--text)" }}>
              {comparisonStats.tilt.current}°
            </div>
            <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px" }}>
              {comparisonStats.tilt.change > 0 ? `↑ +${comparisonStats.tilt.change}°` : `↓ ${comparisonStats.tilt.change}°`} vs avg
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Anomaly Detector Component (for assignment requirement) ────────────────
function AnomalyDetector({ readings, currentData }) {
  const [anomalies, setAnomalies] = useState([]);
  
  useEffect(() => {
    if (!readings || readings.length < 10) return;
    
    const detected = [];
    const recentValues = readings.slice(-10);
    const historicalValues = readings.slice(-30, -10);
    
    // Detect soil moisture anomalies
    const recentSoil = recentValues.map(r => r.soil || 0);
    const histSoil = historicalValues.map(r => r.soil || 0);
    const avgSoil = histSoil.reduce((a, b) => a + b, 0) / histSoil.length;
    const stdSoil = Math.sqrt(histSoil.map(x => Math.pow(x - avgSoil, 2)).reduce((a, b) => a + b, 0) / histSoil.length);
    const currentSoil = currentData.soil_moisture;
    
    if (Math.abs(currentSoil - avgSoil) > 2 * stdSoil) {
      detected.push({
        sensor: "Soil Moisture",
        message: `Unusual value: ${currentSoil}% (normal range: ${(avgSoil - stdSoil).toFixed(0)}-${(avgSoil + stdSoil).toFixed(0)}%)`,
        severity: currentSoil > avgSoil + 2 * stdSoil ? "critical" : "warning",
        chart: "Sensor Trend Chart"
      });
    }
    
    // Detect crack anomalies
    const recentCrack = recentValues.map(r => r.crack || 0);
    const histCrack = historicalValues.map(r => r.crack || 0);
    const avgCrack = histCrack.reduce((a, b) => a + b, 0) / histCrack.length;
    const stdCrack = Math.sqrt(histCrack.map(x => Math.pow(x - avgCrack, 2)).reduce((a, b) => a + b, 0) / histCrack.length);
    const currentCrack = currentData.crack_width;
    
    if (Math.abs(currentCrack - avgCrack) > 2 * stdCrack) {
      detected.push({
        sensor: "Crack Width",
        message: `Unusual measurement: ${currentCrack}mm (normal: ${(avgCrack - stdCrack).toFixed(1)}-${(avgCrack + stdCrack).toFixed(1)}mm)`,
        severity: currentCrack > avgCrack + 2 * stdCrack ? "critical" : "warning",
        chart: "Crack Displacement tab"
      });
    }
    
    // Detect tilt anomalies
    const recentTilt = recentValues.map(r => r.tilt || 0);
    const histTilt = historicalValues.map(r => r.tilt || 0);
    const avgTilt = histTilt.reduce((a, b) => a + b, 0) / histTilt.length;
    const stdTilt = Math.sqrt(histTilt.map(x => Math.pow(x - avgTilt, 2)).reduce((a, b) => a + b, 0) / histTilt.length);
    const currentTilt = currentData.tilt;
    
    if (Math.abs(currentTilt - avgTilt) > 2 * stdTilt) {
      detected.push({
        sensor: "Tilt Angle",
        message: `Sudden change: ${currentTilt.toFixed(1)}° (normal: ${(avgTilt - stdTilt).toFixed(1)}-${(avgTilt + stdTilt).toFixed(1)}°)`,
        severity: currentTilt > avgTilt + 2 * stdTilt ? "critical" : "warning",
        chart: "Tilt Sensor tab"
      });
    }
    
    setAnomalies(detected);
  }, [readings, currentData]);
  
  if (anomalies.length === 0) return null;
  
  return (
    <div style={{ marginTop: "12px", padding: "14px", backgroundColor: "rgba(239,68,68,0.08)", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.3)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <AlertTriangle size={14} style={{ color: "var(--amber)" }} />
        <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--amber)", letterSpacing: "0.1em" }}>
          ANOMALY DETECTION — Statistical Outliers Identified
        </span>
      </div>
      {anomalies.map((anomaly, idx) => (
        <div key={idx} style={{ fontSize: "12px", color: "var(--text)", marginBottom: "8px", paddingLeft: "14px" }}>
          • <span style={{ color: anomaly.severity === "critical" ? "var(--red)" : "var(--amber)", fontWeight: 600 }}>{anomaly.sensor}</span>: {anomaly.message}
          <span style={{ fontSize: "10px", color: "var(--muted)", marginLeft: "8px" }}>— View on {anomaly.chart}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Correlation Panel (for assignment requirement) ─────────────────────────
function CorrelationPanel({ readings }) {
  const [correlations, setCorrelations] = useState(null);
  
  useEffect(() => {
    if (!readings || readings.length < 20) return;
    
    const n = readings.length;
    const soilVals = readings.map(r => r.soil || 0);
    const crackVals = readings.map(r => r.crack || 0);
    const tiltVals = readings.map(r => r.tilt || 0);
    const vibVals = readings.map(r => r.vibration || 0);
    
    const calculateCorr = (arr1, arr2) => {
      const mean1 = arr1.reduce((a,b) => a+b,0)/n;
      const mean2 = arr2.reduce((a,b) => a+b,0)/n;
      let num=0, den1=0, den2=0;
      for(let i=0; i<n; i++) {
        num += (arr1[i]-mean1)*(arr2[i]-mean2);
        den1 += Math.pow(arr1[i]-mean1,2);
        den2 += Math.pow(arr2[i]-mean2,2);
      }
      return den1*den2 === 0 ? 0 : (num/Math.sqrt(den1*den2)).toFixed(2);
    };
    
    setCorrelations([
      { pair: "Soil → Crack", value: calculateCorr(soilVals, crackVals), color: "#22c55e", description: "Higher soil moisture often leads to crack widening" },
      { pair: "Soil → Tilt", value: calculateCorr(soilVals, tiltVals), color: "#f59e0b", description: "Wet soil can cause structural tilting" },
      { pair: "Crack → Tilt", value: calculateCorr(crackVals, tiltVals), color: "#ef4444", description: "Crack propagation may affect structural alignment" },
      { pair: "Vibration → Crack", value: calculateCorr(vibVals, crackVals), color: "#8b5cf6", description: "Heavy vibration accelerates crack growth" }
    ]);
  }, [readings]);
  
  if (!correlations) return null;
  
  return (
    <div style={{ marginTop: "16px", padding: "16px", backgroundColor: "var(--bg3)", borderRadius: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
        <TrendingUp size={14} style={{ color: "var(--blue)" }} />
        <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em" }}>
          SENSOR CORRELATIONS — Pearson Coefficient
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
        {correlations.map((corr, idx) => (
          <div key={idx} style={{ backgroundColor: "var(--bg2)", padding: "10px 14px", borderRadius: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "12px", color: "var(--text)" }}>{corr.pair}</span>
              <span style={{ fontSize: "12px", fontWeight: 700, color: corr.color }}>r = {corr.value}</span>
            </div>
            <div style={{ height: "5px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ width: `${Math.abs(corr.value) * 100}%`, height: "100%", backgroundColor: corr.color, borderRadius: "3px" }} />
            </div>
            <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "5px" }}>{corr.description}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "10px", textAlign: "center" }}>
        💡 |r| &gt; 0.7 = Strong correlation | 0.4-0.7 = Moderate | &lt; 0.4 = Weak
      </div>
    </div>
  );
}

// ─── Radar Chart Component (Multi-dimensional analysis) ─────────────────────
function MultiSensorRadar({ currentData }) {
  const radarData = [
    { metric: "Soil Moisture", value: currentData.soil_moisture, fullMark: 100 },
    { metric: "Crack Width", value: Math.min(currentData.crack_width * 20, 100), fullMark: 100 },
    { metric: "Tilt Angle", value: Math.min(currentData.tilt * 10, 100), fullMark: 100 },
    { metric: "Vibration", value: Math.min(currentData.vibration * 250, 100), fullMark: 100 },
  ];
  
  return (
    <div style={{ marginTop: "16px", padding: "16px", backgroundColor: "var(--bg3)", borderRadius: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <Activity size={14} style={{ color: "var(--purple)" }} />
        <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em" }}>
          MULTI-DIMENSIONAL ANALYSIS — Sensor State Radar
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: "var(--muted)", fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "var(--muted)", fontSize: 10 }} />
          <Radar name="Current State" dataKey="value" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LiveOverview() {
  const navigate = useNavigate();
  
  // ─── Brushing & Linking from Context ──────────────────────────────────────
  const { linkedTimestamp, brushPoint, clearBrush } = useBrushing();
  
  const [sensorData, setSensorData] = useState({
    soil_moisture: 0,
    crack_width: 0,
    tilt: 0,
    vibration: 0,
    riskScore: 0
  });
  const [trendData, setTrendData] = useState([]);
  const [allReadings, setAllReadings] = useState([]);

  useEffect(() => {
    // Listen for real-time updates
    getLatestReading((latest) => {
      if (latest) {
        setSensorData({
          soil_moisture: latest.soil_20cm || 0,
          crack_width: latest.crack_width || 0,
          tilt: Math.abs(latest.rotation_x) || 0,
          vibration: Math.abs(latest.acceleration_x) || 0,
          riskScore: calculateRiskScore(latest)
        });
      }
    });

    // Load trend data for chart
    const loadTrendData = async () => {
      const { getAllReadings } = await import("../../services/firebaseService");
      getAllReadings((readings) => {
        if (readings && readings.length > 0) {
          // Get last 30 readings for trend
          const last30 = readings.slice(-30);
          const trend = last30.map((reading, index) => ({
            time: index,
            timestamp: reading.timestamp,
            soil: reading.soil_20cm || 0,
            tilt: Math.abs(reading.rotation_x) || 0,
            vibration: Math.abs(reading.acceleration_x) || 0,
            crack: reading.crack_width || 0
          }));
          setTrendData(trend);
          setAllReadings(trend);
        }
      });
    };
    
    loadTrendData();
  }, []);

  // ─── Chart Click Handler for Brushing ─────────────────────────────────────
  const handleChartClick = (data) => {
    if (data?.activePayload?.[0]?.payload) {
      const payload = data.activePayload[0].payload;
      brushPoint(payload.time, {
        time: payload.time,
        timestamp: payload.timestamp,
        soil: payload.soil,
        tilt: payload.tilt,
        vibration: payload.vibration,
        crack: payload.crack
      });
    }
  };

  // Determine status based on values
  const getSoilStatus = () => {
    if (sensorData.soil_moisture > 80) return "critical";
    if (sensorData.soil_moisture > 60) return "warning";
    return "safe";
  };
  
  const getCrackStatus = () => {
    if (sensorData.crack_width > 5) return "critical";
    if (sensorData.crack_width > 3.5) return "warning";
    return "safe";
  };
  
  const getTiltStatus = () => {
    if (sensorData.tilt > 8) return "critical";
    if (sensorData.tilt > 5) return "warning";
    return "safe";
  };
  
  const getVibrationStatus = () => {
    if (sensorData.vibration > 0.4) return "critical";
    if (sensorData.vibration > 0.2) return "warning";
    return "safe";
  };

  // Export data for CSV
  const exportData = () => {
    const headers = ["Timestamp", "Soil (%)", "Crack (mm)", "Tilt (°)", "Vibration (g)", "Risk Score"];
    const rows = trendData.map(d => [
      d.timestamp,
      d.soil,
      d.crack,
      d.tilt,
      d.vibration,
      calculateRiskScore({ soil_20cm: d.soil, crack_width: d.crack, rotation_x: d.tilt, acceleration_x: d.vibration })
    ]);
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sensor_data_${new Date().toISOString().slice(0, 19)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Generate Narrative Content ──────────────────────────────────────────
  const getNarrativeContent = () => {
    const soil = sensorData.soil_moisture;
    const tilt = sensorData.tilt;
    const crack = sensorData.crack_width;
    const vib = sensorData.vibration;
    
    if (soil > 80 || tilt > 8 || crack > 5) {
      return `🚨 CRITICAL STATUS: Soil moisture at ${soil}% ${soil > 80 ? '(exceeds 80% threshold)' : ''}, tilt at ${tilt.toFixed(1)}° ${tilt > 8 ? '(exceeds 8° limit)' : ''}, crack width at ${crack.toFixed(1)}mm ${crack > 5 ? '(exceeds 5mm limit)' : ''}. IMMEDIATE EVACUATION of Zone C required. Notify site supervisor and safety officer now.`;
    } else if (soil > 60 || tilt > 5 || crack > 3.5 || vib > 0.2) {
      return `⚠️ WARNING STATUS: ${soil > 60 ? `Soil moisture at ${soil}% (above 60% warning threshold). ` : ''}${tilt > 5 ? `Tilt at ${tilt.toFixed(1)}° (approaching 8° limit). ` : ''}${crack > 3.5 ? `Crack width at ${crack.toFixed(1)}mm. ` : ''}${vib > 0.2 ? `Elevated vibration at ${vib.toFixed(2)}g. ` : ''}Schedule inspection within 24 hours and increase monitoring frequency.`;
    } else {
      return `✅ SAFE STATUS: All parameters within normal ranges. Soil moisture: ${soil}%, Tilt: ${tilt.toFixed(1)}°, Crack: ${crack.toFixed(1)}mm, Vibration: ${vib.toFixed(2)}g. Continue routine monitoring every 30 minutes.`;
    }
  };

  const getNarrativeColor = () => {
    if (sensorData.soil_moisture > 80 || sensorData.tilt > 8 || sensorData.crack_width > 5) return "var(--red)";
    if (sensorData.soil_moisture > 60 || sensorData.tilt > 5 || sensorData.crack_width > 3.5 || sensorData.vibration > 0.2) return "var(--amber)";
    return "var(--green)";
  };

  const getNarrativeIcon = () => {
    if (sensorData.soil_moisture > 80 || sensorData.tilt > 8 || sensorData.crack_width > 5) return "🚨";
    if (sensorData.soil_moisture > 60 || sensorData.tilt > 5 || sensorData.crack_width > 3.5 || sensorData.vibration > 0.2) return "⚠️";
    return "✅";
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      
      {/* ─── NARRATIVE ANNOTATION (Visual Storytelling) ─────────────────────── */}
      <NarrativeAnnotation
        title="VISUAL NARRATIVE — Current Situation"
        content={getNarrativeContent()}
        color={getNarrativeColor()}
        icon={getNarrativeIcon()}
      />

      {/* ─── BRUSHING STATUS BAR ────────────────────────────────────────────── */}
      {linkedTimestamp !== null && (
        <div style={{
          padding: '8px 14px',
          borderRadius: '6px',
          backgroundColor: '#8b5cf620',
          border: '1px solid #8b5cf6',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px'
        }}>
          <span style={{ color: '#8b5cf6' }}>
            🔗 Linked to reading #{linkedTimestamp}
          </span>
          <button
            onClick={clearBrush}
            style={{
              background: 'none',
              border: 'none',
              color: '#8b5cf6',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            Clear ✕
          </button>
        </div>
      )}

      {/* Sensor Cards Row - 4 columns */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '12px'
      }}>
        <SensorCard
          label="SOIL MOISTURE"
          value={sensorData.soil_moisture}
          unit="% saturation"
          status={getSoilStatus()}
          onClick={() => navigate("/sensors?tab=soil")}
        />
        <SensorCard
          label="VIBRATION"
          value={sensorData.vibration.toFixed(2)}
          unit="g-force"
          status={getVibrationStatus()}
          onClick={() => navigate("/sensors?tab=vibration")}
        />
        <SensorCard
          label="TILT / MPU6050"
          value={sensorData.tilt.toFixed(1)}
          unit="° deviation (X axis)"
          status={getTiltStatus()}
          onClick={() => navigate("/sensors?tab=tilt")}
        />
        <SensorCard
          label="CRACK DISPLACEMENT"
          value={sensorData.crack_width.toFixed(1)}
          unit="mm gap width (ToF)"
          status={getCrackStatus()}
          onClick={() => navigate("/sensors?tab=crack")}
        />
      </div>

      {/* Export Button Row */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button
          onClick={exportData}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '12px',
            backgroundColor: 'var(--bg3)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            cursor: 'pointer'
          }}
        >
          <Download size={13} /> Export CSV
        </button>
        <button
          onClick={() => navigate("/ml-predictions")}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '12px',
            backgroundColor: 'rgba(139,92,246,0.15)',
            border: '1px solid #8b5cf6',
            color: '#8b5cf6',
            cursor: 'pointer'
          }}
        >
          <Brain size={13} /> ML Predictions
        </button>
      </div>

      <div style={{ height: '12px' }}></div>

      {/* Charts Row - 3 columns */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '12px'
      }}>
        {/* Sensor Trend Chart - spans 2 columns */}
        <div
          style={{ 
            gridColumn: 'span 2',
            padding: '14px',
            borderRadius: '8px',
            backgroundColor: "#1A2030"
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--muted)",
              letterSpacing: "0.1em",
              marginBottom: "8px",
              fontFamily: "Barlow, sans-serif",
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <span>SENSOR TREND — LAST 30 READINGS</span>
            <span style={{ fontSize: "11px", fontWeight: 400 }}>
              💡 Click any point to link across dashboard
            </span>
          </div>

          <div
            style={{
              display: "flex",
              gap: "14px",
              marginBottom: "10px",
              fontSize: "11px",
              fontFamily: "Share Tech Mono, monospace",
              color: "var(--muted)",
              flexWrap: "wrap",
            }}
          >
            <span><span style={{ color: "#ef4444" }}>●</span> Soil</span>
            <span><span style={{ color: "#f59e0b" }}>●</span> Tilt</span>
            <span><span style={{ color: "#3b82f6" }}>●</span> Vibration</span>
            <span><span style={{ color: "#22c55e" }}>●</span> Crack</span>
            <span style={{ marginLeft: "auto" }}>
              <span style={{ color: "#ef4444", opacity: 0.7 }}>— —</span> Critical 80%
              &nbsp;&nbsp;
              <span style={{ color: "#f59e0b", opacity: 0.7 }}>— —</span> Warning 60%
            </span>
          </div>

          <ResponsiveContainer width="100%" height={160}>
            <LineChart 
              data={trendData} 
              onClick={handleChartClick}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(42, 51, 71, 0.5)"
              />
              <XAxis
                dataKey="time"
                stroke="var(--muted)"
                style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }}
              />
              <YAxis
                stroke="var(--muted)"
                style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }}
                domain={[0, 100]}
              />
              
              {/* Brushing & Linking - Reference Line */}
              {linkedTimestamp !== null && (
                <ReferenceLine 
                  x={linkedTimestamp} 
                  stroke="#8b5cf6" 
                  strokeWidth={2} 
                  strokeDasharray="6 4"
                  label={{
                    value: "🔗 Linked",
                    position: "top",
                    fill: "#8b5cf6",
                    fontSize: 9
                  }}
                />
              )}
              
              {/* Threshold Reference Lines */}
              <ReferenceLine
                y={80}
                stroke="#ef4444"
                strokeDasharray="4 4"
                strokeOpacity={0.8}
                label={{
                  value: "80%",
                  position: "insideTopRight",
                  fill: "#ef4444",
                  fontSize: 9,
                  fontFamily: "Share Tech Mono, monospace",
                  dy: -6,
                }}
              />
              <ReferenceLine
                y={60}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                strokeOpacity={0.8}
                label={{
                  value: "60%",
                  position: "insideTopRight",
                  fill: "#f59e0b",
                  fontSize: 9,
                  fontFamily: "Share Tech Mono, monospace",
                  dy: -6,
                }}
              />
              
              <Line type="monotone" dataKey="soil" stroke="#ef4444" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: "#ef4444", stroke: "#fff", strokeWidth: 2 }} />
              <Line type="monotone" dataKey="tilt" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 5, fill: "#f59e0b", stroke: "#fff", strokeWidth: 2 }} />
              <Line type="monotone" dataKey="vibration" stroke="#3b82f6" strokeWidth={1.5} dot={false} activeDot={{ r: 5, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }} />
              <Line type="monotone" dataKey="crack" stroke="#22c55e" strokeWidth={2} dot={false} activeDot={{ r: 5, fill: "#22c55e", stroke: "#fff", strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
          
          <div style={{ fontSize: "11px", color: "var(--muted)", textAlign: "center", marginTop: "8px" }}>
            🖱️ Hover over lines → click any point to highlight across all dashboard panels
          </div>
        </div>

        {/* Composite Risk Score */}
        <div
          style={{
            padding: "14px",
            borderRadius: "8px",
            backgroundColor: "#1A2030",
            border: "1px solid var(--border)"
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--muted)",
              letterSpacing: "0.1em",
              marginBottom: "14px",
              fontFamily: "Barlow, sans-serif",
            }}
          >
            COMPOSITE RISK SCORE
          </div>

          <div style={{ textAlign: "center", marginBottom: "14px" }}>
            <div style={{ fontSize: "42px", fontFamily: "Share Tech Mono, monospace", color: sensorData.riskScore > 70 ? "var(--red)" : sensorData.riskScore > 50 ? "var(--amber)" : "var(--green)", lineHeight: 1 }}>
              {sensorData.riskScore}
            </div>
            <div style={{ fontSize: "12px", color: "var(--muted)", fontFamily: "Share Tech Mono, monospace", marginTop: "6px" }}>
              / 100 — {sensorData.riskScore > 70 ? "HIGH RISK" : sensorData.riskScore > 50 ? "MEDIUM RISK" : "LOW RISK"}
            </div>
          </div>

          <div style={{ position: "relative", marginBottom: "8px" }}>
            <div
              style={{
                height: "6px",
                borderRadius: "999px",
                background: "linear-gradient(to right, #22c55e 0%, #22c55e 33%, #f59e0b 33%, #f59e0b 66%, #ef4444 66%, #ef4444 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "white",
                left: `${sensorData.riskScore}%`,
                marginLeft: "-4px"
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "14px",
              fontSize: "11px",
              fontFamily: "Share Tech Mono, monospace",
              color: "var(--muted)"
            }}
          >
            <span>SAFE</span>
            <span>WARN</span>
            <span>CRITICAL</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
            {[
              { label: "Soil", value: `${sensorData.soil_moisture}%`, color: getSoilStatus() === "critical" ? "var(--red)" : getSoilStatus() === "warning" ? "var(--amber)" : "var(--green)" },
              { label: "Vib", value: `${sensorData.vibration.toFixed(2)}g`, color: getVibrationStatus() === "critical" ? "var(--red)" : getVibrationStatus() === "warning" ? "var(--amber)" : "var(--green)" },
              { label: "Tilt", value: `${sensorData.tilt.toFixed(1)}°`, color: getTiltStatus() === "critical" ? "var(--red)" : getTiltStatus() === "warning" ? "var(--amber)" : "var(--green)" },
              { label: "Crack", value: `${sensorData.crack_width.toFixed(1)}mm`, color: getCrackStatus() === "critical" ? "var(--red)" : getCrackStatus() === "warning" ? "var(--amber)" : "var(--green)" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  textAlign: "center",
                  backgroundColor: "var(--bg3)"
                }}
              >
                <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "4px" }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: "15px", fontFamily: "Share Tech Mono, monospace", color: stat.color, fontWeight: 600 }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== NEW ASSIGNMENT FEATURES ADDED BELOW ========== */}

      {/* 1. COMPARATIVE VIEW - Current vs Historical */}
      <ComparativeView currentData={sensorData} historicalData={allReadings} />

      {/* 2. ANOMALY DETECTION - Statistical outlier detection */}
      <AnomalyDetector readings={allReadings} currentData={sensorData} />

      {/* 3. CORRELATION PANEL - Sensor relationships analysis */}
      <CorrelationPanel readings={allReadings} />

      {/* 4. MULTI-DIMENSIONAL RADAR CHART */}
      <MultiSensorRadar currentData={sensorData} />

      <div style={{ height: "12px" }}></div>

      {/* Alerts + Site Map Row - 2 columns */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '12px'
      }}>
        {/* Active Alerts - Generated dynamically */}
        <div
          style={{
            padding: "14px",
            borderRadius: "8px",
            backgroundColor: "#1A2030",
            border: "1px solid var(--border)"
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--muted)",
              letterSpacing: "0.1em",
              marginBottom: "14px",
              fontFamily: "Barlow, sans-serif",
            }}
          >
            ACTIVE ALERTS
          </div>
          
          {sensorData.soil_moisture > 80 && (
            <>
              <AlertItem
                severity="critical"
                message={`Soil moisture exceeded critical threshold (${sensorData.soil_moisture}% > 80%)`}
                timestamp={new Date().toLocaleTimeString()}
                location="Sensor S-01 Zone B"
              />
              <div style={{ height: "8px" }}></div>
            </>
          )}
          
          {sensorData.tilt > 7 && (
            <>
              <AlertItem
                severity="warning"
                message={`Tilt angle approaching warning limit (${sensorData.tilt.toFixed(1)}° of 10° limit)`}
                timestamp={new Date().toLocaleTimeString()}
                location="MPU6050 Node 2"
              />
              <div style={{ height: "8px" }}></div>
            </>
          )}
          
          {sensorData.vibration > 0.3 && (
            <AlertItem
              severity="warning"
              message={`Vibration spike detected — possible excavation impact (${sensorData.vibration.toFixed(2)}g)`}
              timestamp={new Date().toLocaleTimeString()}
              location="SW-420 Node A"
            />
          )}
          
          {sensorData.soil_moisture <= 80 && sensorData.tilt <= 7 && sensorData.vibration <= 0.3 && (
            <div style={{ textAlign: "center", padding: "24px", color: "var(--green)", fontSize: "14px" }}>
              ✓ No active alerts. All systems normal.
            </div>
          )}
        </div>

        {/* Site Map */}
        <div
          style={{
            padding: "14px",
            borderRadius: "8px",
            backgroundColor: "#1A2030",
            border: "1px solid var(--border)"
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--muted)",
              letterSpacing: "0.1em",
              marginBottom: "14px",
              fontFamily: "Barlow, sans-serif",
            }}
          >
            SITE MAP — SENSOR LOCATIONS
          </div>

          <div
            style={{
              borderRadius: "6px",
              padding: "16px",
              position: "relative",
              backgroundColor: "var(--bg3)",
              height: "220px"
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "16px",
                borderRadius: "4px",
                border: "2px dashed white"
              }}
            >
              {/* Block A */}
              <div
                style={{
                  position: "absolute",
                  top: "8px",
                  left: "8px",
                  width: "240px",
                  height: "64px",
                  border: `1px dashed ${getCrackStatus() === "critical" ? "var(--red)" : getCrackStatus() === "warning" ? "var(--amber)" : "var(--green)"}`,
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onClick={() => navigate("/sensors?tab=crack")}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(59,130,246,0.08)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ fontSize: "9px", color: "var(--blue)", padding: "4px" }}>
                  Block A
                </div>
                <div style={{ fontSize: "8px", color: "var(--muted)", paddingLeft: "4px", fontFamily: "Share Tech Mono, monospace" }}>
                  Crack · {getCrackStatus().toUpperCase()} {getCrackStatus() === "critical" ? "🔴" : getCrackStatus() === "warning" ? "🟠" : "🟢"}
                </div>
                <div style={{ position: "absolute", bottom: "8px", right: "8px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: getCrackStatus() === "critical" ? "var(--red)" : getCrackStatus() === "warning" ? "var(--amber)" : "var(--green)", border: "2px solid var(--bg3)" }} />
              </div>

              {/* Block B */}
              <div
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  width: "160px",
                  height: "64px",
                  border: `1px dashed ${getTiltStatus() === "critical" ? "var(--red)" : getTiltStatus() === "warning" ? "var(--amber)" : "var(--green)"}`,
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onClick={() => navigate("/sensors?tab=tilt")}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(245,158,11,0.08)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ fontSize: "9px", color: "var(--amber)", padding: "4px" }}>
                  Block B
                </div>
                <div style={{ fontSize: "8px", color: "var(--muted)", paddingLeft: "4px", fontFamily: "Share Tech Mono, monospace" }}>
                  Tilt · {getTiltStatus().toUpperCase()} {getTiltStatus() === "critical" ? "🔴" : getTiltStatus() === "warning" ? "🟠" : "🟢"}
                </div>
                <div style={{ position: "absolute", bottom: "8px", left: "8px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: getTiltStatus() === "critical" ? "var(--red)" : getTiltStatus() === "warning" ? "var(--amber)" : "var(--green)", border: "2px solid var(--bg3)" }} />
              </div>

              {/* Zone C */}
              <div
                style={{
                  position: "absolute",
                  bottom: "8px",
                  left: "8px",
                  right: "8px",
                  height: "80px",
                  border: `2px dashed ${getSoilStatus() === "critical" ? "var(--red)" : getSoilStatus() === "warning" ? "var(--amber)" : "var(--green)"}`,
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onClick={() => navigate("/sensors?tab=soil")}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ fontSize: "9px", color: "var(--red)", fontWeight: 600, padding: "4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Zone C — {getSoilStatus() === "critical" ? "HIGH RISK" : getSoilStatus() === "warning" ? "MEDIUM RISK" : "LOW RISK"}</span>
                  <span style={{ fontSize: "8px", fontFamily: "Share Tech Mono, monospace", fontWeight: 400, color: "var(--muted)", paddingRight: "4px" }}>
                    tap to inspect ↗
                  </span>
                </div>
                <div style={{ position: "absolute", top: "40px", left: "16px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: getSoilStatus() === "critical" ? "var(--red)" : getSoilStatus() === "warning" ? "var(--amber)" : "var(--green)", border: "2px solid var(--bg3)" }} />
                <div style={{ position: "absolute", top: "40px", right: "16px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: getVibrationStatus() === "critical" ? "var(--red)" : getVibrationStatus() === "warning" ? "var(--amber)" : "var(--green)", border: "2px solid var(--bg3)" }} />
              </div>
            </div>
          </div>

          {/* Legend */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "10px",
              fontSize: "11px",
              fontFamily: "Share Tech Mono, monospace",
              color: "var(--muted)"
            }}
          >
            <span><span style={{ color: "var(--red)" }}>●</span> Soil</span>
            <span><span style={{ color: "var(--amber)" }}>●</span> Vibration</span>
            <span><span style={{ color: "var(--amber)" }}>●</span> Tilt</span>
            <span><span style={{ color: "var(--green)" }}>●</span> Crack</span>
            <span style={{ marginLeft: "auto", opacity: 0.6 }}>click zone to inspect</span>
          </div>
        </div>
      </div>

      {/* UX Footer - Assignment requirement documentation */}

      {/* ─── SAFETY RECOMMENDATIONS ──────────────────────────────────────────── */}
      <SafetyRecommendations
        riskLevel={
          sensorData.riskScore > 70 || sensorData.soil_moisture > 80 || sensorData.tilt > 8 || sensorData.crack_width > 5
            ? "critical"
            : sensorData.riskScore > 50 || sensorData.soil_moisture > 60 || sensorData.tilt > 5 || sensorData.crack_width > 3.5 || sensorData.vibration > 0.2
            ? "warning"
            : "safe"
        }
      />
    </div>
  );
}

// The corrected one

// import { useNavigate } from "react-router-dom";
// import { SensorCard } from "../components/SensorCard";
// import { AlertItem } from "../components/AlertItem";
// import { getLatestReading, calculateRiskScore } from "../../services/firebaseService";
// import { useEffect, useState } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   ResponsiveContainer,
//   CartesianGrid,
//   ReferenceLine,
// } from "recharts";
// import { useBrushing } from "../context/BrushingContext";

// // ─── Narrative Annotation Component ─────────────────────────────────────────
// function NarrativeAnnotation({ title, content, color, icon }) {
//   return (
//     <div style={{
//       padding: '12px 16px',
//       borderRadius: '8px',
//       backgroundColor: `${color}10`,
//       borderLeft: `3px solid ${color}`,
//       marginBottom: '12px'
//     }}>
//       <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
//         <span>{icon}</span>
//         <span style={{ fontSize: '11px', fontWeight: 600, color }}>{title}</span>
//       </div>
//       <div style={{ fontSize: '11px', color: 'var(--text)', lineHeight: 1.5 }}>
//         {content}
//       </div>
//     </div>
//   );
// }

// export function LiveOverview() {
//   const navigate = useNavigate();
  
//   // ─── Brushing & Linking from Context ──────────────────────────────────────
//   const { linkedTimestamp, brushPoint, clearBrush } = useBrushing();
  
//   const [sensorData, setSensorData] = useState({
//     soil_moisture: 0,
//     crack_width: 0,
//     tilt: 0,
//     vibration: 0,
//     riskScore: 0
//   });
//   const [trendData, setTrendData] = useState([]);

//   useEffect(() => {
//     // Listen for real-time updates
//     getLatestReading((latest) => {
//       if (latest) {
//         setSensorData({
//           soil_moisture: latest.soil_20cm || 0,
//           crack_width: latest.crack_width || 0,
//           tilt: Math.abs(latest.rotation_x) || 0,
//           vibration: Math.abs(latest.acceleration_x) || 0,
//           riskScore: calculateRiskScore(latest)
//         });
//       }
//     });

//     // Load trend data for chart
//     const loadTrendData = async () => {
//       const { getAllReadings } = await import("../../services/firebaseService");
//       getAllReadings((readings) => {
//         if (readings && readings.length > 0) {
//           // Get last 30 readings for trend
//           const last30 = readings.slice(-30);
//           const trend = last30.map((reading, index) => ({
//             time: index,
//             timestamp: reading.timestamp,  // Keep timestamp for brushing
//             soil: reading.soil_20cm || 0,
//             tilt: Math.abs(reading.rotation_x) || 0,
//             vibration: Math.abs(reading.acceleration_x) || 0,
//             crack: reading.crack_width || 0
//           }));
//           setTrendData(trend);
//         }
//       });
//     };
    
//     loadTrendData();
//   }, []);

//   // ─── Chart Click Handler for Brushing ─────────────────────────────────────
//   const handleChartClick = (data) => {
//     if (data?.activePayload?.[0]?.payload) {
//       const payload = data.activePayload[0].payload;
//       brushPoint(payload.time, {
//         time: payload.time,
//         timestamp: payload.timestamp,
//         soil: payload.soil,
//         tilt: payload.tilt,
//         vibration: payload.vibration,
//         crack: payload.crack
//       });
//     }
//   };

//   // Determine status based on values
//   const getSoilStatus = () => {
//     if (sensorData.soil_moisture > 80) return "critical";
//     if (sensorData.soil_moisture > 60) return "warning";
//     return "safe";
//   };
  
//   const getCrackStatus = () => {
//     if (sensorData.crack_width > 5) return "critical";
//     if (sensorData.crack_width > 3.5) return "warning";
//     return "safe";
//   };
  
//   const getTiltStatus = () => {
//     if (sensorData.tilt > 8) return "critical";
//     if (sensorData.tilt > 5) return "warning";
//     return "safe";
//   };
  
//   const getVibrationStatus = () => {
//     if (sensorData.vibration > 0.4) return "critical";
//     if (sensorData.vibration > 0.2) return "warning";
//     return "safe";
//   };

//   // ─── Generate Narrative Content ──────────────────────────────────────────
//   const getNarrativeContent = () => {
//     const soil = sensorData.soil_moisture;
//     const tilt = sensorData.tilt;
//     const crack = sensorData.crack_width;
//     const vib = sensorData.vibration;
    
//     if (soil > 80 || tilt > 8 || crack > 5) {
//       return `⚠️ CRITICAL STATUS: Soil moisture at ${soil}% ${soil > 80 ? '(exceeds 80% threshold)' : ''}, tilt at ${tilt.toFixed(1)}° ${tilt > 8 ? '(exceeds 8° limit)' : ''}, crack width at ${crack.toFixed(1)}mm ${crack > 5 ? '(exceeds 5mm limit)' : ''}. IMMEDIATE EVACUATION of Zone C required. Notify site supervisor and safety officer now.`;
//     } else if (soil > 60 || tilt > 5 || crack > 3.5 || vib > 0.2) {
//       return `⚠️ WARNING STATUS: ${soil > 60 ? `Soil moisture at ${soil}% (above 60% warning threshold). ` : ''}${tilt > 5 ? `Tilt at ${tilt.toFixed(1)}° (approaching 8° limit). ` : ''}${crack > 3.5 ? `Crack width at ${crack.toFixed(1)}mm. ` : ''}${vib > 0.2 ? `Elevated vibration at ${vib.toFixed(2)}g. ` : ''}Schedule inspection within 24 hours and increase monitoring frequency.`;
//     } else {
//       return `✅ SAFE STATUS: All parameters within normal ranges. Soil moisture: ${soil}%, Tilt: ${tilt.toFixed(1)}°, Crack: ${crack.toFixed(1)}mm, Vibration: ${vib.toFixed(2)}g. Continue routine monitoring every 30 minutes.`;
//     }
//   };

//   const getNarrativeColor = () => {
//     if (sensorData.soil_moisture > 80 || sensorData.tilt > 8 || sensorData.crack_width > 5) return "var(--red)";
//     if (sensorData.soil_moisture > 60 || sensorData.tilt > 5 || sensorData.crack_width > 3.5 || sensorData.vibration > 0.2) return "var(--amber)";
//     return "var(--green)";
//   };

//   const getNarrativeIcon = () => {
//     if (sensorData.soil_moisture > 80 || sensorData.tilt > 8 || sensorData.crack_width > 5) return "🚨";
//     if (sensorData.soil_moisture > 60 || sensorData.tilt > 5 || sensorData.crack_width > 3.5 || sensorData.vibration > 0.2) return "⚠️";
//     return "✅";
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      
//       {/* ─── NARRATIVE ANNOTATION (Visual Storytelling) ─────────────────────── */}
//       <NarrativeAnnotation
//         title="VISUAL NARRATIVE — Current Situation"
//         content={getNarrativeContent()}
//         color={getNarrativeColor()}
//         icon={getNarrativeIcon()}
//       />

//       {/* ─── BRUSHING STATUS BAR (shows when a point is linked) ─────────────── */}
//       {linkedTimestamp !== null && (
//         <div style={{
//           padding: '8px 14px',
//           borderRadius: '6px',
//           backgroundColor: '#8b5cf620',
//           border: '1px solid #8b5cf6',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           fontSize: '11px'
//         }}>
//           <span style={{ color: '#8b5cf6' }}>
//             🔗 Linked to reading #{linkedTimestamp}
//           </span>
//           <button
//             onClick={clearBrush}
//             style={{
//               background: 'none',
//               border: 'none',
//               color: '#8b5cf6',
//               cursor: 'pointer',
//               fontSize: '12px'
//             }}
//           >
//             Clear ✕
//           </button>
//         </div>
//       )}

//       {/* Sensor Cards Row - 4 columns */}
//       <div style={{ 
//         display: 'grid', 
//         gridTemplateColumns: 'repeat(4, 1fr)', 
//         gap: '12px'
//       }}>
//         <SensorCard
//           label="SOIL MOISTURE"
//           value={sensorData.soil_moisture}
//           unit="% saturation"
//           status={getSoilStatus()}
//           onClick={() => navigate("/sensors?tab=soil")}
//         />
//         <SensorCard
//           label="VIBRATION"
//           value={sensorData.vibration.toFixed(2)}
//           unit="g-force"
//           status={getVibrationStatus()}
//           onClick={() => navigate("/sensors?tab=vibration")}
//         />
//         <SensorCard
//           label="TILT / MPU6050"
//           value={sensorData.tilt.toFixed(1)}
//           unit="° deviation (X axis)"
//           status={getTiltStatus()}
//           onClick={() => navigate("/sensors?tab=tilt")}
//         />
//         <SensorCard
//           label="CRACK DISPLACEMENT"
//           value={sensorData.crack_width.toFixed(1)}
//           unit="mm gap width (ToF)"
//           status={getCrackStatus()}
//           onClick={() => navigate("/sensors?tab=crack")}
//         />
//       </div>

//       <div style={{ height: '12px' }}></div>

//       {/* Charts Row - 3 columns */}
//       <div style={{ 
//         display: 'grid', 
//         gridTemplateColumns: 'repeat(3, 1fr)', 
//         gap: '12px'
//       }}>
//         {/* Sensor Trend Chart - spans 2 columns */}
//         <div
//           style={{ 
//             gridColumn: 'span 2',
//             padding: '14px',
//             borderRadius: '8px',
//             backgroundColor: "#1A2030"
//           }}
//         >
//           <div
//             style={{
//               fontSize: "10px",
//               fontWeight: 600,
//               color: "var(--muted)",
//               letterSpacing: "0.1em",
//               marginBottom: "8px",
//               fontFamily: "Barlow, sans-serif",
//               display: "flex",
//               justifyContent: "space-between"
//             }}
//           >
//             <span>SENSOR TREND — LAST 30 READINGS</span>
//             <span style={{ fontSize: "9px", fontWeight: 400 }}>
//               💡 Click any point to link across dashboard
//             </span>
//           </div>

//           <div
//             style={{
//               display: "flex",
//               gap: "14px",
//               marginBottom: "10px",
//               fontSize: "9px",
//               fontFamily: "Share Tech Mono, monospace",
//               color: "var(--muted)",
//               flexWrap: "wrap",
//             }}
//           >
//             <span><span style={{ color: "#ef4444" }}>●</span> Soil</span>
//             <span><span style={{ color: "#f59e0b" }}>●</span> Tilt</span>
//             <span><span style={{ color: "#3b82f6" }}>●</span> Vibration</span>
//             <span><span style={{ color: "#22c55e" }}>●</span> Crack</span>
//             <span style={{ marginLeft: "auto" }}>
//               <span style={{ color: "#ef4444", opacity: 0.7 }}>— —</span> Critical 80%
//               &nbsp;&nbsp;
//               <span style={{ color: "#f59e0b", opacity: 0.7 }}>— —</span> Warning 60%
//             </span>
//           </div>

//           <ResponsiveContainer width="100%" height={160}>
//             <LineChart 
//               data={trendData} 
//               onClick={handleChartClick}
//             >
//               <CartesianGrid
//                 strokeDasharray="3 3"
//                 stroke="rgba(42, 51, 71, 0.5)"
//               />
//               <XAxis
//                 dataKey="time"
//                 stroke="var(--muted)"
//                 style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }}
//               />
//               <YAxis
//                 stroke="var(--muted)"
//                 style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }}
//                 domain={[0, 100]}
//               />
              
//               {/* Brushing & Linking - Reference Line */}
//               {linkedTimestamp !== null && (
//                 <ReferenceLine 
//                   x={linkedTimestamp} 
//                   stroke="#8b5cf6" 
//                   strokeWidth={2} 
//                   strokeDasharray="6 4"
//                   label={{
//                     value: "🔗 Linked",
//                     position: "top",
//                     fill: "#8b5cf6",
//                     fontSize: 9
//                   }}
//                 />
//               )}
              
//               {/* Threshold Reference Lines */}
//               <ReferenceLine
//                 y={80}
//                 stroke="#ef4444"
//                 strokeDasharray="4 4"
//                 strokeOpacity={0.8}
//                 label={{
//                   value: "80%",
//                   position: "insideTopRight",
//                   fill: "#ef4444",
//                   fontSize: 9,
//                   fontFamily: "Share Tech Mono, monospace",
//                   dy: -6,
//                 }}
//               />
//               <ReferenceLine
//                 y={60}
//                 stroke="#f59e0b"
//                 strokeDasharray="4 4"
//                 strokeOpacity={0.8}
//                 label={{
//                   value: "60%",
//                   position: "insideTopRight",
//                   fill: "#f59e0b",
//                   fontSize: 9,
//                   fontFamily: "Share Tech Mono, monospace",
//                   dy: -6,
//                 }}
//               />
              
//               <Line type="monotone" dataKey="soil" stroke="#ef4444" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: "#ef4444", stroke: "#fff", strokeWidth: 2 }} />
//               <Line type="monotone" dataKey="tilt" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 5, fill: "#f59e0b", stroke: "#fff", strokeWidth: 2 }} />
//               <Line type="monotone" dataKey="vibration" stroke="#3b82f6" strokeWidth={1.5} dot={false} activeDot={{ r: 5, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }} />
//               <Line type="monotone" dataKey="crack" stroke="#22c55e" strokeWidth={2} dot={false} activeDot={{ r: 5, fill: "#22c55e", stroke: "#fff", strokeWidth: 2 }} />
//             </LineChart>
//           </ResponsiveContainer>
          
//           {/* Hint text for brushing */}
//           <div style={{ fontSize: "8px", color: "var(--muted)", textAlign: "center", marginTop: "8px" }}>
//             🖱️ Hover over lines → click any point to highlight across all dashboard panels
//           </div>
//         </div>

//         {/* Composite Risk Score */}
//         <div
//           style={{
//             padding: "14px",
//             borderRadius: "8px",
//             backgroundColor: "#1A2030",
//             border: "1px solid var(--border)"
//           }}
//         >
//           <div
//             style={{
//               fontSize: "10px",
//               fontWeight: 600,
//               color: "var(--muted)",
//               letterSpacing: "0.1em",
//               marginBottom: "12px",
//               fontFamily: "Barlow, sans-serif",
//             }}
//           >
//             COMPOSITE RISK SCORE
//           </div>

//           <div style={{ textAlign: "center", marginBottom: "12px" }}>
//             <div style={{ fontSize: "38px", fontFamily: "Share Tech Mono, monospace", color: sensorData.riskScore > 70 ? "var(--red)" : sensorData.riskScore > 50 ? "var(--amber)" : "var(--green)", lineHeight: 1 }}>
//               {sensorData.riskScore}
//             </div>
//             <div style={{ fontSize: "10px", color: "var(--muted)", fontFamily: "Share Tech Mono, monospace", marginTop: "4px" }}>
//               / 100 — {sensorData.riskScore > 70 ? "HIGH RISK" : sensorData.riskScore > 50 ? "MEDIUM RISK" : "LOW RISK"}
//             </div>
//           </div>

//           <div style={{ position: "relative", marginBottom: "8px" }}>
//             <div
//               style={{
//                 height: "6px",
//                 borderRadius: "999px",
//                 background: "linear-gradient(to right, #22c55e 0%, #22c55e 33%, #f59e0b 33%, #f59e0b 66%, #ef4444 66%, #ef4444 100%)",
//               }}
//             />
//             <div
//               style={{
//                 position: "absolute",
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 width: "8px",
//                 height: "8px",
//                 borderRadius: "50%",
//                 backgroundColor: "white",
//                 left: `${sensorData.riskScore}%`,
//                 marginLeft: "-4px"
//               }}
//             />
//           </div>

//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               marginBottom: "12px",
//               fontSize: "9px",
//               fontFamily: "Share Tech Mono, monospace",
//               color: "var(--muted)"
//             }}
//           >
//             <span>SAFE</span>
//             <span>WARN</span>
//             <span>CRITICAL</span>
//           </div>

//           <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
//             {[
//               { label: "Soil", value: `${sensorData.soil_moisture}%`, color: getSoilStatus() === "critical" ? "var(--red)" : getSoilStatus() === "warning" ? "var(--amber)" : "var(--green)" },
//               { label: "Vib", value: `${sensorData.vibration.toFixed(2)}g`, color: getVibrationStatus() === "critical" ? "var(--red)" : getVibrationStatus() === "warning" ? "var(--amber)" : "var(--green)" },
//               { label: "Tilt", value: `${sensorData.tilt.toFixed(1)}°`, color: getTiltStatus() === "critical" ? "var(--red)" : getTiltStatus() === "warning" ? "var(--amber)" : "var(--green)" },
//               { label: "Crack", value: `${sensorData.crack_width.toFixed(1)}mm`, color: getCrackStatus() === "critical" ? "var(--red)" : getCrackStatus() === "warning" ? "var(--amber)" : "var(--green)" },
//             ].map((stat) => (
//               <div
//                 key={stat.label}
//                 style={{
//                   padding: "8px",
//                   borderRadius: "4px",
//                   textAlign: "center",
//                   backgroundColor: "var(--bg3)"
//                 }}
//               >
//                 <div style={{ fontSize: "9px", color: "var(--muted)", marginBottom: "2px" }}>
//                   {stat.label}
//                 </div>
//                 <div style={{ fontSize: "14px", fontFamily: "Share Tech Mono, monospace", color: stat.color }}>
//                   {stat.value}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div style={{ height: "12px" }}></div>

//       {/* Alerts + Site Map Row - 2 columns */}
//       <div style={{ 
//         display: 'grid', 
//         gridTemplateColumns: 'repeat(2, 1fr)', 
//         gap: '12px'
//       }}>
//         {/* Active Alerts - Generated dynamically */}
//         <div
//           style={{
//             padding: "14px",
//             borderRadius: "8px",
//             backgroundColor: "#1A2030",
//             border: "1px solid var(--border)"
//           }}
//         >
//           <div
//             style={{
//               fontSize: "10px",
//               fontWeight: 600,
//               color: "var(--muted)",
//               letterSpacing: "0.1em",
//               marginBottom: "12px",
//               fontFamily: "Barlow, sans-serif",
//             }}
//           >
//             ACTIVE ALERTS
//           </div>
          
//           {sensorData.soil_moisture > 80 && (
//             <>
//               <AlertItem
//                 severity="critical"
//                 message={`Soil moisture exceeded critical threshold (${sensorData.soil_moisture}% > 80%)`}
//                 timestamp={new Date().toLocaleTimeString()}
//                 location="Sensor S-01 Zone B"
//               />
//               <div style={{ height: "8px" }}></div>
//             </>
//           )}
          
//           {sensorData.tilt > 7 && (
//             <>
//               <AlertItem
//                 severity="warning"
//                 message={`Tilt angle approaching warning limit (${sensorData.tilt.toFixed(1)}° of 10° limit)`}
//                 timestamp={new Date().toLocaleTimeString()}
//                 location="MPU6050 Node 2"
//               />
//               <div style={{ height: "8px" }}></div>
//             </>
//           )}
          
//           {sensorData.vibration > 0.3 && (
//             <AlertItem
//               severity="warning"
//               message={`Vibration spike detected — possible excavation impact (${sensorData.vibration.toFixed(2)}g)`}
//               timestamp={new Date().toLocaleTimeString()}
//               location="SW-420 Node A"
//             />
//           )}
          
//           {sensorData.soil_moisture <= 80 && sensorData.tilt <= 7 && sensorData.vibration <= 0.3 && (
//             <div style={{ textAlign: "center", padding: "20px", color: "var(--green)" }}>
//               ✓ No active alerts. All systems normal.
//             </div>
//           )}
//         </div>

//         {/* Site Map */}
//         <div
//           style={{
//             padding: "14px",
//             borderRadius: "8px",
//             backgroundColor: "#1A2030",
//             border: "1px solid var(--border)"
//           }}
//         >
//           <div
//             style={{
//               fontSize: "10px",
//               fontWeight: 600,
//               color: "var(--muted)",
//               letterSpacing: "0.1em",
//               marginBottom: "12px",
//               fontFamily: "Barlow, sans-serif",
//             }}
//           >
//             SITE MAP — SENSOR LOCATIONS
//           </div>

//           <div
//             style={{
//               borderRadius: "6px",
//               padding: "16px",
//               position: "relative",
//               backgroundColor: "var(--bg3)",
//               height: "220px"
//             }}
//           >
//             <div
//               style={{
//                 position: "absolute",
//                 inset: "16px",
//                 borderRadius: "4px",
//                 border: "2px dashed white"
//               }}
//             >
//               {/* Block A */}
//               <div
//                 style={{
//                   position: "absolute",
//                   top: "8px",
//                   left: "8px",
//                   width: "240px",
//                   height: "64px",
//                   border: `1px dashed ${getCrackStatus() === "critical" ? "var(--red)" : getCrackStatus() === "warning" ? "var(--amber)" : "var(--green)"}`,
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                   transition: "background 0.2s"
//                 }}
//                 onClick={() => navigate("/sensors?tab=crack")}
//                 onMouseEnter={e => (e.currentTarget.style.background = "rgba(59,130,246,0.08)")}
//                 onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
//               >
//                 <div style={{ fontSize: "9px", color: "var(--blue)", padding: "4px" }}>
//                   Block A
//                 </div>
//                 <div style={{ fontSize: "8px", color: "var(--muted)", paddingLeft: "4px", fontFamily: "Share Tech Mono, monospace" }}>
//                   Crack · {getCrackStatus().toUpperCase()} {getCrackStatus() === "critical" ? "🔴" : getCrackStatus() === "warning" ? "🟠" : "🟢"}
//                 </div>
//                 <div style={{ position: "absolute", bottom: "8px", right: "8px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: getCrackStatus() === "critical" ? "var(--red)" : getCrackStatus() === "warning" ? "var(--amber)" : "var(--green)", border: "2px solid var(--bg3)" }} />
//               </div>

//               {/* Block B */}
//               <div
//                 style={{
//                   position: "absolute",
//                   top: "8px",
//                   right: "8px",
//                   width: "160px",
//                   height: "64px",
//                   border: `1px dashed ${getTiltStatus() === "critical" ? "var(--red)" : getTiltStatus() === "warning" ? "var(--amber)" : "var(--green)"}`,
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                   transition: "background 0.2s"
//                 }}
//                 onClick={() => navigate("/sensors?tab=tilt")}
//                 onMouseEnter={e => (e.currentTarget.style.background = "rgba(245,158,11,0.08)")}
//                 onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
//               >
//                 <div style={{ fontSize: "9px", color: "var(--amber)", padding: "4px" }}>
//                   Block B
//                 </div>
//                 <div style={{ fontSize: "8px", color: "var(--muted)", paddingLeft: "4px", fontFamily: "Share Tech Mono, monospace" }}>
//                   Tilt · {getTiltStatus().toUpperCase()} {getTiltStatus() === "critical" ? "🔴" : getTiltStatus() === "warning" ? "🟠" : "🟢"}
//                 </div>
//                 <div style={{ position: "absolute", bottom: "8px", left: "8px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: getTiltStatus() === "critical" ? "var(--red)" : getTiltStatus() === "warning" ? "var(--amber)" : "var(--green)", border: "2px solid var(--bg3)" }} />
//               </div>

//               {/* Zone C */}
//               <div
//                 style={{
//                   position: "absolute",
//                   bottom: "8px",
//                   left: "8px",
//                   right: "8px",
//                   height: "80px",
//                   border: `2px dashed ${getSoilStatus() === "critical" ? "var(--red)" : getSoilStatus() === "warning" ? "var(--amber)" : "var(--green)"}`,
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                   transition: "background 0.2s"
//                 }}
//                 onClick={() => navigate("/sensors?tab=soil")}
//                 onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
//                 onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
//               >
//                 <div style={{ fontSize: "9px", color: "var(--red)", fontWeight: 600, padding: "4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                   <span>Zone C — {getSoilStatus() === "critical" ? "HIGH RISK" : getSoilStatus() === "warning" ? "MEDIUM RISK" : "LOW RISK"}</span>
//                   <span style={{ fontSize: "8px", fontFamily: "Share Tech Mono, monospace", fontWeight: 400, color: "var(--muted)", paddingRight: "4px" }}>
//                     tap to inspect ↗
//                   </span>
//                 </div>
//                 <div style={{ position: "absolute", top: "40px", left: "16px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: getSoilStatus() === "critical" ? "var(--red)" : getSoilStatus() === "warning" ? "var(--amber)" : "var(--green)", border: "2px solid var(--bg3)" }} />
//                 <div style={{ position: "absolute", top: "40px", right: "16px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: getVibrationStatus() === "critical" ? "var(--red)" : getVibrationStatus() === "warning" ? "var(--amber)" : "var(--green)", border: "2px solid var(--bg3)" }} />
//               </div>
//             </div>
//           </div>

//           {/* Legend */}
//           <div
//             style={{
//               display: "flex",
//               gap: "12px",
//               marginTop: "8px",
//               fontSize: "9px",
//               fontFamily: "Share Tech Mono, monospace",
//               color: "var(--muted)"
//             }}
//           >
//             <span><span style={{ color: "var(--red)" }}>●</span> Soil</span>
//             <span><span style={{ color: "var(--amber)" }}>●</span> Vibration</span>
//             <span><span style={{ color: "var(--amber)" }}>●</span> Tilt</span>
//             <span><span style={{ color: "var(--green)" }}>●</span> Crack</span>
//             <span style={{ marginLeft: "auto", opacity: 0.6 }}>click zone to inspect</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }