"use client";

import { RegisterLoginForm } from "@/types/login-reg-form.type";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegisterMutation } from "@/store/auth";
import { toast } from "sonner";

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
      toast.success(result.message || "Регистрация прошла успешно!", {
        duration: 2000,
      });
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "data" in err) {
        const apiError = err as { data?: { message?: string } };
        toast.error(apiError.data?.message || "Ошибка при регистрации", {
          duration: 2000,
        });
      } else {
        toast.error("Ошибка при регистрации", { duration: 2000 });
      }
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-2xl text-center font-unbounded">Регистрация</h1>

      <div>
        {errors.nickName && (
          <span className="text-sm text-red-400">
            {errors.nickName.message}
          </span>
        )}
        <Input
          {...registerInput("nickName")}
          placeholder="Введите логин"
          type="text"
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
          placeholder="Введите email"
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
          placeholder="Введите пароль"
          type="password"
          className={
            errors.password &&
            "border-red-400 placeholder:text-red-400 focus-visible:border-red-400! text-red-400"
          }
        />
      </div>

      <Button
        type="submit"
        variant={"secondary"}
        className="text-lg h-auto w-full"
        disabled={isLoading}
      >
        Зарегистрироваться
      </Button>

      <span className="text-sm text-center">
        Уже есть аккаунт?{" "}
        <Link className="text-neutral-500" href="/login">
          Войдите!
        </Link>
      </span>
    </form>
  );
};
