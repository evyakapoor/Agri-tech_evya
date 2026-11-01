import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';

const emptyForm = {
  farm: '',
  cropName: '',
  variety: '',
  plantingDate: '',
  expectedHarvestDate: '',
  fieldArea: '',
  growthStage: 'Vegetative',
  healthStatus: 'Healthy',
  notes: '',
};

export default function CropsPage() {
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const loadData = async () => {
    const [farmRes, cropRes] = await Promise.all([
      api.get('/api/farms'),
      api.get('/api/crops'),
    ]);
    setFarms(farmRes.data.farms);
    setCrops(cropRes.data.crops);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/crops', form);
      toast.success('Crop added');
      setForm(emptyForm);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save crop');
    }
  };

  return (
    <div className="page-shell container py-4">
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h4>Add crop record</h4>
              <form onSubmit={handleSubmit}>
                <select className="form-select mb-2" value={form.farm} onChange={(e) => setForm({ ...form, farm: e.target.value })} required>
                  <option value="">Select farm</option>
                  {farms.map((farm) => <option key={farm._id} value={farm._id}>{farm.name}</option>)}
                </select>
                <input className="form-control mb-2" placeholder="Crop name" value={form.cropName} onChange={(e) => setForm({ ...form, cropName: e.target.value })} required />
                <input className="form-control mb-2" placeholder="Variety" value={form.variety} onChange={(e) => setForm({ ...form, variety: e.target.value })} />
                <input className="form-control mb-2" type="date" value={form.plantingDate} onChange={(e) => setForm({ ...form, plantingDate: e.target.value })} required />
                <input className="form-control mb-2" type="date" value={form.expectedHarvestDate} onChange={(e) => setForm({ ...form, expectedHarvestDate: e.target.value })} required />
                <input className="form-control mb-2" type="number" placeholder="Field area" value={form.fieldArea} onChange={(e) => setForm({ ...form, fieldArea: e.target.value })} required />
                <select className="form-select mb-2" value={form.growthStage} onChange={(e) => setForm({ ...form, growthStage: e.target.value })}>
                  <option>Seedling</option>
                  <option>Vegetative</option>
                  <option>Flowering</option>
                  <option>Fruiting</option>
                  <option>Maturity</option>
                </select>
                <select className="form-select mb-2" value={form.healthStatus} onChange={(e) => setForm({ ...form, healthStatus: e.target.value })}>
                  <option>Healthy</option>
                  <option>Monitoring</option>
                  <option>At Risk</option>
                </select>
                <textarea className="form-control mb-2" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}></textarea>
                <button className="btn btn-success w-100">Save crop</button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h4>Crop inventory</h4>
              <table className="table table-hover">
                <thead><tr><th>Crop</th><th>Farm</th><th>Stage</th><th>Health</th><th>Harvest</th></tr></thead>
                <tbody>
                  {crops.map((crop) => (
                    <tr key={crop._id}>
                      <td>{crop.cropName}</td>
                      <td>{crop.farm?.name || 'Farm'}</td>
                      <td>{crop.growthStage}</td>
                      <td>{crop.healthStatus}</td>
                      <td>{new Date(crop.expectedHarvestDate).toLocaleDateString()}</td>
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
