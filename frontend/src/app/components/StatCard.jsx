export function StatCard({ label, value, sub, color = 'var(--text)', centered = true }) {
  return (
    <div
      className="p-3.5 rounded-lg"
      style={{
        backgroundColor: '#1A2030',
        border: '1px solid var(--border)',
        textAlign: 'center'
      }}
    >
      <div style={{
        fontSize: '10px',
        fontWeight: 600,
        color: 'var(--text)',        // ← was var(--muted)
        letterSpacing: '0.1em',
        marginBottom: '8px',
        fontFamily: 'Barlow, sans-serif'
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '26px',
        fontFamily: 'Share Tech Mono, monospace',
        color: color,
        marginBottom: sub ? '4px' : '0'
      }}>
        {value}
      </div>
      {sub && (
        <div style={{
          fontSize: '11px',
          color: 'var(--text)',       // ← was var(--muted)
          fontFamily: 'Barlow, sans-serif'
        }}>
          {sub}
        </div>
      )}
    </div>
  );
}