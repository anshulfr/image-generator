import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
export interface Env {
  AI: Ai
}

type Bindings = {
  [key in keyof CloudflareBindings]: CloudflareBindings[key]
}

const app = new Hono<{ Bindings: Bindings }>()

const r = cors({
  origin: '*',
  allowMethods: ['GET'],
})

app.use(r)

app.get('/', zValidator("query", z.object({prompt: z.string()})), async (c) => {
  const { prompt } = c.req.valid("query")
  const inputs = {
    prompt,
  };

  const response = await c.env.AI.run(
    '@cf/stabilityai/stable-diffusion-xl-base-1.0',
    inputs
  );

  return new Response(response, {
    headers: {
      "content-type": "image/png",
    },
  });
})

export default app