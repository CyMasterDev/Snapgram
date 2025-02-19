import { z } from "zod";

export const SignupValidation = z.object({
  name: z
    .string()
    .min(3, {
      message: "Name is too short, please enter at least 3 characters",
    })
    .max(30, {
      message: "Name is too long, please enter a max of 30 characters",
    })
    .regex(/^[A-Za-z\s]+$/, {
      message: "Name can only contain letters and spaces",
    }),
  username: z
    .string()
    .min(3, {
      message: "Username is too short, please enter at least 3 characters",
    })
    .max(30, {
      message: "Username is too long, please enter a max of 30 characters",
    })
    .regex(/^[a-z0-9_-]+$/, {
      message: "Username can only contain lowercase letters, numbers, dashes, and underscores",
    }),
  email: z.string().email().min(8, { message: "Please enter your email, this field is required" }),
  password: z
    .string()
    .min(8, {
      message: "Password is too short, please enter at least 8 characters",
    }),
});


export const SigninValidation = z.object({
  email: z.string().email().min(1, { message: "Please enter your email, this field is required" }),
  password: z.string().min(1, { message: "Please enter your password, this field is required" }),
});

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const PostValidation = z.object({
  caption: z
    .string()
    .min(1, { message: "Please enter a caption, this field is required" })
    .max(2200, { message: "Caption is too long, please enter a max of 2200 characters" }),
  file: z
    .custom<File[]>()
    .refine((files) => files?.every((file) => file.size <= MAX_FILE_SIZE), {
      message: "Each file must be 5MB or smaller",
    }),
  location: z.string().max(100, { message: "Location is too long, please enter a max of 100 characters" }),
  tags: z.string(),
});

export const CommentValidation = z.object({
  comment: z
    .string()
    .min(1, { message: "Please type your comment, this field is required" })
    .max(2200, { message: "Comment is too long, please enter a max of 2200 characters" }),
});

