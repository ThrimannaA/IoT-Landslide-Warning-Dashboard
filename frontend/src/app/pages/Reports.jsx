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

import { useState, useEffect } from "react";
import { StatCard } from "../components/StatCard";
import { SeverityBadge } from "../components/SeverityBadge";
import { getAllReadings, getAlertDistribution, getRiskScoreTrend, calculateRiskScore } from "../../services/firebaseService";
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
} from "recharts";

export function Reports() {
  const [alertDistribution, setAlertDistribution] = useState([
    { name: "Soil", value: 38, color: "#ef4444" },
    { name: "Vibration", value: 29, color: "#f59e0b" },
    { name: "Tilt", value: 25, color: "#3b82f6" },
    { name: "Crack", value: 8, color: "#22c55e" },
  ]);
  const [riskScoreTrend, setRiskScoreTrend] = useState([]);
  const [stats, setStats] = useState({
    totalAlerts: 0,
    criticalEvents: 0,
    avgResponseTime: "0m 0s"
  });

  useEffect(() => {
    // Get real alert distribution
    getAlertDistribution((distribution) => {
      setAlertDistribution(distribution);
    });

    // Get risk score trend
    getRiskScoreTrend(14, (trend) => {
      setRiskScoreTrend(trend);
    });

    // Calculate stats from real data
    getAllReadings((readings) => {
      if (readings && readings.length > 0) {
        let criticalCount = 0;
        readings.forEach(reading => {
          const riskScore = calculateRiskScore(reading);
          if (riskScore > 70) criticalCount++;
        });
        
        setStats({
          totalAlerts: readings.length,
          criticalEvents: criticalCount,
          avgResponseTime: "3m 12s" // This would come from alert acknowledgment data
        });
      }
    });
  }, []);

  const auditData = [
    {
      date: new Date().toLocaleDateString(),
      checkItem: "Soil saturation check",
      sensorData: `${alertDistribution[0]?.value || 38}% alerts`,
      status: alertDistribution[0]?.value > 30 ? "fail" : "pass",
      inspector: "E.A. Abeysinghe",
    },
    {
      date: new Date().toLocaleDateString(),
      checkItem: "Structural tilt review",
      sensorData: `${alertDistribution[2]?.value || 25}% alerts`,
      status: alertDistribution[2]?.value > 30 ? "fail" : "pass",
      inspector: "R.A.D.N. Rupasinghe",
    },
    {
      date: new Date().toLocaleDateString(),
      checkItem: "Vibration tolerance",
      sensorData: `${alertDistribution[1]?.value || 29}% alerts`,
      status: alertDistribution[1]?.value > 30 ? "fail" : "pass",
      inspector: "J.V.D. Jayarathna",
    },
    {
      date: new Date().toLocaleDateString(),
      checkItem: "Crack displacement",
      sensorData: `${alertDistribution[3]?.value || 8}% alerts`,
      status: alertDistribution[3]?.value > 15 ? "fail" : "pass",
      inspector: "A. Thrimanna",
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* KPI Row - 4 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        <StatCard
          label="TOTAL ALERTS"
          value={stats.totalAlerts}
          sub="Total readings"
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
          label="AVG RESPONSE"
          value={stats.avgResponseTime}
          sub="Alert to Ack"
          color="var(--green)"
          centered
        />
        <StatCard
          label="SUS SCORE"
          value="81"
          sub="Usability (target ≥75)"
          color="var(--green)"
          centered
        />
      </div>

      <div style={{ height: "12px" }}></div>

      {/* Charts Row - 2 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {/* Monthly Alert Distribution */}
        <div
          style={{
            padding: "14px",
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
              marginBottom: "12px",
              fontFamily: "Barlow, sans-serif",
            }}
          >
            ALERT DISTRIBUTION BY SENSOR
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
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
              </PieChart>
            </ResponsiveContainer>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
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

        {/* Risk Score Trend */}
        <div
          style={{
            padding: "14px",
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
              marginBottom: "12px",
              fontFamily: "Barlow, sans-serif",
            }}
          >
            RISK SCORE TREND — LAST 14 DAYS
          </div>

          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={riskScoreTrend}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(42, 51, 71, 0.5)"
              />
              <XAxis
                dataKey="date"
                stroke="var(--muted)"
                style={{
                  fontSize: "9px",
                  fontFamily: "Share Tech Mono, monospace",
                }}
              />
              <YAxis
                domain={[0, 100]}
                stroke="var(--muted)"
                style={{
                  fontSize: "9px",
                  fontFamily: "Share Tech Mono, monospace",
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#f59e0b"
                fill="rgba(245, 158, 11, 0.08)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ height: "12px" }}></div>

      {/* Compliance Audit Trail Table */}
      <div
        style={{
          padding: "14px",
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
            marginBottom: "12px",
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
              <tr
                style={{
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <th style={{ fontSize: "9px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.15em", padding: "8px 12px", textAlign: "left" }}>DATE</th>
                <th style={{ fontSize: "9px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.15em", padding: "8px 12px", textAlign: "left" }}>CHECK ITEM</th>
                <th style={{ fontSize: "9px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.15em", padding: "8px 12px", textAlign: "left" }}>SENSOR DATA</th>
                <th style={{ fontSize: "9px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.15em", padding: "8px 12px", textAlign: "left" }}>STATUS</th>
                <th style={{ fontSize: "9px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.15em", padding: "8px 12px", textAlign: "left" }}>INSPECTOR</th>
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
                </tr>
              ))}
            </tbody>
           </table>
        </div>
      </div>

      <div style={{ height: "12px" }}></div>

      {/* Export Buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button style={{ padding: "8px 16px", borderRadius: "4px", fontSize: "11px", fontWeight: 600, fontFamily: "Barlow, sans-serif", letterSpacing: "0.08em", backgroundColor: "rgba(245, 158, 11, 0.15)", border: "1px solid var(--amber)", color: "var(--amber)", cursor: "pointer", transition: "opacity 0.2s ease" }}>EXPORT PDF REPORT</button>
        <button style={{ padding: "8px 16px", borderRadius: "4px", fontSize: "11px", fontWeight: 600, fontFamily: "Barlow, sans-serif", letterSpacing: "0.08em", backgroundColor: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text)", cursor: "pointer", transition: "opacity 0.2s ease" }}>EXPORT CSV DATA</button>
        <button style={{ padding: "8px 16px", borderRadius: "4px", fontSize: "11px", fontWeight: 600, fontFamily: "Barlow, sans-serif", letterSpacing: "0.08em", backgroundColor: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text)", cursor: "pointer", transition: "opacity 0.2s ease" }}>SHARE AUDIT TRAIL</button>
      </div>
    </div>
  );
}