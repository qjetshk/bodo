import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const templates = [
  {
    name: 'Классический Kanban',
    description: 'Базовый канбан из трёх колонок',
    columns: [
      { title: 'To Do', order: 0 },
      { title: 'In Progress', order: 1 },
      { title: 'Done', order: 2 },
    ],
  },
  {
    name: 'Разработка ПО',
    description: 'Типовой процесс разработки задач',
    columns: [
      { title: 'Backlog', order: 0 },
      { title: 'In Progress', order: 1 },
      { title: 'Code Review', order: 2 },
      { title: 'Testing', order: 3 },
      { title: 'Done', order: 4 },
    ],
  },
  {
    name: 'Маркетинг-кампания',
    description: 'От идей до выполнения маркетинговых задач',
    columns: [
      { title: 'Ideas', order: 0 },
      { title: 'Planning', order: 1 },
      { title: 'Designing', order: 2 },
      { title: 'Executing', order: 3 },
      { title: 'Completed', order: 4 },
    ],
  },
  {
    name: 'Личный To-Do',
    description: 'Простой шаблон для личных задач',
    columns: [
      { title: 'Tasks', order: 0 },
      { title: 'In Progress', order: 1 },
      { title: 'Done', order: 2 },
    ],
  },
  {
    name: 'Учёба / Обучение',
    description: 'Контроль учебных задач и целей',
    columns: [
      { title: 'To Study', order: 0 },
      { title: 'Studying', order: 1 },
      { title: 'Review', order: 2 },
      { title: 'Completed', order: 3 },
    ],
  },
  {
    name: 'Scrum Board',
    description: 'Рабочий процесс для команд, использующих Scrum',
    columns: [
      { title: 'Product Backlog', order: 0 },
      { title: 'Sprint Backlog', order: 1 },
      { title: 'In Progress', order: 2 },
      { title: 'In Review', order: 3 },
      { title: 'Done', order: 4 },
    ],
  },
];

async function main() {
  for (const template of templates) {
    await prisma.boardTemplate.create({
      data: {
        name: template.name,
        description: template.description,
        columns: {
          create: template.columns,
        },
      },
    });
  }
  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
