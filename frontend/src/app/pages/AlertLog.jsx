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
//     description:
//       "Saturation exceeded critical threshold — immediate risk",
//     value: "87%",
//     acknowledged: false,
//   },
//   {
//     time: "14:19:47",
//     sensor: "Tilt / MPU6050",
//     severity: "warning",
//     description:
//       "X-axis tilt approaching critical (8.4° of 10° limit)",
//     value: "8.4°",
//     acknowledged: false,
//   },
//   {
//     time: "14:17:22",
//     sensor: "Vibration",
//     severity: "warning",
//     description:
//       "Vibration spike — possible heavy equipment impact",
//     value: "14.2 p/m",
//     acknowledged: true,
//     ackTime: "14:18",
//   },
//   {
//     time: "11:04:51",
//     sensor: "Soil Moisture",
//     severity: "warning",
//    description:
//       "Gradual moisture rise detected over 2-hr period",
//     value: "74%",
//     acknowledged: true,
//     ackTime: "11:08",
//   },
//   {
//     time: "09:33:10",
//     sensor: "Tilt / MPU6050",
//     severity: "info",
//     description:
//       "Tilt restored to baseline after scaffolding adjustment",
//     value: "1.2°",
//     acknowledged: true,
//     ackTime: "Auto",
//   },
//   {
//     time: "Mar 13",
//     sensor: "Crack (ToF)",
//     severity: "info",
//     description:
//       "Crack width measurement baseline recorded at installation",
//     value: "2.8 mm",
//     acknowledged: true,
//     ackTime: "Auto",
//   },
//   {
//     time: "Mar 12",
//     sensor: "Vibration",
//     severity: "critical",
//     description:
//       "Seismic-level vibration — construction halt enforced",
//     value: "28.7 p/m",
//     acknowledged: true,
//     ackTime: "09:12",
//   },
// ];

// export function AlertLog() {
//   const [activeFilter, setActiveFilter] =
//     useState<FilterType>("all");

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
//         (a) => !a.time.includes("Mar"), // example logic, adjust if needed
//       );
//     }

//     if (activeFilter === "week") {
//       return alertData; // already showing full range, adjust if needed
//     }

//     return alertData;
//   }, [activeFilter]);

//   return (
//     <div className="space-y-3">
//       {/* Filter Bar */}
//       <div className="flex items-center justify-between">
//         <div className="flex gap-2">
//           {filters.map((filter) => (
//             <button
//               key={filter.id}
//               onClick={() => setActiveFilter(filter.id)}
//               className="px-3 py-1 rounded transition-all"
//               style={{
//                 fontSize: "11px",
//                 fontWeight: 600,
//                 fontFamily: "Barlow, sans-serif",
//                 letterSpacing: "0.05em",
//                 backgroundColor:
//                   activeFilter === filter.id
//                     ? "rgba(245, 158, 11, 0.15)"
//                     : "var(--bg3)",
//                 border: `1px solid ${activeFilter === filter.id ? "var(--amber)" : "var(--border)"}`,
//                 color:
//                   activeFilter === filter.id
//                     ? "var(--amber)"
//                     : "var(--text)",
//               }}
//             >
//               {filter.label.toUpperCase()}
//             </button>
//           ))}
//         </div>

//         <button
//           className="px-3 py-1 rounded"
//           style={{
//             fontSize: "11px",
//             fontWeight: 600,
//             fontFamily: "Barlow, sans-serif",
//             letterSpacing: "0.08em",
//             backgroundColor: "var(--bg3)",
//             border: "1px solid var(--border)",
//             color: "var(--text)",
//           }}
//         >
//           EXPORT CSV
//         </button>
//       </div>

//       <div className="h-5"></div>

//       {/* Alert Frequency Chart */}
//       <div
//         className="p-3.5 rounded-lg"
//         style={{
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

//       <div className="h-5"></div>

//       {/* Incident Log Table */}
//       <div
//         className="p-3.5 rounded-lg"
//         style={{
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
//         <div className="overflow-x-auto">
//           <table
//             className="w-full"
//             style={{
//               fontSize: "12px",
//               fontFamily: "Barlow, sans-serif",
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
//               </tr>
//             </thead>
//             <tbody>
//               {filteredAlerts.map((alert, index) => (
//                 <tr
//                   key={index}
//                   style={{
//                     borderBottom:
//                       "1px solid rgba(42, 51, 71, 0.5)",
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
//                       color: alert.acknowledged
//                         ? "var(--green)"
//                         : "var(--amber)",
//                     }}
//                   >
//                     {alert.acknowledged
//                       ? `✓ ${alert.ackTime}`
//                       : "Pending"}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useMemo } from "react";
import { SeverityBadge } from "../components/SeverityBadge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const alertFrequencyData = [
  { date: "Mar 8", critical: 2, warning: 5, info: 3 },
  { date: "Mar 9", critical: 1, warning: 4, info: 2 },
  { date: "Mar 10", critical: 0, warning: 6, info: 4 },
  { date: "Mar 11", critical: 1, warning: 3, info: 1 },
  { date: "Mar 12", critical: 2, warning: 7, info: 3 },
  { date: "Mar 13", critical: 1, warning: 5, info: 2 },
  { date: "Mar 14", critical: 1, warning: 8, info: 5 },
];

const alertData = [
  {
    time: "14:21:03",
    sensor: "Soil Moisture",
    severity: "critical",
    description: "Saturation exceeded critical threshold — immediate risk",
    value: "87%",
    acknowledged: false,
  },
  {
    time: "14:19:47",
    sensor: "Tilt / MPU6050",
    severity: "warning",
    description: "X-axis tilt approaching critical (8.4° of 10° limit)",
    value: "8.4°",
    acknowledged: false,
  },
  {
    time: "14:17:22",
    sensor: "Vibration",
    severity: "warning",
    description: "Vibration spike — possible heavy equipment impact",
    value: "14.2 p/m",
    acknowledged: true,
    ackTime: "14:18",
  },
  {
    time: "11:04:51",
    sensor: "Soil Moisture",
    severity: "warning",
    description: "Gradual moisture rise detected over 2-hr period",
    value: "74%",
    acknowledged: true,
    ackTime: "11:08",
  },
  {
    time: "09:33:10",
    sensor: "Tilt / MPU6050",
    severity: "info",
    description: "Tilt restored to baseline after scaffolding adjustment",
    value: "1.2°",
    acknowledged: true,
    ackTime: "Auto",
  },
  {
    time: "Mar 13",
    sensor: "Crack (ToF)",
    severity: "info",
    description: "Crack width measurement baseline recorded at installation",
    value: "2.8 mm",
    acknowledged: true,
    ackTime: "Auto",
  },
  {
    time: "Mar 12",
    sensor: "Vibration",
    severity: "critical",
    description: "Seismic-level vibration — construction halt enforced",
    value: "28.7 p/m",
    acknowledged: true,
    ackTime: "09:12",
  },
];

export function AlertLog() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "All" },
    { id: "critical", label: "Critical" },
    { id: "warning", label: "Warning" },
    { id: "info", label: "Info" },
    { id: "today", label: "Today" },
    { id: "week", label: "This Week" },
  ];

  const filteredAlerts = useMemo(() => {
    if (activeFilter === "all") return alertData;

    if (activeFilter === "critical") {
      return alertData.filter((a) => a.severity === "critical");
    }

    if (activeFilter === "warning") {
      return alertData.filter((a) => a.severity === "warning");
    }

    if (activeFilter === "info") {
      return alertData.filter((a) => a.severity === "info");
    }

    if (activeFilter === "today") {
      return alertData.filter(
        (a) => !a.time.includes("Mar"),
      );
    }

    if (activeFilter === "week") {
      return alertData;
    }

    return alertData;
  }, [activeFilter]);

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

        <button
          style={{
            padding: "4px 12px",
            borderRadius: "4px",
            fontSize: "11px",
            fontWeight: 600,
            fontFamily: "Barlow, sans-serif",
            letterSpacing: "0.08em",
            backgroundColor: "var(--bg3)",
            border: "1px solid var(--border)",
            color: "var(--text)",
            cursor: "pointer",
            transition: "opacity 0.2s ease"
          }}
        >
          EXPORT CSV
        </button>
      </div>

      <div style={{ height: "20px" }}></div>

      {/* Alert Frequency Chart */}
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
          ALERT FREQUENCY — LAST 7 DAYS
        </div>

        <ResponsiveContainer width="100%" height={100}>
          <BarChart
            key={activeFilter}
            data={alertFrequencyData}
          >
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
              stroke="var(--muted)"
              style={{
                fontSize: "9px",
                fontFamily: "Share Tech Mono, monospace",
              }}
            />
            <Bar
              dataKey="critical"
              stackId="a"
              fill="var(--red)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="warning"
              stackId="a"
              fill="var(--amber)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="info"
              stackId="a"
              fill="var(--blue)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ height: "20px" }}></div>

      {/* Incident Log Table */}
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
          INCIDENT LOG
        </div>

        {/* Table */}
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
              />
                <th
                  style={{
                    fontSize: "9px",
                    fontWeight: 600,
                    color: "var(--muted)",
                    letterSpacing: "0.15em",
                    padding: "8px 12px",
                    textAlign: "left",
                  }}
                >
                  TIME
                </th>
                <th
                  style={{
                    fontSize: "9px",
                    fontWeight: 600,
                    color: "var(--muted)",
                    letterSpacing: "0.15em",
                    padding: "8px 12px",
                    textAlign: "left",
                  }}
                >
                  SENSOR
                </th>
                <th
                  style={{
                    fontSize: "9px",
                    fontWeight: 600,
                    color: "var(--muted)",
                    letterSpacing: "0.15em",
                    padding: "8px 12px",
                    textAlign: "left",
                  }}
                >
                  SEVERITY
                </th>
                <th
                  style={{
                    fontSize: "9px",
                    fontWeight: 600,
                    color: "var(--muted)",
                    letterSpacing: "0.15em",
                    padding: "8px 12px",
                    textAlign: "left",
                  }}
                >
                  EVENT DESCRIPTION
                </th>
                <th
                  style={{
                    fontSize: "9px",
                    fontWeight: 600,
                    color: "var(--muted)",
                    letterSpacing: "0.15em",
                    padding: "8px 12px",
                    textAlign: "left",
                  }}
                >
                  VALUE
                </th>
                <th
                  style={{
                    fontSize: "9px",
                    fontWeight: 600,
                    color: "var(--muted)",
                    letterSpacing: "0.15em",
                    padding: "8px 12px",
                    textAlign: "left",
                  }}
                >
                  ACKNOWLEDGED
                </th>
              \),
            </thead>
            <tbody>
              {filteredAlerts.map((alert, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: "1px solid rgba(42, 51, 71, 0.5)",
                  }}
                >
                  <td
                    style={{
                      padding: "12px",
                      fontFamily: "Share Tech Mono, monospace",
                      fontSize: "11px",
                      color: "var(--text)",
                    }}
                  >
                    {alert.time}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      color: "var(--text)",
                    }}
                  >
                    {alert.sensor}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                    }}
                  >
                    <SeverityBadge severity={alert.severity} />
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      color: "var(--text)",
                    }}
                  >
                    {alert.description}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontFamily: "Share Tech Mono, monospace",
                      fontSize: "11px",
                      color: "var(--text)",
                    }}
                  >
                    {alert.value}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontSize: "11px",
                      fontFamily: "Share Tech Mono, monospace",
                      color: alert.acknowledged ? "var(--green)" : "var(--amber)",
                    }}
                  >
                    {alert.acknowledged ? `✓ ${alert.ackTime}` : "Pending"}
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