const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set } = require("firebase/database");
const fs = require("fs");

// Your Firebase config
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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const sensorData = JSON.parse(
  fs.readFileSync("./data/sensor_data.json", "utf8"),
);

async function loadData() {
  for (let i = 0; i < sensorData.length; i++) {
    const reading = sensorData[i];
    const readingId = `reading_${i + 1}`;

    await set(ref(database, `sensor_readings/${readingId}`), {
      timestamp: reading.Date,
      node_name: reading.Name,
      rotation_x: reading["Rotation X"],
      rotation_y: reading["Rotation Y"],
      rotation_z: reading["Rotation Z"],
      acceleration_x: reading["Acceleration X"],
      acceleration_y: reading["Acceleration Y"],
      acceleration_z: reading["Acceleration Z"],
      raindrop: reading.Raindrop,
      vibration: reading.Vibration,
      soil_20cm: reading.Soil20cm,
      soil_40cm: reading.Soil40cm,
      soil_60cm: reading.Soil60cm,
      crack_width: reading.CrackWidth,
      temperature: reading.Temperature,
      humidity: reading.Humidity,
    });

    console.log(`Loaded record ${i + 1}/${sensorData.length}`);
  }

  console.log("All data loaded successfully!");
}

loadData();
