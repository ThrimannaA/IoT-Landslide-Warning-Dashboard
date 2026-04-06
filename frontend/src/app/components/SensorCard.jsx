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
        padding: "6px 14px",
      }}
      onClick={onClick}
    >
      <div
        style={{
          fontSize: "9px",
          fontWeight: 600,
          color: "var(--muted)",
          letterSpacing: "0.15em",
          marginBottom: "2px",
          fontFamily: "Barlow, sans-serif",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "24px",
          fontFamily: "Share Tech Mono, monospace",
          color: style.valueColor,
          marginBottom: "0px",
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>

      <div
        style={{
          fontSize: "11px",
          fontFamily: "Share Tech Mono, monospace",
          color: "var(--muted)",
          marginBottom: "2px",
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
            gap: "3px",
            fontSize: "10px",
            fontFamily: "Share Tech Mono, monospace",
            color: trendStyle.color,
            marginBottom: "4px",
          }}
        >
          <span style={{ fontSize: "12px", lineHeight: 1 }}>
            {trendStyle.arrow}
          </span>
          {rate && (
            <span style={{ fontSize: "9px", opacity: 0.85 }}>
              {rate}
            </span>
          )}
        </div>
      )}

      {/* ── If no trend, keep spacing consistent ── */}
      {!trendStyle && <div style={{ marginBottom: "4px" }} />}

      <div
        className="flex justify-center items-center gap-1 rounded w-full"
        style={{
          backgroundColor: style.badgeBg,
          color: style.badgeText,
          fontSize: "9px",
          fontWeight: 600,
          padding: "3px 0",
        }}
      >
        <span>●</span>
        <span>{status.toUpperCase()}</span>
      </div>
    </div>
  );
}