"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { useMutation, useQuery } from "@apollo/client/react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

import BoardTemplate from "./BoardTemplate";
import { MembersInput, MemberType } from "./MembersInput";

import { AddBoardForm } from "@/types/add-board-form.type";
import {
  FIND_MEMBERS,
  FindMembersData,
  FindMembersInput,
} from "@/apollo/requests/members";
import {
  GET_BOARD_TEMPLATES,
  GetTemplatesData,
} from "@/apollo/requests/templates";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewBoardForm() {
  const [findMembersInput, setFindMembersInput] = useState("");
  const [findMembers, { data, loading }] = useMutation<
    FindMembersData,
    { member: FindMembersInput["member"] }
  >(FIND_MEMBERS);

  const { data: templates, loading: loadingTemplates } =
    useQuery<GetTemplatesData>(GET_BOARD_TEMPLATES);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddBoardForm>({
    resolver: zodResolver(AddBoardForm),
    defaultValues: {
      name: "",
      description: "",
      templateId: templates?.getAllBoardTemplates[0]?.id ?? "",
      boardType: false,
      members: [],
    },
  });

  const boardType = watch("boardType");
  const formMemberIds = watch("members") || [];

  // Автоматическая очистка участников при переключении на приватную доску
  useEffect(() => {
    if (boardType) {
      setValue("members", []);
    }
  }, [boardType, setValue]);

  const handleFindMembers = (value: string) => {
    if (value.trim().length) {
      findMembers({
        variables: { member: { nickName: value, email: value } },
      });
    }
  };

  const onSubmit: SubmitHandler<AddBoardForm> = (formData) => {
    console.log("Форма успешно отправлена", formData);
  };

  // Преобразуем id участников из формы в объекты MemberType для отображения
  const selectedMembers: MemberType[] = formMemberIds
    .map((id) => data?.findMembers?.find((m) => m.id === id))
    .filter(Boolean) as MemberType[];

  const selectedTemplateId = watch("templateId");

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { duration: 0.5 } }}
    >
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="font-unbounded text-lg">
            Создание новой канбан-доски
          </CardTitle>
          <CardDescription>Заполните данные и выберите шаблон</CardDescription>
        </CardHeader>

        <CardContent>
          <form
            className="flex flex-col gap-5 w-full overflow-x-hidden p-1"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Название доски */}
            <div>
              {errors.name?.message && (
                <p className="text-sm text-red-400 mb-1">
                  {errors.name.message}
                </p>
              )}
              <Input {...register("name")} placeholder="Название доски" />
            </div>

            {/* Описание */}
            <div>
              {errors.description?.message && (
                <p className="text-sm text-red-400 mb-1">
                  {errors.description.message}
                </p>
              )}
              <Textarea
                {...register("description")}
                className="resize-none"
                placeholder="Описание (необязательно)"
              />
            </div>

            {/* Выбор шаблона */}
            <div>
              <Label className="text-lg mb-2 block">Выберите шаблон:</Label>
              <section className="grid grid-cols-1 xl:grid-cols-2 gap-5 p-1">
                {templates &&
                templates.getAllBoardTemplates.length > 0 &&
                !loadingTemplates ? (
                  templates.getAllBoardTemplates.map((template) => (
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
                  ))
                ) : (
                  <>
                    <Skeleton className="h-full min-h-[250px]" />
                    <Skeleton className="h-full min-h-[250px]" />
                    <Skeleton className="h-full min-h-[250px]" />
                    <Skeleton className="h-full min-h-[250px]" />
                    <Skeleton className="h-full min-h-[250px]" />
                    <Skeleton className="h-full min-h-[250px]" />
                  </>
                )}
              </section>
            </div>

            {/* Тип доски */}
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

            {/* Добавление участников только для публичной доски */}
            {!boardType && (
              <MembersInput
                findMembersInput={findMembersInput}
                setFindMembersInput={setFindMembersInput}
                handleFindMembers={handleFindMembers}
                data={{
                  findMembers: data?.findMembers?.map((m) => ({
                    id: m.id,
                    email: m.email,
                    nickName: m.nickName,
                    avatarUrl: m.avatarUrl,
                  })),
                }}
                loading={loading}
                errors={errors}
                setValue={setValue}
                formMembers={selectedMembers}
              />
            )}

            <Button type="submit" size="lg" className="mt-4">
              Создать доску
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
