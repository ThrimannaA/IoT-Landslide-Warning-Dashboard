// import { useNavigate } from "react-router-dom";
// import { SensorCard } from "../components/SensorCard";
// import { AlertItem } from "../components/AlertItem";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   ResponsiveContainer,
//   CartesianGrid,
//   ReferenceLine,
// } from "recharts";

// const trendData = Array.from({ length: 30 }, (_, i) => ({
//   time: i,
//   soil: 58 + i * 0.97,
//   tilt: 3 + i * 0.18,
//   vibration: 8 + (i % 5) * 1.6,
//   crack: 3.1 + (i % 3) * 0.05,
// }));

// export function LiveOverview() {
//   const navigate = useNavigate();

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
//           value="87"
//           unit="% saturation"
//           status="critical"
//           onClick={() => navigate("/sensors?tab=soil")}
//         />
//         <SensorCard
//           label="VIBRATION"
//           value="14.2"
//           unit="pulse events/min"
//           status="warning"
//           onClick={() => navigate("/sensors?tab=vibration")}
//         />
//         <SensorCard
//           label="TILT / MPU6050"
//           value="8.4"
//           unit="° deviation (X axis)"
//           status="warning"
//           onClick={() => navigate("/sensors?tab=tilt")}
//         />
//         <SensorCard
//           label="CRACK DISPLACEMENT"
//           value="3.1"
//           unit="mm gap width (ToF)"
//           status="safe"
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
//             SENSOR TREND — LAST 30 MINUTES
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
//                 tickFormatter={(v) => `${v}m`}
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
//               <Line type="monotone" dataKey="soil"      stroke="#ef4444" strokeWidth={2}   dot={false} />
//               <Line type="monotone" dataKey="tilt"      stroke="#f59e0b" strokeWidth={2}   dot={false} />
//               <Line type="monotone" dataKey="vibration" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
//               <Line type="monotone" dataKey="crack"     stroke="#22c55e" strokeWidth={2}   dot={false} />
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
//             <div style={{ fontSize: "38px", fontFamily: "Share Tech Mono, monospace", color: "var(--red)", lineHeight: 1 }}>
//               78
//             </div>
//             <div style={{ fontSize: "10px", color: "var(--muted)", fontFamily: "Share Tech Mono, monospace", marginTop: "4px" }}>
//               / 100 — HIGH RISK
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
//                 left: "78%",
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
//               { label: "Soil",  value: "38%", color: "var(--red)"   },
//               { label: "Vib",   value: "22%", color: "var(--amber)" },
//               { label: "Tilt",  value: "18%", color: "var(--amber)" },
//               { label: "Crack", value: "0%",  color: "var(--green)" },
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
//         {/* Active Alerts */}
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
//           <AlertItem
//             severity="critical"
//             message="Soil moisture exceeded critical threshold (87% > 80%)"
//             timestamp="14:21:03"
//             location="Sensor S-01 Zone B"
//           />
//           <div style={{ height: "8px" }}></div>
//           <AlertItem
//             severity="warning"
//             message="Tilt angle approaching warning limit on west wall"
//             timestamp="14:19:47"
//             location="MPU6050 Node 2"
//           />
//           <div style={{ height: "8px" }}></div>
//           <AlertItem
//             severity="warning"
//             message="Vibration spike detected — possible excavation impact"
//             timestamp="14:17:22"
//             location="SW-420 Node A"
//           />
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
//                   border: "1px dashed var(--blue)",
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
//                   Crack · SAFE ↗
//                 </div>
//                 <div style={{ position: "absolute", bottom: "8px", right: "8px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "var(--green)", border: "2px solid var(--bg3)" }} />
//               </div>

//               {/* Block B */}
//               <div
//                 style={{
//                   position: "absolute",
//                   top: "8px",
//                   right: "8px",
//                   width: "160px",
//                   height: "64px",
//                   border: "1px dashed var(--amber)",
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
//                   Tilt · WARNING ↑
//                 </div>
//                 <div style={{ position: "absolute", bottom: "8px", left: "8px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "var(--amber)", border: "2px solid var(--bg3)" }} />
//               </div>

//               {/* Zone C */}
//               <div
//                 style={{
//                   position: "absolute",
//                   bottom: "8px",
//                   left: "8px",
//                   right: "8px",
//                   height: "80px",
//                   border: "2px dashed var(--red)",
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                   transition: "background 0.2s"
//                 }}
//                 onClick={() => navigate("/sensors?tab=soil")}
//                 onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
//                 onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
//               >
//                 <div style={{ fontSize: "9px", color: "var(--red)", fontWeight: 600, padding: "4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                   <span>Zone C — HIGH RISK</span>
//                   <span style={{ fontSize: "8px", fontFamily: "Share Tech Mono, monospace", fontWeight: 400, color: "var(--muted)", paddingRight: "4px" }}>
//                     tap to inspect ↗
//                   </span>
//                 </div>
//                 <div style={{ position: "absolute", top: "40px", left: "16px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "var(--red)", border: "2px solid var(--bg3)" }} />
//                 <div style={{ position: "absolute", top: "40px", right: "16px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "var(--amber)", border: "2px solid var(--bg3)" }} />
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
import { getLatestReading, calculateRiskScore } from "../../services/firebaseService";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

export function LiveOverview() {
  const navigate = useNavigate();
  const [sensorData, setSensorData] = useState({
    soil_moisture: 0,
    crack_width: 0,
    tilt: 0,
    vibration: 0,
    riskScore: 0
  });
  const [trendData, setTrendData] = useState([]);

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
            soil: reading.soil_20cm || 0,
            tilt: Math.abs(reading.rotation_x) || 0,
            vibration: Math.abs(reading.acceleration_x) || 0,
            crack: reading.crack_width || 0
          }));
          setTrendData(trend);
        }
      });
    };
    
    loadTrendData();
  }, []);

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
              fontSize: "10px",
              fontWeight: 600,
              color: "var(--muted)",
              letterSpacing: "0.1em",
              marginBottom: "8px",
              fontFamily: "Barlow, sans-serif",
            }}
          >
            SENSOR TREND — LAST 30 READINGS
          </div>

          <div
            style={{
              display: "flex",
              gap: "14px",
              marginBottom: "10px",
              fontSize: "9px",
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
            <LineChart data={trendData}>
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
              <Line type="monotone" dataKey="soil" stroke="#ef4444" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="tilt" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="vibration" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="crack" stroke="#22c55e" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
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
              fontSize: "10px",
              fontWeight: 600,
              color: "var(--muted)",
              letterSpacing: "0.1em",
              marginBottom: "12px",
              fontFamily: "Barlow, sans-serif",
            }}
          >
            COMPOSITE RISK SCORE
          </div>

          <div style={{ textAlign: "center", marginBottom: "12px" }}>
            <div style={{ fontSize: "38px", fontFamily: "Share Tech Mono, monospace", color: sensorData.riskScore > 70 ? "var(--red)" : sensorData.riskScore > 50 ? "var(--amber)" : "var(--green)", lineHeight: 1 }}>
              {sensorData.riskScore}
            </div>
            <div style={{ fontSize: "10px", color: "var(--muted)", fontFamily: "Share Tech Mono, monospace", marginTop: "4px" }}>
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
              marginBottom: "12px",
              fontSize: "9px",
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
                  padding: "8px",
                  borderRadius: "4px",
                  textAlign: "center",
                  backgroundColor: "var(--bg3)"
                }}
              >
                <div style={{ fontSize: "9px", color: "var(--muted)", marginBottom: "2px" }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: "14px", fontFamily: "Share Tech Mono, monospace", color: stat.color }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
              fontSize: "10px",
              fontWeight: 600,
              color: "var(--muted)",
              letterSpacing: "0.1em",
              marginBottom: "12px",
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
            <div style={{ textAlign: "center", padding: "20px", color: "var(--green)" }}>
              ✓ No active alerts. All systems normal.
            </div>
          )}
        </div>

        {/* Site Map - same as before */}
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
              fontSize: "10px",
              fontWeight: 600,
              color: "var(--muted)",
              letterSpacing: "0.1em",
              marginBottom: "12px",
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
              marginTop: "8px",
              fontSize: "9px",
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
    </div>
  );
}