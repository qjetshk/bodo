'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { MembersInput, MemberType } from '@/app/(auth)/dashboard/kanban/new/MembersInput'
import { useMutation } from '@apollo/client/react'
import { FIND_MEMBERS } from '@/apollo/requests/members'
import { SubmitHandler, useForm } from 'react-hook-form'
import { EditBoardForm } from '@/types/edit-board-form-type'
import { zodResolver } from '@hookform/resolvers/zod'
import { GetInitialBoardQuery } from '@/apollo/gql/graphql'
import DefaultUserPreview from '../DefaultUserPreview'
import { copyToClipboard } from '@/utils/copy-to-clipboard.util'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

interface Props {
    board?: InitialBoard
    isOpened: boolean
}

export type InitialBoard = GetInitialBoardQuery['getBoardById']

const SettingsForOwner = ({ board, isOpened }: Props) => {
    const [findMembersInput, setFindMembersInput] = useState("")

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        trigger,
        formState: { errors },
    } = useForm<EditBoardForm>({
        resolver: zodResolver(EditBoardForm),
        mode: "onSubmit", // ошибки появляются при submit
        defaultValues: {
            name: board?.name ?? "",
            description: board?.description ?? "",
            boardType: board?.boardType ?? false,
            membersToAdd: [],
            canAddMember: true
        },
    })

    useEffect(() => {
        if (isOpened && board) {
            reset({
                name: board.name ?? "",
                description: board.description ?? "",
                boardType: board.boardType ?? false,
                membersToAdd: [],
                canAddMember: true
            })
        }
    }, [isOpened, board, reset, trigger])


    const formMemberIds = watch("membersToAdd") || []

    const [findMembers, { data, loading }] = useMutation(FIND_MEMBERS)

    const handleFindMembers = (value: string) => {
        if (value.trim().length) {
            findMembers({
                variables: { member: { nickName: value, email: value } },
            })
        }
    }

    const selectedMembers: MemberType[] = formMemberIds
        .map((id) => data?.findMembers?.find((m) => m.id === id))
        .filter(Boolean) as MemberType[]

    const onSubmit: SubmitHandler<EditBoardForm> = (formData) => {
        console.log("Форма успешно отправлена", formData)
        console.log('sds')
    }

    const watchedName = watch("name");
    const watchedDescription = watch("description");
    const watchedMembers = watch("membersToAdd") || [];

    const isUpdated = useMemo(() => {
        if (!board) return false;

        const nameChanged = watchedName !== (board.name ?? "");
        const descriptionChanged = watchedDescription !== (board.description ?? "");
        const membersChanged = watchedMembers.length > 0;

        return nameChanged || descriptionChanged || membersChanged;
    }, [board, watchedName, watchedDescription, watchedMembers]);


    return (

        <DialogContent className="dark">
            <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
                <DialogHeader>
                    <DialogTitle>Настройки</DialogTitle>
                    <DialogDescription>
                        Здесь вы можете посмотреть и поменять настройки для этой доски
                    </DialogDescription>
                </DialogHeader>

                <section className='flex flex-col gap-5'>
                    <div className='flex flex-col gap-2'>
                        <div className='flex justify-between'>
                            <Label className='pl-2 text-neutral-500 font-normal'>Название доски:</Label>
                            {errors.name?.message && (
                                <p className="text-sm text-red-400">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>
                        <Input
                            maxLength={100}
                            {...register('name')}
                            placeholder='Введите новое имя доски'
                            className={errors.name ? 'outline-1! outline-red-400!' : ''}
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <div className='flex justify-between'>
                            <Label className='pl-2 text-neutral-500 font-normal'>Описание доски:</Label>
                            {errors.description?.message && (
                                <p className="text-sm text-red-400">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>
                        <Textarea
                            {...register('description')}
                            maxLength={100}
                            placeholder='Введите новое описание доски'
                            className={`${errors.description ? 'outline-1 outline-red-400' : ''} min-h-15 resize-none break-all`}
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <Label className='pl-2 text-neutral-500 font-normal'>Тип доски:</Label>
                        <p className='pl-2 text-neutral-300'>{board?.boardType ? 'Приватная' : 'Публичная'}</p>
                    </div>
                    <p
                        onClick={(e) => copyToClipboard(e, board?.id ?? '')}
                        className='pl-2 w-fit text-sm hover:text-neutral-300 cursor-pointer transition-colors text-neutral-500'>
                        {`id: ${board?.id}`}
                    </p>
                    {!board?.boardType &&
                        <>
                            <div className='flex flex-col gap-3'>
                                <Label className='pl-2 text-neutral-500 font-normal'>Участники доски:</Label>
                                <div className='flex flex-wrap gap-3 px-2'>
                                    {board?.members.map(member => (
                                        <div key={member.user.id} className='text-neutral-300'>
                                            <DefaultUserPreview nickName={member?.user.nickName ?? ''} email={member?.user.email ?? ''} avatarUrl={member?.user.avatarUrl ?? ''} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {!(board?.members.length === 5) &&
                                <MembersInput
                                    findMembersInput={findMembersInput}
                                    setFindMembersInput={setFindMembersInput}
                                    handleFindMembers={handleFindMembers}
                                    data={{
                                        findMembers: data?.findMembers?.map((m) => ({
                                            id: m.id,
                                            email: m.email,
                                            nickName: m.nickName,
                                            avatarUrl: m.avatarUrl ?? ""
                                        }))
                                    }}
                                    loading={loading}
                                    errors={errors}
                                    setValue={setValue}
                                    formMembers={selectedMembers}
                                    maxMembers={5 - (board?.members.length ?? 0)}
                                    addedMembers={board?.members}
                                />
                            }
                        </>
                    }


                </section>

                <DialogFooter className='flex-col'>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div>
                                <Button className='w-full' disabled={!isUpdated} type="submit">
                                    Сохранить
                                </Button>
                            </div>
                        </TooltipTrigger>

                        {!isUpdated && (
                            <TooltipContent side="top">
                                <p className="max-w-50 truncate">Вы ничего не поменяли</p>
                            </TooltipContent>
                        )}
                    </Tooltip>

                    <DialogClose asChild>
                        <Button variant="outline">Отмена</Button>
                    </DialogClose>
                </DialogFooter>
            </form>
        </DialogContent>

    )
}

export default SettingsForOwner
