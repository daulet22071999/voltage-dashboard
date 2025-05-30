import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { database, ref, onValue } from "./firebaseConfig";
import { query, limitToLast } from "firebase/database";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "./App.css";
import { useNavigate, Route, Routes } from 'react-router-dom';

const Dashboard = () => {
  const [voltage, setVoltage] = useState(0);
  const [ampere, setAmpere] = useState(0);
  const [power, setPower] = useState(0);
  const [selectedMetric, setSelectedMetric] = useState("voltage");

  
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (!auth) {
      navigate('/login');
    }
  }, [navigate]);

  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const voltageRef = ref(database, "energy_data/voltage");
    const ampereRef = ref(database, "energy_data/current");
    const powerRef = ref(database, "energy_data/power");
    const historyRef = query(
      ref(database, "history/energy_data"),
      limitToLast(60)
    );

    onValue(voltageRef, (snapshot) => {
      setVoltage(snapshot.val() || 0);
    });

    onValue(ampereRef, (snapshot) => {
      setAmpere(snapshot.val() || 0);
    });

    onValue(powerRef, (snapshot) => {
      setPower(snapshot.val() || 0);
    });

    onValue(historyRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formattedData = Object.keys(data).map((key) => ({
          timestamp: new Date(Number(key) * 1000),
          voltage: data[key].voltage,
          current: data[key].current,
          power: data[key].power,
        }));
        setHistoryData(formattedData);
      }
    });
  }, []);

  const voltageChartData = {
    labels: historyData.map((item) => item.timestamp.toLocaleTimeString()),
    datasets: [
      {
        label: "Voltage (V)",
        data: historyData.map((item) => item.voltage),
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        fill: true,
      },
    ],
  };

  const ampereChartData = {
    labels: historyData.map((item) => item.timestamp.toLocaleTimeString()),
    datasets: [
      {
        label: "Ampere (A)",
        data: historyData.map((item) => item.current),
        borderColor: "#f8ff36",
        backgroundColor: "rgba(245, 255, 54, 0.2)",
        fill: true,
      },
    ],
  };

  const powerChartData = {
    labels: historyData.map((item) => item.timestamp.toLocaleTimeString()),
    datasets: [
      {
        label: "Power (W)",
        data: historyData.map((item) => item.power),
        borderColor: "#ff5733",
        backgroundColor: "rgba(255, 87, 51, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="main-background">
      <div className="dashboard-container">
        {/* LEFT - SENSOR CARDS */}
        <div className="sensor-section">
          <h3 className="section-title">Live Sensor Data</h3>

          <div className={`sensor-card ${selectedMetric === "voltage" ? "selected" : ""}`}
              onClick={() => setSelectedMetric("voltage")}>

            <h4>Voltage</h4>
            <div className="progress-wrapper">
              <CircularProgressbar
                value={voltage}
                maxValue={250}
                text={`${voltage.toFixed(2)} V`}
                circleRatio={0.6}
                styles={buildStyles({
                  pathColor: "#007bff",
                  textColor: "black",
                  trailColor: "#444",
                  textSize: "18px",
                  strokeLinecap: "round",
                  rotation: 0.7,
                  trailWidth: 8,
                  pathWidth: 8,
                })}
              />
            </div>
            <div className="progress-labels">
              <span>0</span>
              <span>250</span>
            </div>
          </div>

          <div
  className={`sensor-card ${selectedMetric === "ampere" ? "selected" : ""}`}
  onClick={() => setSelectedMetric("ampere")}
>
            <h4>Ampere</h4>
            <div className="progress-wrapper">
              <CircularProgressbar
                value={ampere}
                maxValue={50}
                text={`${ampere.toFixed(2)} A`}
                circleRatio={0.6}
                styles={buildStyles({
                  pathColor: "#f8ff36",
                  textColor: "black",
                  trailColor: "#444",
                  textSize: "18px",
                  strokeLinecap: "round",
                  rotation: 0.7,
                  trailWidth: 8,
                  pathWidth: 8,
                })}
              />
            </div>
            <div className="progress-labels">
              <span>0</span>
              <span>50</span>
            </div>
          </div>

          <div
  className={`sensor-card ${selectedMetric === "power" ? "selected" : ""}`}
  onClick={() => setSelectedMetric("power")}
>
            <h4>Power</h4>
            <div className="progress-wrapper">
              <CircularProgressbar
                value={power}
                maxValue={5000}
                text={`${power.toFixed(2)} W`}
                circleRatio={0.6}
                styles={buildStyles({
                  pathColor: "#ff5733",
                  textColor: "black",
                  trailColor: "#444",
                  textSize: "18px",
                  strokeLinecap: "round",
                  rotation: 0.7,
                  trailWidth: 8,
                  pathWidth: 8,
                })}
              />
            </div>
            <div className="progress-labels">
              <span>0</span>
              <span>5000</span>
            </div>
          </div>
        </div>

        {/* RIGHT - CHARTS */}
        <div className="chart-section">
  <h3 className="section-title">Statistics</h3>

  {selectedMetric === "voltage" && (
    <div className="chart-container">
      <h3>Voltage History</h3>
      <Line data={voltageChartData} />
    </div>
  )}

  {selectedMetric === "ampere" && (
    <div className="chart-container">
      <h3>Ampere History</h3>
      <Line data={ampereChartData} />
    </div>
  )}

  {selectedMetric === "power" && (
    <div className="chart-container">
      <h3>Power History</h3>
      <Line data={powerChartData} />
    </div>
  )}
</div>

      </div>
    </div>
  );
};

export default Dashboard;
