const severityStyles = {
  critical: {
    bg: '#7f1d1d',
    text: '#ef4444'
  },
  warning: {
    bg: '#92600a',
    text: '#f59e0b'
  },
  info: {
    bg: '#1e3a8a',
    text: '#3b82f6'
  },
  pass: {
    bg: '#14532d',
    text: '#22c55e'
  },
  fail: {
    bg: '#7f1d1d',
    text: '#ef4444'
  }
};

export function SeverityBadge({ severity }) {
  const style = severityStyles[severity];

  return (
    <div
      className="inline-block px-2 py-0.5 rounded"
      style={{
        backgroundColor: style.bg,
        color: style.text,
        fontSize: '9px',
        fontWeight: 700,
        letterSpacing: '0.1em',
        fontFamily: 'Barlow, sans-serif'
      }}
    >
      {severity.toUpperCase()}
    </div>
  );
}
