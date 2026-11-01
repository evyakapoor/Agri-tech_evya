import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';

const emptyForm = {
  name: '',
  address: '',
  region: '',
  totalArea: '',
  soilType: 'Loamy',
  irrigationMethod: 'Drip',
};

export default function FarmsPage() {
  const [farms, setFarms] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const loadFarms = async () => {
    const { data } = await api.get('/api/farms');
    setFarms(data.farms);
  };

  useEffect(() => {
    loadFarms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/farms/${editingId}`, form);
        toast.success('Farm updated');
      } else {
        await api.post('/api/farms', form);
        toast.success('Farm created');
      }
      setForm(emptyForm);
      setEditingId(null);
      loadFarms();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save farm');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this farm?')) return;
    await api.delete(`/api/farms/${id}`);
    toast.success('Farm removed');
    loadFarms();
  };

  const handleEdit = (farm) => {
    setEditingId(farm._id);
    setForm({
      name: farm.name,
      address: farm.address,
      region: farm.region,
      totalArea: farm.totalArea,
      soilType: farm.soilType,
      irrigationMethod: farm.irrigationMethod,
    });
  };

  return (
    <div className="page-shell container py-4">
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h4>{editingId ? 'Edit farm' : 'Add new farm'}</h4>
              <form onSubmit={handleSubmit}>
                <input className="form-control mb-2" placeholder="Farm name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <input className="form-control mb-2" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                <input className="form-control mb-2" placeholder="Region" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
                <input className="form-control mb-2" type="number" placeholder="Total area" value={form.totalArea} onChange={(e) => setForm({ ...form, totalArea: e.target.value })} required />
                <input className="form-control mb-2" placeholder="Soil type" value={form.soilType} onChange={(e) => setForm({ ...form, soilType: e.target.value })} />
                <input className="form-control mb-2" placeholder="Irrigation method" value={form.irrigationMethod} onChange={(e) => setForm({ ...form, irrigationMethod: e.target.value })} />
                <button className="btn btn-success w-100">{editingId ? 'Update farm' : 'Create farm'}</button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h4>Farm portfolio</h4>
              <table className="table table-hover align-middle">
                <thead>
                  <tr><th>Name</th><th>Region</th><th>Area</th><th>Soil</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {farms.map((farm) => (
                    <tr key={farm._id}>
                      <td>{farm.name}</td>
                      <td>{farm.region || 'N/A'}</td>
                      <td>{farm.totalArea} {farm.areaUnit || 'acre'}</td>
                      <td>{farm.soilType}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-success me-2" onClick={() => handleEdit(farm)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(farm._id)}>Delete</button>
                      </td>
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
