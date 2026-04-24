import express from "express";
import cors from "cors";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  get,
  query,
  limitToLast,
  orderByChild,
} from "firebase/database";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ========== FIREBASE CONFIGURATION ==========
// USE YOUR EXISTING FIREBASE CONFIG FROM frontend/src/firebase.js
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

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

// // ========== GEMINI AI SETUP ==========
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash", // or "gemini-3.0-pro" for better quality
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 500,
  },
});


// ========== SYSTEM PROMPT ==========
const SYSTEM_PROMPT = `You are SiteSense AI, an expert assistant for a Landslide Early Warning System.

CONTEXT: You analyze sensor data from construction sites monitoring:
- Soil Moisture (% at 20cm, 40cm, 60cm depths)
- Tilt/Rotation (X, Y, Z axes in degrees)
- Vibration (g-force from acceleration)
- Crack Width (mm from Time-of-Flight sensor)
- Temperature (°C) and Humidity (%)
- Raindrop detection

THRESHOLDS (Critical for decision support):
| Parameter | SAFE | WARNING | CRITICAL |
|-----------|------|---------|----------|
| Soil Moisture | <60% | 60-80% | >80% |
| Tilt (X-axis) | <5° | 5-8° | >8° |
| Crack Width | <3.5mm | 3.5-5mm | >5mm |
| Vibration | <0.2g | 0.2-0.4g | >0.4g |

ACTION GUIDELINES:
- CRITICAL: "🚨 IMMEDIATE EVACUATION required. Notify all personnel."
- WARNING: "⚠️ Schedule inspection within 24 hours. Increase monitoring."
- SAFE: "✅ Continue routine monitoring. All parameters normal."

RESPONSE RULES:
1. ALWAYS reference specific numerical values from the data
2. Provide actionable recommendations based on thresholds above
3. Be concise (2-3 sentences for simple queries)
4. For complex analysis, provide bullet points
5. Never invent data - ask for clarification if needed

EXAMPLE RESPONSES:
Q: "What's the current risk?"
A: "Soil moisture at 87% (CRITICAL) and tilt at 6.2° (WARNING). Combined risk level: CRITICAL. 🚨 Immediate evacuation recommended for Zone C."

Q: "What factors influence risk most?"
A: "Based on correlation analysis: 1) Soil moisture (r=0.82) strongest predictor, 2) Tilt angle (r=0.71), 3) Crack width (r=0.65). Vibration shows weaker correlation (r=0.43)."
`;

// ========== HELPER FUNCTIONS ==========

// Get latest readings from Firebase
async function getLatestReadings(limit = 20) {
  try {
    const readingsRef = ref(database, "sensor_readings");
    const snapshot = await get(readingsRef);
    const data = snapshot.val();

    if (!data) return [];

    const readings = Object.values(data);
    // Sort by timestamp descending (newest first)
    readings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return readings.slice(0, limit);
  } catch (error) {
    console.error("Error fetching readings:", error);
    return [];
  }
}

// Calculate comprehensive risk score
function calculateRiskScore(reading) {
  let score = 0;

  // Soil moisture contribution (40% max)
  const soilAvg =
    ((reading.soil_20cm || 0) +
      (reading.soil_40cm || 0) +
      (reading.soil_60cm || 0)) /
    3;
  score += (soilAvg / 100) * 40;

  // Tilt contribution (35% max)
  const tiltX = Math.abs(reading.rotation_x || 0);
  score += (Math.min(tiltX, 10) / 10) * 35;

  // Crack contribution (15% max)
  const crack = reading.crack_width || 0;
  score += (Math.min(crack, 8) / 8) * 15;

  // Vibration contribution (10% max)
  const vibration = Math.abs(reading.acceleration_x || 0);
  score += (Math.min(vibration, 0.5) / 0.5) * 10;

  return Math.min(Math.round(score), 100);
}

// Get comprehensive statistics for AI context
async function getSystemStats() {
  const readings = await getLatestReadings(50);
  if (readings.length === 0) return null;

  const latest = readings[0];

  // Calculate trends (compare last 10 with previous 10)
  const recent10 = readings.slice(0, 10);
  const previous10 = readings.slice(10, 20);

  const avgRecent =
    recent10.reduce((sum, r) => sum + (r.soil_20cm || 0), 0) / 10;
  const avgPrevious =
    previous10.length > 0
      ? previous10.reduce((sum, r) => sum + (r.soil_20cm || 0), 0) /
        previous10.length
      : avgRecent;
  const soilTrend = avgRecent - avgPrevious;

  const stats = {
    timestamp: new Date().toISOString(),
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
      risk_score: calculateRiskScore(latest),
      node_name: latest.node_name || "Node2",
    },
    trends: {
      soil_trend: soilTrend.toFixed(1),
      soil_direction:
        soilTrend > 2
          ? "rapidly_increasing"
          : soilTrend > 0.5
            ? "gradually_increasing"
            : soilTrend < -2
              ? "rapidly_decreasing"
              : "stable",
    },
    alerts: [],
  };

  // Generate alerts based on thresholds
  if (stats.latest.soil_20cm > 80)
    stats.alerts.push({
      severity: "critical",
      message: `Soil moisture at ${stats.latest.soil_20cm}% exceeds critical threshold (80%)`,
    });
  else if (stats.latest.soil_20cm > 60)
    stats.alerts.push({
      severity: "warning",
      message: `Soil moisture at ${stats.latest.soil_20cm}% exceeds warning threshold (60%)`,
    });

  if (stats.latest.tilt_x > 8)
    stats.alerts.push({
      severity: "critical",
      message: `Tilt angle at ${stats.latest.tilt_x.toFixed(1)}° exceeds critical threshold (8°)`,
    });
  else if (stats.latest.tilt_x > 5)
    stats.alerts.push({
      severity: "warning",
      message: `Tilt angle at ${stats.latest.tilt_x.toFixed(1)}° exceeds warning threshold (5°)`,
    });

  if (stats.latest.crack_width > 5)
    stats.alerts.push({
      severity: "critical",
      message: `Crack width at ${stats.latest.crack_width.toFixed(1)}mm exceeds critical threshold (5mm)`,
    });
  else if (stats.latest.crack_width > 3.5)
    stats.alerts.push({
      severity: "warning",
      message: `Crack width at ${stats.latest.crack_width.toFixed(1)}mm exceeds warning threshold (3.5mm)`,
    });

  if (stats.latest.vibration > 0.4)
    stats.alerts.push({
      severity: "critical",
      message: `Vibration at ${stats.latest.vibration.toFixed(2)}g exceeds critical threshold (0.4g)`,
    });
  else if (stats.latest.vibration > 0.2)
    stats.alerts.push({
      severity: "warning",
      message: `Vibration at ${stats.latest.vibration.toFixed(2)}g exceeds warning threshold (0.2g)`,
    });

  // Determine overall risk level
  if (stats.latest.risk_score > 70) stats.risk_level = "CRITICAL";
  else if (stats.latest.risk_score > 40) stats.risk_level = "WARNING";
  else stats.risk_level = "SAFE";

  return stats;
}

// Get historical correlation data
async function getCorrelationData() {
  const readings = await getLatestReadings(100);
  if (readings.length < 20) return null;

  // Calculate Pearson correlation between soil moisture and crack width
  const n = readings.length;
  const soilVals = readings.map((r) => r.soil_20cm || 0);
  const crackVals = readings.map((r) => r.crack_width || 0);
  const tiltVals = readings.map((r) => Math.abs(r.rotation_x || 0));
  const vibVals = readings.map((r) => Math.abs(r.acceleration_x || 0));

  const correlation = (arr1, arr2) => {
    const mean1 = arr1.reduce((a, b) => a + b, 0) / n;
    const mean2 = arr2.reduce((a, b) => a + b, 0) / n;
    let num = 0,
      den1 = 0,
      den2 = 0;
    for (let i = 0; i < n; i++) {
      num += (arr1[i] - mean1) * (arr2[i] - mean2);
      den1 += (arr1[i] - mean1) ** 2;
      den2 += (arr2[i] - mean2) ** 2;
    }
    return den1 * den2 === 0 ? 0 : num / Math.sqrt(den1 * den2);
  };

  return {
    soil_crack_correlation: correlation(soilVals, crackVals).toFixed(2),
    soil_tilt_correlation: correlation(soilVals, tiltVals).toFixed(2),
    vibration_crack_correlation: correlation(vibVals, crackVals).toFixed(2),
  };
}

// ========== API ENDPOINTS ==========

async function getGeminiResponse(message, contextData) {
  // Build the full prompt with context
  const fullPrompt = `${SYSTEM_PROMPT}

${contextData}

User Question: ${message}

Provide a helpful, actionable response based on the data above.`;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}


// ========== API ENDPOINTS ==========

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // Get current system data for context
    const stats = await getSystemStats();
    const correlations = await getCorrelationData();

    if (!stats) {
      return res.json({
        reply:
          "I'm having trouble accessing sensor data. Please check if data has been loaded into Firebase.",
        timestamp: new Date().toISOString(),
      });
    }

    // Build context message
    let contextMessage = `CURRENT SYSTEM STATUS (${stats.timestamp}):\n\n`;

    contextMessage += `📊 LATEST READINGS:\n`;
    contextMessage += `- Soil Moisture: ${stats.latest.soil_20cm}% (20cm), ${stats.latest.soil_40cm}% (40cm), ${stats.latest.soil_60cm}% (60cm)\n`;
    contextMessage += `- Tilt: X=${stats.latest.tilt_x.toFixed(1)}°, Y=${stats.latest.tilt_y.toFixed(1)}°, Z=${stats.latest.tilt_z.toFixed(1)}°\n`;
    contextMessage += `- Crack Width: ${stats.latest.crack_width.toFixed(1)}mm\n`;
    contextMessage += `- Vibration: ${stats.latest.vibration.toFixed(2)}g\n`;
    contextMessage += `- Temperature: ${stats.latest.temperature}°C, Humidity: ${stats.latest.humidity}%\n`;
    contextMessage += `- Raindrop Detected: ${stats.latest.raindrop > 0 ? "YES" : "NO"}\n`;
    contextMessage += `- Node: ${stats.latest.node_name}\n`;
    contextMessage += `- Risk Score: ${stats.latest.risk_score}/100\n`;
    contextMessage += `- Overall Risk Level: ${stats.risk_level}\n\n`;

    contextMessage += `📈 TRENDS:\n`;
    contextMessage += `- Soil moisture is ${stats.trends.soil_direction.replace("_", " ")}\n`;
    contextMessage += `- Rate of change: ${stats.trends.soil_trend}% per reading\n\n`;

    if (correlations) {
      contextMessage += `🔗 CORRELATIONS (Pearson r):\n`;
      contextMessage += `- Soil vs Crack: r=${correlations.soil_crack_correlation}\n`;
      contextMessage += `- Soil vs Tilt: r=${correlations.soil_tilt_correlation}\n`;
      contextMessage += `- Vibration vs Crack: r=${correlations.vibration_crack_correlation}\n\n`;
    }

    if (stats.alerts.length > 0) {
      contextMessage += `🚨 ACTIVE ALERTS (${stats.alerts.length}):\n`;
      stats.alerts.forEach((alert) => {
        contextMessage += `- [${alert.severity.toUpperCase()}] ${alert.message}\n`;
      });
      contextMessage += `\n`;
    }

    contextMessage += `THRESHOLDS REMINDER:\n`;
    contextMessage += `- Soil: SAFE <60%, WARNING 60-80%, CRITICAL >80%\n`;
    contextMessage += `- Tilt: SAFE <5°, WARNING 5-8°, CRITICAL >8°\n`;
    contextMessage += `- Crack: SAFE <3.5mm, WARNING 3.5-5mm, CRITICAL >5mm\n`;
    contextMessage += `- Vibration: SAFE <0.2g, WARNING 0.2-0.4g, CRITICAL >0.4g\n`;

    // Add conversation history if provided
    if (history && history.length > 0) {
      contextMessage += `\nCONVERSATION HISTORY:\n`;
      history.slice(-5).forEach((msg) => {
        contextMessage += `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}\n`;
      });
    }

    // Get response from Gemini
    const reply = await getGeminiResponse(message, contextMessage);


    res.json({
      reply: reply,
      timestamp: new Date().toISOString(),
      context_used: {
        risk_level: stats.risk_level,
        alert_count: stats.alerts.length,
        risk_score: stats.latest.risk_score,
      },
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    res.status(500).json({
      error: "Failed to process request",
      reply: `I encountered an error: ${error.message}. Please check your Gemini API key and try again.`,
    });
  }
});

// Get latest sensor data (for dashboard integration)
app.get("/api/latest-data", async (req, res) => {
  try {
    const stats = await getSystemStats();
    const readings = await getLatestReadings(10);
    res.json({ stats, readings });
  } catch (error) {
    console.error("Error fetching latest data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Get risk trend (last N readings)
app.get("/api/risk-trend", async (req, res) => {
  const { limit = 30 } = req.query;
  try {
    const readings = await getLatestReadings(parseInt(limit));
    const trend = readings
      .map((r) => ({
        timestamp: r.timestamp,
        risk_score: calculateRiskScore(r),
        soil: r.soil_20cm || 0,
        tilt: Math.abs(r.rotation_x || 0),
        crack: r.crack_width || 0,
      }))
      .reverse(); // chronological order

    res.json(trend);
  } catch (error) {
    console.error("Error fetching risk trend:", error);
    res.status(500).json({ error: "Failed to fetch trend" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    ai_provider: "Google Gemini",
    model: "gemini-2.5-flash",
  });
});

// Helper to call Python ML service
async function callMLService(endpoint, method = 'GET', data = null) {
  const url = `http://localhost:5000/api/ml${endpoint}`;
  
  if (method === 'GET') {
    const response = await fetch(url);
    return response.json();
  } else {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
}

// ML: Get current risk prediction
app.get('/api/ml/current-risk', async (req, res) => {
  try {
    const result = await callMLService('/current-risk');
    res.json(result);
  } catch (error) {
    console.error('ML service error:', error);
    res.status(503).json({ error: 'ML service unavailable' });
  }
});

// ML: Get risk forecast
app.get('/api/ml/forecast', async (req, res) => {
  try {
    const hours = req.query.hours || 1;
    const result = await callMLService(`/forecast?hours=${hours}`);
    res.json(result);
  } catch (error) {
    res.status(503).json({ error: 'ML service unavailable' });
  }
});

// ML: Get historical risk trend
app.get('/api/ml/historical-risk', async (req, res) => {
  try {
    const limit = req.query.limit || 30;
    const result = await callMLService(`/historical-risk?limit=${limit}`);
    res.json(result);
  } catch (error) {
    res.status(503).json({ error: 'ML service unavailable' });
  }
});

// ML: Get feature importance
app.get('/api/ml/feature-importance', async (req, res) => {
  try {
    const result = await callMLService('/feature-importance');
    res.json(result);
  } catch (error) {
    res.status(503).json({ error: 'ML service unavailable' });
  }
});

// ML: Predict from custom data
app.post('/api/ml/predict', async (req, res) => {
  try {
    const result = await callMLService('/predict', 'POST', req.body);
    res.json(result);
  } catch (error) {
    res.status(503).json({ error: 'ML service unavailable' });
  }
});

// ML: Health check
app.get('/api/ml/health', async (req, res) => {
  try {
    const result = await callMLService('/health');
    res.json(result);
  } catch (error) {
    res.json({ status: 'disconnected', error: error.message });
  }
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 SiteSense AI Server running on http://localhost:${PORT}`);
  console.log(`🤖 AI Provider: Google Gemini`);
  console.log(`📡 API endpoints:`);
  console.log(`   POST /api/chat - Chat with AI assistant`);
  console.log(`   GET  /api/latest-data - Get latest sensor data`);
  console.log(`   GET  /api/risk-trend - Get risk score trend`);
  console.log(`   GET  /api/health - Health check`);
  console.log(`   🤖 ML endpoints:`);
  console.log(`   GET  /api/ml/health - ML service health`);
  console.log(`   GET  /api/ml/current-risk - ML risk prediction`);
  console.log(`   GET  /api/ml/forecast - Risk forecast`);
  console.log(`   GET  /api/ml/historical-risk - Historical risk trend`);
  console.log(`   GET  /api/ml/feature-importance - Feature importance`);
});
