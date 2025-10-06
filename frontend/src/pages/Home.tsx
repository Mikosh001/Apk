// /frontend/src/pages/Home.tsx
import { type MouseEvent, type ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../store/auth';

type SectionProps = {
  id?: string;
  className?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

const Section = ({ id, className = '', title, subtitle, children }: SectionProps) => (
  <section id={id} className={`py-12 md:py-16 ${className}`}>
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {title ? (
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-[#0F172A] md:text-4xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-3 text-base text-[#64748B] md:text-lg">{subtitle}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </div>
  </section>
);

type BenefitCardProps = {
  title: string;
  description: string;
};

const BenefitCard = ({ title, description }: BenefitCardProps) => (
  <div className="flex h-full flex-col justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg focus-within:ring-2 focus-within:ring-[#007BFF]">
    <div>
      <h3 className="text-xl font-semibold text-[#0F172A]">{title}</h3>
      <p className="mt-3 text-base text-[#64748B]">{description}</p>
    </div>
  </div>
);

type PartnerLogoProps = {
  name: string;
};

const PartnerLogo = ({ name }: PartnerLogoProps) => (
  <div className="flex h-20 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 text-sm font-semibold text-[#0F172A] shadow-sm" aria-label={name}>
    <span aria-hidden="true">{name}</span>
  </div>
);

type StepItemProps = {
  emoji: string;
  title: string;
  description: string;
};

const StepItem = ({ emoji, title, description }: StepItemProps) => (
  <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
    <div className="flex items-center gap-3">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#007BFF]/10 text-2xl" aria-hidden="true">
        {emoji}
      </span>
      <h3 className="text-xl font-semibold text-[#0F172A]">{title}</h3>
    </div>
    <p className="mt-4 text-base text-[#64748B]">{description}</p>
  </div>
);

const benefits = [
  {
    title: '1 айда жаңа кәсіп',
    description: 'Қысқа модульдер, нақты дағдылар және тәжірибелік тапсырмалар.',
  },
  {
    title: 'Симулятор + тәжірибе',
    description: 'Дрон маршруты, сенсор деректері, өнімділік есебі — барлығы интерактивті.',
  },
  {
    title: 'Бейдж және жұмыс',
    description: 'QR-бейдждер, портфолио және жұмыс берушілермен matching.',
  },
];

const partners = ['Baitursynov Univ', 'Qostanai Hub', 'AgroTech', 'SmartFarm'];

const steps = [
  {
    emoji: '📝',
    title: 'Тіркелу',
    description: 'Профиль жасап, өз кәсібіңді таңда.',
  },
  {
    emoji: '🎯',
    title: 'Оқы және тапсыр',
    description: 'Видеосабақ, интерактив және тест.',
  },
  {
    emoji: '🏆',
    title: 'Бейдж & жұмыс',
    description: 'Дағдың расталады, matching ұсыныстары келеді.',
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAuthenticated = Boolean(user);

  useEffect(() => {
    document.title = 'Профессия 2.0 — Home';
    const description = 'АПК үшін оқу, симулятор және жұмысқа орналастыру платформасы.';
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);
  }, []);

  const handlePrimaryCTA = () => {
    navigate(isAuthenticated ? '/learning' : '/auth/register');
  };

  const handleSecondaryCTA = () => {
    navigate('/professions');
  };

  const handleScrollToBenefits = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const target = document.getElementById('benefits');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FBFF] text-[#0F172A]">
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#E8F2FF] to-[#F4FAFF] py-16">
          <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#007BFF]/10 blur-3xl" aria-hidden="true" />
          <div className="absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-[#4CAF50]/10 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="max-w-2xl">
              <span className="inline-flex items-center rounded-full bg-[#007BFF]/10 px-4 py-1 text-sm font-medium text-[#007BFF]">
                Цифрлық агро-болашақ
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight text-[#0F172A] sm:text-5xl">
                АПК болашағы — сенің цифрлық қолында!
              </h1>
              <p className="mt-6 text-lg text-[#64748B]">
                Оқы, тәжірибеден өт, бейдж ал және жұмысқа орналаспақ — бәрі бір платформада.
              </p>
              <small className="mt-2 block text-xs text-slate-500">
                Цифровой кадровый резерв для АПК — обучение + бейдж + работа
              </small>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={handlePrimaryCTA}
                  className="inline-flex items-center justify-center rounded-full bg-[#007BFF] px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-[#0063d1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#007BFF]"
                >
                  Оқуды бастау
                </button>
                <button
                  type="button"
                  onClick={handleSecondaryCTA}
                  className="inline-flex items-center justify-center rounded-full border border-[#007BFF] px-6 py-3 text-base font-semibold text-[#007BFF] transition hover:bg-[#007BFF]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#007BFF]"
                >
                  Кәсіптерді көру
                </button>
                <button
                  type="button"
                  onClick={handleScrollToBenefits}
                  className="inline-flex items-center text-sm font-semibold text-[#0F172A] underline-offset-4 transition hover:text-[#007BFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#007BFF]"
                >
                  Толығырақ ↓
                </button>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative mx-auto max-w-lg rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
                <div className="absolute -top-10 right-6 h-20 w-20 rounded-full bg-[#FFC107]/30 blur-xl" aria-hidden="true" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#64748B]">Сенің бағытың</span>
                    <span className="rounded-full bg-[#4CAF50]/10 px-3 py-1 text-sm font-semibold text-[#4CAF50]">
                      ▲ 92% мотивация
                    </span>
                  </div>
                  <div className="rounded-2xl bg-[#007BFF]/5 p-5">
                    <p className="text-lg font-semibold text-[#0F172A]">Дрон-оператор симуляторы</p>
                    <p className="mt-2 text-sm text-[#64748B]">
                      UAV маршруты, қауіпсіздік чек-лист және нақты деректермен есеп.
                    </p>
                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full w-4/5 rounded-full bg-[#007BFF]" aria-hidden="true" />
                    </div>
                    <p className="mt-2 text-sm font-medium text-[#0F172A]">80% прогресс</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm font-medium text-[#64748B]">Бейдж</p>
                      <p className="mt-1 text-base font-semibold text-[#0F172A]">Smart-tractor телематика</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm font-medium text-[#64748B]">Matching</p>
                      <p className="mt-1 text-base font-semibold text-[#0F172A]">SmartFarm аналитик</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Section id="benefits" title="Артықшылықтар">
          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map((benefit) => (
              <BenefitCard key={benefit.title} title={benefit.title} description={benefit.description} />
            ))}
          </div>
        </Section>

        <Section title="Серіктестер">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {partners.map((partner) => (
              <PartnerLogo key={partner} name={partner} />
            ))}
          </div>
        </Section>

        <Section title="Қалай жұмыс істейді?">
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <StepItem key={step.title} emoji={step.emoji} title={step.title} description={step.description} />
            ))}
          </div>
        </Section>

        <Section className="py-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#007BFF] via-[#4CAF50] to-[#007BFF] p-10 text-center text-white shadow-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent_55%)]" aria-hidden="true" />
            <div className="relative mx-auto max-w-2xl space-y-6">
              <h2 className="text-3xl font-semibold md:text-4xl">Бүгін баста — болашағыңды цифрландыр!</h2>
              <p className="text-base text-slate-100">
                Агро-секторға қажетті цифрлық дағдыларды меңгеріп, бейдж және жұмыс ұсыныстарына қол жеткіз.
              </p>
              <button
                type="button"
                onClick={handlePrimaryCTA}
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-base font-semibold text-[#0F172A] shadow-lg transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
              >
                Оқуды бастау
              </button>
            </div>
          </div>
        </Section>
      </main>

      <footer className="mt-auto bg-[#0F172A] text-slate-100">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h2 className="text-xl font-semibold text-white">Байланыс</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              <li>
                <a
                  href="mailto:hello@prof2.kz"
                  className="transition hover:text-[#FFC107] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#007BFF]"
                >
                  Почта: hello@prof2.kz
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/prof2_support"
                  className="transition hover:text-[#FFC107] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#007BFF]"
                >
                  Telegram: @prof2_support
                </a>
              </li>
            </ul>
          </div>
          <p className="text-sm text-slate-400">© 2025 Профессия 2.0</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
