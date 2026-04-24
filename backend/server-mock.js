import express from 'express';
import cors from 'cors';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Your Firebase config here (same as above)
const firebaseConfig = {
  apiKey: "AIzaSyD5IShpVHM9Dy4C4Cg15j-5ik1e6Cvy0I4",
  authDomain: "iotbda-11609.firebaseapp.com",
  databaseURL: "https://iotbda-11609-default-rtdb.firebaseio.com",
  projectId: "iotbda-11609",
  storageBucket: "iotbda-11609.firebasestorage.app",
  messagingSenderId: "806540556560",
  appId: "1:806540556560:web:07f223b9e755fa8552cd95",
  measurementId: "G-ZF194M0RW3",
};
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

// Mock AI responses based on keywords
async function getMockResponse(message, stats) {
  const msg = message.toLowerCase();
  
  if (msg.includes('risk') || msg.includes('danger') || msg.includes('safe')) {
    if (stats?.risk_level === 'CRITICAL') {
      return `🚨 CRITICAL RISK LEVEL DETECTED!\n\nSoil moisture: ${stats.latest.soil_20cm}%\nTilt: ${stats.latest.tilt_x.toFixed(1)}°\nCrack: ${stats.latest.crack_width.toFixed(1)}mm\n\n⚠️ IMMEDIATE ACTION REQUIRED:\n• Evacuate Zone C immediately\n• Halt all construction activity\n• Notify site supervisor and safety officer\n• Call structural engineer for emergency review`;
    } else if (stats?.risk_level === 'WARNING') {
      return `⚠️ WARNING LEVEL - Elevated Risk Detected\n\nCurrent readings:\n• Soil: ${stats.latest.soil_20cm}%\n• Tilt: ${stats.latest.tilt_x.toFixed(1)}°\n• Crack: ${stats.latest.crack_width.toFixed(1)}mm\n\nRecommended actions:\n• Schedule inspection within 24 hours\n• Increase monitoring frequency to every 15 minutes\n• Review evacuation procedures\n• Check soil moisture correlation`;
    } else {
      return `✅ SAFE - Normal Conditions\n\nAll parameters within acceptable ranges:\n• Soil: ${stats?.latest.soil_20cm || 'N/A'}%\n• Tilt: ${stats?.latest.tilt_x.toFixed(1) || 'N/A'}°\n• Crack: ${stats?.latest.crack_width.toFixed(1) || 'N/A'}mm\n\nContinue routine monitoring as scheduled.`;
    }
  }
  
  if (msg.includes('latest') || msg.includes('current') || msg.includes('now')) {
    return `📊 LATEST SENSOR READINGS (${new Date().toLocaleTimeString()}):\n\n🌱 SOIL MOISTURE:\n  • 20cm: ${stats?.latest.soil_20cm || 0}%\n  • 40cm: ${stats?.latest.soil_40cm || 0}%\n  • 60cm: ${stats?.latest.soil_60cm || 0}%\n\n📐 TILT ANGLE:\n  • X-axis: ${stats?.latest.tilt_x.toFixed(1) || 0}°\n  • Y-axis: ${stats?.latest.tilt_y.toFixed(1) || 0}°\n  • Z-axis: ${stats?.latest.tilt_z.toFixed(1) || 0}°\n\n🔧 OTHER SENSORS:\n  • Crack Width: ${stats?.latest.crack_width.toFixed(1) || 0}mm\n  • Vibration: ${stats?.latest.vibration.toFixed(2) || 0}g\n  • Temperature: ${stats?.latest.temperature || 0}°C\n  • Humidity: ${stats?.latest.humidity || 0}%\n  • Rain: ${stats?.latest.raindrop > 0 ? 'YES' : 'NO'}\n\nRisk Score: ${stats?.latest.risk_score || 0}/100 (${stats?.risk_level || 'UNKNOWN'})`;
  }
  
  if (msg.includes('correlation') || msg.includes('factors') || msg.includes('influence')) {
    return `🔗 CORRELATION ANALYSIS (based on historical data):\n\nStrongest correlations with landslide risk:\n1. Soil moisture vs Crack width: r = 0.82 (Strong positive)\n2. Soil moisture vs Tilt angle: r = 0.71 (Strong positive)\n3. Rainfall vs Soil moisture: r = 0.68 (Strong positive)\n4. Tilt angle vs Crack width: r = 0.59 (Moderate positive)\n5. Vibration vs Soil moisture: r = 0.43 (Weak positive)\n\n💡 INSIGHT: Soil moisture is the primary driver of landslide risk. Monitor rainfall and soil saturation closely.`;
  }
  
  if (msg.includes('alert') || msg.includes('warning') || msg.includes('critical')) {
    if (stats?.alerts?.length > 0) {
      let response = `🚨 ACTIVE ALERTS (${stats.alerts.length}):\n\n`;
      stats.alerts.forEach((alert, i) => {
        response += `${i+1}. [${alert.severity.toUpperCase()}] ${alert.message}\n`;
      });
      return response;
    }
    return `✅ No active alerts. All systems operating within normal parameters.`;
  }
  
  if (msg.includes('trend') || msg.includes('change') || msg.includes('increasing')) {
    return `📈 TREND ANALYSIS:\n\nSoil moisture is ${stats?.trends.soil_direction.replace('_', ' ')} at ${Math.abs(stats?.trends.soil_trend || 0)}% per reading.\n\n${stats?.trends.soil_direction === 'rapidly_increasing' ? '⚠️ Rapid increase detected - escalate monitoring frequency!' : stats?.trends.soil_direction === 'gradually_increasing' ? '⚠️ Gradual increase observed - continue monitoring.' : '✅ Stable conditions - continue routine operations.'}`;
  }
  
  return `I can help you analyze sensor data and provide risk assessments. Try asking:\n\n• "What's the current risk level?"\n• "Show me latest readings"\n• "What factors influence risk?"\n• "Any active alerts?"\n• "Show me the trends"`;
}

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  
  // Fetch latest data from Firebase
  const readingsRef = ref(database, 'sensor_readings');
  const snapshot = await get(readingsRef);
  const data = snapshot.val();
  
  let stats = null;
  if (data) {
    const readings = Object.values(data);
    readings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const latest = readings[0];
    
    const calculateRisk = (reading) => {
      let score = 0;
      score += ((reading.soil_20cm || 0) / 100) * 40;
      score += (Math.min(Math.abs(reading.rotation_x || 0), 10) / 10) * 35;
      score += (Math.min(reading.crack_width || 0, 8) / 8) * 15;
      score += (Math.min(Math.abs(reading.acceleration_x || 0), 0.5) / 0.5) * 10;
      return Math.min(Math.round(score), 100);
    };
    
    const recent10 = readings.slice(0, 10);
    const prev10 = readings.slice(10, 20);
    const avgRecent = recent10.reduce((s, r) => s + (r.soil_20cm || 0), 0) / 10;
    const avgPrev = prev10.length > 0 ? prev10.reduce((s, r) => s + (r.soil_20cm || 0), 0) / prev10.length : avgRecent;
    
    const alerts = [];
    if (latest.soil_20cm > 80) alerts.push({ severity: 'critical', message: `Soil moisture at ${latest.soil_20cm}% exceeds critical threshold` });
    else if (latest.soil_20cm > 60) alerts.push({ severity: 'warning', message: `Soil moisture at ${latest.soil_20cm}% exceeds warning threshold` });
    if (Math.abs(latest.rotation_x) > 8) alerts.push({ severity: 'critical', message: `Tilt at ${Math.abs(latest.rotation_x).toFixed(1)}° exceeds critical threshold` });
    else if (Math.abs(latest.rotation_x) > 5) alerts.push({ severity: 'warning', message: `Tilt at ${Math.abs(latest.rotation_x).toFixed(1)}° exceeds warning threshold` });
    
    stats = {
      latest: {
        soil_20cm: latest.soil_20cm || 0,
        soil_40cm: latest.soil_40cm || 0,
        soil_60cm: latest.soil_60cm || 0,
        tilt_x: Math.abs(latest.rotation_x || 0),
        tilt_y: Math.abs(latest.rotation_y || 0),
        tilt_z: Math.abs(latest.rotation_z || 0),
        crack_width: latest.crack_width || 0,
        vibration: Math.abs(latest.acceleration_x || 0),
        temperature: latest.temperature || 0,
        humidity: latest.humidity || 0,
        raindrop: latest.raindrop || 0,
        risk_score: calculateRisk(latest),
        node_name: latest.node_name || 'Node2'
      },
      trends: {
        soil_trend: (avgRecent - avgPrev).toFixed(1),
        soil_direction: (avgRecent - avgPrev) > 2 ? 'rapidly_increasing' : (avgRecent - avgPrev) > 0.5 ? 'gradually_increasing' : 'stable'
      },
      alerts: alerts,
      risk_level: alerts.some(a => a.severity === 'critical') ? 'CRITICAL' : alerts.some(a => a.severity === 'warning') ? 'WARNING' : 'SAFE'
    };
  }
  
  const reply = await getMockResponse(message, stats);
  res.json({ reply, timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), mock_mode: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 SiteSense AI Server (MOCK MODE) running on http://localhost:${PORT}`);
});