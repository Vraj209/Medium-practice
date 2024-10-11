import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createBlogInput, updateBlogInput } from "@vraj_209/medium-common";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string
        JWT_SECRET: string
    }
    Variables: {
        userId: string
    }
}>()

blogRouter.use('/*', async (c, next) => {
    // get the header
    // verify the header
    // if header is correct then move forwrd
    // if not , we return the user
    const authHeader = c.req.header("Authorization")
    if (!authHeader) {
        return c.json({ error: "Missing authorization header" }, 401)
    }
    // Beare token 

    const user = await verify(authHeader, c.env.JWT_SECRET)
    if (user) {
        c.set('userId', String(user.id))
        await next()
    } else {
        c.status(403)
        return c.json({ error: "unauthroized" })
    }

})


blogRouter.post('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate())
    const body = await c.req.json();
    const authorId = c.get('userId')
    const { success } = createBlogInput.safeParse(body)
    if (!success) {
        c.status(411);
        return c.json({
            message: "Invalid type"
        })
    }
    try {
        const blog = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: authorId
            }
        })
        return c.json({
            id: blog.id
        })
    } catch (error) {
        return c.json({
            error
        })
    }


})
blogRouter.put('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate())
    const body = await c.req.json();
    const { success } = updateBlogInput.safeParse(body)
    if (!success) {
        c.status(411);
        return c.json({
            message: "Invalid type"
        })
    }
    const blog = await prisma.post.update({
        where: {
            id: body.id
        },
        data: {
            title: body.title,
            content: body.content,
        }
    })
    return c.json({
        id: blog.id
    })

})
blogRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate())
    try {
        const body = await c.req.json();

        const blog = await prisma.post.findFirst({
            where: {
                id: body.id
            }
        })
        return c.json({
            blog
        })
    } catch (error) {
        c.status(500)
        return c.json({
            error,
            message: "error while fetaching of blog"
        })
    }
})

// Add pagginations

blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate())

    const blogs = await prisma.post.findMany()
    return c.json({
        blogs
    })
})