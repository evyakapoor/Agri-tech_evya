import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../api/axios';

const palette = ['#198754', '#2ecc71', '#f2c94c', '#d35400', '#27ae60'];

export default function DashboardPage() {
  const [data, setData] = useState({ stats: {}, upcomingHarvests: [], activeAlerts: [], activities: [], monthlyData: [], cropHealth: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data } = await api.get('/api/dashboard');
        setData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return <div className="page-shell text-center py-5"><div className="spinner-border text-success" role="status" /></div>;
  }

  const weather = data.stats.latestWeather || {};
  const soil = data.stats.soilSummary || {};

  return (
    <div className="page-shell container py-4">
      <h2 className="mb-4">Farmer dashboard</h2>
      <div className="row g-4 mb-4">
        {[
          { label: 'Total Farms', value: data.stats.totalFarms || 0, icon: '🏡' },
          { label: 'Active Crops', value: data.stats.activeCrops || 0, icon: '🌾' },
          { label: 'Upcoming Harvests', value: data.stats.upcomingHarvests || 0, icon: '🚜' },
          { label: 'Active Alerts', value: data.stats.activeAlerts || 0, icon: '⚠️' },
        ].map((card) => (
          <div key={card.label} className="col-md-6 col-xl-3">
            <div className="card shadow-sm h-100 border-0">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">{card.label}</small>
                  <h3 className="mb-0">{card.value}</h3>
                </div>
                <div className="display-6">{card.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5>Monthly crop activity</h5>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.monthlyData}> 
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#198754" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5>Crop health mix</h5>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={data.cropHealth} dataKey="count" nameKey="_id" outerRadius={80} label>
                    {data.cropHealth.map((entry, index) => (
                      <Cell key={entry._id || index} fill={palette[index % palette.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5>Latest weather</h5>
              <div className="d-flex justify-content-between"><span>Temperature</span><strong>{weather.temperature ?? '--'}°C</strong></div>
              <div className="d-flex justify-content-between"><span>Humidity</span><strong>{weather.humidity ?? '--'}%</strong></div>
              <div className="d-flex justify-content-between"><span>Rainfall</span><strong>{weather.rainfall ?? '--'} mm</strong></div>
              <div className="d-flex justify-content-between"><span>Wind</span><strong>{weather.windSpeed ?? '--'} km/h</strong></div>
            </div>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5>Upcoming harvests</h5>
              {data.upcomingHarvests.length ? (
                <ul className="list-group list-group-flush">
                  {data.upcomingHarvests.map((crop) => (
                    <li key={crop._id} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{crop.cropName}</span>
                      <span className="badge bg-success rounded-pill">{new Date(crop.expectedHarvestDate).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-muted mb-0">No upcoming harvests found.</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5>Soil health summary</h5>
              <div className="d-flex justify-content-between"><span>pH</span><strong>{soil.pH ?? '--'}</strong></div>
              <div className="d-flex justify-content-between"><span>N</span><strong>{soil.nitrogen ?? '--'}</strong></div>
              <div className="d-flex justify-content-between"><span>P</span><strong>{soil.phosphorus ?? '--'}</strong></div>
              <div className="d-flex justify-content-between"><span>K</span><strong>{soil.potassium ?? '--'}</strong></div>
              <div className="mt-3 text-muted small">{soil.recommendations || 'No recommendations available yet.'}</div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5>Recent farm activities</h5>
              {data.activities.length ? (
                <ul className="list-group list-group-flush">
                  {data.activities.map((item) => (
                    <li key={item._id} className="list-group-item">
                      <div className="fw-semibold">{item.activityType}</div>
                      <small className="text-muted">{item.description}</small>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-muted mb-0">No activities recorded yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
