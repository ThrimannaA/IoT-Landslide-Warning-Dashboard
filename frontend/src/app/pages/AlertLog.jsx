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
  Tooltip,
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
          const timestamp = new Date(reading.timestamp);
          const timeStr = timestamp.toLocaleTimeString();
          const dateStr = timestamp.toLocaleDateString();
          
          // ========== SOIL MOISTURE ALERTS ==========
          const soilValue = reading.soil_20cm || 0;
          if (soilValue > 80) {
            generatedAlerts.push({
              id: `soil_critical_${index}`,
              timestamp: reading.timestamp,
              date: dateStr,
              time: timeStr,
              sensor: "Soil Moisture",
              severity: "critical",
              description: `Soil saturation exceeded CRITICAL threshold (${soilValue}% > 80%) — Immediate evacuation risk`,
              value: `${soilValue}%`,
              acknowledged: false,
              ackTime: null
            });
          } else if (soilValue > 60) {
            generatedAlerts.push({
              id: `soil_warning_${index}`,
              timestamp: reading.timestamp,
              date: dateStr,
              time: timeStr,
              sensor: "Soil Moisture",
              severity: "warning",
              description: `Soil moisture elevated to WARNING level (${soilValue}% > 60%) — Monitor closely`,
              value: `${soilValue}%`,
              acknowledged: true,
              ackTime: "Auto"
            });
          }
          
          // ========== TILT ALERTS ==========
          const tiltValue = Math.abs(reading.rotation_x || 0);
          if (tiltValue > 8) {
            generatedAlerts.push({
              id: `tilt_critical_${index}`,
              timestamp: reading.timestamp,
              date: dateStr,
              time: timeStr,
              sensor: "Tilt / MPU6050",
              severity: "critical",
              description: `X-axis tilt at CRITICAL level (${tiltValue.toFixed(1)}° > 8°) — Structural failure risk`,
              value: `${tiltValue.toFixed(1)}°`,
              acknowledged: false,
              ackTime: null
            });
          } else if (tiltValue > 5) {
            generatedAlerts.push({
              id: `tilt_warning_${index}`,
              timestamp: reading.timestamp,
              date: dateStr,
              time: timeStr,
              sensor: "Tilt / MPU6050",
              severity: "warning",
              description: `X-axis tilt elevated to WARNING level (${tiltValue.toFixed(1)}° > 5°) — Schedule inspection`,
              value: `${tiltValue.toFixed(1)}°`,
              acknowledged: true,
              ackTime: "Auto"
            });
          }
          
          // ========== VIBRATION ALERTS ==========
          const vibrationValue = Math.abs(reading.acceleration_x || 0);
          if (vibrationValue > 0.4) {
            generatedAlerts.push({
              id: `vibration_critical_${index}`,
              timestamp: reading.timestamp,
              date: dateStr,
              time: timeStr,
              sensor: "Vibration",
              severity: "critical",
              description: `Vibration at CRITICAL level (${vibrationValue.toFixed(2)}g > 0.4g) — Immediate halt construction`,
              value: `${vibrationValue.toFixed(2)}g`,
              acknowledged: false,
              ackTime: null
            });
          } else if (vibrationValue > 0.2) {
            generatedAlerts.push({
              id: `vibration_warning_${index}`,
              timestamp: reading.timestamp,
              date: dateStr,
              time: timeStr,
              sensor: "Vibration",
              severity: "warning",
              description: `Vibration spike detected (${vibrationValue.toFixed(2)}g > 0.2g) — Possible heavy equipment impact`,
              value: `${vibrationValue.toFixed(2)}g`,
              acknowledged: true,
              ackTime: "14:18"
            });
          }
          
          // ========== CRACK ALERTS ==========
          const crackValue = reading.crack_width || 0;
          if (crackValue > 5) {
            generatedAlerts.push({
              id: `crack_critical_${index}`,
              timestamp: reading.timestamp,
              date: dateStr,
              time: timeStr,
              sensor: "Crack (ToF)",
              severity: "critical",
              description: `Crack width at CRITICAL level (${crackValue.toFixed(1)}mm > 5mm) — Immediate evacuation required`,
              value: `${crackValue.toFixed(1)} mm`,
              acknowledged: false,
              ackTime: null
            });
          } else if (crackValue > 3.5) {
            generatedAlerts.push({
              id: `crack_warning_${index}`,
              timestamp: reading.timestamp,
              date: dateStr,
              time: timeStr,
              sensor: "Crack (ToF)",
              severity: "warning",
              description: `Crack widening detected (${crackValue.toFixed(1)}mm > 3.5mm) — Schedule inspection`,
              value: `${crackValue.toFixed(1)} mm`,
              acknowledged: true,
              ackTime: "Auto"
            });
          }
        });
        
        // Sort by timestamp (newest first)
        generatedAlerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setAlertData(generatedAlerts.slice(-50)); // Last 50 alerts
        
        // ========== CORRECT FREQUENCY DATA - Group by actual date ==========
        const frequencyByDate = {};
        
        generatedAlerts.forEach(alert => {
          const date = alert.date;
          if (!frequencyByDate[date]) {
            frequencyByDate[date] = { date: date, critical: 0, warning: 0, info: 0 };
          }
          if (alert.severity === "critical") {
            frequencyByDate[date].critical++;
          } else if (alert.severity === "warning") {
            frequencyByDate[date].warning++;
          } else {
            frequencyByDate[date].info++;
          }
        });
        
        // Get last 7 days of data
        const last7DaysData = Object.values(frequencyByDate).slice(-7);
        setAlertFrequencyData(last7DaysData);
        
        // Debug: Log what alerts were generated
        console.log(`📊 Generated ${generatedAlerts.length} alerts total`);
        console.log(`   Soil: ${generatedAlerts.filter(a => a.sensor === "Soil Moisture").length}`);
        console.log(`   Tilt: ${generatedAlerts.filter(a => a.sensor === "Tilt / MPU6050").length}`);
        console.log(`   Vibration: ${generatedAlerts.filter(a => a.sensor === "Vibration").length}`);
        console.log(`   Crack: ${generatedAlerts.filter(a => a.sensor === "Crack (ToF)").length}`);
        
      }
    });
  }, []);

  const filters = [
    { id: "all", label: "All" },
    { id: "critical", label: "Critical" },
    { id: "warning", label: "Warning" },
  ];

  const filteredAlerts = useMemo(() => {
    if (activeFilter === "all") return alertData;
    return alertData.filter((a) => a.severity === activeFilter);
  }, [activeFilter, alertData]);

  // Count alerts by sensor for summary
  const alertSummary = useMemo(() => {
    const summary = {
      soil: alertData.filter(a => a.sensor === "Soil Moisture").length,
      tilt: alertData.filter(a => a.sensor === "Tilt / MPU6050").length,
      vibration: alertData.filter(a => a.sensor === "Vibration").length,
      crack: alertData.filter(a => a.sensor === "Crack (ToF)").length,
      critical: alertData.filter(a => a.severity === "critical").length,
      warning: alertData.filter(a => a.severity === "warning").length,
    };
    return summary;
  }, [alertData]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      
      {/* Alert Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)", textAlign: "center" }}>
          <div style={{ fontSize: "9px", color: "var(--muted)", letterSpacing: "0.1em" }}>SOIL ALERTS</div>
          <div style={{ fontSize: "24px", fontFamily: "Share Tech Mono, monospace", color: alertSummary.soil > 0 ? "var(--amber)" : "var(--green)" }}>
            {alertSummary.soil}
          </div>
        </div>
        <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)", textAlign: "center" }}>
          <div style={{ fontSize: "9px", color: "var(--muted)", letterSpacing: "0.1em" }}>TILT ALERTS</div>
          <div style={{ fontSize: "24px", fontFamily: "Share Tech Mono, monospace", color: alertSummary.tilt > 0 ? "var(--amber)" : "var(--green)" }}>
            {alertSummary.tilt}
          </div>
        </div>
        <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)", textAlign: "center" }}>
          <div style={{ fontSize: "9px", color: "var(--muted)", letterSpacing: "0.1em" }}>VIBRATION ALERTS</div>
          <div style={{ fontSize: "24px", fontFamily: "Share Tech Mono, monospace", color: alertSummary.vibration > 0 ? "var(--amber)" : "var(--green)" }}>
            {alertSummary.vibration}
          </div>
        </div>
        <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)", textAlign: "center" }}>
          <div style={{ fontSize: "9px", color: "var(--muted)", letterSpacing: "0.1em" }}>CRACK ALERTS</div>
          <div style={{ fontSize: "24px", fontFamily: "Share Tech Mono, monospace", color: alertSummary.crack > 0 ? "var(--amber)" : "var(--green)" }}>
            {alertSummary.crack}
          </div>
        </div>
      </div>

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
              {filter.label.toUpperCase()} ({activeFilter === "all" ? alertData.length : alertData.filter(a => a.severity === filter.id).length})
            </button>
          ))}
        </div>
        <button 
          onClick={() => {
            const headers = ["Date", "Time", "Sensor", "Severity", "Description", "Value", "Acknowledged"];
            const rows = filteredAlerts.map(a => [
              a.date, a.time, a.sensor, a.severity, a.description, a.value, a.acknowledged ? "Yes" : "No"
            ]);
            const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `alerts_${new Date().toISOString().slice(0, 19)}.csv`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          style={{ padding: "4px 12px", borderRadius: "4px", fontSize: "11px", fontWeight: 600, fontFamily: "Barlow, sans-serif", letterSpacing: "0.08em", backgroundColor: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text)", cursor: "pointer" }}
        >
          EXPORT CSV
        </button>
      </div>

      <div style={{ height: "20px" }}></div>

      {/* Alert Frequency Chart */}
      {alertFrequencyData.length > 0 && (
        <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: "Barlow, sans-serif" }}>
            ALERT FREQUENCY — LAST 7 DAYS
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={alertFrequencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 51, 71, 0.5)" />
              <XAxis dataKey="date" stroke="var(--muted)" style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
              <YAxis stroke="var(--muted)" style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1A2030", border: "1px solid var(--border)", fontSize: 11 }}
              />
              <Bar dataKey="critical" stackId="a" fill="var(--red)" radius={[4, 4, 0, 0]} name="Critical" />
              <Bar dataKey="warning" stackId="a" fill="var(--amber)" radius={[4, 4, 0, 0]} name="Warning" />
              <Bar dataKey="info" stackId="a" fill="var(--blue)" radius={[4, 4, 0, 0]} name="Info" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={{ height: "20px" }}></div>

      {/* Incident Log Table */}
      <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
        <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: "Barlow, sans-serif" }}>
          INCIDENT LOG ({filteredAlerts.length} alerts)
        </div>

        {filteredAlerts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--green)", fontSize: "12px" }}>
            ✅ No alerts found for the selected filter.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: "100%", fontSize: "12px", fontFamily: "Barlow, sans-serif", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <th style={{ fontSize: "9px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.15em", padding: "8px 12px", textAlign: "left" }}>DATE</th>
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
                    <td style={{ padding: "12px", fontFamily: "Share Tech Mono, monospace", fontSize: "11px", color: "var(--text)" }}>{alert.date}</td>
                    <td style={{ padding: "12px", fontFamily: "Share Tech Mono, monospace", fontSize: "11px", color: "var(--text)" }}>{alert.time}</td>
                    <td style={{ padding: "12px", color: "var(--text)" }}>{alert.sensor}</td>
                    <td style={{ padding: "12px" }}><SeverityBadge severity={alert.severity} /></td>
                    <td style={{ padding: "12px", color: "var(--text)" }}>{alert.description}</td>
                    <td style={{ padding: "12px", fontFamily: "Share Tech Mono, monospace", fontSize: "11px", color: "var(--text)" }}>{alert.value}</td>
                    <td style={{ padding: "12px", fontSize: "11px", fontFamily: "Share Tech Mono, monospace", color: alert.acknowledged ? "var(--green)" : "var(--amber)" }}>
                      {alert.acknowledged ? `✓ ${alert.ackTime || "Auto"}` : "⚠ Pending"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
