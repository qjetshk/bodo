"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BoardTemplate from "./BoardTemplate";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddBoardForm } from "@/types/add-board-form.type";
import React from "react";
import { motion } from "motion/react";

const templates = [
  {
    id: "asdsdq",
    name: "Классический Kanban",
    description: "Базовый канбан из трёх колонок",
    columns: [
      { title: "To Do", order: 1 },
      { title: "In Progress", order: 2 },
      { title: "Done", order: 3 },
    ],
  },
  {
    id: "asdsda",
    name: "Разработка ПО",
    description: "Типовой процесс разработки задач",
    columns: [
      { title: "Backlog", order: 1 },
      { title: "In Progress", order: 2 },
      { title: "Code Review", order: 3 },
      { title: "Testing", order: 4 },
      { title: "Done", order: 5 },
    ],
  },
  {
    id: "asdsdz",
    name: "Маркетинг-кампания",
    description: "От идей до выполнения маркетинговых задач",
    columns: [
      { title: "Ideas", order: 1 },
      { title: "Planning", order: 2 },
      { title: "Designing", order: 3 },
      { title: "Executing", order: 4 },
      { title: "Completed", order: 5 },
    ],
  },
  {
    id: "asdsds",
    name: "Личный To-Do",
    description: "Простой шаблон для личных задач",
    columns: [
      { title: "Tasks", order: 1 },
      { title: "In Progress", order: 2 },
      { title: "Done", order: 3 },
    ],
  },
  {
    id: "asdsdd",
    name: "Учёба / Обучение",
    description: "Контроль учебных задач и целей",
    columns: [
      { title: "To Study", order: 1 },
      { title: "Studying", order: 2 },
      { title: "Review", order: 3 },
      { title: "Completed", order: 4 },
    ],
  },
  {
    id: "asdsdf",
    name: "Scrum Board",
    description: "Рабочий процесс для команд, использующих Scrum",
    columns: [
      { title: "Product Backlog", order: 1 },
      { title: "Sprint Backlog", order: 2 },
      { title: "In Progress", order: 3 },
      { title: "In Review", order: 4 },
      { title: "Done", order: 5 },
    ],
  },
];

const NewBoardForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AddBoardForm>({
    resolver: zodResolver(AddBoardForm),
    defaultValues: {
      name: "",
      description: "",
      templateId: templates[0].id,
      boardType: false,
      members: [],
    },
  });

  const selectedTemplateId = watch("templateId");
  const boardType = watch("boardType");

  const onSubmit: SubmitHandler<AddBoardForm> = (data) => {
    console.log("Форма успешно отправлена", data);
  };

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        transition: { duration: 0.5 },
      }}
    >
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="font-unbounded text-lg">
            Создание новой канбан-доски
          </CardTitle>
          <CardDescription>Заполните данные и выберите шаблон</CardDescription>
        </CardHeader>

        <CardContent className="">
          <form
            className="flex flex-col gap-5 w-full overflow-x-hidden p-1"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              {errors.name && (
                <p className="text-sm text-red-400 mb-1">
                  {errors.name.message}
                </p>
              )}
              <Input
                {...register("name")}
                placeholder="Название доски"
                className={
                  errors.name &&
                  "border-red-400 text-red-400 placeholder:text-red-400"
                }
              />
            </div>

            <div>
              {errors.description && (
                <p className="text-sm text-red-400 mb-1">
                  {errors.description.message}
                </p>
              )}
              <Textarea
                {...register("description")}
                placeholder="Описание (необязательно)"
                className={`resize-none ${
                  errors.description &&
                  "border-red-400 text-red-400 placeholder:text-red-400"
                }`}
              />
            </div>

            <div>
              <Label className="text-lg mb-2 block">Выберите шаблон:</Label>
              <section className="grid grid-cols-1 xl:grid-cols-2 gap-5 p-1">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setValue("templateId", template.id)}
                    className={`text-left rounded-2xl transition-all border cursor-pointer ${
                      selectedTemplateId === template.id
                        ? "outline-2 outline-neutral-400"
                        : "hover:outline-1 hover:outline-neutral-300"
                    }`}
                  >
                    <BoardTemplate template={template} />
                  </div>
                ))}
              </section>
              {errors.templateId && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.templateId.message}
                </p>
              )}
            </div>

            <div>
              <Label className="text-lg mb-2 block">Тип доски:</Label>
              <div className="flex gap-3 items-center">
                <Label>Публичная</Label>
                <Switch
                  checked={boardType}
                  onCheckedChange={(checked) => setValue("boardType", checked)}
                />
                <Label>Приватная</Label>
              </div>
            </div>

            {!boardType && (
              <div>
                {errors.members && (
                  <p className="text-sm text-red-400 mb-1">
                    {errors.members.message}
                  </p>
                )}
                <Input
                  placeholder="Добавьте участников"
                  {...register("members")}
                  className={
                    errors.members &&
                    "border-red-400 text-red-400 placeholder:text-red-400"
                  }
                />
              </div>
            )}

            <Button type="submit" size="lg" className="mt-4">
              Создать доску
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NewBoardForm;
