import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const templates = [
  {
    name: 'Classic Kanban',
    description: 'Basic Kanban with three columns',
    columns: [
      { title: 'To Do', order: 0 },
      { title: 'In Progress', order: 1 },
      { title: 'Done', order: 2 },
    ],
  },
  {
    name: 'Software Development',
    description: 'Typical task development process',
    columns: [
      { title: 'Backlog', order: 0 },
      { title: 'In Progress', order: 1 },
      { title: 'Code Review', order: 2 },
      { title: 'Testing', order: 3 },
      { title: 'Done', order: 4 },
    ],
  },
  {
    name: 'Marketing Campaign',
    description: 'From ideas to execution of marketing tasks',
    columns: [
      { title: 'Ideas', order: 0 },
      { title: 'Planning', order: 1 },
      { title: 'Designing', order: 2 },
      { title: 'Executing', order: 3 },
      { title: 'Completed', order: 4 },
    ],
  },
  {
    name: 'Personal To-Do',
    description: 'Simple template for personal tasks',
    columns: [
      { title: 'Tasks', order: 0 },
      { title: 'In Progress', order: 1 },
      { title: 'Done', order: 2 },
    ],
  },
  {
    name: 'Study / Learning',
    description: 'Track study tasks and goals',
    columns: [
      { title: 'To Study', order: 0 },
      { title: 'Studying', order: 1 },
      { title: 'Review', order: 2 },
      { title: 'Completed', order: 3 },
    ],
  },
  {
    name: 'Scrum Board',
    description: 'Workflow for teams using Scrum',
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
