import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({ name: '', category: 'Input', description: '', price: '0' });

  const loadResources = async () => {
    const { data } = await api.get('/api/resources');
    setResources(data.resources);
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/resources', { ...form, price: Number(form.price) });
      toast.success('Resource submitted');
      setForm({ name: '', category: 'Input', description: '', price: '0' });
      loadResources();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to submit resource');
    }
  };

  return (
    <div className="page-shell container py-4">
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h4>List a resource</h4>
              <form onSubmit={handleSubmit}>
                <input className="form-control mb-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <input className="form-control mb-2" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                <textarea className="form-control mb-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <input className="form-control mb-2" type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                <button className="btn btn-success w-100">Submit</button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h4>Marketplace</h4>
              <div className="row g-3">
                {resources.map((resource) => (
                  <div key={resource._id} className="col-md-6">
                    <div className="card h-100 border-0 bg-light">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h5 className="mb-0">{resource.name}</h5>
                          <span className="badge bg-success">{resource.category}</span>
                        </div>
                        <p className="text-muted small">{resource.description}</p>
                        <div className="d-flex justify-content-between">
                          <strong>₹{resource.price}</strong>
                          <small>Stock: {resource.stockQuantity}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
