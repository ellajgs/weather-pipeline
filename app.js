//this file runs web server and exposes weather data to browser
import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 5000;

const DATA_DIR = path.join(import.meta.dirname, "data");
const WEATHER_FILE = path.join(DATA_DIR, "weather.json");
const LOG_FILE = path.join(DATA_DIR, "weather_log.csv");
//same file path constants as fetchWeather.js but that writes to the files whereas this reads from them


app.use(express.static(path.join(import.meta.dirname, "publib")));
//without this, browser wouldn't be able to load frontend

app.get("/api/weather", (req, res) => {
  try {
    const weatherData = JSON.parse(fs.readFileSync(WEATHER_FILE, "utf-8"));
    res.json(weatherData);
  } catch {
    res.status(404).json({ error: "No weather data available" });
  }
});

app.get("api/weather-log", (req, res) => {
  try {
    const lines = fs.readFileSync(LOG_FILE, "utf-8").trim().split("\n");
    const ts = [];
    const temps = [];

    for (const line of lines.slice(1)) {
      const [timestamp, temperature] = line.split(",");
      if (timestamp && temperature) {
        ts.push(timestamp);
        temps.push(parseFloat(temperature));
      }
    }

    res.json({ ts, temps });
  } catch {
    res.status(404).json({ error: "No weather log available" });
  }
});

app.listen(PORT,()=> {
    console.log(`🚀 Server running on PORT: ${PORT}`)
})