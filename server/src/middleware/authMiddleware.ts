import type { MiddlewareHandler } from 'hono';
import { verify } from 'hono/jwt';

type JwtPayload = { userId: string };

export const authMiddleware: MiddlewareHandler<{ Variables: { userId: string } }> =
  async (c, next) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Missing or invalid Authorization header' }, 401);
    }

    const parts = authHeader.split(' ');
    const token = parts[1];
    if (!token) {
      return c.json({ error: 'Missing token' }, 401);
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in env');
    }

    try {
      const payload = (await verify(token, jwtSecret)) as JwtPayload;
      if (!payload.userId) {
        return c.json({ error: 'Invalid token payload' }, 401);
      }
      c.set('userId', payload.userId);
      await next();
    } catch {
      return c.json({ error: 'Invalid or expired token' }, 401);
    }
  };
