import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function WeatherPage() {
  const [weather, setWeather] = useState([]);
  const [live, setLive] = useState(null);

  const loadWeather = async () => {
    const [snapshotRes, historyRes] = await Promise.all([
      api.get('/api/weather/forecast'),
      api.get('/api/weather/history'),
    ]);
    setLive(snapshotRes.data.weather);
    setWeather(historyRes.data.weather);
  };

  useEffect(() => {
    loadWeather();
  }, []);

  return (
    <div className="page-shell container py-4">
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h4>Weather overview</h4>
              {live ? (
                <>
                  <div className="fw-bold mb-2">{live.location}</div>
                  <div className="d-flex justify-content-between"><span>Temperature</span><strong>{live.temperature}°C</strong></div>
                  <div className="d-flex justify-content-between"><span>Humidity</span><strong>{live.humidity}%</strong></div>
                  <div className="d-flex justify-content-between"><span>Rainfall</span><strong>{live.rainfall} mm</strong></div>
                  <div className="d-flex justify-content-between"><span>Wind</span><strong>{live.windSpeed} km/h</strong></div>
                  <div className="mt-3 small text-muted">Source: {live.provider}</div>
                </>
              ) : <p className="text-muted mb-0">Loading weather data...</p>}
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h4>Recent weather snapshots</h4>
              <ul className="list-group list-group-flush">
                {weather.map((item) => (
                  <li key={item._id} className="list-group-item d-flex justify-content-between">
                    <span>{item.location}</span>
                    <span>{item.temperature}°C</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
