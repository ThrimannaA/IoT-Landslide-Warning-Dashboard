import { useState } from "react";

const severityStyles = {
  critical: {
    bg: 'rgba(239, 68, 68, 0.08)',
    border: 'rgba(239, 68, 68, 0.25)',
    icon: '⬥',
    iconColor: 'var(--red)',
    btnBorder: 'var(--red)',
    btnColor: 'var(--red)'
  },
  warning: {
    bg: 'rgba(245, 158, 11, 0.08)',
    border: 'rgba(245, 158, 11, 0.25)',
    icon: '⬦',
    iconColor: 'var(--amber)',
    btnBorder: 'var(--amber)',
    btnColor: 'var(--amber)'
  },
  info: {
    bg: 'rgba(59, 130, 246, 0.08)',
    border: 'rgba(59, 130, 246, 0.25)',
    icon: '◆',
    iconColor: 'var(--blue)',
    btnBorder: 'var(--blue)',
    btnColor: 'var(--blue)'
  }
};

export function AlertItem({ severity, message, timestamp, location }) {
  const style = severityStyles[severity];
  const [acknowledged, setAcknowledged] = useState(false);
  const [ackedTime, setAckedTime] = useState('');

  function handleAcknowledge() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    setAckedTime(time);
    setAcknowledged(true);
  }

  return (
    <div
      className="p-3 rounded-lg mb-2"
      style={{
        backgroundColor: acknowledged ? 'rgba(34, 197, 94, 0.05)' : style.bg,
        border: `1px solid ${acknowledged ? 'rgba(34, 197, 94, 0.25)' : style.border}`,
        opacity: acknowledged ? 0.75 : 1,
        transition: 'all 0.3s ease'
      }}
    >
      <div className="flex items-start gap-2">
        <div style={{
          fontSize: '16px',
          color: acknowledged ? 'var(--green)' : style.iconColor,
          marginTop: '2px',
          transition: 'color 0.3s ease'
        }}>
          {acknowledged ? '✓' : style.icon}
        </div>
        <div className="flex-1">
          <div style={{
            fontSize: '12px',
            color: 'var(--text)',
            marginBottom: '4px',
            lineHeight: 1.4
          }}>
            {message}
          </div>
          <div style={{
            fontSize: '10px',
            fontFamily: 'Share Tech Mono, monospace',
            color: 'var(--muted)'
          }}>
            {timestamp} — {location}
          </div>

          {/* ── Acknowledge row ── */}
          <div style={{
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {!acknowledged ? (
              <button
                onClick={handleAcknowledge}
                style={{
                  fontSize: '9px',
                  fontWeight: 600,
                  fontFamily: 'Barlow, sans-serif',
                  letterSpacing: '0.08em',
                  padding: '3px 10px',
                  borderRadius: '4px',
                  border: `1px solid ${style.btnBorder}`,
                  background: 'transparent',
                  color: style.btnColor,
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                ACKNOWLEDGE
              </button>
            ) : (
              <div style={{
                fontSize: '9px',
                fontFamily: 'Share Tech Mono, monospace',
                color: 'var(--green)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <span>✓ Acknowledged</span>
                <span style={{ color: 'var(--muted)' }}>at {ackedTime}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}