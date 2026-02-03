"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { useMutation, useQuery } from "@apollo/client/react";

import { Input } from "@/shared/ui-kit/input";
import { Textarea } from "@/shared/ui-kit/textarea";
import { Label } from "@/shared/ui-kit/label";
import { Switch } from "@/shared/ui-kit/switch";
import { Button } from "@/shared/ui-kit/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/shared/ui-kit/card";

import BoardTemplate from "../../../../entities/board/ui/BoardTemplate";
import { MembersInput, MemberType } from "../../../../entities/board/ui/MembersInput";

import { AddBoardForm } from "@/features/board/add-new-board/model/add-board-form.type";
import { FIND_MEMBERS } from "@/apollo/requests/members";
import { GET_BOARD_TEMPLATES } from "@/apollo/requests/templates";
import { CREATE_BOARD, GET_ALL_USER_BOARDS_FOR_NAVIGATION } from "@/apollo/requests/boards";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { normalizeSpaces } from "@/shared/lib/normalize-spaces.util";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui-kit/tooltip";
import { Skeleton } from "@/shared/ui-kit/skeleton";

export default function NewBoardForm() {
  const router = useRouter();
  const [findMembersInput, setFindMembersInput] = useState("");
  const [findMembers, { data, loading }] = useMutation(FIND_MEMBERS);
  const { data: templates, loading: loadingTemplates } = useQuery(GET_BOARD_TEMPLATES);
  const [sendForm, { data: boardData, loading: sendingForm }] = useMutation(CREATE_BOARD, {
    refetchQueries: [GET_ALL_USER_BOARDS_FOR_NAVIGATION],
  });

  const { data: userBoards } = useQuery(GET_ALL_USER_BOARDS_FOR_NAVIGATION);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<AddBoardForm>({
    resolver: zodResolver(AddBoardForm),
    defaultValues: {
      name: "",
      description: "",
      boardTemplateId: "",
      boardType: false,
      membersToAdd: [],
    },
  });

  useEffect(() => {
    if (!loadingTemplates && templates?.getAllBoardTemplates.length) {
      reset({
        name: "",
        description: "",
        boardTemplateId: templates.getAllBoardTemplates[0].id,
        boardType: false,
        membersToAdd: [],
      });
    }
  }, [loadingTemplates, templates, reset]);

  useEffect(() => {
    if (boardData) {
      toast.success('Board created successfully!', { duration: 1500 });
      setTimeout(() => {
        router.push(`/dashboard/kanban/${boardData.createBoard.id}`);
      }, 1000);
    }
  }, [boardData]);

  const boardType = watch("boardType");
  const formMemberIds = watch("membersToAdd") || [];
  const watchedName = watch("name");
  const watchedDescription = watch("description");

  const onSubmit: SubmitHandler<AddBoardForm> = (formData) => {
    if (userBoards?.getAllUserBoards.length === 10) {
      toast.error('You cannot create more than 10 boards!');
      return;
    }
    sendForm({
      variables: {
        boardInput: {
          ...formData,
          name: normalizeSpaces(formData.name),
          description: normalizeSpaces(formData.description ?? ""),
        }
      }
    });
  };

  const selectedMembers: MemberType[] = formMemberIds
    .map((id) => data?.findMembers?.find((m) => m.id === id))
    .filter(Boolean) as MemberType[];

  const selectedTemplateId =
    watch("boardTemplateId") ||
    templates?.getAllBoardTemplates[0]?.id ||
    "";

  const isButtonDisabled = !normalizeSpaces(watchedName) && !normalizeSpaces(watchedDescription ?? '');

  return (
    <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { duration: 0.5 } }}>
      <Card aria-disabled={sendingForm} className={`${sendingForm && 'opacity-70'} max-w-5xl mx-auto`}>
        <CardHeader>
          <CardTitle className="font-unbounded text-lg">Create New Kanban Board</CardTitle>
          <CardDescription>Fill in the details and choose a template</CardDescription>
        </CardHeader>

        <CardContent>
          <form className="flex flex-col gap-5 w-full overflow-x-hidden p-1" onSubmit={handleSubmit(onSubmit)}>
            <div>
              {errors.name?.message && <p className="text-sm text-red-400 mb-1">{errors.name.message}</p>}
              <Input disabled={sendingForm} maxLength={50} {...register("name")} placeholder="Board Name" />
            </div>

            <div>
              {errors.description?.message && <p className="text-sm text-red-400 mb-1">{errors.description.message}</p>}
              <Textarea disabled={sendingForm} maxLength={100} {...register("description")} className="resize-none" placeholder="Description (optional)" />
            </div>

            {/* Templates */}
            <div>
              <Label className="text-lg mb-2 block">Choose a Template:</Label>
              <section className="grid grid-cols-1 xl:grid-cols-2 gap-5 p-1">
                {loadingTemplates ? (
                    [...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="min-h-[250px] rounded-xl" />
                    ))
                ) : templates?.getAllBoardTemplates?.map(template => (
                  <div key={template.id}
                    onClick={() => setValue("boardTemplateId", template.id)}
                    className={`text-left rounded-2xl transition-all border cursor-pointer ${selectedTemplateId === template.id ? "outline-2 outline-neutral-400" : "hover:outline-1 hover:outline-neutral-300"}`}>
                    <BoardTemplate template={template} />
                  </div>
                ))}
              </section>
            </div>

            {/* Board Type */}
            <div>
              <Label className="text-lg mb-2 block">Board Type:</Label>
              <div className="flex gap-3 items-center">
                <Label>Public</Label>
                <Switch checked={boardType} onCheckedChange={(checked) => setValue("boardType", checked)} />
                <Label>Private</Label>
              </div>
            </div>

            {!boardType && (
              <MembersInput
                findMembersInput={findMembersInput}
                setFindMembersInput={setFindMembersInput}
                handleFindMembers={(v) => v.trim().length && findMembers({ variables: { member: { nickName: v, email: v } } })}
                data={{ findMembers: data?.findMembers?.map(m => ({ id: m.id, email: m.email, nickName: m.nickName, avatarUrl: m.avatarUrl ?? "" })) }}
                loading={loading}
                errors={errors}
                setValue={setValue}
                formMembers={selectedMembers}
                disabled={sendingForm}
              />
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button type="submit" size="lg" className="mt-4 w-full" disabled={isButtonDisabled || sendingForm}>
                    Create Board
                  </Button>
                </div>
              </TooltipTrigger>

              {isButtonDisabled && (
                <TooltipContent side="top">
                  <p className="max-w-50 truncate">You must fill in the form</p>
                </TooltipContent>
              )}
            </Tooltip>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
