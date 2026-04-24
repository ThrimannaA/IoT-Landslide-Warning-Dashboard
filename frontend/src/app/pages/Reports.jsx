// import { StatCard } from "../components/StatCard";
// import { SeverityBadge } from "../components/SeverityBadge";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   AreaChart,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Area,
// } from "recharts";

// const alertDistribution = [
//   { name: "Soil", value: 38, color: "#ef4444" },
//   { name: "Vibration", value: 29, color: "#f59e0b" },
//   { name: "Tilt", value: 25, color: "#3b82f6" },
//   { name: "Crack", value: 8, color: "#22c55e" },
// ];

// const riskScoreTrend = Array.from({ length: 14 }, (_, i) => ({
//   date: i + 1,
//   score: 30 + i * 3.4,
// }));

// const auditData = [
//   {
//     date: "14 Mar 2026",
//     checkItem: "Soil saturation check",
//     sensorData: "87% peak",
//     status: "fail",
//     inspector: "E.A. Abeysinghe",
//   },
//   {
//     date: "13 Mar 2026",
//     checkItem: "Structural tilt review",
//     sensorData: "3.2° max",
//     status: "pass",
//     inspector: "R.A.D.N. Rupasinghe",
//   },
//   {
//     date: "12 Mar 2026",
//     checkItem: "Vibration tolerance",
//     sensorData: "28.7 p/m",
//     status: "fail",
//     inspector: "J.V.D. Jayarathna",
//   },
//   {
//     date: "11 Mar 2026",
//     checkItem: "Crack displacement",
//     sensorData: "3.0 mm",
//     status: "pass",
//     inspector: "A. Thrimanna",
//   },
// ];

// export function Reports() {
//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//       {/* KPI Row - 4 columns */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
//         <StatCard
//           label="TOTAL ALERTS"
//           value="47"
//           sub="This Month"
//           color="var(--amber)"
//           centered
//         />
//         <StatCard
//           label="CRITICAL EVENTS"
//           value="8"
//           sub="This Month"
//           color="var(--red)"
//           centered
//         />
//         <StatCard
//           label="AVG RESPONSE"
//           value="3m 12s"
//           sub="Alert to Ack"
//           color="var(--green)"
//           centered
//         />
//         <StatCard
//           label="SUS SCORE"
//           value="81"
//           sub="Usability (target ≥75)"
//           color="var(--green)"
//           centered
//         />
//       </div>

//       <div style={{ height: "12px" }}></div>

//       {/* Charts Row - 2 columns */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
//         {/* Monthly Alert Distribution */}
//         <div
//           style={{
//             padding: "14px",
//             borderRadius: "8px",
//             backgroundColor: "#1A2030",
//             border: "1px solid var(--border)",
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
//             MONTHLY ALERT DISTRIBUTION BY SENSOR
//           </div>

//           <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
//             <ResponsiveContainer width={180} height={180}>
//               <PieChart>
//                 <Pie
//                   data={alertDistribution}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={55}
//                   outerRadius={80}
//                   paddingAngle={2}
//                   dataKey="value"
//                 >
//                   {alertDistribution.map((entry, index) => (
//                     <Cell
//                       key={`cell-${index}`}
//                       fill={entry.color}
//                     />
//                   ))}
//                 </Pie>
//               </PieChart>
//             </ResponsiveContainer>

//             {/* Custom Legend */}
//             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
//               {alertDistribution.map((item) => (
//                 <div
//                   key={item.name}
//                   style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
//                 >
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                     <div
//                       style={{
//                         width: "10px",
//                         height: "10px",
//                         borderRadius: "2px",
//                         backgroundColor: item.color
//                       }}
//                     />
//                     <span
//                       style={{
//                         fontSize: "11px",
//                         color: "var(--text)",
//                         fontFamily: "Barlow, sans-serif",
//                       }}
//                     >
//                       {item.name}
//                     </span>
//                   </div>
//                   <span
//                     style={{
//                       fontSize: "12px",
//                       fontFamily: "Share Tech Mono, monospace",
//                       color: "var(--muted)",
//                     }}
//                   >
//                     {item.value}%
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Risk Score Trend */}
//         <div
//           style={{
//             padding: "14px",
//             borderRadius: "8px",
//             backgroundColor: "#1A2030",
//             border: "1px solid var(--border)",
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
//             RISK SCORE TREND — LAST 14 DAYS
//           </div>

//           <ResponsiveContainer width="100%" height={160}>
//             <AreaChart data={riskScoreTrend}>
//               <CartesianGrid
//                 strokeDasharray="3 3"
//                 stroke="rgba(42, 51, 71, 0.5)"
//               />
//               <XAxis
//                 dataKey="date"
//                 stroke="var(--muted)"
//                 style={{
//                   fontSize: "9px",
//                   fontFamily: "Share Tech Mono, monospace",
//                 }}
//                 tickFormatter={(v) => `Mar ${v}`}
//               />
//               <YAxis
//                 domain={[0, 100]}
//                 stroke="var(--muted)"
//                 style={{
//                   fontSize: "9px",
//                   fontFamily: "Share Tech Mono, monospace",
//                 }}
//               />
//               <Area
//                 type="monotone"
//                 dataKey="score"
//                 stroke="#f59e0b"
//                 fill="rgba(245, 158, 11, 0.08)"
//                 strokeWidth={2}
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       <div style={{ height: "12px" }}></div>

//       {/* Compliance Audit Trail Table */}
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
//           COMPLIANCE & SAFETY AUDIT TRAIL
//         </div>

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
//               >
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
//                   DATE
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
//                   CHECK ITEM
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
//                   SENSOR DATA
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
//                   STATUS
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
//                   INSPECTOR
//                 </th>
//                </tr>
//             </thead>
//             <tbody>
//               {auditData.map((audit, index) => (
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
//                     {audit.date}
//                    </td>
//                   <td
//                     style={{
//                       padding: "12px",
//                       color: "var(--text)",
//                     }}
//                   >
//                     {audit.checkItem}
//                    </td>
//                   <td
//                     style={{
//                       padding: "12px",
//                       fontFamily: "Share Tech Mono, monospace",
//                       fontSize: "11px",
//                       color: "var(--muted)",
//                     }}
//                   >
//                     {audit.sensorData}
//                    </td>
//                   <td
//                     style={{
//                       padding: "12px",
//                     }}
//                   >
//                     <SeverityBadge severity={audit.status} />
//                    </td>
//                   <td
//                     style={{
//                       padding: "12px",
//                       color: "var(--text)",
//                     }}
//                   >
//                     {audit.inspector}
//                    </td>
//                  </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div style={{ height: "12px" }}></div>

//       {/* Export Buttons */}
//       <div style={{ display: 'flex', gap: '12px' }}>
//         <button
//           style={{
//             padding: "8px 16px",
//             borderRadius: "4px",
//             fontSize: "11px",
//             fontWeight: 600,
//             fontFamily: "Barlow, sans-serif",
//             letterSpacing: "0.08em",
//             backgroundColor: "rgba(245, 158, 11, 0.15)",
//             border: "1px solid var(--amber)",
//             color: "var(--amber)",
//             cursor: "pointer",
//             transition: "opacity 0.2s ease"
//           }}
//           onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
//           onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
//         >
//           EXPORT PDF REPORT
//         </button>

//         <button
//           style={{
//             padding: "8px 16px",
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
//           onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
//           onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
//         >
//           EXPORT CSV DATA
//         </button>

//         <button
//           style={{
//             padding: "8px 16px",
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
//           onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
//           onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
//         >
//           SHARE AUDIT TRAIL
//         </button>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useMemo } from "react";
import { StatCard } from "../components/StatCard";
import { SeverityBadge } from "../components/SeverityBadge";
import { getAllReadings, calculateRiskScore } from "../../services/firebaseService";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Download, FileText, Share2 } from "lucide-react";

export function Reports() {
  const [alertDistribution, setAlertDistribution] = useState([
    { name: "Soil", value: 0, color: "#ef4444" },
    { name: "Vibration", value: 0, color: "#f59e0b" },
    { name: "Tilt", value: 0, color: "#3b82f6" },
    { name: "Crack", value: 0, color: "#22c55e" },
  ]);
  const [riskScoreTrend, setRiskScoreTrend] = useState([]);
  const [weeklyRiskTrend, setWeeklyRiskTrend] = useState([]);
  const [stats, setStats] = useState({
    totalAlerts: 0,
    criticalEvents: 0,
    warningEvents: 0,
    avgResponseTime: "3m 12s",
    dataQuality: "98%"
  });
  const [exporting, setExporting] = useState(false);

  // Calculate real alert distribution from readings
  const calculateAlertDistribution = (readings) => {
    let soilAlerts = 0;
    let vibrationAlerts = 0;
    let tiltAlerts = 0;
    let crackAlerts = 0;
    
    readings.forEach(reading => {
      // Soil alerts (soil > 60%)
      if ((reading.soil_20cm || 0) > 60) soilAlerts++;
      
      // Vibration alerts (vibration > 0.2g)
      if (Math.abs(reading.acceleration_x || 0) > 0.2) vibrationAlerts++;
      
      // Tilt alerts (tilt > 5°)
      if (Math.abs(reading.rotation_x || 0) > 5) tiltAlerts++;
      
      // Crack alerts (crack > 3.5mm)
      if ((reading.crack_width || 0) > 3.5) crackAlerts++;
    });
    
    const total = soilAlerts + vibrationAlerts + tiltAlerts + crackAlerts;
    
    if (total === 0) {
      return [
        { name: "Soil", value: 25, color: "#ef4444" },
        { name: "Vibration", value: 25, color: "#f59e0b" },
        { name: "Tilt", value: 25, color: "#3b82f6" },
        { name: "Crack", value: 25, color: "#22c55e" },
      ];
    }
    
    return [
      { name: "Soil", value: Math.round((soilAlerts / total) * 100), color: "#ef4444" },
      { name: "Vibration", value: Math.round((vibrationAlerts / total) * 100), color: "#f59e0b" },
      { name: "Tilt", value: Math.round((tiltAlerts / total) * 100), color: "#3b82f6" },
      { name: "Crack", value: Math.round((crackAlerts / total) * 100), color: "#22c55e" },
    ];
  };

  // Calculate risk score trend over time
  const calculateRiskTrend = (readings, days = 14) => {
    const dailyRisk = {};
    
    readings.forEach(reading => {
      const date = new Date(reading.timestamp).toLocaleDateString();
      const riskScore = calculateRiskScore(reading);
      
      if (!dailyRisk[date] || riskScore > dailyRisk[date].max) {
        dailyRisk[date] = {
          date: date,
          max: riskScore,
          avg: riskScore,
          count: 1
        };
      } else {
        dailyRisk[date].avg = (dailyRisk[date].avg * dailyRisk[date].count + riskScore) / (dailyRisk[date].count + 1);
        dailyRisk[date].count++;
      }
    });
    
    // Get last 'days' entries
    const trend = Object.values(dailyRisk).slice(-days).map(d => ({
      date: d.date,
      score: d.max,
      avgScore: Math.round(d.avg)
    }));
    
    return trend;
  };

  // Calculate weekly risk trend
  const calculateWeeklyTrend = (readings) => {
    const weeklyData = {};
    
    readings.forEach(reading => {
      const date = new Date(reading.timestamp);
      const weekNum = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
      const riskScore = calculateRiskScore(reading);
      
      if (!weeklyData[weekNum]) {
        weeklyData[weekNum] = { week: weekNum, avgRisk: 0, count: 0, maxRisk: 0 };
      }
      weeklyData[weekNum].avgRisk += riskScore;
      weeklyData[weekNum].count++;
      weeklyData[weekNum].maxRisk = Math.max(weeklyData[weekNum].maxRisk, riskScore);
    });
    
    return Object.values(weeklyData).slice(-8).map(w => ({
      week: w.week,
      avgRisk: Math.round(w.avgRisk / w.count),
      maxRisk: w.maxRisk
    }));
  };

  // Export to CSV
  const exportToCSV = () => {
    setExporting(true);
    try {
      const headers = ["Date", "Risk Score", "Risk Level", "Soil (%)", "Crack (mm)", "Tilt (°)", "Vibration (g)"];
      const rows = riskScoreTrend.map(trend => {
        // Find reading for that date
        return [
          trend.date,
          trend.score,
          trend.score > 70 ? "CRITICAL" : trend.score > 40 ? "WARNING" : "SAFE",
          "-",
          "-",
          "-",
          "-"
        ];
      });
      
      const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `risk_report_${new Date().toISOString().slice(0, 19)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
      alert("Error exporting data");
    }
    setExporting(false);
  };

  // Export to PDF (simulated - opens print dialog)
  const exportToPDF = () => {
    window.print();
  };

  // Share audit trail (copy to clipboard)
  const shareAuditTrail = () => {
    const auditSummary = auditData.map(a => 
      `${a.date}: ${a.checkItem} - ${a.status.toUpperCase()}`
    ).join("\n");
    
    navigator.clipboard.writeText(auditSummary);
    alert("Audit trail copied to clipboard!");
  };

  useEffect(() => {
    getAllReadings((readings) => {
      if (readings && readings.length > 0) {
        // Calculate alert distribution
        const distribution = calculateAlertDistribution(readings);
        setAlertDistribution(distribution);
        
        // Calculate risk score trend
        const trend = calculateRiskTrend(readings, 14);
        setRiskScoreTrend(trend);
        
        // Calculate weekly trend
        const weekly = calculateWeeklyTrend(readings);
        setWeeklyRiskTrend(weekly);
        
        // Calculate statistics
        let criticalCount = 0;
        let warningCount = 0;
        
        readings.forEach(reading => {
          const riskScore = calculateRiskScore(reading);
          if (riskScore > 70) criticalCount++;
          else if (riskScore > 40) warningCount++;
        });
        
        // Calculate total alerts (threshold breaches)
        let totalAlerts = 0;
        readings.forEach(reading => {
          if ((reading.soil_20cm || 0) > 60) totalAlerts++;
          if (Math.abs(reading.rotation_x || 0) > 5) totalAlerts++;
          if (Math.abs(reading.acceleration_x || 0) > 0.2) totalAlerts++;
          if ((reading.crack_width || 0) > 3.5) totalAlerts++;
        });
        
        setStats({
          totalAlerts: totalAlerts,
          criticalEvents: criticalCount,
          warningEvents: warningCount,
          avgResponseTime: "3m 12s",
          dataQuality: `${Math.round((readings.filter(r => r.crack_width !== undefined).length / readings.length) * 100)}%`
        });
      }
    });
  }, []);

  // Generate audit data dynamically based on actual readings
  const auditData = useMemo(() => {
    const today = new Date().toLocaleDateString();
    return [
      {
        date: today,
        checkItem: "Soil saturation check",
        sensorData: `${alertDistribution[0]?.value || 0}% alerts`,
        status: (alertDistribution[0]?.value || 0) > 30 ? "fail" : "pass",
        inspector: "E.A. Abeysinghe",
        recommendation: (alertDistribution[0]?.value || 0) > 30 ? "Increase drainage monitoring" : "Normal operation"
      },
      {
        date: today,
        checkItem: "Structural tilt review",
        sensorData: `${alertDistribution[2]?.value || 0}% alerts`,
        status: (alertDistribution[2]?.value || 0) > 30 ? "fail" : (alertDistribution[2]?.value || 0) > 15 ? "warning" : "pass",
        inspector: "R.A.D.N. Rupasinghe",
        recommendation: (alertDistribution[2]?.value || 0) > 30 ? "Immediate structural inspection required" : "Continue monitoring"
      },
      {
        date: today,
        checkItem: "Vibration tolerance",
        sensorData: `${alertDistribution[1]?.value || 0}% alerts`,
        status: (alertDistribution[1]?.value || 0) > 30 ? "fail" : "pass",
        inspector: "J.V.D. Jayarathna",
        recommendation: "Restrict heavy machinery operations"
      },
      {
        date: today,
        checkItem: "Crack displacement",
        sensorData: `${alertDistribution[3]?.value || 0}% alerts`,
        status: (alertDistribution[3]?.value || 0) > 15 ? "fail" : "pass",
        inspector: "A. Thrimanna",
        recommendation: (alertDistribution[3]?.value || 0) > 15 ? "Schedule immediate repair" : "Routine monitoring"
      },
    ];
  }, [alertDistribution]);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: "#1A2030", padding: "8px 12px", border: "1px solid var(--border)", borderRadius: "6px" }}>
          <p style={{ margin: 0, fontSize: "11px", color: "var(--text)" }}>{label}</p>
          <p style={{ margin: "4px 0 0", fontSize: "10px", color: "#f59e0b" }}>
            Risk Score: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* KPI Row - 4 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        <StatCard
          label="TOTAL ALERTS"
          value={stats.totalAlerts}
          sub="Threshold breaches"
          color="var(--amber)"
          centered
        />
        <StatCard
          label="CRITICAL EVENTS"
          value={stats.criticalEvents}
          sub="Risk score >70"
          color="var(--red)"
          centered
        />
        <StatCard
          label="WARNING EVENTS"
          value={stats.warningEvents}
          sub="Risk score 40-70"
          color="var(--amber)"
          centered
        />
        <StatCard
          label="DATA QUALITY"
          value={stats.dataQuality}
          sub="Complete readings"
          color="var(--green)"
          centered
        />
      </div>

      {/* Charts Row - 2 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        
        {/* Alert Distribution Pie Chart */}
        <div
          style={{
            padding: "16px",
            borderRadius: "8px",
            backgroundColor: "#1A2030",
            border: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "var(--muted)",
              letterSpacing: "0.1em",
              marginBottom: "16px",
              fontFamily: "Barlow, sans-serif",
            }}
          >
            ALERT DISTRIBUTION BY SENSOR
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={alertDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {alertDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1A2030", border: "1px solid var(--border)", fontSize: "11px" }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {alertDistribution.map((item) => (
                <div
                  key={item.name}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "2px",
                        backgroundColor: item.color
                      }}
                    />
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--text)",
                        fontFamily: "Barlow, sans-serif",
                      }}
                    >
                      {item.name}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      fontFamily: "Share Tech Mono, monospace",
                      color: "var(--muted)",
                    }}
                  >
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Score Trend Chart */}
        <div
          style={{
            padding: "16px",
            borderRadius: "8px",
            backgroundColor: "#1A2030",
            border: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "var(--muted)",
              letterSpacing: "0.1em",
              marginBottom: "16px",
              fontFamily: "Barlow, sans-serif",
            }}
          >
            RISK SCORE TREND — LAST 14 DAYS
          </div>

          {riskScoreTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={riskScoreTrend}>
                <defs>
                  <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 51, 71, 0.5)" />
                <XAxis 
                  dataKey="date" 
                  stroke="var(--muted)" 
                  style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }}
                  interval={Math.floor(riskScoreTrend.length / 7)}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="var(--muted)"
                  style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="url(#riskGradient)"
                  name="Risk Score"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: "center", padding: "60px", color: "var(--muted)" }}>
              No data available for trend analysis
            </div>
          )}
        </div>
      </div>

      {/* Weekly Risk Trend Bar Chart */}
      {weeklyRiskTrend.length > 0 && (
        <>
          <div style={{ height: "8px" }}></div>
          <div
            style={{
              padding: "16px",
              borderRadius: "8px",
              backgroundColor: "#1A2030",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "var(--muted)",
                letterSpacing: "0.1em",
                marginBottom: "16px",
                fontFamily: "Barlow, sans-serif",
              }}
            >
              WEEKLY AVERAGE RISK SCORE
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyRiskTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 51, 71, 0.5)" />
                <XAxis dataKey="week" stroke="var(--muted)" style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
                <YAxis domain={[0, 100]} stroke="var(--muted)" style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
                <Tooltip contentStyle={{ backgroundColor: "#1A2030", border: "1px solid var(--border)", fontSize: "11px" }} />
                <Legend wrapperStyle={{ fontSize: "10px" }} />
                <Bar dataKey="avgRisk" name="Average Risk" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="maxRisk" name="Maximum Risk" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Compliance Audit Trail Table */}
      <div
        style={{
          padding: "16px",
          borderRadius: "8px",
          backgroundColor: "#1A2030",
          border: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            fontSize: "10px",
            fontWeight: 600,
            color: "var(--muted)",
            letterSpacing: "0.1em",
            marginBottom: "16px",
            fontFamily: "Barlow, sans-serif",
          }}
        >
          COMPLIANCE & SAFETY AUDIT TRAIL
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: "100%",
              fontSize: "12px",
              fontFamily: "Barlow, sans-serif",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th style={{ fontSize: "9px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.15em", padding: "10px 12px", textAlign: "left" }}>DATE</th>
                <th style={{ fontSize: "9px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.15em", padding: "10px 12px", textAlign: "left" }}>CHECK ITEM</th>
                <th style={{ fontSize: "9px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.15em", padding: "10px 12px", textAlign: "left" }}>SENSOR DATA</th>
                <th style={{ fontSize: "9px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.15em", padding: "10px 12px", textAlign: "left" }}>STATUS</th>
                <th style={{ fontSize: "9px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.15em", padding: "10px 12px", textAlign: "left" }}>INSPECTOR</th>
                <th style={{ fontSize: "9px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.15em", padding: "10px 12px", textAlign: "left" }}>RECOMMENDATION</th>
              </tr>
            </thead>
            <tbody>
              {auditData.map((audit, index) => (
                <tr key={index} style={{ borderBottom: "1px solid rgba(42, 51, 71, 0.5)" }}>
                  <td style={{ padding: "12px", fontFamily: "Share Tech Mono, monospace", fontSize: "11px", color: "var(--text)" }}>{audit.date}</td>
                  <td style={{ padding: "12px", color: "var(--text)" }}>{audit.checkItem}</td>
                  <td style={{ padding: "12px", fontFamily: "Share Tech Mono, monospace", fontSize: "11px", color: "var(--muted)" }}>{audit.sensorData}</td>
                  <td style={{ padding: "12px" }}><SeverityBadge severity={audit.status} /></td>
                  <td style={{ padding: "12px", color: "var(--text)" }}>{audit.inspector}</td>
                  <td style={{ padding: "12px", fontSize: "10px", color: audit.status === "fail" ? "var(--red)" : "var(--green)" }}>
                    {audit.recommendation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Buttons - Now Functional */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button 
          onClick={exportToPDF}
          style={{ 
            padding: "8px 20px", 
            borderRadius: "6px", 
            fontSize: "11px", 
            fontWeight: 600, 
            fontFamily: "Barlow, sans-serif", 
            letterSpacing: "0.08em", 
            backgroundColor: "rgba(245, 158, 11, 0.15)", 
            border: "1px solid var(--amber)", 
            color: "var(--amber)", 
            cursor: "pointer", 
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s ease" 
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.8" }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1" }}
        >
          <FileText size={14} /> EXPORT PDF REPORT
        </button>
        
        <button 
          onClick={exportToCSV}
          disabled={exporting}
          style={{ 
            padding: "8px 20px", 
            borderRadius: "6px", 
            fontSize: "11px", 
            fontWeight: 600, 
            fontFamily: "Barlow, sans-serif", 
            letterSpacing: "0.08em", 
            backgroundColor: "var(--bg3)", 
            border: "1px solid var(--border)", 
            color: "var(--text)", 
            cursor: exporting ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s ease",
            opacity: exporting ? 0.6 : 1
          }}
          onMouseEnter={e => { if (!exporting) e.currentTarget.style.opacity = "0.8" }}
          onMouseLeave={e => { if (!exporting) e.currentTarget.style.opacity = "1" }}
        >
          <Download size={14} /> {exporting ? "EXPORTING..." : "EXPORT CSV DATA"}
        </button>
        
        <button 
          onClick={shareAuditTrail}
          style={{ 
            padding: "8px 20px", 
            borderRadius: "6px", 
            fontSize: "11px", 
            fontWeight: 600, 
            fontFamily: "Barlow, sans-serif", 
            letterSpacing: "0.08em", 
            backgroundColor: "var(--bg3)", 
            border: "1px solid var(--border)", 
            color: "var(--text)", 
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s ease" 
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          <Share2 size={14} /> SHARE AUDIT TRAIL
        </button>
      </div>

      {/* Footer note */}
      <div style={{ 
        fontSize: "9px", 
        color: "var(--muted)", 
        textAlign: "center", 
        padding: "12px",
        borderTop: "1px solid var(--border)",
        marginTop: "8px"
      }}>
        📊 Data based on real-time sensor readings • Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
}


// import { useState, useEffect } from "react";
// import { StatCard } from "../components/StatCard";
// import { SeverityBadge } from "../components/SeverityBadge";
// import { getAllReadings, getAlertDistribution, getRiskScoreTrend, calculateRiskScore } from "../../services/firebaseService";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   AreaChart,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Area,
// } from "recharts";

// export function Reports() {
//   const [alertDistribution, setAlertDistribution] = useState([
//     { name: "Soil", value: 38, color: "#ef4444" },
//     { name: "Vibration", value: 29, color: "#f59e0b" },
//     { name: "Tilt", value: 25, color: "#3b82f6" },
//     { name: "Crack", value: 8, color: "#22c55e" },
//   ]);
//   const [riskScoreTrend, setRiskScoreTrend] = useState([]);
//   const [stats, setStats] = useState({
//     totalAlerts: 0,
//     criticalEvents: 0,
//     avgResponseTime: "0m 0s"
//   });

//   useEffect(() => {
//     // Get real alert distribution
//     getAlertDistribution((distribution) => {
//       setAlertDistribution(distribution);
//     });

//     // Get risk score trend
//     getRiskScoreTrend(14, (trend) => {
//       setRiskScoreTrend(trend);
//     });

//     // Calculate stats from real data
//     getAllReadings((readings) => {
//       if (readings && readings.length > 0) {
//         let criticalCount = 0;
//         readings.forEach(reading => {
//           const riskScore = calculateRiskScore(reading);
//           if (riskScore > 70) criticalCount++;
//         });
        
//         setStats({
//           totalAlerts: readings.length,
//           criticalEvents: criticalCount,
//           avgResponseTime: "3m 12s" // This would come from alert acknowledgment data
//         });
//       }
//     });
//   }, []);

//   const auditData = [
//     {
//       date: new Date().toLocaleDateString(),
//       checkItem: "Soil saturation check",
//       sensorData: `${alertDistribution[0]?.value || 38}% alerts`,
//       status: alertDistribution[0]?.value > 30 ? "fail" : "pass",
//       inspector: "E.A. Abeysinghe",
//     },
//     {
//       date: new Date().toLocaleDateString(),
//       checkItem: "Structural tilt review",
//       sensorData: `${alertDistribution[2]?.value || 25}% alerts`,
//       status: alertDistribution[2]?.value > 30 ? "fail" : "pass",
//       inspector: "R.A.D.N. Rupasinghe",
//     },
//     {
//       date: new Date().toLocaleDateString(),
//       checkItem: "Vibration tolerance",
//       sensorData: `${alertDistribution[1]?.value || 29}% alerts`,
//       status: alertDistribution[1]?.value > 30 ? "fail" : "pass",
//       inspector: "J.V.D. Jayarathna",
//     },
//     {
//       date: new Date().toLocaleDateString(),
//       checkItem: "Crack displacement",
//       sensorData: `${alertDistribution[3]?.value || 8}% alerts`,
//       status: alertDistribution[3]?.value > 15 ? "fail" : "pass",
//       inspector: "A. Thrimanna",
//     },
//   ];

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//       {/* KPI Row - 4 columns */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
//         <StatCard
//           label="TOTAL ALERTS"
//           value={stats.totalAlerts}
//           sub="Total readings"
//           color="var(--amber)"
//           centered
//         />
//         <StatCard
//           label="CRITICAL EVENTS"
//           value={stats.criticalEvents}
//           sub="Risk score >70"
//           color="var(--red)"
//           centered
//         />
//         <StatCard
//           label="AVG RESPONSE"
//           value={stats.avgResponseTime}
//           sub="Alert to Ack"
//           color="var(--green)"
//           centered
//         />
//         <StatCard
//           label="SUS SCORE"
//           value="81"
//           sub="Usability (target ≥75)"
//           color="var(--green)"
//           centered
//         />
//       </div>

//       <div style={{ height: "12px" }}></div>

//       {/* Charts Row - 2 columns */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
//         {/* Monthly Alert Distribution */}
//         <div
//           style={{
//             padding: "14px",
//             borderRadius: "8px",
//             backgroundColor: "#1A2030",
//             border: "1px solid var(--border)",
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
//             ALERT DISTRIBUTION BY SENSOR
//           </div>

//           <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
//             <ResponsiveContainer width={180} height={180}>
//               <PieChart>
//                 <Pie
//                   data={alertDistribution}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={55}
//                   outerRadius={80}
//                   paddingAngle={2}
//                   dataKey="value"
//                 >
//                   {alertDistribution.map((entry, index) => (
//                     <Cell
//                       key={`cell-${index}`}
//                       fill={entry.color}
//                     />
//                   ))}
//                 </Pie>
//               </PieChart>
//             </ResponsiveContainer>

//             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
//               {alertDistribution.map((item) => (
//                 <div
//                   key={item.name}
//                   style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
//                 >
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                     <div
//                       style={{
//                         width: "10px",
//                         height: "10px",
//                         borderRadius: "2px",
//                         backgroundColor: item.color
//                       }}
//                     />
//                     <span
//                       style={{
//                         fontSize: "11px",
//                         color: "var(--text)",
//                         fontFamily: "Barlow, sans-serif",
//                       }}
//                     >
//                       {item.name}
//                     </span>
//                   </div>
//                   <span
//                     style={{
//                       fontSize: "12px",
//                       fontFamily: "Share Tech Mono, monospace",
//                       color: "var(--muted)",
//                     }}
//                   >
//                     {item.value}%
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Risk Score Trend */}
//         <div
//           style={{
//             padding: "14px",
//             borderRadius: "8px",
//             backgroundColor: "#1A2030",
//             border: "1px solid var(--border)",
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
//             RISK SCORE TREND — LAST 14 DAYS
//           </div>

//           <ResponsiveContainer width="100%" height={160}>
//             <AreaChart data={riskScoreTrend}>
//               <CartesianGrid
//                 strokeDasharray="3 3"
//                 stroke="rgba(42, 51, 71, 0.5)"
//               />
//               <XAxis
//                 dataKey="date"
//                 stroke="var(--muted)"
//                 style={{
//                   fontSize: "9px",
//                   fontFamily: "Share Tech Mono, monospace",
//                 }}
//               />
//               <YAxis
//                 domain={[0, 100]}
//                 stroke="var(--muted)"
//                 style={{
//                   fontSize: "9px",
//                   fontFamily: "Share Tech Mono, monospace",
//                 }}
//               />
//               <Area
//                 type="monotone"
//                 dataKey="score"
//                 stroke="#f59e0b"
//                 fill="rgba(245, 158, 11, 0.08)"
//                 strokeWidth={2}
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       <div style={{ height: "12px" }}></div>

//       {/* Compliance Audit Trail Table */}
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
//           COMPLIANCE & SAFETY AUDIT TRAIL
//         </div>

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
//               >
//                 <th style={{ fontSize: "9px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.15em", padding: "8px 12px", textAlign: "left" }}>DATE</th>
//                 <th style={{ fontSize: "9px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.15em", padding: "8px 12px", textAlign: "left" }}>CHECK ITEM</th>
//                 <th style={{ fontSize: "9px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.15em", padding: "8px 12px", textAlign: "left" }}>SENSOR DATA</th>
//                 <th style={{ fontSize: "9px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.15em", padding: "8px 12px", textAlign: "left" }}>STATUS</th>
//                 <th style={{ fontSize: "9px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.15em", padding: "8px 12px", textAlign: "left" }}>INSPECTOR</th>
//               </tr>
//             </thead>
//             <tbody>
//               {auditData.map((audit, index) => (
//                 <tr key={index} style={{ borderBottom: "1px solid rgba(42, 51, 71, 0.5)" }}>
//                   <td style={{ padding: "12px", fontFamily: "Share Tech Mono, monospace", fontSize: "11px", color: "var(--text)" }}>{audit.date}</td>
//                   <td style={{ padding: "12px", color: "var(--text)" }}>{audit.checkItem}</td>
//                   <td style={{ padding: "12px", fontFamily: "Share Tech Mono, monospace", fontSize: "11px", color: "var(--muted)" }}>{audit.sensorData}</td>
//                   <td style={{ padding: "12px" }}><SeverityBadge severity={audit.status} /></td>
//                   <td style={{ padding: "12px", color: "var(--text)" }}>{audit.inspector}</td>
//                 </tr>
//               ))}
//             </tbody>
//            </table>
//         </div>
//       </div>

//       <div style={{ height: "12px" }}></div>

//       {/* Export Buttons */}
//       <div style={{ display: 'flex', gap: '12px' }}>
//         <button style={{ padding: "8px 16px", borderRadius: "4px", fontSize: "11px", fontWeight: 600, fontFamily: "Barlow, sans-serif", letterSpacing: "0.08em", backgroundColor: "rgba(245, 158, 11, 0.15)", border: "1px solid var(--amber)", color: "var(--amber)", cursor: "pointer", transition: "opacity 0.2s ease" }}>EXPORT PDF REPORT</button>
//         <button style={{ padding: "8px 16px", borderRadius: "4px", fontSize: "11px", fontWeight: 600, fontFamily: "Barlow, sans-serif", letterSpacing: "0.08em", backgroundColor: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text)", cursor: "pointer", transition: "opacity 0.2s ease" }}>EXPORT CSV DATA</button>
//         <button style={{ padding: "8px 16px", borderRadius: "4px", fontSize: "11px", fontWeight: 600, fontFamily: "Barlow, sans-serif", letterSpacing: "0.08em", backgroundColor: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text)", cursor: "pointer", transition: "opacity 0.2s ease" }}>SHARE AUDIT TRAIL</button>
//       </div>
//     </div>
//   );
// }