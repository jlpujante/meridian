import { $articles, $sources, and, gte, lte, isNotNull, eq, not, $reports, desc } from '@meridian/database';
import { Env } from './index';
import { getDb, hasValidAuthToken } from './lib/utils';
import { Hono } from 'hono';
import { trimTrailingSlash } from 'hono/trailing-slash';
import openGraph from './routers/openGraph.router';
import reportsRouter from './routers/reports.router';
import triggersRouter from './routers/triggers.router';
import { getRssFeedWithFetch } from './lib/puppeteer';
import { parseRSSFeed } from './lib/parsers';

export type HonoEnv = { Bindings: Env };

const app = new Hono<HonoEnv>()
  .use(trimTrailingSlash())
  .route('/', reportsRouter)
  .route('/', triggersRouter)
  .route('/openGraph', openGraph)
  .get('/', async c => c.json({ response: "Meridian Project" }))
  .get('/env', async c => {
    console.log('c.env.DATABASE_URL => ' + c.env.DATABASE_URL)
    console.log('c.env.GOOGLE_AI_API_KEY => ' + c.env.GOOGLE_AI_API_KEY)
    console.log('c.env.MERIDIAN_SECRET_KEY => ' + c.env.MERIDIAN_SECRET_KEY)
    return c.json({ response: "Success" }, 200);
  })
  .get('/favicon.ico', async c => c.notFound()) // disable favicon
  .get('/ping', async c => c.json({ pong: true }))
  .get('/events', async c => {
    // require bearer auth token
    const hasValidToken = hasValidAuthToken(c);
    if (!hasValidToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if a date query parameter was provided in yyyy-mm-dd format
    const dateParam = c.req.query('date');

    let endDate: Date;
    if (dateParam) {
      // Parse the date parameter explicitly with UTC
      // Append T07:00:00Z to ensure it's 7am UTC
      endDate = new Date(`${dateParam}T07:00:00Z`);
      // Check if date is valid
      if (isNaN(endDate.getTime())) {
        return c.json({ error: 'Invalid date format. Please use yyyy-mm-dd' }, 400);
      }
    } else {
      // Use current date if no date parameter was provided
      endDate = new Date();
      // Set to 7am UTC today
      endDate.setUTCHours(7, 0, 0, 0);
    }

    // Create a 30-hour window ending at 7am UTC on the specified date
    const startDate = new Date(endDate.getTime() - 30 * 60 * 60 * 1000);

    const db = getDb(c.env.DATABASE_URL);

    const allSources = await db.select({ id: $sources.id, name: $sources.name }).from($sources);

    let events = await db
      .select({
        id: $articles.id,
        sourceId: $articles.sourceId,
        url: $articles.url,
        title: $articles.title,
        publishDate: $articles.publishDate,
        content: $articles.content,
        location: $articles.location,
        completeness: $articles.completeness,
        relevance: $articles.relevance,
        summary: $articles.summary,
        createdAt: $articles.createdAt,
      })
      .from($articles)
      .where(
        and(
          isNotNull($articles.location),
          gte($articles.publishDate, startDate),
          lte($articles.publishDate, endDate),
          eq($articles.relevance, 'RELEVANT'),
          not(eq($articles.completeness, 'PARTIAL_USELESS')),
          isNotNull($articles.summary)
        )
      );

    const response = {
      sources: allSources,
      events,
      dateRange: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    };

    return c.json(response);
  })
;

export default app;
