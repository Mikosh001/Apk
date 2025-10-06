import { Route, Routes } from 'react-router-dom';

import { Layout } from '../components/Layout';
import Home from '../pages/Home';
import Professions from '../pages/Professions';
import Stories from '../pages/Stories';
import Blog from '../pages/Blog';
import Learning from '../pages/Learning';
import CourseDetail from '../pages/CourseDetail';
import QuizPage from '../pages/Quiz';
import SimPage from '../pages/Sim';
import Portfolio from '../pages/Portfolio';
import Jobs from '../pages/Jobs';
import Mentors from '../pages/Mentors';
import EmployerJobs from '../pages/EmployerJobs';
import AdminPage from '../pages/Admin';
import AuthLogin from '../pages/AuthLogin';
import AuthRegister from '../pages/AuthRegister';
import PublicProfile from '../pages/PublicProfile';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/professions" element={<Professions />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/auth/login" element={<AuthLogin />} />
        <Route path="/auth/register" element={<AuthRegister />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/quiz/:courseId" element={<QuizPage />} />
        <Route path="/sim" element={<SimPage />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/mentors" element={<Mentors />} />
        <Route path="/employer/jobs" element={<EmployerJobs />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/u/:id" element={<PublicProfile />} />
      </Routes>
    </Layout>
  );
};

export default App;
