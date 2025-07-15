import { Hono } from 'hono';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { sign } from 'hono/jwt';

const auth = new Hono();

const userSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

const tokenBlacklist = new Set<string>();

auth.post('/register', async (c) => {
  const body = await c.req.json();
  const parsed = userSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: 'Invalid input' }, 400);
  }

  const { username, password } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) {
    return c.json({ error: 'User already exists' }, 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: { username, password: hashedPassword },
  });

  return c.json({ message: 'User registered', user: { id: newUser.id, username: newUser.username } });
});

auth.post('/login', async (c) => {
  const body = await c.req.json();
  const parsed = userSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: 'Invalid input' }, 400);
  }

  const { username, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    return c.json({ error: 'Invalid username or password' }, 401);
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return c.json({ error: 'Invalid username or password' }, 401);
  }
  
  const token = await sign(
    { userId: user.id },
    process.env.JWT_SECRET!
  );

  return c.json({ 
    message: 'Login successful', 
    token, 
    user: { id: user.id, username: user.username } 
  });
});

auth.post('/logout', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Missing token' }, 400);
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return c.json({ error: 'Invalid token format' }, 400);
  }
  tokenBlacklist.add(token);
  return c.json({ message: 'Logout successful' });
});

export default auth;
