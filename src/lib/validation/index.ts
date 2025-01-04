import { z } from "zod"

export const SignupValidation = z.object({
    name: z.string().min(3, { message: 'Name is too short.' }).max(30, { message: 'Name is too long.' }),
    username: z.string().min(3, { message: 'Username is too short.' }).max(30, { message: 'Username is too long.' }),
    email: z.string().email().min(6, { message: 'Email is too short.' }),
    password: z.string().min(8, { message: 'Password is too short.' }),
  })