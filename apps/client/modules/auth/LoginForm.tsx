import { loginAction } from "@/app/actions/auth.actions";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ILoginForm, LoginFormSchema } from "./auth.schema";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loginError, setLoginError] = useState("");
  const { handleSubmit, register, formState } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginFormSchema),
  });

  async function onSubmit(values: ILoginForm) {
    setLoginError("");
    const reqBody = new FormData();
    reqBody.append("email", values.email);
    reqBody.append("password", values.password);
    const res = await loginAction(reqBody);
    if (res.error) {
      setLoginError(res.error);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {loginError ? (
        <Alert variant="destructive">
          <HugeiconsIcon icon={AlertIcon} />
          <AlertTitle>{loginError}</AlertTitle>
        </Alert>
      ) : null}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              {/*<Field>
                <Button variant="outline" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>*/}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="text"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                <FieldError>{formState.errors.email?.message}</FieldError>
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  {/*<a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>*/}
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
                <FieldError>{formState.errors.password?.message}</FieldError>
              </Field>
              <Field>
                <Button type="submit">Login</Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="/signup">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
