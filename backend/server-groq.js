// import express from 'express';
// import cors from 'cors';
// import { initializeApp } from 'firebase/app';
// import { getDatabase, ref, get } from 'firebase/database';
// import Groq from 'groq-sdk';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // ========== FIREBASE CONFIGURATION ==========
// // COPY YOUR EXISTING FIREBASE CONFIG FROM frontend/src/firebase.js
// const firebaseConfig = {
//   "apiKey": "AIzaSyD5IShpVHM9Dy4C4Cg15j-5ik1e6Cvy0I4",
//   "authDomain": "iotbda-11609.firebaseapp.com",
//   "databaseURL": "https://iotbda-11609-default-rtdb.firebaseio.com",
//   "projectId": "iotbda-11609",
//   "storageBucket": "iotbda-11609.firebasestorage.app",
//   "messagingSenderId": "806540556560",
//   "appId": "1:806540556560:web:07f223b9e755fa8552cd95",
// };

// // Initialize Firebase
// const firebaseApp = initializeApp(firebaseConfig);
// const database = getDatabase(firebaseApp);

// // ========== GROQ AI SETUP ==========
// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// // ========== SYSTEM PROMPT ==========
// const SYSTEM_PROMPT = `You are SiteSense AI, an expert assistant for a Landslide Early Warning System.

// CONTEXT: You analyze sensor data from construction sites monitoring:
// - Soil Moisture (% at 20cm, 40cm, 60cm depths)
// - Tilt/Rotation (X, Y, Z axes in degrees)
// - Vibration (g-force from acceleration)
// - Crack Width (mm from Time-of-Flight sensor)
// - Temperature (°C) and Humidity (%)
// - Raindrop detection

// THRESHOLDS (Critical for decision support):
// | Parameter | SAFE | WARNING | CRITICAL |
// |-----------|------|---------|----------|
// | Soil Moisture | <60% | 60-80% | >80% |
// | Tilt (X-axis) | <5° | 5-8° | >8° |
// | Crack Width | <3.5mm | 3.5-5mm | >5mm |
// | Vibration | <0.2g | 0.2-0.4g | >0.4g |

// ACTION GUIDELINES:
// - CRITICAL: "🚨 IMMEDIATE EVACUATION required. Notify all personnel."
// - WARNING: "⚠️ Schedule inspection within 24 hours. Increase monitoring."
// - SAFE: "✅ Continue routine monitoring. All parameters normal."

// RESPONSE RULES:
// 1. ALWAYS reference specific numerical values from the data
// 2. Provide actionable recommendations based on thresholds above
// 3. Be concise (2-3 sentences for simple queries)
// 4. For complex analysis, provide bullet points
// 5. Never invent data - ask for clarification if needed
// 6. Use emojis for visual clarity (🚨⚠️✅📊🔗)

// EXAMPLE RESPONSES:
// Q: "What's the current risk?"
// A: "Soil moisture at 87% (CRITICAL) and tilt at 6.2° (WARNING). Combined risk level: CRITICAL. 🚨 Immediate evacuation recommended for Zone C."

// Q: "What factors influence risk most?"
// A: "Based on correlation analysis: 1) Soil moisture (r=0.82) strongest predictor, 2) Tilt angle (r=0.71), 3) Crack width (r=0.65). Vibration shows weaker correlation (r=0.43)."`;

// // ========== HELPER FUNCTIONS ==========

// // Get latest readings from Firebase
// async function getLatestReadings(limit = 20) {
//   try {
//     const readingsRef = ref(database, 'sensor_readings');
//     const snapshot = await get(readingsRef);
//     const data = snapshot.val();
    
//     if (!data) return [];
    
//     const readings = Object.values(data);
//     readings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
//     return readings.slice(0, limit);
//   } catch (error) {
//     console.error('Error fetching readings:', error);
//     return [];
//   }
// }

// // Calculate comprehensive risk score
// function calculateRiskScore(reading) {
//   let score = 0;
//   const soilAvg = ((reading.soil_20cm || 0) + (reading.soil_40cm || 0) + (reading.soil_60cm || 0)) / 3;
//   score += (soilAvg / 100) * 40;
//   const tiltX = Math.abs(reading.rotation_x || 0);
//   score += (Math.min(tiltX, 10) / 10) * 35;
//   const crack = reading.crack_width || 0;
//   score += (Math.min(crack, 8) / 8) * 15;
//   const vibration = Math.abs(reading.acceleration_x || 0);
//   score += (Math.min(vibration, 0.5) / 0.5) * 10;
//   return Math.min(Math.round(score), 100);
// }

// // Get comprehensive statistics for AI context
// async function getSystemStats() {
//   const readings = await getLatestReadings(50);
//   if (readings.length === 0) return null;
  
//   const latest = readings[0];
//   const recent10 = readings.slice(0, 10);
//   const previous10 = readings.slice(10, 20);
  
//   const avgRecent = recent10.reduce((sum, r) => sum + (r.soil_20cm || 0), 0) / 10;
//   const avgPrevious = previous10.length > 0 ? previous10.reduce((sum, r) => sum + (r.soil_20cm || 0), 0) / previous10.length : avgRecent;
//   const soilTrend = avgRecent - avgPrevious;
  
//   const stats = {
//     timestamp: new Date().toISOString(),
//     latest: {
//       soil_20cm: latest.soil_20cm || 0,
//       soil_40cm: latest.soil_40cm || 0,
//       soil_60cm: latest.soil_60cm || 0,
//       tilt_x: Math.abs(latest.rotation_x || 0),
//       tilt_y: Math.abs(latest.rotation_y || 0),
//       tilt_z: Math.abs(latest.rotation_z || 0),
//       crack_width: latest.crack_width || 0,
//       vibration: Math.abs(latest.acceleration_x || 0),
//       temperature: latest.temperature || 0,
//       humidity: latest.humidity || 0,
//       raindrop: latest.raindrop || 0,
//       risk_score: calculateRiskScore(latest),
//       node_name: latest.node_name || 'Node2'
//     },
//     trends: {
//       soil_trend: soilTrend.toFixed(1),
//       soil_direction: soilTrend > 2 ? 'rapidly_increasing' : soilTrend > 0.5 ? 'gradually_increasing' : 'stable'
//     },
//     alerts: []
//   };
  
//   if (stats.latest.soil_20cm > 80) stats.alerts.push({ severity: 'critical', message: `Soil moisture at ${stats.latest.soil_20cm}% exceeds critical threshold (80%)` });
//   else if (stats.latest.soil_20cm > 60) stats.alerts.push({ severity: 'warning', message: `Soil moisture at ${stats.latest.soil_20cm}% exceeds warning threshold (60%)` });
//   if (stats.latest.tilt_x > 8) stats.alerts.push({ severity: 'critical', message: `Tilt angle at ${stats.latest.tilt_x.toFixed(1)}° exceeds critical threshold (8°)` });
//   else if (stats.latest.tilt_x > 5) stats.alerts.push({ severity: 'warning', message: `Tilt angle at ${stats.latest.tilt_x.toFixed(1)}° exceeds warning threshold (5°)` });
//   if (stats.latest.crack_width > 5) stats.alerts.push({ severity: 'critical', message: `Crack width at ${stats.latest.crack_width.toFixed(1)}mm exceeds critical threshold (5mm)` });
//   else if (stats.latest.crack_width > 3.5) stats.alerts.push({ severity: 'warning', message: `Crack width at ${stats.latest.crack_width.toFixed(1)}mm exceeds warning threshold (3.5mm)` });
//   if (stats.latest.vibration > 0.4) stats.alerts.push({ severity: 'critical', message: `Vibration at ${stats.latest.vibration.toFixed(2)}g exceeds critical threshold (0.4g)` });
//   else if (stats.latest.vibration > 0.2) stats.alerts.push({ severity: 'warning', message: `Vibration at ${stats.latest.vibration.toFixed(2)}g exceeds warning threshold (0.2g)` });
  
//   if (stats.latest.risk_score > 70) stats.risk_level = 'CRITICAL';
//   else if (stats.latest.risk_score > 40) stats.risk_level = 'WARNING';
//   else stats.risk_level = 'SAFE';
  
//   return stats;
// }

// // ========== GROQ API HELPER ==========
// async function getGroqResponse(message, contextData, history = []) {
//   // Build messages array for Groq
//   const messages = [
//     { role: 'system', content: SYSTEM_PROMPT },
//     { role: 'system', content: `Current System Data:\n${contextData}` }
//   ];
  
//   // Add conversation history (last 5 messages)
//   for (const msg of history.slice(-5)) {
//     messages.push({ role: msg.role, content: msg.content });
//   }
  
//   // Add current user message
//   messages.push({ role: 'user', content: message });
  
//   try {
//     const completion = await groq.chat.completions.create({
//       messages: messages,
//       model: 'llama-3.3-70b-versatile',  // Fast and free model on Groq
//       temperature: 0.7,
//       max_tokens: 500,
//       top_p: 0.9,
//     });
    
//     return completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";
//   } catch (error) {
//     console.error('Groq API Error:', error);
//     throw error;
//   }
// }

// // ========== API ENDPOINTS ==========

// // Chat endpoint
// app.post('/api/chat', async (req, res) => {
//   const { message, history = [] } = req.body;
  
//   if (!message) {
//     return res.status(400).json({ error: 'Message is required' });
//   }
  
//   try {
//     const stats = await getSystemStats();
    
//     if (!stats) {
//       return res.json({ 
//         reply: "I'm having trouble accessing sensor data. Please check if data has been loaded into Firebase.",
//         timestamp: new Date().toISOString()
//       });
//     }
    
//     // Build context message
//     let contextMessage = `CURRENT SYSTEM STATUS (${stats.timestamp}):\n\n`;
//     contextMessage += `📊 LATEST READINGS:\n`;
//     contextMessage += `- Soil Moisture: ${stats.latest.soil_20cm}% (20cm), ${stats.latest.soil_40cm}% (40cm), ${stats.latest.soil_60cm}% (60cm)\n`;
//     contextMessage += `- Tilt: X=${stats.latest.tilt_x.toFixed(1)}°, Y=${stats.latest.tilt_y.toFixed(1)}°, Z=${stats.latest.tilt_z.toFixed(1)}°\n`;
//     contextMessage += `- Crack Width: ${stats.latest.crack_width.toFixed(1)}mm\n`;
//     contextMessage += `- Vibration: ${stats.latest.vibration.toFixed(2)}g\n`;
//     contextMessage += `- Temperature: ${stats.latest.temperature}°C, Humidity: ${stats.latest.humidity}%\n`;
//     contextMessage += `- Raindrop Detected: ${stats.latest.raindrop > 0 ? 'YES' : 'NO'}\n`;
//     contextMessage += `- Node: ${stats.latest.node_name}\n`;
//     contextMessage += `- Risk Score: ${stats.latest.risk_score}/100\n`;
//     contextMessage += `- Overall Risk Level: ${stats.risk_level}\n\n`;
    
//     contextMessage += `📈 TRENDS:\n`;
//     contextMessage += `- Soil moisture is ${stats.trends.soil_direction.replace('_', ' ')}\n`;
//     contextMessage += `- Rate of change: ${stats.trends.soil_trend}% per reading\n\n`;
    
//     if (stats.alerts.length > 0) {
//       contextMessage += `🚨 ACTIVE ALERTS (${stats.alerts.length}):\n`;
//       stats.alerts.forEach(alert => {
//         contextMessage += `- [${alert.severity.toUpperCase()}] ${alert.message}\n`;
//       });
//       contextMessage += `\n`;
//     }
    
//     contextMessage += `THRESHOLDS REMINDER:\n`;
//     contextMessage += `- Soil: SAFE <60%, WARNING 60-80%, CRITICAL >80%\n`;
//     contextMessage += `- Tilt: SAFE <5°, WARNING 5-8°, CRITICAL >8°\n`;
//     contextMessage += `- Crack: SAFE <3.5mm, WARNING 3.5-5mm, CRITICAL >5mm\n`;
//     contextMessage += `- Vibration: SAFE <0.2g, WARNING 0.2-0.4g, CRITICAL >0.4g\n`;
    
//     // Get response from Groq
//     const reply = await getGroqResponse(message, contextMessage, history);
    
//     res.json({ 
//       reply: reply,
//       timestamp: new Date().toISOString(),
//       context_used: {
//         risk_level: stats.risk_level,
//         alert_count: stats.alerts.length,
//         risk_score: stats.latest.risk_score
//       }
//     });
    
//   } catch (error) {
//     console.error('Chat API Error:', error);
//     res.status(500).json({ 
//       error: 'Failed to process request',
//       reply: `I encountered an error: ${error.message}. Please check your Groq API key and try again.`
//     });
//   }
// });

// // Get latest sensor data
// app.get('/api/latest-data', async (req, res) => {
//   try {
//     const stats = await getSystemStats();
//     const readings = await getLatestReadings(10);
//     res.json({ stats, readings });
//   } catch (error) {
//     console.error('Error fetching latest data:', error);
//     res.status(500).json({ error: 'Failed to fetch data' });
//   }
// });

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ 
//     status: 'ok', 
//     timestamp: new Date().toISOString(),
//     ai_provider: 'Groq',
//     model: 'llama-3.3-70b-versatile'
//   });
// });

// // Start server
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`\n${'='.repeat(60)}`);
//   console.log(`🚀 SiteSense AI Server running on http://localhost:${PORT}`);
//   console.log(`${'='.repeat(60)}`);
//   console.log(`🤖 AI Provider: Groq (Llama 3.3 70B)`);
//   console.log(`📡 API endpoints:`);
//   console.log(`   POST /api/chat - Chat with AI assistant`);
//   console.log(`   GET  /api/latest-data - Get latest sensor data`);
//   console.log(`   GET  /api/health - Health check`);
//   console.log(`${'='.repeat(60)}\n`);
// });

import express from 'express';
import cors from 'cors';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ========== FIREBASE CONFIGURATION ==========
const firebaseConfig = {
  "apiKey": "AIzaSyD5IShpVHM9Dy4C4Cg15j-5ik1e6Cvy0I4",
  "authDomain": "iotbda-11609.firebaseapp.com",
  "databaseURL": "https://iotbda-11609-default-rtdb.firebaseio.com",
  "projectId": "iotbda-11609",
  "storageBucket": "iotbda-11609.firebasestorage.app",
  "messagingSenderId": "806540556560",
  "appId": "1:806540556560:web:07f223b9e755fa8552cd95",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

// ========== GROQ AI SETUP ==========
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
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

THRESHOLDS:
- Soil Moisture: SAFE <60%, WARNING 60-80%, CRITICAL >80%
- Tilt (X-axis): SAFE <5°, WARNING 5-8°, CRITICAL >8°
- Crack Width: SAFE <3.5mm, WARNING 3.5-5mm, CRITICAL >5mm
- Vibration: SAFE <0.2g, WARNING 0.2-0.4g, CRITICAL >0.4g

ACTION GUIDELINES:
- CRITICAL: "🚨 IMMEDIATE EVACUATION required. Notify all personnel."
- WARNING: "⚠️ Schedule inspection within 24 hours. Increase monitoring."
- SAFE: "✅ Continue routine monitoring. All parameters normal."

RESPONSE RULES:
1. ALWAYS reference specific numerical values from the data
2. Provide actionable recommendations based on thresholds above
3. Be concise (2-3 sentences for simple queries)
4. Use emojis for visual clarity
5. Never invent data - ask for clarification if needed`;

// ========== HELPER FUNCTIONS ==========

async function getLatestReadings(limit = 20) {
  try {
    const readingsRef = ref(database, 'sensor_readings');
    const snapshot = await get(readingsRef);
    const data = snapshot.val();
    if (!data) return [];
    const readings = Object.values(data);
    readings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return readings.slice(0, limit);
  } catch (error) {
    console.error('Error fetching readings:', error);
    return [];
  }
}

function calculateRiskScore(reading) {
  let score = 0;
  const soilAvg = ((reading.soil_20cm || 0) + (reading.soil_40cm || 0) + (reading.soil_60cm || 0)) / 3;
  score += (soilAvg / 100) * 40;
  const tiltX = Math.abs(reading.rotation_x || 0);
  score += (Math.min(tiltX, 10) / 10) * 35;
  const crack = reading.crack_width || 0;
  score += (Math.min(crack, 8) / 8) * 15;
  const vibration = Math.abs(reading.acceleration_x || 0);
  score += (Math.min(vibration, 0.5) / 0.5) * 10;
  return Math.min(Math.round(score), 100);
}

async function getSystemStats() {
  const readings = await getLatestReadings(50);
  if (readings.length === 0) return null;
  
  const latest = readings[0];
  const recent10 = readings.slice(0, 10);
  const previous10 = readings.slice(10, 20);
  
  const avgRecent = recent10.reduce((sum, r) => sum + (r.soil_20cm || 0), 0) / 10;
  const avgPrevious = previous10.length > 0 ? previous10.reduce((sum, r) => sum + (r.soil_20cm || 0), 0) / previous10.length : avgRecent;
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
      node_name: latest.node_name || 'Node2'
    },
    trends: {
      soil_trend: soilTrend.toFixed(1),
      soil_direction: soilTrend > 2 ? 'rapidly_increasing' : soilTrend > 0.5 ? 'gradually_increasing' : 'stable'
    },
    alerts: []
  };
  
  if (stats.latest.soil_20cm > 80) stats.alerts.push({ severity: 'critical', message: `Soil moisture at ${stats.latest.soil_20cm}% exceeds critical threshold (80%)` });
  else if (stats.latest.soil_20cm > 60) stats.alerts.push({ severity: 'warning', message: `Soil moisture at ${stats.latest.soil_20cm}% exceeds warning threshold (60%)` });
  if (stats.latest.tilt_x > 8) stats.alerts.push({ severity: 'critical', message: `Tilt angle at ${stats.latest.tilt_x.toFixed(1)}° exceeds critical threshold (8°)` });
  else if (stats.latest.tilt_x > 5) stats.alerts.push({ severity: 'warning', message: `Tilt angle at ${stats.latest.tilt_x.toFixed(1)}° exceeds warning threshold (5°)` });
  if (stats.latest.crack_width > 5) stats.alerts.push({ severity: 'critical', message: `Crack width at ${stats.latest.crack_width.toFixed(1)}mm exceeds critical threshold (5mm)` });
  else if (stats.latest.crack_width > 3.5) stats.alerts.push({ severity: 'warning', message: `Crack width at ${stats.latest.crack_width.toFixed(1)}mm exceeds warning threshold (3.5mm)` });
  if (stats.latest.vibration > 0.4) stats.alerts.push({ severity: 'critical', message: `Vibration at ${stats.latest.vibration.toFixed(2)}g exceeds critical threshold (0.4g)` });
  else if (stats.latest.vibration > 0.2) stats.alerts.push({ severity: 'warning', message: `Vibration at ${stats.latest.vibration.toFixed(2)}g exceeds warning threshold (0.2g)` });
  
  if (stats.latest.risk_score > 70) stats.risk_level = 'CRITICAL';
  else if (stats.latest.risk_score > 40) stats.risk_level = 'WARNING';
  else stats.risk_level = 'SAFE';
  
  return stats;
}

// ========== GROQ API HELPER ==========
async function getGroqResponse(message, contextData, history = []) {
  // Build messages array
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'system', content: `Current System Data:\n${contextData}` }
  ];
  
  // Add conversation history
  for (const msg of history.slice(-5)) {
    messages.push({ role: msg.role, content: msg.content });
  }
  
  // Add current user message
  messages.push({ role: 'user', content: message });
  
  try {
    const completion = await groq.chat.completions.create({
      messages: messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 500,
      top_p: 0.9,
    });
    
    return completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error('Groq API Error:', error);
    // Return fallback response
    return getFallbackResponse(message, contextData);
  }
}

// Fallback response when API fails
function getFallbackResponse(message, contextData) {
  const msg = message.toLowerCase();
  
  try {
    // Parse context data
    const stats = JSON.parse(contextData);
    const soil = stats.latest?.soil_20cm || 0;
    const crack = stats.latest?.crack_width || 0;
    const tilt = stats.latest?.tilt_x || 0;
    const riskLevel = stats.risk_level || 'SAFE';
    
    if (msg.includes('risk') || msg.includes('danger')) {
      if (riskLevel === 'CRITICAL') {
        return `🚨 **CRITICAL RISK!**\n\nSoil: ${soil}% | Crack: ${crack}mm | Tilt: ${tilt.toFixed(1)}°\n\n⚠️ **IMMEDIATE ACTION:** Evacuate Zone C, halt construction, notify supervisor!`;
      } else if (riskLevel === 'WARNING') {
        return `⚠️ **WARNING - Elevated Risk**\n\nSoil: ${soil}% | Crack: ${crack}mm | Tilt: ${tilt.toFixed(1)}°\n\n📋 **Actions:** Schedule inspection within 24 hours, increase monitoring frequency.`;
      } else {
        return `✅ **SAFE - Normal Conditions**\n\nSoil: ${soil}% | Crack: ${crack}mm | Tilt: ${tilt.toFixed(1)}°\n\nContinue routine monitoring. All parameters within safe limits.`;
      }
    }
    
    if (msg.includes('readings') || msg.includes('sensor')) {
      return `📊 **Latest Sensor Readings**\n\n🌱 Soil: ${soil}%\n📏 Crack: ${crack}mm\n📐 Tilt: ${tilt.toFixed(1)}°\n📳 Vibration: ${stats.latest?.vibration?.toFixed(2) || 0}g\n🌡️ Temp: ${stats.latest?.temperature || 0}°C\n💧 Humidity: ${stats.latest?.humidity || 0}%\n\n🟢 Risk Level: ${riskLevel}`;
    }
    
    return `👋 I'm SiteSense AI. Ask me about:\n• Current risk level\n• Latest sensor readings\n• Safety recommendations\n\nTry: "What is the current risk?"`;
    
  } catch (e) {
    return `👋 SiteSense AI Assistant active. Ask me about current risk levels or sensor readings!`;
  }
}

// ========== API ENDPOINTS ==========

app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  try {
    const stats = await getSystemStats();
    
    if (!stats) {
      return res.json({ 
        reply: "I'm having trouble accessing sensor data. Please check if data has been loaded into Firebase.",
        timestamp: new Date().toISOString()
      });
    }
    
    const contextData = JSON.stringify(stats);
    const reply = await getGroqResponse(message, contextData, history);
    
    res.json({ 
      reply: reply,
      timestamp: new Date().toISOString(),
      context_used: {
        risk_level: stats.risk_level,
        alert_count: stats.alerts.length,
        risk_score: stats.latest.risk_score
      }
    });
    
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ 
      error: 'Failed to process request',
      reply: "I encountered an error. Please try again later."
    });
  }
});

app.get('/api/latest-data', async (req, res) => {
  try {
    const stats = await getSystemStats();
    const readings = await getLatestReadings(10);
    res.json({ stats, readings });
  } catch (error) {
    console.error('Error fetching latest data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    ai_provider: 'Groq',
    model: 'llama-3.3-70b-versatile'
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 SiteSense AI Server running on http://localhost:${PORT}`);
  console.log(`${'='.repeat(60)}`);
  console.log(`🤖 AI Provider: Groq (Llama 3.3 70B)`);
  console.log(`📡 API endpoints:`);
  console.log(`   POST /api/chat - Chat with AI assistant`);
  console.log(`   GET  /api/latest-data - Get latest sensor data`);
  console.log(`   GET  /api/health - Health check`);
  console.log(`${'='.repeat(60)}\n`);
});