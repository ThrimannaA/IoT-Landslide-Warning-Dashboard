import { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Tooltip, ReferenceLine, Area, ComposedChart,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  Brain, TrendingUp, AlertTriangle, CheckCircle, 
  Activity, BarChart3, Sparkles, RefreshCw, Download
} from 'lucide-react';

const COLORS = {
  LOW: '#22c55e',
  WARNING: '#f59e0b',
  CRITICAL: '#ef4444'
};

const RISK_ICONS = {
  LOW: '✅',
  WARNING: '⚠️',
  CRITICAL: '🚨'
};

const RISK_MESSAGES = {
  LOW: 'Normal operations - Continue routine monitoring',
  WARNING: 'Elevated risk - Schedule inspection within 24 hours',
  CRITICAL: 'Immediate evacuation required - Critical danger detected'
};

export function MlPredictions() {
  const [currentRisk, setCurrentRisk] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [historicalRisk, setHistoricalRisk] = useState([]);
  const [featureImportance, setFeatureImportance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forecastHours, setForecastHours] = useState(1);
  const [mlStatus, setMlStatus] = useState('checking');
  const [selectedNode, setSelectedNode] = useState('all');

  // Fetch all ML data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Check ML service health
      const healthRes = await fetch('http://localhost:5000/api/ml/health');
      const health = await healthRes.json();
      setMlStatus(health.status === 'ok' ? 'connected' : 'disconnected');
      
      if (health.status !== 'ok') {
        setLoading(false);
        return;
      }
      
      // Fetch current risk
      const currentRes = await fetch('http://localhost:5000/api/ml/current-risk');
      const currentData = await currentRes.json();
      setCurrentRisk(currentData);
      
      // Fetch forecast
      const forecastRes = await fetch(`http://localhost:5000/api/ml/forecast?hours=${forecastHours}`);
      const forecastData = await forecastRes.json();
      setForecast(forecastData);
      
      // Fetch historical risk
      const historicalRes = await fetch('http://localhost:5000/api/ml/historical-risk?limit=30');
      const historicalData = await historicalRes.json();
      setHistoricalRisk(historicalData.historical_risk || []);
      
      // Fetch feature importance
      const featureRes = await fetch('http://localhost:5000/api/ml/feature-importance');
      const featureData = await featureRes.json();
      setFeatureImportance(featureData.feature_importance || []);
      
    } catch (error) {
      console.error('Error fetching ML data:', error);
      setMlStatus('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [forecastHours]);

  // Prepare chart data for historical risk (using risk level as numeric for visualization)
  const getRiskLevelNumeric = (level) => {
    switch(level) {
      case 'LOW': return 25;
      case 'WARNING': return 65;
      case 'CRITICAL': return 90;
      default: return 50;
    }
  };

    const chartData = historicalRisk.map(r => ({
    time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    risk_level: r.risk_level,
    risk_numeric: getRiskLevelNumeric(r.risk_level),
    soil: r.soil,
    crack: r.crack,
    tilt: r.tilt,
    vibration: r.vibration || 0,  // ← ADD THIS LINE
    confidence: r.confidence
    }));

  // Export data as CSV
  const exportData = () => {
    const headers = ['Timestamp', 'Risk Level', 'Confidence', 'Soil (%)', 'Crack (mm)', 'Tilt (°)'];
    const rows = historicalRisk.map(r => [
      r.timestamp,
      r.risk_level,
      r.confidence,
      r.soil,
      r.crack,
      r.tilt
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ml_predictions_${new Date().toISOString().slice(0, 19)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Risk Level Display Component (replaces RiskGauge)
  const RiskLevelDisplay = ({ level, confidence }) => (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div style={{ 
        width: '180px', 
        height: '180px', 
        margin: '0 auto',
        borderRadius: '50%',
        backgroundColor: `${COLORS[level]}20`,
        border: `4px solid ${COLORS[level]}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '8px' }}>
          {RISK_ICONS[level]}
        </div>
        <div style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: COLORS[level],
          letterSpacing: '2px'
        }}>
          {level}
        </div>
        <div style={{ 
          position: 'absolute',
          bottom: '-12px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '10px',
          color: 'var(--muted)',
          whiteSpace: 'nowrap'
        }}>
          
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <div style={{
          padding: '10px 16px',
          borderRadius: '8px',
          backgroundColor: `${COLORS[level]}15`,
          color: COLORS[level],
          fontSize: '12px',
          fontWeight: 500,
          maxWidth: '250px',
          margin: '0 auto'
        }}>
          {RISK_MESSAGES[level]}
        </div>
        {confidence && (
          <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '12px' }}>
            🤖 Model Confidence: {confidence}%
          </div>
        )}
      </div>
    </div>
  );

  // Disconnected state
  if (mlStatus === 'disconnected' || mlStatus === 'error') {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <Brain size={48} style={{ color: 'var(--amber)', marginBottom: '20px' }} />
        <h2 style={{ color: 'var(--text)', marginBottom: '10px' }}>ML Service Not Available</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '20px', maxWidth: '500px' }}>
          The machine learning prediction service is not running. 
          Please start the Python ML service:
        </p>
        <code style={{ 
          backgroundColor: 'var(--bg3)', 
          padding: '10px 15px', 
          borderRadius: '6px',
          fontFamily: 'monospace',
          fontSize: '12px'
        }}>
          cd backend && python ml_service.py
        </code>
        <button 
          onClick={fetchAllData}
          style={{
            marginTop: '20px',
            padding: '8px 20px',
            backgroundColor: 'var(--amber)',
            border: 'none',
            borderRadius: '6px',
            color: '#000',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '3px solid var(--amber)', 
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: 'var(--muted)' }}>Loading ML predictions...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header with spinner animation style */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '16px 20px',
        backgroundColor: 'var(--bg2)',
        borderRadius: '8px',
        border: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Brain size={24} style={{ color: 'var(--amber)' }} />
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>ML-Powered Risk Predictions</h1>
            <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '4px 0 0' }}>
              landslide risk assessment
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={exportData}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              color: 'var(--text)',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            <Download size={12} /> Export CSV
          </button>
          <button 
            onClick={fetchAllData}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              color: 'var(--text)',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={12} /> Refresh
          </button>
        </div>
      </div>

      {/* Two Column Layout - Current Risk & Forecast */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Current Risk Level Display */}
        <div style={{
          padding: '20px',
          backgroundColor: 'var(--bg2)',
          borderRadius: '8px',
          border: '1px solid var(--border)'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted)', marginBottom: '16px', letterSpacing: '0.1em' }}>
            CURRENT RISK LEVEL
          </div>
          {currentRisk && (
            <>
              <RiskLevelDisplay 
                level={currentRisk.risk_level}
                confidence={currentRisk.confidence}
              />
              {currentRisk.probabilities && (
                <div style={{ marginTop: '20px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '8px' }}>
                    CONFIDENCE DISTRIBUTION:
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {Object.entries(currentRisk.probabilities).map(([cls, prob]) => (
                      <div key={cls} style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{
                          height: '4px',
                          backgroundColor: `${COLORS[cls.toUpperCase()]}40`,
                          borderRadius: '2px',
                          overflow: 'hidden',
                          marginBottom: '4px'
                        }}>
                          <div style={{
                            width: `${prob}%`,
                            height: '100%',
                            backgroundColor: COLORS[cls.toUpperCase()],
                            borderRadius: '2px'
                          }} />
                        </div>
                        <div style={{ fontSize: '9px', color: COLORS[cls.toUpperCase()] }}>
                          {cls}: {prob}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {currentRisk.node_name && (
                <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '10px', color: 'var(--muted)' }}>
                  📍 Node: {currentRisk.node_name} • Last updated: {new Date(currentRisk.timestamp).toLocaleTimeString()}
                </div>
              )}
            </>
          )}
        </div>

        {/* Forecast Section */}
        <div style={{
          padding: '20px',
          backgroundColor: 'var(--bg2)',
          borderRadius: '8px',
          border: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.1em' }}>
              📈 RISK FORECAST
            </div>
            <select 
              value={forecastHours}
              onChange={(e) => setForecastHours(parseInt(e.target.value))}
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: 'var(--bg3)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                fontSize: '10px'
              }}
            >
              <option value={1}>+1 hour</option>
              <option value={2}>+2 hours</option>
              <option value={3}>+3 hours</option>
              <option value={6}>+6 hours</option>
            </select>
          </div>

          {forecast && forecast.forecast ? (
            <>
              {/* Current vs Predicted comparison */}
              <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: 'var(--muted)' }}>Current Risk</div>
                  <div style={{ 
                    fontSize: '28px', 
                    fontWeight: 'bold', 
                    color: COLORS[forecast.current?.risk_level],
                    padding: '10px 20px',
                    borderRadius: '12px',
                    backgroundColor: `${COLORS[forecast.current?.risk_level]}15`,
                    marginTop: '8px'
                  }}>
                    {RISK_ICONS[forecast.current?.risk_level]} {forecast.current?.risk_level}
                  </div>
                </div>
                <div style={{ fontSize: '24px', color: 'var(--muted)', alignSelf: 'center' }}>→</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: 'var(--muted)' }}>+{forecast.forecast.hours_ahead}h</div>
                  <div style={{ 
                    fontSize: '28px', 
                    fontWeight: 'bold', 
                    color: COLORS[forecast.forecast.predicted_risk?.risk_level],
                    padding: '10px 20px',
                    borderRadius: '12px',
                    backgroundColor: `${COLORS[forecast.forecast.predicted_risk?.risk_level]}15`,
                    marginTop: '8px'
                  }}>
                    {RISK_ICONS[forecast.forecast.predicted_risk?.risk_level]} {forecast.forecast.predicted_risk?.risk_level}
                  </div>
                </div>
              </div>

              {/* Trend indicators */}
              <div style={{ 
                padding: '12px', 
                backgroundColor: 'var(--bg3)', 
                borderRadius: '6px',
                marginBottom: '12px'
              }}>
                <div style={{ fontSize: '9px', color: 'var(--muted)', marginBottom: '8px' }}>
                  TREND DIRECTION:
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  {forecast.forecast.trend_direction && Object.entries(forecast.forecast.trend_direction).map(([key, direction]) => (
                    <div key={key} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text)' }}>{key.replace('_', ' ').toUpperCase()}</div>
                      <div style={{ 
                        fontSize: '14px', 
                        color: direction === 'increasing' ? 'var(--red)' : direction === 'decreasing' ? 'var(--green)' : 'var(--muted)'
                      }}>
                        {direction === 'increasing' ? '↑ ↑' : direction === 'decreasing' ? '↓ ↓' : '→'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Level Change Alert */}
              {forecast.forecast.predicted_risk?.risk_level !== forecast.current?.risk_level && (
                <div style={{
                  padding: '12px',
                  borderRadius: '6px',
                  backgroundColor: forecast.forecast.predicted_risk?.risk_level === 'CRITICAL' 
                    ? 'rgba(239,68,68,0.15)' 
                    : 'rgba(245,158,11,0.1)',
                  borderLeft: `3px solid ${COLORS[forecast.forecast.predicted_risk?.risk_level]}`
                }}>
                  <div style={{ 
                    fontSize: '10px', 
                    color: COLORS[forecast.forecast.predicted_risk?.risk_level], 
                    fontWeight: 600 
                  }}>
                    {forecast.forecast.predicted_risk?.risk_level === 'CRITICAL' ? '⚠️ RISK LEVEL INCREASING' : '📈 RISK LEVEL CHANGING'}
                  </div>
                  <div style={{ fontSize: '9px', color: 'var(--text)', marginTop: '4px' }}>
                    Risk level will change from {forecast.current?.risk_level} to {forecast.forecast.predicted_risk?.risk_level} in the next {forecast.forecast.hours_ahead} hour(s).
                    {forecast.forecast.predicted_risk?.risk_level === 'CRITICAL' && ' Take immediate preventive action!'}
                  </div>
                </div>
              )}

              {/* Stabilizing message */}
              {forecast.forecast.predicted_risk?.risk_level === forecast.current?.risk_level && 
               forecast.forecast.trend_direction?.soil === 'decreasing' && (
                <div style={{
                  padding: '10px',
                  backgroundColor: 'rgba(34,197,94,0.1)',
                  borderRadius: '6px',
                  borderLeft: '3px solid var(--green)'
                }}>
                  <div style={{ fontSize: '10px', color: 'var(--green)', fontWeight: 600 }}>
                    ✅ CONDITIONS STABILIZING
                  </div>
                  <div style={{ fontSize: '9px', color: 'var(--text)' }}>
                    Risk level is expected to remain at {forecast.current?.risk_level} with improving conditions.
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
              <TrendingUp size={32} opacity={0.5} />
              <p style={{ marginTop: '12px', fontSize: '11px' }}>Insufficient data for forecast. Need at least 5 readings.</p>
            </div>
          )}
        </div>
      </div>

      {/* Historical Risk Trend Chart - Now showing Risk Level */}
      <div style={{
        padding: '20px',
        backgroundColor: 'var(--bg2)',
        borderRadius: '8px',
        border: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.1em' }}>
            📊 HISTORICAL RISK TREND (Last 30 Readings)
          </div>
            <div style={{ fontSize: '9px', color: 'var(--muted)' }}>
            <span style={{ color: '#f59e0b' }}>●</span> Risk Level &nbsp;
            <span style={{ color: '#ef4444' }}>●</span> Soil (%) &nbsp;
            <span style={{ color: '#22c55e' }}>●</span> Crack (mm) &nbsp;
            <span style={{ color: '#8b5cf6' }}>●</span> Vibration (g) &nbsp;
            <span style={{ color: '#f97316' }}>●</span> Tilt (°)
            </div>
        </div>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" stroke="var(--muted)" tick={{ fontSize: 9 }} interval={Math.floor(chartData.length / 8)} />
              <YAxis yAxisId="risk" domain={[0, 100]} stroke="var(--muted)" tick={{ fontSize: 9 }} 
                label={{ value: 'Risk Level', angle: -90, position: 'insideLeft', fill: 'var(--muted)', fontSize: 9 }}
                tickFormatter={(value) => {
                  if (value === 25) return 'LOW';
                  if (value === 65) return 'WARNING';
                  if (value === 90) return 'CRITICAL';
                  return '';
                }}
              />
              <YAxis yAxisId="sensor" orientation="right" domain={[0, 100]} stroke="var(--muted)" tick={{ fontSize: 9 }} 
                label={{ value: 'Soil / Crack', angle: 90, position: 'insideRight', fill: 'var(--muted)', fontSize: 9 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg3)', border: '1px solid var(--border)', fontSize: 11, borderRadius: 6 }}
                formatter={(value, name) => {
                  if (name === 'risk_level' && value === 25) return ['LOW', 'Risk Level'];
                  if (name === 'risk_level' && value === 65) return ['WARNING', 'Risk Level'];
                  if (name === 'risk_level' && value === 90) return ['CRITICAL', 'Risk Level'];
                  return [value, name];
                }}
              />
              <ReferenceLine yAxisId="risk" y={70} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.6} />
              <ReferenceLine yAxisId="risk" y={40} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.6} />
              <Area 
                type="monotone" 
                dataKey="risk_numeric" 
                yAxisId="risk" 
                stroke="#f59e0b" 
                fill="rgba(245,158,11,0.1)" 
                strokeWidth={2} 
                name="risk_level" 
              />
            <Line type="monotone" dataKey="soil" yAxisId="sensor" stroke="#ef4444" strokeWidth={1.5} dot={false} name="Soil Moisture (%)" />
            <Line type="monotone" dataKey="crack" yAxisId="sensor" stroke="#22c55e" strokeWidth={1.5} dot={false} name="Crack Width (mm)" />
            <Line type="monotone" dataKey="vibration" yAxisId="sensor" stroke="#8b5cf6" strokeWidth={1.5} dot={false} name="Vibration (g)" />
            <Line type="monotone" dataKey="tilt" yAxisId="sensor" stroke="#f97316" strokeWidth={1.5} dot={false} name="Tilt Angle (°)" />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
            No historical data available
          </div>
        )}
      </div>

      {/* Two Column Bottom Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Feature Importance */}
        <div style={{
          padding: '20px',
          backgroundColor: 'var(--bg2)',
          borderRadius: '8px',
          border: '1px solid var(--border)'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted)', marginBottom: '16px', letterSpacing: '0.1em' }}>
            🔬 FEATURE IMPORTANCE (Model Explainability)
          </div>
          {featureImportance.length > 0 ? (
            <div>
              {featureImportance.map((item, idx) => (
                <div key={item.feature} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text)' }}>{item.feature}</span>
                    <span style={{ fontSize: '10px', color: 'var(--amber)', fontWeight: 600 }}>{(item.importance * 100).toFixed(1)}%</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${item.importance * 100}%`,
                      height: '100%',
                      backgroundColor: idx === 0 ? 'var(--amber)' : idx === 1 ? 'var(--red)' : 'var(--blue)',
                      borderRadius: '3px',
                      transition: 'width 0.6s ease'
                    }} />
                  </div>
                </div>
              ))}
              
              {/* Insight text */}
              <div style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: 'rgba(59,130,246,0.08)',
                borderRadius: '6px',
                borderLeft: '3px solid var(--blue)'
              }}>
                <div style={{ fontSize: '10px', color: 'var(--blue)', fontWeight: 600, marginBottom: '6px' }}>
                  💡 MODEL INSIGHT
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text)', lineHeight: 1.5 }}>
                  {featureImportance[0]?.feature} is the strongest predictor of landslide risk, 
                  contributing {(featureImportance[0]?.importance * 100).toFixed(0)}% to the model's decisions.
                  {featureImportance[0]?.feature === 'Soil20cm' ? ' Monitor soil saturation closely.' : ' Pay attention to structural changes.'}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
              Feature importance data not available
            </div>
          )}
        </div>

        {/* Decision Support Recommendations */}
        <div style={{
          padding: '20px',
          backgroundColor: 'var(--bg2)',
          borderRadius: '8px',
          border: '1px solid var(--border)'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted)', marginBottom: '16px', letterSpacing: '0.1em' }}>
            🎯 AI-POWERED DECISION SUPPORT
          </div>
          
          {currentRisk && (
            <div>
              {/* Risk-based recommendations */}
              {currentRisk.risk_level === 'CRITICAL' && (
                <div style={{
                  padding: '14px',
                  backgroundColor: 'rgba(239,68,68,0.1)',
                  borderRadius: '6px',
                  marginBottom: '12px',
                  border: '1px solid rgba(239,68,68,0.3)'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--red)', marginBottom: '8px' }}>
                    🚨 IMMEDIATE ACTIONS REQUIRED
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '10px', color: 'var(--text)', lineHeight: 1.6 }}>
                    <li>Evacuate Zone C and surrounding areas immediately</li>
                    <li>Halt ALL construction and heavy machinery activity</li>
                    <li>Alert site supervisor and safety officer</li>
                    <li>Call structural engineer for emergency assessment</li>
                    <li>Increase monitoring frequency to every 2 minutes</li>
                  </ul>
                </div>
              )}
              
              {currentRisk.risk_level === 'WARNING' && (
                <div style={{
                  padding: '14px',
                  backgroundColor: 'rgba(245,158,11,0.1)',
                  borderRadius: '6px',
                  marginBottom: '12px',
                  border: '1px solid rgba(245,158,11,0.3)'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--amber)', marginBottom: '8px' }}>
                    ⚠️ RECOMMENDED ACTIONS
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '10px', color: 'var(--text)', lineHeight: 1.6 }}>
                    <li>Schedule structural inspection within 24 hours</li>
                    <li>Increase sensor polling to every 5 minutes</li>
                    <li>Review emergency evacuation procedures with team</li>
                    <li>Monitor soil moisture and tilt correlation</li>
                    <li>Restrict heavy machinery near Zone C</li>
                  </ul>
                </div>
              )}
              
              {currentRisk.risk_level === 'LOW' && (
                <div style={{
                  padding: '14px',
                  backgroundColor: 'rgba(34,197,94,0.1)',
                  borderRadius: '6px',
                  marginBottom: '12px',
                  border: '1px solid rgba(34,197,94,0.3)'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--green)', marginBottom: '8px' }}>
                    ✅ NORMAL OPERATIONS
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '10px', color: 'var(--text)', lineHeight: 1.6 }}>
                    <li>Continue routine monitoring as scheduled</li>
                    <li>Document any visible changes to soil or structures</li>
                    <li>Review weekly trend reports</li>
                    <li>Maintain regular equipment calibration</li>
                  </ul>
                </div>
              )}
              
              {/* Model confidence note */}
              <div style={{
                marginTop: '12px',
                padding: '10px',
                backgroundColor: 'var(--bg3)',
                borderRadius: '6px',
                fontSize: '9px',
                color: 'var(--muted)',
                textAlign: 'center'
              }}>
                🤖 Model prediction confidence: {currentRisk.confidence}% • 
                Last updated: {new Date(currentRisk.timestamp).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}