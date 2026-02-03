'use client'

import { RegisterLoginForm } from "@/features/auth/model/login-reg-form.type";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/shared/ui-kit/button";
import { Input } from "@/shared/ui-kit/input";
import { useRegisterMutation } from "@/features/auth/api/auth.slice";
import { toast } from "sonner";
import { Card } from "@/shared/ui-kit/card";

export const RegisterForm: React.FC = () => {
  const {
    register: registerInput,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterLoginForm>({
    resolver: zodResolver(RegisterLoginForm),
  });

  const [reg, { isLoading }] = useRegisterMutation();

  const onSubmit: SubmitHandler<RegisterLoginForm> = async (formData) => {
    console.log(formData);
    try {
      const result = await reg(formData).unwrap();
      toast.success(result.message || "Registration was successful!", {
        duration: 2000,
      });
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "data" in err) {
        const apiError = err as { data?: { message?: string } };
        toast.error(apiError.data?.message || "Error during registration", {
          duration: 2000,
        });
      } else {
        toast.error("Error during registration", { duration: 2000 });
      }
    }
  };

  return (
    <Card className="dark bg-neutral-950 lg:px-0 px-6 border-0">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-2xl text-center font-unbounded">Registration</h1>

        <div>
          {errors.nickName && (
            <span className="text-sm text-red-400">
              {errors.nickName.message}
            </span>
          )}
          <Input
            {...registerInput("nickName")}
            placeholder="Enter your login"
            type="text"
            maxLength={30}
            className={
              errors.nickName &&
              "border-red-400 placeholder:text-red-400 focus-visible:border-red-400! text-red-400"
            }
          />
        </div>

        <div>
          {errors.email && (
            <span className="text-sm text-red-400">{errors.email.message}</span>
          )}
          <Input
            {...registerInput("email")}
            placeholder="Enter your email"
            type="email"
            className={
              errors.email &&
              "border-red-400 placeholder:text-red-400 focus-visible:border-red-400! text-red-400"
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
            {...registerInput("password")}
            placeholder="Enter your password"
            type="password"
            className={
              errors.password &&
              "border-red-400 placeholder:text-red-400 focus-visible:border-red-400! text-red-400"
            }
          />
        </div>

        <Button
          type="submit"
          variant={"default"}
          className="text-lg h-auto w-full"
          disabled={isLoading}
        >
          Sign up
        </Button>

        <span className="text-sm text-center">
          Already have an account?{" "}
          <Link className="text-neutral-500" href="/login">
            Sign in!
          </Link>
        </span>
      </form>
    </Card>
  );
};
