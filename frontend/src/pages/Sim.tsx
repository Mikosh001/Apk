import { useMemo, useState } from 'react';

import { Card } from '../components/Card';
import { strings } from '../i18n/kk';

const FIELD_AREA = 50_000; // m2 placeholder

const SimPage = () => {
  const [speed, setSpeed] = useState(5);
  const [altitude, setAltitude] = useState(30);
  const [swath, setSwath] = useState(15);

  const result = useMemo(() => {
    const passes = Math.ceil(Math.sqrt(FIELD_AREA) / swath);
    const distance = passes * Math.sqrt(FIELD_AREA);
    const timeSeconds = distance / speed;
    const overlap = Math.abs(altitude - 30) * 0.5;
    const pass = speed >= 4 && speed <= 12 && overlap < 20;
    return {
      passes,
      timeMinutes: (timeSeconds / 60).toFixed(1),
      overlap,
      message: pass ? 'Маршрут тиімді! (Маршрут эффективен)' : 'Параметрлерді түзетіңіз. (Настройте параметры)',
    };
  }, [speed, altitude, swath]);

  return (
    <section className="section">
      <h2>{strings.sim.title}</h2>
      <div className="card-grid">
        <Card title="Параметрлер (Параметры)">
          <form>
            <label>
              Жылдамдық (м/с)
              <input type="number" value={speed} min={1} max={15} onChange={(e) => setSpeed(Number(e.target.value))} />
            </label>
            <label>
              Биіктік (м)
              <input type="number" value={altitude} min={10} max={120} onChange={(e) => setAltitude(Number(e.target.value))} />
            </label>
            <label>
              Жолақ ені (м)
              <input type="number" value={swath} min={5} max={30} onChange={(e) => setSwath(Number(e.target.value))} />
            </label>
          </form>
        </Card>
        <div className="canvas-card">
          <p>Өту саны: {result.passes}</p>
          <p>Жалпы уақыт: {result.timeMinutes} мин</p>
          <p>Қабаттасу қатесі: {result.overlap.toFixed(1)}%</p>
          <strong>{result.message}</strong>
        </div>
      </div>
    </section>
  );
};

export default SimPage;
