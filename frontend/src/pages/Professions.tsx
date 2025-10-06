import { KeyboardEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../api/client';
import SkillChip from '../components/SkillChip';
import { useToast } from '../components/Toast';

interface Course {
  id: string;
  title: string;
  summary: string;
  skills: string[];
  durationWeeks: number;
}

const skeletonItems = Array.from({ length: 6 });

const Professions = () => {
  const navigate = useNavigate();
  const { show } = useToast();

  const [courses, setCourses] = useState<Course[]>([]);
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    const loadSkills = async () => {
      try {
        const { data } = await api.get<Course[]>('/courses');
        if (ignore) return;
        const uniqueSkills = Array.from(new Set(data.flatMap((course) => course.skills))).sort();
        setAllSkills(uniqueSkills);
      } catch (err) {
        // silently fail here; main fetch will surface error
      }
    };

    loadSkills();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let ignore = false;

    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params: Record<string, string | string[]> = {};
        if (debouncedQuery) {
          params.q = debouncedQuery;
        }
        if (selectedSkills.length > 0) {
          params.skills = selectedSkills;
        }
        const { data } = await api.get<Course[]>('/courses', { params });
        if (ignore) return;
        setCourses(data);
      } catch (err) {
        if (ignore) return;
        show('Сервермен байланыс жоқ, кейінірек қайталаңыз.');
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchCourses();

    return () => {
      ignore = true;
    };
  }, [debouncedQuery, selectedSkills, show]);

  const filtersActive = useMemo(
    () => query.trim().length > 0 || selectedSkills.length > 0,
    [query, selectedSkills]
  );

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((item) => item !== skill) : [...prev, skill]
    );
  };

  const handleClear = () => {
    setQuery('');
    setDebouncedQuery('');
    setSelectedSkills([]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setDebouncedQuery(query.trim());
    }
  };

  const renderCourses = () => {
    if (loading) {
      return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {skeletonItems.map((_, index) => (
            <div
              key={index}
              className="h-52 rounded-2xl bg-slate-100 animate-pulse"
              aria-hidden="true"
            />
          ))}
        </div>
      );
    }

    if (!loading && courses.length === 0) {
      return (
        <div
          className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500"
          role="status"
        >
          Курс табылмады 😕
        </div>
      );
    }

    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        {courses.map((course) => (
          <article
            key={course.id}
            className="flex h-full flex-col justify-between rounded-2xl bg-white p-6 shadow transition-transform duration-200 hover:scale-[1.01] hover:shadow-lg"
          >
            <div>
              <h3 className="text-xl font-semibold text-[#0F172A]">{course.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{course.durationWeeks} апта</p>
              <p className="mt-4 text-slate-600">
                {course.summary.length > 100
                  ? `${course.summary.slice(0, 97)}...`
                  : course.summary}
              </p>
              <div className="mt-4 flex flex-wrap" aria-label="Дағдылар">
                {course.skills.map((skill) => (
                  <span
                    key={skill}
                    className="mr-2 mb-2 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => navigate(`/course/${course.id}`)}
                className="w-full rounded-xl bg-[#007BFF] px-4 py-2 text-center text-sm font-semibold text-white shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 hover:bg-blue-600"
              >
                Курсқа кіру
              </button>
            </div>
          </article>
        ))}
      </div>
    );
  };

  return (
    <main className="bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#0F172A]">
            Кәсіптер
            <small className="ml-2 align-middle text-sm text-slate-500">
              Профессии будущего в АПК
            </small>
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Өзіңе сай цифрлық кәсіпті таңда және оқуды баста.
          </p>
        </header>

        <section className="mb-12 rounded-2xl bg-white p-6 shadow">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <label htmlFor="profession-search" className="sr-only">
                Кәсіп немесе дағды бойынша іздеу
              </label>
              <input
                id="profession-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Кәсіп немесе дағды бойынша іздеу..."
                aria-label="Кәсіп немесе дағды бойынша іздеу"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-700 shadow-sm focus:border-blue-500 focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>
            {filtersActive ? (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-xl border border-transparent bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              >
                Барлығын тазалау
              </button>
            ) : null}
          </div>

          {allSkills.length > 0 ? (
            <div className="mt-6" aria-label="Дағдыны сүзу">
              {allSkills.map((skill) => (
                <SkillChip
                  key={skill}
                  label={skill}
                  selected={selectedSkills.includes(skill)}
                  onClick={() => toggleSkill(skill)}
                />
              ))}
            </div>
          ) : null}

          {filtersActive && selectedSkills.length > 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              Таңдалғандар: {selectedSkills.join(', ')}
            </p>
          ) : null}
        </section>

        <section aria-labelledby="courses-heading">
          <h2 id="courses-heading" className="sr-only">
            Қолжетімді курстар
          </h2>
          {renderCourses()}
        </section>
      </div>
    </main>
  );
};

export default Professions;
