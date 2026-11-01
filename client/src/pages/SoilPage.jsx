import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';

const defaultForm = {
  farm: '',
  pH: '6.4',
  nitrogen: '35',
  phosphorus: '18',
  potassium: '210',
  moisture: '28',
  organicMatter: '2.8',
  source: 'Manual',
};

export default function SoilPage() {
  const [farms, setFarms] = useState([]);
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState(defaultForm);

  const loadData = async () => {
    const [farmRes, reportRes] = await Promise.all([
      api.get('/api/farms'),
      api.get('/api/soil-reports'),
    ]);
    setFarms(farmRes.data.farms);
    setReports(reportRes.data.reports);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/soil-reports', { ...form, farm: form.farm, pH: Number(form.pH), nitrogen: Number(form.nitrogen), phosphorus: Number(form.phosphorus), potassium: Number(form.potassium), moisture: Number(form.moisture), organicMatter: Number(form.organicMatter) });
      toast.success('Soil report saved');
      setForm(defaultForm);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Soil data invalid');
    }
  };

  return (
    <div className="page-shell container py-4">
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h4>Submit soil test</h4>
              <form onSubmit={handleSubmit}>
                <select className="form-select mb-2" value={form.farm} onChange={(e) => setForm({ ...form, farm: e.target.value })} required>
                  <option value="">Select farm</option>
                  {farms.map((farm) => <option key={farm._id} value={farm._id}>{farm.name}</option>)}
                </select>
                <input className="form-control mb-2" type="number" step="0.1" placeholder="pH" value={form.pH} onChange={(e) => setForm({ ...form, pH: e.target.value })} required />
                <input className="form-control mb-2" type="number" step="0.1" placeholder="Nitrogen" value={form.nitrogen} onChange={(e) => setForm({ ...form, nitrogen: e.target.value })} required />
                <input className="form-control mb-2" type="number" step="0.1" placeholder="Phosphorus" value={form.phosphorus} onChange={(e) => setForm({ ...form, phosphorus: e.target.value })} required />
                <input className="form-control mb-2" type="number" step="0.1" placeholder="Potassium" value={form.potassium} onChange={(e) => setForm({ ...form, potassium: e.target.value })} required />
                <input className="form-control mb-2" type="number" step="0.1" placeholder="Moisture %" value={form.moisture} onChange={(e) => setForm({ ...form, moisture: e.target.value })} required />
                <input className="form-control mb-2" type="number" step="0.1" placeholder="Organic matter %" value={form.organicMatter} onChange={(e) => setForm({ ...form, organicMatter: e.target.value })} required />
                <select className="form-select mb-2" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
                  <option>Manual</option>
                  <option>Laboratory</option>
                  <option>Sample</option>
                </select>
                <button className="btn btn-success w-100">Save report</button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h4>Soil health history</h4>
              <table className="table table-hover">
                <thead><tr><th>Farm</th><th>pH</th><th>N</th><th>P</th><th>K</th><th>Moisture</th></tr></thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report._id}>
                      <td>{report.farm?.name || 'Farm'}</td>
                      <td>{report.pH}</td>
                      <td>{report.nitrogen}</td>
                      <td>{report.phosphorus}</td>
                      <td>{report.potassium}</td>
                      <td>{report.moisture}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
