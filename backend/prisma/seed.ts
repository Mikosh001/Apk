import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createLessons = (courseId: string, prefix: string) => {
  const lessons = Array.from({ length: 12 }).map((_, idx) => ({
    courseId,
    type: idx % 3 === 0 ? 'video' : idx % 3 === 1 ? 'task' : 'sim',
    title: `${prefix} Сабақ ${idx + 1}`,
    videoUrl: idx % 3 === 0 ? `https://videos.example.com/${prefix.toLowerCase()}-${idx + 1}` : null,
    contentMd: `## ${prefix} ${idx + 1}\nПрактикалық материалдар.`,
    order: idx + 1,
  }));
  return lessons;
};

const makeQuestion = (skill: string, difficulty: number, idx: number, course: string) => ({
  text: `${course} ${skill} сценарий ${idx}`,
  skillTag: skill,
  difficulty,
  options: [
    { text: 'Дұрыс', isCorrect: true },
    { text: 'Қате', isCorrect: false },
    { text: 'Толықтыру', isCorrect: false },
  ],
});

async function main() {
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.mentor.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Password123!', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@apk.kz',
      name: 'Админ',
      passwordHash,
      role: 'admin',
    },
  });

  const employer = await prisma.user.create({
    data: {
      email: 'employer@apk.kz',
      name: 'AgroEmployer',
      passwordHash,
      role: 'employer',
      region: 'Алматы',
    },
  });

  const student = await prisma.user.create({
    data: {
      email: 'student@apk.kz',
      name: 'AgroStudent',
      passwordHash,
      role: 'student',
      region: 'Астана',
    },
  });

  const coursesSeed = [
    {
      title: 'Дрон-оператор (precision ag)',
      slug: 'uav-operator',
      summary: 'UAV картографиясы, қауіпсіздік, дәл егіншілік.',
      skills: ['UAV', 'Mapping', 'Safety'],
    },
    {
      title: 'Agro-IoT техник',
      slug: 'agro-iot-tech',
      summary: 'Сенсорлар, LoRaWAN және бақылау панельдері.',
      skills: ['Sensors', 'LoRaWAN', 'Dashboards'],
    },
    {
      title: 'Smart-tractor телематика',
      slug: 'smart-tractor',
      summary: 'CAN, GPS және тиімділік аналитикасы.',
      skills: ['CAN', 'GPS', 'Efficiency'],
    },
  ];

  for (const courseSeed of coursesSeed) {
    const course = await prisma.course.create({ data: courseSeed });
    const lessons = createLessons(course.id, courseSeed.title);
    for (const lesson of lessons) {
      await prisma.lesson.create({ data: lesson });
    }
    const quiz = await prisma.quiz.create({ data: { title: `${courseSeed.title} финалдық тест`, courseId: course.id } });
    const questions = [] as Array<{ text: string; skillTag: string; difficulty: number; options: unknown }>;
    courseSeed.skills.forEach((skill) => {
      for (let i = 1; i <= 4; i += 1) {
        const difficulty = i === 1 ? 1 : i === 2 ? 2 : i === 3 ? 3 : ((i % 3) + 1);
        questions.push(makeQuestion(skill, difficulty, i, courseSeed.title));
      }
    });
    while (questions.length < 10) {
      questions.push(makeQuestion(courseSeed.skills[0], 2, questions.length + 1, courseSeed.title));
    }
    for (const question of questions) {
      await prisma.question.create({ data: { quizId: quiz.id, ...question } });
    }
  }

  await prisma.enrollment.create({ data: { courseId: (await prisma.course.findFirst({ where: { slug: 'uav-operator' } }))!.id, userId: student.id, progress: 100 } });

  const jobs = [
    {
      employerId: employer.id,
      title: 'UAV картограф',
      city: 'Алматы',
      salaryMin: 300000,
      salaryMax: 450000,
      skillsRequired: ['UAV', 'Mapping'],
      description: 'Егістік мониторинг дрондары.',
    },
    {
      employerId: employer.id,
      title: 'LoRaWAN инженер',
      city: 'Астана',
      salaryMin: 280000,
      salaryMax: 420000,
      skillsRequired: ['Sensors', 'LoRaWAN'],
      description: 'Ауыл IoT сенсорлық желі.',
    },
    {
      employerId: employer.id,
      title: 'Телематика аналитигі',
      city: 'Шымкент',
      salaryMin: 320000,
      salaryMax: 480000,
      skillsRequired: ['CAN', 'GPS', 'Efficiency'],
      description: 'Smart-tractor деректер сараптамасы.',
    },
    {
      employerId: employer.id,
      title: 'Агродрон жаттықтырушысы',
      city: 'Қостанай',
      salaryMin: 250000,
      salaryMax: 400000,
      skillsRequired: ['UAV', 'Safety'],
      description: 'Дрон операторларын оқыту.',
    },
    {
      employerId: employer.id,
      title: 'IoT сервис технигі',
      city: 'Ақтау',
      salaryMin: 260000,
      salaryMax: 410000,
      skillsRequired: ['Sensors', 'Dashboards'],
      description: 'Деректер платформасын қолдау.',
    },
  ];

  for (const job of jobs) {
    await prisma.job.create({ data: job });
  }

  await prisma.mentor.create({
    data: {
      userId: admin.id,
      skills: ['UAV', 'Safety'],
      bio: '10 жылдық дрон тәжірибесі.',
      calendarUrl: 'https://cal.example.com/uav',
    },
  });

  await prisma.mentor.create({
    data: {
      userId: employer.id,
      skills: ['LoRaWAN', 'Sensors'],
      bio: 'IoT сарапшысы.',
      calendarUrl: 'https://cal.example.com/iot',
    },
  });

  await prisma.mentor.create({
    data: {
      userId: student.id,
      skills: ['GPS', 'Efficiency'],
      bio: 'Smart-tractor энтузиасты.',
      calendarUrl: 'https://cal.example.com/tractor',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
