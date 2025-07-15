import { Hono } from 'hono';
import { prisma } from '../lib/prisma';
import type { Task } from 'shared/src/types/task';

const tasks = new Hono();

tasks.get('/', async (c) => {
  const all = await prisma.task.findMany({ orderBy: { createdAt: 'desc' } });
  return c.json(all);
});

tasks.post('/', async (c) => {
  const body = await c.req.json<Task>();
  const created = await prisma.task.create({
    data: {
      title: body.title,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      completed: body.completed,
    },
  });
  return c.json(created, 201);
});

tasks.patch('/:id', async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json<Partial<Task>>();
  const updated = await prisma.task.update({
    where: { id },
    data: {
      title: body.title,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      completed: body.completed,
    },
  });
  return c.json(updated);
});

tasks.delete('/:id', async (c) => {
  const { id } = c.req.param();
  await prisma.task.delete({ where: { id } });
  return c.body(null, 204);
});

export default tasks;
