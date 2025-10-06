import { Card } from '../components/Card';

const stories = [
  {
    name: 'Айгерім — Дрон-оператор',
    text: '1 айлық курстан кейін Агродрон стартапында жұмысқа тұрды.',
  },
  {
    name: 'Ерасыл — IoT техник',
    text: 'LoRaWAN желісін ауыл кооперативіне енгізіп, жаңа табыс ашты.',
  },
];

const Stories = () => (
  <section className="section">
    <h2>Табысты оқиғалар (Истории успеха)</h2>
    <div className="card-grid">
      {stories.map((story) => (
        <Card key={story.name} title={story.name}>
          <p>{story.text}</p>
        </Card>
      ))}
    </div>
  </section>
);

export default Stories;
