import { StatCard } from "../../components/StatCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

const vibrationData = Array.from({ length: 30 }, (_, i) => ({
  time: i, value: 8 + Math.random() * 10,
}));

const vibrationDistribution = [
  { name: "Low", value: 45 },
  { name: "Medium", value: 35 },
  { name: "High", value: 20 }
];
const vibrationColors = ["#22c55e", "#f59e0b", "#ef4444"];

export function VibrationSensor() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <StatCard label="PULSE EVENTS/MIN" value="14.2" sub="Current vibration rate" color="var(--amber)" />
        <StatCard label="PEAK INTENSITY" value="HIGH" sub="Last 30 minutes" color="var(--red)" />
        <StatCard label="RISK LEVEL" value="MODERATE" sub="Based on vibration pattern" color="var(--amber)" />
      </div>

      <div style={{ height: "20px" }}></div>

      <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
        <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: "Barlow, sans-serif" }}>
          REAL-TIME VIBRATION TREND
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={vibrationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 51, 71, 0.5)" />
            <XAxis dataKey="time" stroke="var(--muted)" />
            <YAxis stroke="var(--muted)" />
            <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} dot={false} />
            <ReferenceLine y={15} stroke="red" strokeDasharray="4 4" label={{ value: "CRITICAL LIMIT", position: "right", fill: "red", fontSize: 10 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ height: "20px" }}></div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        <div style={{ gridColumn: 'span 3', padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: "Barlow, sans-serif" }}>
            VIBRATION PULSE FREQUENCY - LAST 30 MINUTES
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={vibrationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 51, 71, 0.5)" />
              <XAxis dataKey="time" stroke="var(--muted)" />
              <YAxis stroke="var(--muted)" />
              <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: "Barlow, sans-serif" }}>
            VIBRATION INTENSITY DISTRIBUTION
          </div>
          <ResponsiveContainer width="100%" height={175}>
            <PieChart>
              <Pie data={vibrationDistribution} cx="50%" cy="50%" innerRadius={25} outerRadius={45} dataKey="value" nameKey="name" label>
                {vibrationDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={vibrationColors[index % vibrationColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ height: "20px" }}></div>

      <div style={{ padding: "16px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
        <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "10px", fontFamily: "Barlow, sans-serif" }}>
          LANDSLIDE RISK PROBABILITY (BASED ON VIBRATION)
        </div>
        <div style={{ width: "100%", height: "20px", borderRadius: "4px", backgroundColor: "gray", position: "relative" }}>
          <div style={{ width: "65%", backgroundColor: "#f59e0b", height: "100%", borderRadius: "4px" }} />
          <div style={{ position: "absolute", right: "5px", top: "-18px", fontSize: "11px", color: "var(--text)" }}>
            65%
          </div>
        </div>
      </div>

      <div style={{ height: "16px" }}></div>

      <div style={{ padding: "16px", borderRadius: "8px", backgroundColor: "rgba(245, 158, 11, 0.08)", border: "1px solid var(--amber)" }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ fontSize: "24px", color: "var(--amber)" }}>⬦</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--amber)", marginBottom: "8px" }}>
              Monitor Ground Stability
            </div>
            <div style={{ fontSize: "12px", color: "var(--text)", lineHeight: 1.5 }}>
              Elevated vibration patterns may indicate early-stage ground instability.
              Correlate with soil moisture and tilt sensor data. If vibration intensity
              continues rising for more than 15 minutes, restrict heavy machinery
              operation and inspect nearby slope areas.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}