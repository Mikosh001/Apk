import { Link } from 'react-router-dom';

import { Card } from '../components/Card';
import { strings } from '../i18n/kk';

const partners = ['AgroTech', 'Qoldau', 'DigitalFarm'];

const Home = () => {
  return (
    <div>
      <section className="hero">
        <h1>{strings.home.heroTitle}</h1>
        <p>{strings.home.heroSubtitle}</p>
        <Link to="/auth/register" className="btn primary">
          {strings.home.cta}
        </Link>
      </section>

      <section className="section">
        <h2>{strings.home.benefitsTitle}</h2>
        <div className="card-grid">
          {strings.home.benefits.map((benefit) => (
            <Card key={benefit} title={benefit}>
              <p>Ауыл шаруашылығының цифрлық трансформациясына қосыл.</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>{strings.home.partners}</h2>
        <div className="card-grid">
          {partners.map((partner) => (
            <Card key={partner} title={partner} subtitle="Логотип placeholder" />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
