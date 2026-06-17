"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import { Chrome } from "lucide-react";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const schema = mode === "login" 
    ? z.object({
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
      })
    : z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
      }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });

  type FormData = z.infer<typeof schema> & { name?: string; confirmPassword?: string };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      if (mode === "login") {
        await signIn(data.email, data.password);
        toast.success("Successfully logged in!");
      } else {
        await signUp(data.email, data.password, data.name);
        toast.success("Account created successfully!");
      }
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      let message = "An authentication error occurred.";
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError.code === "auth/user-not-found" || firebaseError.code === "auth/wrong-password") {
        message = "Invalid email or password.";
      } else if (firebaseError.code === "auth/email-already-in-use") {
        message = "This email is already registered.";
      } else if (firebaseError.code === "auth/weak-password") {
        message = "The password is too weak.";
      } else if (firebaseError.message) {
        message = firebaseError.message;
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Successfully logged in with Google!");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to sign in with Google.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-slate-950/60 border border-slate-900 shadow-xl shadow-indigo-500/5">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </CardTitle>
        <CardDescription className="text-slate-400">
          {mode === "login"
            ? "Enter your credentials to access your dashboard"
            : "Sign up now and start analyzing your resumes with AI"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {mode === "signup" && (
            <Input
              type="text"
              label="Full Name"
              placeholder="John Doe"
              error={errors.name?.message}
              disabled={isLoading || googleLoading}
              {...register("name")}
            />
          )}
          <Input
            type="email"
            label="Email Address"
            placeholder="name@example.com"
            error={errors.email?.message}
            disabled={isLoading || googleLoading}
            {...register("email")}
          />
          <Input
            type="password"
            label="Password"
            placeholder="••••••••"
            error={errors.password?.message}
            disabled={isLoading || googleLoading}
            {...register("password")}
          />
          {mode === "signup" && (
            <Input
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              disabled={isLoading || googleLoading}
              {...register("confirmPassword")}
            />
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            isLoading={isLoading}
            disabled={googleLoading}
          >
            {mode === "login" ? "Sign In" : "Sign Up"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-900" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-950 px-2 text-slate-500 font-medium">Or continue with</span>
          </div>
        </div>

        <Button
          onClick={handleGoogleSignIn}
          variant="secondary"
          className="w-full"
          isLoading={googleLoading}
          disabled={isLoading}
        >
          <Chrome className="h-5 w-5 mr-2 text-indigo-400" />
          Sign in with Google
        </Button>

        <div className="text-center text-sm text-slate-400">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4">
                Sign in
              </Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
