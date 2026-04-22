// import { database, ref, onValue, get, child } from "../firebase";

// // Get all sensor readings
// export function getAllReadings(callback) {
//   const readingsRef = ref(database, "sensor_readings");

//   onValue(readingsRef, (snapshot) => {
//     const data = snapshot.val();
//     if (data) {
//       const readingsArray = Object.values(data);
//       // Sort by timestamp
//       readingsArray.sort(
//         (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
//       );
//       callback(readingsArray);
//     } else {
//       callback([]);
//     }
//   });
// }

// // Get latest reading only
// export function getLatestReading(callback) {
//   const readingsRef = ref(database, "sensor_readings");

//   onValue(readingsRef, (snapshot) => {
//     const data = snapshot.val();
//     if (data) {
//       const readingsArray = Object.values(data);
//       const latestReading = readingsArray[readingsArray.length - 1];
//       callback(latestReading);
//     } else {
//       callback(null);
//     }
//   });
// }

// // Get readings for a specific node (Node1 or Node2)
// export function getReadingsByNode(nodeName, callback) {
//   const readingsRef = ref(database, "sensor_readings");

//   onValue(readingsRef, (snapshot) => {
//     const data = snapshot.val();
//     if (data) {
//       const readingsArray = Object.values(data);
//       const filtered = readingsArray.filter(
//         (reading) => reading.node_name === nodeName,
//       );
//       callback(filtered);
//     } else {
//       callback([]);
//     }
//   });
// }

// // Get readings for last N days
// export function getReadingsLastNDays(days, callback) {
//   const readingsRef = ref(database, "sensor_readings");

//   onValue(readingsRef, (snapshot) => {
//     const data = snapshot.val();
//     if (data) {
//       const readingsArray = Object.values(data);
//       const now = new Date();
//       const cutoffDate = new Date();
//       cutoffDate.setDate(now.getDate() - days);

//       const filtered = readingsArray.filter((reading) => {
//         const readingDate = new Date(reading.timestamp);
//         return readingDate >= cutoffDate;
//       });

//       callback(filtered);
//     } else {
//       callback([]);
//     }
//   });
// }

// // Get readings by date range
// export function getReadingsByDateRange(startDate, endDate, callback) {
//   const readingsRef = ref(database, "sensor_readings");

//   onValue(readingsRef, (snapshot) => {
//     const data = snapshot.val();
//     if (data) {
//       const readingsArray = Object.values(data);
//       const filtered = readingsArray.filter((reading) => {
//         const readingDate = new Date(reading.timestamp);
//         return readingDate >= startDate && readingDate <= endDate;
//       });
//       callback(filtered);
//     } else {
//       callback([]);
//     }
//   });
// }

// // Calculate risk score from reading
// export function calculateRiskScore(reading) {
//   if (!reading) return 0;

//   let score = 0;
//   // Soil moisture contribution (40% max)
//   const soilAvg =
//     (reading.soil_20cm + reading.soil_40cm + reading.soil_60cm) / 3;
//   score += (soilAvg / 100) * 40;

//   // Tilt contribution (35% max)
//   const tiltX = Math.abs(reading.rotation_x);
//   score += (Math.min(tiltX, 10) / 10) * 35;

//   // Vibration contribution (25% max)
//   const vibration = Math.abs(reading.acceleration_x);
//   score += (Math.min(vibration, 0.5) / 0.5) * 25;

//   return Math.min(Math.round(score), 100);
// }

// // Get latest risk score
// export function getLatestRiskScore(callback) {
//   getLatestReading((reading) => {
//     if (reading) {
//       callback(calculateRiskScore(reading));
//     } else {
//       callback(0);
//     }
//   });
// }

// // Get alert distribution for reports
// export function getAlertDistribution(callback) {
//   getAllReadings((readings) => {
//     let soilAlerts = 0;
//     let vibrationAlerts = 0;
//     let tiltAlerts = 0;
//     let crackAlerts = 0;

//     readings.forEach((reading) => {
//       const riskScore = calculateRiskScore(reading);

//       if (riskScore > 70) {
//         if (reading.soil_20cm > 70) soilAlerts++;
//         if (Math.abs(reading.rotation_x) > 7) tiltAlerts++;
//         if (Math.abs(reading.acceleration_x) > 0.3) vibrationAlerts++;
//         if (reading.crack_width > 4.5) crackAlerts++;
//       } else if (riskScore > 50) {
//         if (reading.soil_20cm > 50) soilAlerts++;
//         if (Math.abs(reading.rotation_x) > 4) tiltAlerts++;
//         if (Math.abs(reading.acceleration_x) > 0.15) vibrationAlerts++;
//         if (reading.crack_width > 3.5) crackAlerts++;
//       }
//     });

//     const total = soilAlerts + vibrationAlerts + tiltAlerts + crackAlerts;

//     callback([
//       {
//         name: "Soil",
//         value: total > 0 ? Math.round((soilAlerts / total) * 100) : 25,
//         color: "#ef4444",
//       },
//       {
//         name: "Vibration",
//         value: total > 0 ? Math.round((vibrationAlerts / total) * 100) : 25,
//         color: "#f59e0b",
//       },
//       {
//         name: "Tilt",
//         value: total > 0 ? Math.round((tiltAlerts / total) * 100) : 25,
//         color: "#3b82f6",
//       },
//       {
//         name: "Crack",
//         value: total > 0 ? Math.round((crackAlerts / total) * 100) : 25,
//         color: "#22c55e",
//       },
//     ]);
//   });
// }

// // Get risk score trend for last N days
// export function getRiskScoreTrend(days, callback) {
//   getReadingsLastNDays(days, (readings) => {
//     const dailyScores = {};

//     readings.forEach((reading) => {
//       const date = new Date(reading.timestamp).toLocaleDateString();
//       const score = calculateRiskScore(reading);

//       if (!dailyScores[date] || score > dailyScores[date]) {
//         dailyScores[date] = score;
//       }
//     });

//     const trend = Object.keys(dailyScores).map((date) => ({
//       date: date,
//       score: dailyScores[date],
//     }));

//     callback(trend);
//   });
// }

import { database, ref, onValue, get, child } from "../firebase";

// Get all sensor readings
export function getAllReadings(callback) {
  const readingsRef = ref(database, "sensor_readings");

  onValue(readingsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const readingsArray = Object.values(data);
      // Sort by timestamp in ASCENDING order (oldest first)
      // This is more reliable for time-series data
      readingsArray.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
      );
      callback(readingsArray);
    } else {
      callback([]);
    }
  });
}

// Get latest reading only
// In firebaseService.js, update getLatestReading:

// In firebaseService.js, ensure getLatestReading is correct:

export function getLatestReading(callback) {
  const readingsRef = ref(database, "sensor_readings");

  onValue(readingsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const readingsArray = Object.values(data);
      if (readingsArray.length === 0) {
        callback(null);
        return;
      }
      
      // Sort by timestamp descending (newest first)
      const sorted = readingsArray.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      
      const latestReading = sorted[0];
      console.log("getLatestReading found:", latestReading?.timestamp, "crack:", latestReading?.crack_width);
      callback(latestReading);
    } else {
      callback(null);
    }
  });
}

// Get readings for a specific node (Node1 or Node2)
export function getReadingsByNode(nodeName, callback) {
  const readingsRef = ref(database, "sensor_readings");

  onValue(readingsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const readingsArray = Object.values(data);
      const filtered = readingsArray.filter(
        (reading) => reading.node_name === nodeName,
      );
      callback(filtered);
    } else {
      callback([]);
    }
  });
}

// Get readings for last N days
export function getReadingsLastNDays(days, callback) {
  const readingsRef = ref(database, "sensor_readings");

  onValue(readingsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const readingsArray = Object.values(data);
      const now = new Date();
      const cutoffDate = new Date();
      cutoffDate.setDate(now.getDate() - days);

      const filtered = readingsArray.filter((reading) => {
        const readingDate = new Date(reading.timestamp);
        return readingDate >= cutoffDate;
      });

      callback(filtered);
    } else {
      callback([]);
    }
  });
}

// Get readings by date range
export function getReadingsByDateRange(startDate, endDate, callback) {
  const readingsRef = ref(database, "sensor_readings");

  onValue(readingsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const readingsArray = Object.values(data);
      const filtered = readingsArray.filter((reading) => {
        const readingDate = new Date(reading.timestamp);
        return readingDate >= startDate && readingDate <= endDate;
      });
      callback(filtered);
    } else {
      callback([]);
    }
  });
}

// Calculate risk score from reading
export function calculateRiskScore(reading) {
  if (!reading) return 0;

  let score = 0;
  // Soil moisture contribution (40% max)
  const soilAvg =
    (reading.soil_20cm + reading.soil_40cm + reading.soil_60cm) / 3;
  score += (soilAvg / 100) * 40;

  // Tilt contribution (35% max)
  const tiltX = Math.abs(reading.rotation_x);
  score += (Math.min(tiltX, 10) / 10) * 35;

  // Vibration contribution (25% max)
  const vibration = Math.abs(reading.acceleration_x);
  score += (Math.min(vibration, 0.5) / 0.5) * 25;

  return Math.min(Math.round(score), 100);
}

// Get latest risk score
export function getLatestRiskScore(callback) {
  getLatestReading((reading) => {
    if (reading) {
      callback(calculateRiskScore(reading));
    } else {
      callback(0);
    }
  });
}

// Get alert distribution for reports
export function getAlertDistribution(callback) {
  getAllReadings((readings) => {
    let soilAlerts = 0;
    let vibrationAlerts = 0;
    let tiltAlerts = 0;
    let crackAlerts = 0;

    readings.forEach((reading) => {
      const riskScore = calculateRiskScore(reading);

      if (riskScore > 70) {
        if (reading.soil_20cm > 70) soilAlerts++;
        if (Math.abs(reading.rotation_x) > 7) tiltAlerts++;
        if (Math.abs(reading.acceleration_x) > 0.3) vibrationAlerts++;
        if (reading.crack_width > 4.5) crackAlerts++;
      } else if (riskScore > 50) {
        if (reading.soil_20cm > 50) soilAlerts++;
        if (Math.abs(reading.rotation_x) > 4) tiltAlerts++;
        if (Math.abs(reading.acceleration_x) > 0.15) vibrationAlerts++;
        if (reading.crack_width > 3.5) crackAlerts++;
      }
    });

    const total = soilAlerts + vibrationAlerts + tiltAlerts + crackAlerts;

    callback([
      {
        name: "Soil",
        value: total > 0 ? Math.round((soilAlerts / total) * 100) : 25,
        color: "#ef4444",
      },
      {
        name: "Vibration",
        value: total > 0 ? Math.round((vibrationAlerts / total) * 100) : 25,
        color: "#f59e0b",
      },
      {
        name: "Tilt",
        value: total > 0 ? Math.round((tiltAlerts / total) * 100) : 25,
        color: "#3b82f6",
      },
      {
        name: "Crack",
        value: total > 0 ? Math.round((crackAlerts / total) * 100) : 25,
        color: "#22c55e",
      },
    ]);
  });
}

// Get risk score trend for last N days
export function getRiskScoreTrend(days, callback) {
  getReadingsLastNDays(days, (readings) => {
    const dailyScores = {};

    readings.forEach((reading) => {
      const date = new Date(reading.timestamp).toLocaleDateString();
      const score = calculateRiskScore(reading);

      if (!dailyScores[date] || score > dailyScores[date]) {
        dailyScores[date] = score;
      }
    });

    const trend = Object.keys(dailyScores).map((date) => ({
      date: date,
      score: dailyScores[date],
    }));

    callback(trend);
  });
}

