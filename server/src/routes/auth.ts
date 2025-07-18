import { Hono } from 'hono';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { sign } from 'hono/jwt';
import { redis } from '../lib/redis';

const auth = new Hono();

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const tokenBlacklist = new Set<string>();

auth.post('/register', async (c) => {
  const body = await c.req.json();
  const parsed = userSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: 'Invalid input' }, 400);
  }

  const { email, name, password } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return c.json({ error: 'Email already in use' }, 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: { email, name, password: hashedPassword },
  });

  return c.json({
    message: 'User registered',
    user: { id: newUser.id, email: newUser.email, name: newUser.name },
  });
});

auth.post('/login', async (c) => {
  const body = await c.req.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: 'Invalid input' }, 400);
  }

  const { email, password } = parsed.data;

  let cachedUser = await redis.get(`user:${email}`);

  let user;
  if (cachedUser) {
    user = JSON.parse(cachedUser);
  } else {
    user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    await redis.set(`user:${email}`, JSON.stringify(user), 'EX', 60 * 60); // Cache for 1 hour
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  // TypeScript narrowing: user is definitely not null here
  const token = await sign(
    { userId: user.id },
    process.env.JWT_SECRET!
  );

  return c.json({
    message: 'Login successful',
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
});

auth.post('/logout', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Missing token' }, 400);
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return c.json({ error: 'Invalid token' }, 400);
  }

  tokenBlacklist.add(token);

  return c.json({ message: 'Logout successful' });
});

export default auth;
