import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { title: 'Farm planning', text: 'Map out operations, crops, and harvest windows from one workspace.' },
  { title: 'Soil insights', text: 'Track pH, nutrients, moisture, and agronomic recommendations.' },
  { title: 'Weather risk', text: 'Monitor real-time conditions and adapt irrigation before stress appears.' },
];

export default function HomePage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div>
      <section className="hero-section">
        <div className="container py-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <span className="badge bg-light text-success mb-3">Agri-Tech</span>
              <h1 className="display-4 fw-bold text-white">{t('home.title')}</h1>
              <p className="lead text-light">{t('home.subtitle')}</p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to={user ? '/dashboard' : '/auth'} className="btn btn-light btn-lg">{t('home.primaryCta')}</Link>
                <Link to="/auth" className="btn btn-outline-light btn-lg">{t('home.secondaryCta')}</Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="card shadow-lg border-0 p-3">
                <img src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6" alt="Farm field" className="img-fluid rounded" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <h2 className="text-center mb-4">{t('home.metricsTitle')}</h2>
        <div className="row g-4">
          {features.map((item) => (
            <div className="col-md-4" key={item.title}>
              <div className="card h-100 border-0 shadow-sm p-3">
                <div className="display-6 text-success mb-2">✓</div>
                <h4>{item.title}</h4>
                <p className="text-muted mb-0">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
