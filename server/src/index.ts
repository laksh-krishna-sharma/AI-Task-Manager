import { Hono } from 'hono';
import { cors } from 'hono/cors';
import tasks from './routes/task';

const app = new Hono();

app.use('*', cors({ 
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true 
}));

app.route('/api/tasks', tasks);

app.get('/', (c) => c.text('Todo API is running'));

export default {
  port: 4000,
  fetch: app.fetch,
}