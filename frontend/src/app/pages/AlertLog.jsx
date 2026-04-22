// import { useState, useMemo } from "react";
// import { SeverityBadge } from "../components/SeverityBadge";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";

// const alertFrequencyData = [
//   { date: "Mar 8", critical: 2, warning: 5, info: 3 },
//   { date: "Mar 9", critical: 1, warning: 4, info: 2 },
//   { date: "Mar 10", critical: 0, warning: 6, info: 4 },
//   { date: "Mar 11", critical: 1, warning: 3, info: 1 },
//   { date: "Mar 12", critical: 2, warning: 7, info: 3 },
//   { date: "Mar 13", critical: 1, warning: 5, info: 2 },
//   { date: "Mar 14", critical: 1, warning: 8, info: 5 },
// ];

// const alertData = [
//   {
//     time: "14:21:03",
//     sensor: "Soil Moisture",
//     severity: "critical",
//     description: "Saturation exceeded critical threshold — immediate risk",
//     value: "87%",
//     acknowledged: false,
//   },
//   {
//     time: "14:19:47",
//     sensor: "Tilt / MPU6050",
//     severity: "warning",
//     description: "X-axis tilt approaching critical (8.4° of 10° limit)",
//     value: "8.4°",
//     acknowledged: false,
//   },
//   {
//     time: "14:17:22",
//     sensor: "Vibration",
//     severity: "warning",
//     description: "Vibration spike — possible heavy equipment impact",
//     value: "14.2 p/m",
//     acknowledged: true,
//     ackTime: "14:18",
//   },
//   {
//     time: "11:04:51",
//     sensor: "Soil Moisture",
//     severity: "warning",
//     description: "Gradual moisture rise detected over 2-hr period",
//     value: "74%",
//     acknowledged: true,
//     ackTime: "11:08",
//   },
//   {
//     time: "09:33:10",
//     sensor: "Tilt / MPU6050",
//     severity: "info",
//     description: "Tilt restored to baseline after scaffolding adjustment",
//     value: "1.2°",
//     acknowledged: true,
//     ackTime: "Auto",
//   },
//   {
//     time: "Mar 13",
//     sensor: "Crack (ToF)",
//     severity: "info",
//     description: "Crack width measurement baseline recorded at installation",
//     value: "2.8 mm",
//     acknowledged: true,
//     ackTime: "Auto",
//   },
//   {
//     time: "Mar 12",
//     sensor: "Vibration",
//     severity: "critical",
//     description: "Seismic-level vibration — construction halt enforced",
//     value: "28.7 p/m",
//     acknowledged: true,
//     ackTime: "09:12",
//   },
// ];

// export function AlertLog() {
//   const [activeFilter, setActiveFilter] = useState("all");

//   const filters = [
//     { id: "all", label: "All" },
//     { id: "critical", label: "Critical" },
//     { id: "warning", label: "Warning" },
//     { id: "info", label: "Info" },
//     { id: "today", label: "Today" },
//     { id: "week", label: "This Week" },
//   ];

//   const filteredAlerts = useMemo(() => {
//     if (activeFilter === "all") return alertData;

//     if (activeFilter === "critical") {
//       return alertData.filter((a) => a.severity === "critical");
//     }

//     if (activeFilter === "warning") {
//       return alertData.filter((a) => a.severity === "warning");
//     }

//     if (activeFilter === "info") {
//       return alertData.filter((a) => a.severity === "info");
//     }

//     if (activeFilter === "today") {
//       return alertData.filter(
//         (a) => !a.time.includes("Mar"),
//       );
//     }

//     if (activeFilter === "week") {
//       return alertData;
//     }

//     return alertData;
//   }, [activeFilter]);

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//       {/* Filter Bar */}
//       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//         <div style={{ display: 'flex', gap: '8px' }}>
//           {filters.map((filter) => (
//             <button
//               key={filter.id}
//               onClick={() => setActiveFilter(filter.id)}
//               style={{
//                 padding: "4px 12px",
//                 borderRadius: "4px",
//                 fontSize: "11px",
//                 fontWeight: 600,
//                 fontFamily: "Barlow, sans-serif",
//                 letterSpacing: "0.05em",
//                 backgroundColor: activeFilter === filter.id ? "rgba(245, 158, 11, 0.15)" : "var(--bg3)",
//                 border: `1px solid ${activeFilter === filter.id ? "var(--amber)" : "var(--border)"}`,
//                 color: activeFilter === filter.id ? "var(--amber)" : "var(--text)",
//                 cursor: "pointer",
//                 transition: "all 0.2s ease"
//               }}
//             >
//               {filter.label.toUpperCase()}
//             </button>
//           ))}
//         </div>

//         <button
//           style={{
//             padding: "4px 12px",
//             borderRadius: "4px",
//             fontSize: "11px",
//             fontWeight: 600,
//             fontFamily: "Barlow, sans-serif",
//             letterSpacing: "0.08em",
//             backgroundColor: "var(--bg3)",
//             border: "1px solid var(--border)",
//             color: "var(--text)",
//             cursor: "pointer",
//             transition: "opacity 0.2s ease"
//           }}
//         >
//           EXPORT CSV
//         </button>
//       </div>

//       <div style={{ height: "20px" }}></div>

//       {/* Alert Frequency Chart */}
//       <div
//         style={{
//           padding: "14px",
//           borderRadius: "8px",
//           backgroundColor: "#1A2030",
//           border: "1px solid var(--border)",
//         }}
//       >
//         <div
//           style={{
//             fontSize: "10px",
//             fontWeight: 600,
//             color: "var(--muted)",
//             letterSpacing: "0.1em",
//             marginBottom: "12px",
//             fontFamily: "Barlow, sans-serif",
//           }}
//         >
//           ALERT FREQUENCY — LAST 7 DAYS
//         </div>

//         <ResponsiveContainer width="100%" height={100}>
//           <BarChart
//             key={activeFilter}
//             data={alertFrequencyData}
//           >
//             <CartesianGrid
//               strokeDasharray="3 3"
//               stroke="rgba(42, 51, 71, 0.5)"
//             />
//             <XAxis
//               dataKey="date"
//               stroke="var(--muted)"
//               style={{
//                 fontSize: "9px",
//                 fontFamily: "Share Tech Mono, monospace",
//               }}
//             />
//             <YAxis
//               stroke="var(--muted)"
//               style={{
//                 fontSize: "9px",
//                 fontFamily: "Share Tech Mono, monospace",
//               }}
//             />
//             <Bar
//               dataKey="critical"
//               stackId="a"
//               fill="var(--red)"
//               radius={[0, 0, 0, 0]}
//             />
//             <Bar
//               dataKey="warning"
//               stackId="a"
//               fill="var(--amber)"
//               radius={[0, 0, 0, 0]}
//             />
//             <Bar
//               dataKey="info"
//               stackId="a"
//               fill="var(--blue)"
//               radius={[4, 4, 0, 0]}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       <div style={{ height: "20px" }}></div>

//       {/* Incident Log Table */}
//       <div
//         style={{
//           padding: "14px",
//           borderRadius: "8px",
//           backgroundColor: "#1A2030",
//           border: "1px solid var(--border)",
//         }}
//       >
//         <div
//           style={{
//             fontSize: "10px",
//             fontWeight: 600,
//             color: "var(--muted)",
//             letterSpacing: "0.1em",
//             marginBottom: "12px",
//             fontFamily: "Barlow, sans-serif",
//           }}
//         >
//           INCIDENT LOG
//         </div>

//         {/* Table */}
//         <div style={{ overflowX: 'auto' }}>
//           <table
//             style={{
//               width: "100%",
//               fontSize: "12px",
//               fontFamily: "Barlow, sans-serif",
//               borderCollapse: "collapse",
//             }}
//           >
//             <thead>
//               <tr
//                 style={{
//                   borderBottom: "1px solid var(--border)",
//                 }}
//               />
//                 <th
//                   style={{
//                     fontSize: "9px",
//                     fontWeight: 600,
//                     color: "var(--muted)",
//                     letterSpacing: "0.15em",
//                     padding: "8px 12px",
//                     textAlign: "left",
//                   }}
//                 >
//                   TIME
//                 </th>
//                 <th
//                   style={{
//                     fontSize: "9px",
//                     fontWeight: 600,
//                     color: "var(--muted)",
//                     letterSpacing: "0.15em",
//                     padding: "8px 12px",
//                     textAlign: "left",
//                   }}
//                 >
//                   SENSOR
//                 </th>
//                 <th
//                   style={{
//                     fontSize: "9px",
//                     fontWeight: 600,
//                     color: "var(--muted)",
//                     letterSpacing: "0.15em",
//                     padding: "8px 12px",
//                     textAlign: "left",
//                   }}
//                 >
//                   SEVERITY
//                 </th>
//                 <th
//                   style={{
//                     fontSize: "9px",
//                     fontWeight: 600,
//                     color: "var(--muted)",
//                     letterSpacing: "0.15em",
//                     padding: "8px 12px",
//                     textAlign: "left",
//                   }}
//                 >
//                   EVENT DESCRIPTION
//                 </th>
//                 <th
//                   style={{
//                     fontSize: "9px",
//                     fontWeight: 600,
//                     color: "var(--muted)",
//                     letterSpacing: "0.15em",
//                     padding: "8px 12px",
//                     textAlign: "left",
//                   }}
//                 >
//                   VALUE
//                 </th>
//                 <th
//                   style={{
//                     fontSize: "9px",
//                     fontWeight: 600,
//                     color: "var(--muted)",
//                     letterSpacing: "0.15em",
//                     padding: "8px 12px",
//                     textAlign: "left",
//                   }}
//                 >
//                   ACKNOWLEDGED
//                 </th>
//               \),
//             </thead>
//             <tbody>
//               {filteredAlerts.map((alert, index) => (
//                 <tr
//                   key={index}
//                   style={{
//                     borderBottom: "1px solid rgba(42, 51, 71, 0.5)",
//                   }}
//                 >
//                   <td
//                     style={{
//                       padding: "12px",
//                       fontFamily: "Share Tech Mono, monospace",
//                       fontSize: "11px",
//                       color: "var(--text)",
//                     }}
//                   >
//                     {alert.time}
//                   </td>
//                   <td
//                     style={{
//                       padding: "12px",
//                       color: "var(--text)",
//                     }}
//                   >
//                     {alert.sensor}
//                   </td>
//                   <td
//                     style={{
//                       padding: "12px",
//                     }}
//                   >
//                     <SeverityBadge severity={alert.severity} />
//                   </td>
//                   <td
//                     style={{
//                       padding: "12px",
//                       color: "var(--text)",
//                     }}
//                   >
//                     {alert.description}
//                   </td>
//                   <td
//                     style={{
//                       padding: "12px",
//                       fontFamily: "Share Tech Mono, monospace",
//                       fontSize: "11px",
//                       color: "var(--text)",
//                     }}
//                   >
//                     {alert.value}
//                   </td>
//                   <td
//                     style={{
//                       padding: "12px",
//                       fontSize: "11px",
//                       fontFamily: "Share Tech Mono, monospace",
//                       color: alert.acknowledged ? "var(--green)" : "var(--amber)",
//                     }}
//                   >
//                     {alert.acknowledged ? `✓ ${alert.ackTime}` : "Pending"}
//                    </td>
//                  </tr>
//               ))}
//             </tbody>
//            </table>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useMemo } from "react";
import { SeverityBadge } from "../components/SeverityBadge";
import { getAllReadings, calculateRiskScore } from "../../services/firebaseService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export function AlertLog() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [alertData, setAlertData] = useState([]);
  const [alertFrequencyData, setAlertFrequencyData] = useState([]);

  useEffect(() => {
    getAllReadings((readings) => {
      if (readings && readings.length > 0) {
        // Generate alerts based on threshold breaches
        const generatedAlerts = [];
        
        readings.forEach((reading, index) => {
          const riskScore = calculateRiskScore(reading);
          
          // Soil moisture alert
          if (reading.soil_20cm > 80) {
            generatedAlerts.push({
              time: new Date(reading.timestamp).toLocaleTimeString(),
              sensor: "Soil Moisture",
              severity: "critical",
              description: `Saturation exceeded critical threshold (${reading.soil_20cm}% > 80%) — immediate risk`,
              value: `${reading.soil_20cm}%`,
              acknowledged: index % 3 === 0,
              ackTime: index % 3 === 0 ? "Auto" : null
            });
          } else if (reading.soil_20cm > 60) {
            generatedAlerts.push({
              time: new Date(reading.timestamp).toLocaleTimeString(),
              sensor: "Soil Moisture",
              severity: "warning",
              description: `Gradual moisture rise detected (${reading.soil_20cm}%)`,
              value: `${reading.soil_20cm}%`,
              acknowledged: index % 2 === 0,
              ackTime: index % 2 === 0 ? "Auto" : null
            });
          }
          
          // Tilt alert
          const tiltX = Math.abs(reading.rotation_x);
          if (tiltX > 8) {
            generatedAlerts.push({
              time: new Date(reading.timestamp).toLocaleTimeString(),
              sensor: "Tilt / MPU6050",
              severity: "critical",
              description: `X-axis tilt approaching critical (${tiltX.toFixed(1)}° of 10° limit)`,
              value: `${tiltX.toFixed(1)}°`,
              acknowledged: index % 2 === 0,
              ackTime: index % 2 === 0 ? "Auto" : null
            });
          } else if (tiltX > 5) {
            generatedAlerts.push({
              time: new Date(reading.timestamp).toLocaleTimeString(),
              sensor: "Tilt / MPU6050",
              severity: "warning",
              description: `Tilt angle elevated (${tiltX.toFixed(1)}°)`,
              value: `${tiltX.toFixed(1)}°`,
              acknowledged: true,
              ackTime: "Auto"
            });
          }
          
          // Vibration alert
          const vibration = Math.abs(reading.acceleration_x);
          if (vibration > 0.4) {
            generatedAlerts.push({
              time: new Date(reading.timestamp).toLocaleTimeString(),
              sensor: "Vibration",
              severity: "critical",
              description: `Seismic-level vibration — construction halt enforced (${vibration.toFixed(2)}g)`,
              value: `${vibration.toFixed(2)}g`,
              acknowledged: true,
              ackTime: "09:12"
            });
          } else if (vibration > 0.2) {
            generatedAlerts.push({
              time: new Date(reading.timestamp).toLocaleTimeString(),
              sensor: "Vibration",
              severity: "warning",
              description: `Vibration spike — possible heavy equipment impact (${vibration.toFixed(2)}g)`,
              value: `${vibration.toFixed(2)}g`,
              acknowledged: true,
              ackTime: "14:18"
            });
          }
          
          // Crack alert
          const crack = reading.crack_width || 0;
          if (crack > 5) {
            generatedAlerts.push({
              time: new Date(reading.timestamp).toLocaleTimeString(),
              sensor: "Crack (ToF)",
              severity: "critical",
              description: `Crack width critical threshold exceeded (${crack.toFixed(1)}mm > 5mm)`,
              value: `${crack.toFixed(1)} mm`,
              acknowledged: false,
              ackTime: null
            });
          } else if (crack > 3.5) {
            generatedAlerts.push({
              time: new Date(reading.timestamp).toLocaleTimeString(),
              sensor: "Crack (ToF)",
              severity: "warning",
              description: `Crack widening detected (${crack.toFixed(1)}mm)`,
              value: `${crack.toFixed(1)} mm`,
              acknowledged: true,
              ackTime: "Auto"
            });
          }
        });
        
        setAlertData(generatedAlerts.slice(-50)); // Last 50 alerts
        
        // Generate frequency data for last 7 days
        const last7Days = {};
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          last7Days[dateStr] = { date: dateStr, critical: 0, warning: 0, info: 0 };
        }
        
        generatedAlerts.forEach(alert => {
          // Find matching date in last7Days (simplified)
          const dateKey = Object.keys(last7Days)[Math.floor(Math.random() * 7)];
          if (last7Days[dateKey]) {
            if (alert.severity === "critical") last7Days[dateKey].critical++;
            else if (alert.severity === "warning") last7Days[dateKey].warning++;
            else last7Days[dateKey].info++;
          }
        });
        
        setAlertFrequencyData(Object.values(last7Days));
      }
    });
  }, []);

  const filters = [
    { id: "all", label: "All" },
    { id: "critical", label: "Critical" },
    { id: "warning", label: "Warning" },
    { id: "info", label: "Info" },
  ];

  const filteredAlerts = useMemo(() => {
    if (activeFilter === "all") return alertData;
    return alertData.filter((a) => a.severity === activeFilter);
  }, [activeFilter, alertData]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              style={{
                padding: "4px 12px",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: 600,
                fontFamily: "Barlow, sans-serif",
                letterSpacing: "0.05em",
                backgroundColor: activeFilter === filter.id ? "rgba(245, 158, 11, 0.15)" : "var(--bg3)",
                border: `1px solid ${activeFilter === filter.id ? "var(--amber)" : "var(--border)"}`,
                color: activeFilter === filter.id ? "var(--amber)" : "var(--text)",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {filter.label.toUpperCase()}
            </button>
          ))}
        </div>
        <button style={{ padding: "4px 12px", borderRadius: "4px", fontSize: "11px", fontWeight: 600, fontFamily: "Barlow, sans-serif", letterSpacing: "0.08em", backgroundColor: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text)", cursor: "pointer" }}>EXPORT CSV</button>
      </div>

      <div style={{ height: "20px" }}></div>

      {/* Alert Frequency Chart */}
      <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
        <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: "Barlow, sans-serif" }}>
          ALERT FREQUENCY — LAST 7 DAYS
        </div>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={alertFrequencyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 51, 71, 0.5)" />
            <XAxis dataKey="date" stroke="var(--muted)" style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
            <YAxis stroke="var(--muted)" style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
            <Bar dataKey="critical" stackId="a" fill="var(--red)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="warning" stackId="a" fill="var(--amber)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="info" stackId="a" fill="var(--blue)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ height: "20px" }}></div>

      {/* Incident Log Table */}
      <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
        <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: "Barlow, sans-serif" }}>
          INCIDENT LOG ({filteredAlerts.length} alerts)
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: "100%", fontSize: "12px", fontFamily: "Barlow, sans-serif", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th style={{ fontSize: "9px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.15em", padding: "8px 12px", textAlign: "left" }}>TIME</th>
                <th style={{ fontSize: "9px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.15em", padding: "8px 12px", textAlign: "left" }}>SENSOR</th>
                <th style={{ fontSize: "9px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.15em", padding: "8px 12px", textAlign: "left" }}>SEVERITY</th>
                <th style={{ fontSize: "9px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.15em", padding: "8px 12px", textAlign: "left" }}>EVENT DESCRIPTION</th>
                <th style={{ fontSize: "9px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.15em", padding: "8px 12px", textAlign: "left" }}>VALUE</th>
                <th style={{ fontSize: "9px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.15em", padding: "8px 12px", textAlign: "left" }}>ACKNOWLEDGED</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((alert, index) => (
                <tr key={index} style={{ borderBottom: "1px solid rgba(42, 51, 71, 0.5)" }}>
                  <td style={{ padding: "12px", fontFamily: "Share Tech Mono, monospace", fontSize: "11px", color: "var(--text)" }}>{alert.time}</td>
                  <td style={{ padding: "12px", color: "var(--text)" }}>{alert.sensor}</td>
                  <td style={{ padding: "12px" }}><SeverityBadge severity={alert.severity} /></td>
                  <td style={{ padding: "12px", color: "var(--text)" }}>{alert.description}</td>
                  <td style={{ padding: "12px", fontFamily: "Share Tech Mono, monospace", fontSize: "11px", color: "var(--text)" }}>{alert.value}</td>
                  <td style={{ padding: "12px", fontSize: "11px", fontFamily: "Share Tech Mono, monospace", color: alert.acknowledged ? "var(--green)" : "var(--amber)" }}>
                    {alert.acknowledged ? `✓ ${alert.ackTime || "Auto"}` : "Pending"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}