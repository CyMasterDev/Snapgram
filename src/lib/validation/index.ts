import { z } from "zod"

export const SignupValidation = z.object({
    name: z.string().min(3, { message: 'Name is too short. Please enter at least 3 characters.' }).max(30, { message: 'Name is too long. Please enter a max of 30 characters.' }),
    username: z.string().min(3, { message: 'Username is too short. Please enter at least 3 characters.' }).max(30, { message: 'Username is too long. Please enter a max of 30 characters.' }),
    email: z.string().email().min(8, { message: 'Please enter your email.' }),
    password: z.string().min(8, { message: 'Password is too short. Please enter at least 8 characters.' }),
  })

  export const SigninValidation = z.object({
    email: z.string().email().min(1, { message: 'Please enter your email.' }),
    password: z.string().min(1, { message: 'Please enter your password.' }),
  })