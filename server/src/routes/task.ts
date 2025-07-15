import { Hono } from 'hono';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/authMiddleware';
import type { Task } from 'shared/src/types/task';

// Type the Hono instance with Variables for userId
const tasks = new Hono<{ Variables: { userId: string } }>();

tasks.use('*', authMiddleware);

tasks.get('/', async (c) => {
  const userId = c.get('userId');
  const all = await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return c.json(all);
});

tasks.post('/', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json<Task>();
  const created = await prisma.task.create({
    data: {
      title: body.title,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      completed: body.completed,
      user: { connect: { id: userId } },
    },
  });
  return c.json(created, 201);
});

tasks.patch('/:id', async (c) => {
  const userId = c.get('userId');
  const id = c.req.param('id');
  const body = await c.req.json<Partial<Task>>();

  const existing = await prisma.task.findUnique({
    where: { id },
    select: { id: true, userId: true },
  });
  if (!existing || existing.userId !== userId) {
    return c.json({ error: 'Not found or unauthorized' }, 403);
  }

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
  const userId = c.get('userId');
  const id = c.req.param('id');

  const existing = await prisma.task.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!existing || existing.userId !== userId) {
    return c.json({ error: 'Not found or unauthorized' }, 403);
  }

  await prisma.task.delete({ where: { id } });
  return c.body(null, 204);
});

export default tasks;
