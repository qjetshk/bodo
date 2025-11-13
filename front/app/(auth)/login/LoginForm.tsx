"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RegisterLoginForm } from "@/types/login-reg-form.type";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import { useLoginMutation } from "@/store/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
    console.log(formData);
    try {
      await login(formData).unwrap();
      toast.success("Вы успешно вошли!", { duration: 1000 });
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err: unknown) {
      if (typeof err === "object" && err && "data" in err) {
        const apiError = err as { data?: { message?: string } };
        toast.error(apiError.data?.message || "Ошибка при входе");
      } else {
        toast.error("Неизвестная ошибка");
      }
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-2xl text-center font-unbounded">Вход</h1>
      <div>
        {errors.email && (
          <span className="text-sm text-red-400">{errors.email.message}</span>
        )}
        <Input
          {...register("email")}
          placeholder="Введите email"
          type="text"
          className={
            errors.email &&
            "border-red-400 text-red-400 placeholder:text-red-400 focus-visible:border-red-400!"
          }
        ></Input>
      </div>

      <div>
        {errors.password && (
          <span className="text-sm text-red-400">
            {errors.password.message}
          </span>
        )}
        <Input
          {...register("password")}
          placeholder="Введите пароль"
          type="password"
          className={
            errors.password &&
            "border-red-400 placeholder:text-red-400 text-red-400 focus-visible:border-red-400!"
          }
        ></Input>
      </div>

      <Button
        type="submit"
        variant={"secondary"}
        className="text-lg h-auto w-full"
      >
        Войти
      </Button>

      <Button disabled className="w-full">
        Войти через Google
      </Button>

      <span className="text-sm text-center">
        Еще нет аккаунта?{" "}
        <Link className="text-neutral-500" href={"/register"}>
          Зарегистрируйтесь!
        </Link>
      </span>
    </form>
  );
};
