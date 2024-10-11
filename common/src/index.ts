import { z } from "zod"

// runtime variable
export const singupInput = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional()
})

export const singinInput = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export const createBlogInput = z.object({
    title: z.string(),
    content: z.string(),
})

export const updateBlogInput = z.object({
    title: z.string(),
    content: z.string(),
    id: z.number()
})
export type SignupInput = z.infer<typeof singupInput>
export type SigninInput = z.infer<typeof singinInput>
export type CreateBlogInput = z.infer<typeof createBlogInput>
export type UpdateBlogInput = z.infer<typeof updateBlogInput>
