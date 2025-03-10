import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "react-router-dom"

import { useToast } from "@/hooks/use-toast"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { SignupValidation } from "@/lib/validation"
import { z } from "zod"
import Spinner from "@/components/shared/Spinner"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"

const SignupForm = () => {
  const { toast } = useToast()
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: createUserAccount, isPending:
  isCreatingAccount } = useCreateUserAccount();

  const { mutateAsync: signInAccount, isPending: isSigningIn } = 
  useSignInAccount();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUserAccount(values);

    if(!newUser) {
      return toast({
        title: "Whoops! We couldn't sign you up",
        description: "No new user account was created, please try again later.",
        variant: "destructive"
      })
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    })

    if(!session) {
      return toast({
        title: "Whoops! We couldn't sign you into your new account",
        description: "Your session is missing or expired, please try again later.",
        variant: "destructive"
      })
    }

    const isLoggedIn = await checkAuthUser();

    if(isLoggedIn) {
      form.reset();

      navigate('/')
    } else {
      return toast({
        title: "Whoops! We couldn't sign you up",
        description: "Navigation failed. Something went wrong, please try again later.",
        variant: "destructive"
      })
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="assets/images/logo.svg" alt="logo" draggable="false" className="select-none" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-2 text-center">Welcome! Let's get you set up!</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2 text-center">To use Snapgram, please enter your account details.</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isCreatingAccount ? (
              <div className="flex-center gap-2">
                <Spinner /> Loading...
              </div>
            ) : "Sign up"}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">Sign in</Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm