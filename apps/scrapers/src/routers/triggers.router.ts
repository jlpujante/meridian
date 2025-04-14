import { Hono } from 'hono';
import { z } from 'zod';
import type { HonoEnv } from '../app';
import { $reports, desc, getDb } from '@meridian/database';
import { startRssFeedScraperWorkflow } from '../workflows/rssFeed.workflow';
import { startProcessArticleWorkflow } from '../workflows/processArticles.workflow';

const route = new Hono<HonoEnv>()
  .get('/trigger-rss', async c => {
    const token = c.req.query('token');
    if (token !== c.env.MERIDIAN_SECRET_KEY) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const res = await startRssFeedScraperWorkflow(c.env, { force: true });
    if (res.isErr()) {
      return c.json({ error: res.error }, 500);
    }

    return c.json({ success: true });
  })
  .get('/trigger-articles', async c => {
    const token = c.req.query('token');
    if (token !== c.env.MERIDIAN_SECRET_KEY) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const res = await startProcessArticleWorkflow(c.env, { force: true });
    if (res.isErr()) {
      return c.json({ error: res.error }, 500);
    }

    return c.json({ success: true });
  })
;

export default route;
