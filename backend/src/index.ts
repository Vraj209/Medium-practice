import { Hono } from 'hono'

import { decode, sign, verify } from 'hono/jwt'
import { userRouter } from './routes/user.ts'
import { blogRouter } from './routes/blog.ts'
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
  }
}>()


app.get('/api', (c) => {
  return c.text('Hello Hono from Cloudflare Worker!')
})

app.route('/api/v1/user',userRouter)
app.route('/api/v1/blog',blogRouter)



export default app
