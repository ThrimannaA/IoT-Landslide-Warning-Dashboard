const statusStyles = {
  safe: {
    borderColor: "var(--green-dim)",
    bgTint: "rgba(34, 197, 94, 0.05)",
    valueColor: "var(--green)",
    badgeBg: "rgba(34, 197, 94, 0.15)",
    badgeText: "var(--green)",
  },
  warning: {
    borderColor: "var(--amber)",
    bgTint: "rgba(245, 158, 11, 0.05)",
    valueColor: "var(--amber)",
    badgeBg: "rgba(245, 158, 11, 0.15)",
    badgeText: "var(--amber)",
  },
  critical: {
    borderColor: "var(--red)",
    bgTint: "rgba(239, 68, 68, 0.05)",
    valueColor: "var(--red)",
    badgeBg: "rgba(239, 68, 68, 0.15)",
    badgeText: "var(--red)",
  },
};

const trendStyles = {
  rising:  { arrow: "↑", color: "var(--red)"   },
  stable:  { arrow: "→", color: "var(--muted)" },
  falling: { arrow: "↓", color: "var(--green)" },
};

export function SensorCard({
  label,
  value,
  unit,
  status,
  trend,
  rate,
  onClick,
}) {
  const style = statusStyles[status];
  const trendStyle = trend ? trendStyles[trend] : null;

  return (
    <div
      className="rounded-lg transition-all cursor-pointer hover:opacity-90"
      style={{
        backgroundColor: style.bgTint,
        border: `1px solid ${style.borderColor}`,
        textAlign: "center",
        padding: "12px 16px",
      }}
      onClick={onClick}
    >
      <div
        style={{
          fontSize: "11px",
          fontWeight: 700,
          color: "var(--muted)",
          letterSpacing: "0.12em",
          marginBottom: "6px",
          fontFamily: "Barlow, sans-serif",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "28px",
          fontFamily: "Share Tech Mono, monospace",
          color: style.valueColor,
          marginBottom: "2px",
          lineHeight: 1.1,
          fontWeight: 600,
        }}
      >
        {value}
      </div>

      <div
        style={{
          fontSize: "12px",
          fontFamily: "Share Tech Mono, monospace",
          color: "var(--muted)",
          marginBottom: "6px",
        }}
      >
        {unit}
      </div>

      {/* ── Trend arrow row ── */}
      {trendStyle && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            fontSize: "11px",
            fontFamily: "Share Tech Mono, monospace",
            color: trendStyle.color,
            marginBottom: "6px",
          }}
        >
          <span style={{ fontSize: "14px", lineHeight: 1 }}>
            {trendStyle.arrow}
          </span>
          {rate && (
            <span style={{ fontSize: "10px", opacity: 0.85 }}>
              {rate}
            </span>
          )}
        </div>
      )}

      {/* ── If no trend, keep spacing consistent ── */}
      {!trendStyle && <div style={{ marginBottom: "6px" }} />}

      <div
        className="flex justify-center items-center gap-1 rounded w-full"
        style={{
          backgroundColor: style.badgeBg,
          color: style.badgeText,
          fontSize: "11px",
          fontWeight: 700,
          padding: "5px 0",
          letterSpacing: "0.08em",
        }}
      >
        <span>●</span>
        <span>{status.toUpperCase()}</span>
      </div>
    </div>
  );
}