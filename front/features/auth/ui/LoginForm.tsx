"use client";
import { Button } from "@/shared/ui-kit/button";
import { Input } from "@/shared/ui-kit/input";
import { RegisterLoginForm } from "@/features/auth/model/login-reg-form.type";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import { useLoginMutation } from "@/features/auth/api/auth.slice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { apolloClient } from "@/shared/api/graphql/client";
import { Card } from "@/shared/ui-kit/card";

type LoginRequest = Omit<RegisterLoginForm, "nickName">;

export const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(RegisterLoginForm.omit({ nickName: true })),
  });

  const router = useRouter();

  const [login, { isLoading }] = useLoginMutation();

  const onSubmit: SubmitHandler<LoginRequest> = async (formData) => {
    try {
      await login(formData).unwrap();
      apolloClient.resetStore();
      toast.success("You have successfully signed in!", { duration: 1000 });
      setTimeout(() => {
        router.replace("/dashboard");
      }, 1000);
    } catch (err: unknown) {
      if (typeof err === "object" && err && "data" in err) {
        const apiError = err as { data?: { message?: string } };
        toast.error(apiError.data?.message || "Sign in error");
      } else {
        toast.error("Unknown error");
      }
    }
  };

  return (
    <Card className="dark bg-neutral-950 lg:px-0 px-6 border-0">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-2xl text-center font-unbounded">Sign In</h1>

        <div>
          {errors.email && (
            <span className="text-sm text-red-400">{errors.email.message}</span>
          )}
          <Input
            {...register("email")}
            placeholder="Enter email"
            type="text"
            className={
              errors.email &&
              "border-red-400 text-red-400 placeholder:text-red-400 focus-visible:border-red-400!"
            }
          />
        </div>

        <div>
          {errors.password && (
            <span className="text-sm text-red-400">
              {errors.password.message}
            </span>
          )}
          <Input
            {...register("password")}
            placeholder="Enter password"
            type="password"
            className={
              errors.password &&
              "border-red-400 placeholder:text-red-400 text-red-400 focus-visible:border-red-400!"
            }
          />
        </div>

        <Button
          type="submit"
          variant={"default"}
          className="text-lg h-auto w-full"
        >
          Sign In
        </Button>

        <Button variant={"secondary"} disabled className="w-full">
          Sign in with Google
        </Button>

        <span className="text-sm text-center">
          Don&apos;t have an account?{" "}
          <Link className="text-neutral-500" href={"/register"}>
            Sign up!
          </Link>
        </span>
      </form>
    </Card>
  );
};
