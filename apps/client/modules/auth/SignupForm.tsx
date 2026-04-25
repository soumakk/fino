import { singupAction } from "@/app/actions/auth.actions";
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
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ISignupForm, SignupFormSchema } from "./auth.schema";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState("");
  const { handleSubmit, register, formState } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(SignupFormSchema),
  });

  async function onSubmit(values: ISignupForm) {
    setError("");
    const reqBody = new FormData();
    reqBody.append("name", values.name);
    reqBody.append("email", values.email);
    reqBody.append("password", values.password);
    const res = await singupAction(reqBody);

    if (res.error) {
      setError(res.error);
    }

    if (res.success) {
      toast.message("🎉 Signup Successful", {
        description:
          "We just sent a verification link to your inbox. Please click the link to verify your account, and then you'll be ready to log in.",
        duration: 5000,
      });
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {error ? (
        <Alert variant="destructive">
          <HugeiconsIcon icon={AlertIcon} />
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      ) : null}

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome stranger</CardTitle>
          <CardDescription>Signup to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  {...register("name")}
                />
                <FieldError>{formState.errors.name?.message}</FieldError>
              </Field>
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
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
                <FieldError>{formState.errors.password?.message}</FieldError>
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="cpassword">Confirm Password</FieldLabel>
                </div>
                <Input
                  id="cpassword"
                  type="password"
                  {...register("confirmPassword")}
                />
                <FieldError>
                  {formState.errors.confirmPassword?.message}
                </FieldError>
              </Field>
              <Field>
                <Button type="submit">Signup</Button>
                <FieldDescription className="text-center">
                  Already have an account? <a href="/login">Login</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
