import { StatCard } from "../../components/StatCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

const tiltData = Array.from({ length: 30 }, (_, i) => ({
  time: i, x: 3 + i * 0.18, y: 2.1 + (Math.random() * 0.2 - 0.1),
}));

export function TiltSensor() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <StatCard label="X-AXIS TILT" value="8.4°" sub="Current deviation" color="var(--amber)" />
        <StatCard label="Y-AXIS TILT" value="2.1°" sub="Within safe range" color="var(--green)" />
        <StatCard label="ANGULAR VELOCITY" value="0.3 °/s" sub="Rate of change" color="var(--text)" />
      </div>

      <div style={{ height: "20px" }}></div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <StatCard label="RATE OF CHANGE" value="+0.18°" sub="per minute" color="var(--amber)" />
        <StatCard label="EST. TIME TO CRITICAL" value="~9 min" sub="at current rate" color="var(--amber)" />
        <StatCard label="THRESHOLD PROXIMITY" value="84%" sub="of critical limit" color="var(--red)" />
      </div>

      <div style={{ height: "20px" }}></div>

      <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030" }}>
        <div style={{
          fontSize: "10px", fontWeight: 600, color: "var(--muted)",
          letterSpacing: "0.1em", marginBottom: "8px", fontFamily: "Barlow, sans-serif",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span>TILT ANGLE — LAST 30 MINUTES</span>
          <span style={{ fontWeight: 400, fontSize: "9px" }}>
            <span style={{ color: "#f59e0b" }}>— </span>X-axis  
            <span style={{ color: "#22c55e" }}>— </span>Y-axis  
            <span style={{ color: "#ef4444", opacity: 0.8 }}>— — </span>Critical  
            <span style={{ color: "#f59e0b", opacity: 0.8 }}>— — </span>Warning
          </span>
        </div>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={tiltData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 51, 71, 0.5)" />
            <XAxis dataKey="time" stroke="var(--muted)"
              style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }}
              tickFormatter={(v) => `${v}m`} />
            <YAxis domain={[0, 12]} stroke="var(--muted)"
              style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
            <ReferenceLine y={10} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.8}
              label={{ value: "10°", position: "insideTopRight", fill: "#ef4444", fontSize: 9, dy: -6 }} />
            <ReferenceLine y={7} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.8}
              label={{ value: "7°", position: "insideTopRight", fill: "#f59e0b", fontSize: 9, dy: -6 }} />
            <Line type="monotone" dataKey="x" stroke="#f59e0b" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="y" stroke="#22c55e" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ height: "20px" }}></div>

      <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
        <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: "Barlow, sans-serif" }}>
          X-AXIS THRESHOLD PROXIMITY
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <div style={{ fontSize: "10px", fontFamily: "Share Tech Mono, monospace", color: "var(--muted)", width: "24px" }}>0°</div>
          <div style={{ flex: 1, height: "18px", borderRadius: "4px", backgroundColor: "var(--bg3)", position: "relative", overflow: "visible" }}>
            <div style={{
              position: "absolute", left: 0, top: 0, height: "100%",
              width: "84%",
              background: "linear-gradient(to right, #22c55e 0%, #f59e0b 60%, #ef4444 100%)",
              borderRadius: "4px",
            }} />
            <div style={{ position: "absolute", left: "70%", top: "-3px", height: "24px", width: "1.5px", backgroundColor: "#f59e0b", opacity: 0.7 }} />
            <div style={{ position: "absolute", left: "84%", top: "-5px", height: "28px", width: "2.5px", backgroundColor: "white", borderRadius: "2px" }} />
          </div>
          <div style={{ fontSize: "10px", fontFamily: "Share Tech Mono, monospace", color: "var(--muted)", width: "24px" }}>10°</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", fontFamily: "Share Tech Mono, monospace", color: "var(--muted)" }}>
          <span><span style={{ color: "#22c55e" }}>●</span> Safe {"<"}7°</span>
          <span style={{ color: "var(--amber)" }}>Current: 8.4° — 84% to critical</span>
          <span><span style={{ color: "#ef4444" }}>●</span> Critical 10°</span>
        </div>
      </div>

      <div style={{ height: "20px" }}></div>

      <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#1A2030", border: "1px solid var(--border)" }}>
        <div style={{
          fontSize: "10px", fontWeight: 600, color: "var(--muted)",
          letterSpacing: "0.1em", marginBottom: "8px", fontFamily: "Barlow, sans-serif",
          display: "flex", justifyContent: "space-between",
        }}>
          <span>X-AXIS TILT — 7-DAY TREND</span>
          <span style={{ fontWeight: 400, fontSize: "9px", color: "var(--amber)" }}>+5.2° over 7 days</span>
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={[
            { date: "Mar 9", x: 3.2 }, { date: "Mar 10", x: 4.1 },
            { date: "Mar 11", x: 4.8 }, { date: "Mar 12", x: 5.6 },
            { date: "Mar 13", x: 6.4 }, { date: "Mar 14", x: 7.2 },
            { date: "Mar 15", x: 8.4 },
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,51,71,0.5)" />
            <XAxis dataKey="date" stroke="var(--muted)"
              style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
            <YAxis domain={[0, 12]} stroke="var(--muted)"
              style={{ fontSize: "9px", fontFamily: "Share Tech Mono, monospace" }} />
            <ReferenceLine y={10} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.6} />
            <ReferenceLine y={7} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.6} />
            <Line type="monotone" dataKey="x" stroke="#f59e0b" strokeWidth={2} dot={true} />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ fontSize: "10px", color: "var(--muted)", marginTop: "6px", fontFamily: "Share Tech Mono, monospace" }}>
          Consistent upward trend — structural review recommended before tilt reaches critical threshold.
        </div>
      </div>

      <div style={{ height: "20px" }}></div>

      <div style={{ padding: "16px", borderRadius: "8px", backgroundColor: "rgba(245, 158, 11, 0.08)", border: "1px solid var(--amber)" }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ fontSize: "24px", color: "var(--amber)" }}>⬦</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--amber)", marginBottom: "8px" }}>
              Caution — Approaching Limit
            </div>
            <div style={{ fontSize: "12px", color: "var(--text)", lineHeight: 1.5 }}>
              X-axis tilt at 8.4° is 84% of the way to the 10° critical threshold and rising at +0.18°/min.
              At this rate, critical will be reached in approximately 9 minutes. Monitor structural
              integrity of west wall and consider reinforcement. Cross-correlate with soil moisture —
              if both are elevated simultaneously, initiate evacuation protocol immediately.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}