import { Card } from '../components/Card';

const posts = [
  { title: 'AgriTech жаңалықтары', summary: 'Жаңа UAV стандарттары қабылданды.' },
  { title: 'IoT мониторинг мысалы', summary: 'Құрғақшылыққа қарсы сенсорлық желі.' },
];

const Blog = () => (
  <section className="section">
    <h2>Жарияланымдар (Публикации)</h2>
    <div className="card-grid">
      {posts.map((post) => (
        <Card key={post.title} title={post.title} subtitle={post.summary} />
      ))}
    </div>
  </section>
);

export default Blog;
