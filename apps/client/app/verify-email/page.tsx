import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { redirect } from "next/navigation";

async function verifyEmail(token: string) {
  try {
    const res = await fetch(`${process.env.API_URL}/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();

    if (!res.ok || !data?.success) {
      return {
        success: false,
        error: data?.message ?? "Invalid or expired verification link",
      };
    }

    return { success: true, error: null };
  } catch {
    return { success: false, error: "Unable to connect. Please try again." };
  }
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { token } = await searchParams;

  // guard missing or malformed token
  if (!token || typeof token !== "string") {
    redirect("/login?error=Invalid verification link");
  }

  const { success, error } = await verifyEmail(token);

  // if (success) {
  //   redirect("/login?message=Email verified! You can now log in.");
  // }

  // explicit error UI instead of silent fallback
  return (
    <div className="flex h-screen items-center justify-center p-4 ">
      <Card className="max-w-sm mx-auto shadow-md border-red-100 dark:border-red-900/50">
        <CardHeader className="flex flex-col items-center space-y-2 text-center pb-4">
          <HugeiconsIcon icon={AlertCircle} size={28} />
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Verification Failed
          </CardTitle>
          <CardDescription className="text-base text-gray-500 dark:text-gray-400">
            {error || "The verification link is invalid or has expired."}
          </CardDescription>
        </CardHeader>

        {/*<CardContent className="text-center pb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Don't worry, you can request a new verification link to be sent to
            your email address.
          </p>
        </CardContent>*/}

        <CardFooter>
          <Button variant="default" className="w-full">
            <Link href="/login">Back to Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
