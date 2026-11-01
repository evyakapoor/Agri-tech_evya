import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', location: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await register(form);
      } else {
        await login({ email: form.email, password: form.password });
      }
      toast.success(isRegister ? 'Account created successfully' : 'Login successful');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="card shadow border-0">
              <div className="card-body p-4">
                <h3 className="mb-3 text-center">{isRegister ? 'Create your farm account' : 'Sign in to your account'}</h3>
                <form onSubmit={handleSubmit}>
                  {isRegister && (
                    <div className="mb-3">
                      <label className="form-label">Full Name</label>
                      <input name="name" value={form.name} onChange={handleChange} className="form-control" required />
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} className="form-control" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input name="password" type="password" value={form.password} onChange={handleChange} className="form-control" required />
                  </div>
                  {isRegister && (
                    <div className="mb-3">
                      <label className="form-label">Location</label>
                      <input name="location" value={form.location} onChange={handleChange} className="form-control" />
                    </div>
                  )}
                  <button className="btn btn-success w-100" disabled={loading}>
                    {loading ? 'Please wait...' : 'Continue'}
                  </button>
                </form>
                <div className="mt-3 text-center">
                  <button className="btn btn-link text-success" onClick={() => setIsRegister(!isRegister)}>
                    {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
