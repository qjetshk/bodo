import { Task } from '@/types/board.type'
import { NewTaskForm } from '@/types/new-task-form.type'
import { normalizeSpaces } from '@/utils/normalize-spaces.util'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useMemo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Button } from '../ui/button'

interface Props {
    task: Task,
    isOpen: boolean
}

const EditTask = ({ task, isOpen }: Props) => {

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<NewTaskForm>({
        resolver: zodResolver(NewTaskForm),
        mode: "onSubmit",
        defaultValues: {
            title: task.title,
            description: task.description
        },
    })

    const watchedTitle = watch('title')
    const watchedDescription = watch('description')

    const isUpdated = useMemo(() => {
        const desc = watchedDescription ??  ''
        const nameChanged = (normalizeSpaces(watchedTitle) !== task.title) && (watchedTitle.length > 0);
        const descriptionChanged = (normalizeSpaces(watchedDescription ?? "") !== task.description) && (desc.length > 0);

        return nameChanged || descriptionChanged
    }, [watchedDescription, watchedTitle])

    const onSubmit: SubmitHandler<NewTaskForm> = (formData) => {
        console.log(
            {
                ...formData,
                id: task.id
            }
        )
    }

    useEffect(() => {
        setTimeout(() => {
            reset({
                description: task.description,
                title: task.title
            })
        }, 150)

    }, [isOpen])

    return (
        <DialogContent className={`dark ${/* loading && */ 'bg-neutral-900'}`}>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
                <DialogHeader>
                    <DialogTitle>Изменить задачу</DialogTitle>
                    <DialogDescription>
                        Здесь вы можете изменить текущую задачу
                    </DialogDescription>
                </DialogHeader>

                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-1'>
                        {errors.title?.message && (
                            <p className="text-sm text-red-400">
                                {errors.title.message}
                            </p>
                        )}
                        <Input
                            /*  disabled={loading} */
                            maxLength={50}
                            className={errors.title ? 'outline-1! outline-red-400!' : ''}
                            {...register('title')}
                            placeholder='Введите название задачи'
                        />
                    </div>

                    <div className='flex flex-col gap-1'>
                        {errors.description?.message && (
                            <p className="text-sm text-red-400">
                                {errors.description.message}
                            </p>
                        )}
                        <Textarea
                            /* disabled={loading} */
                            maxLength={2000}
                            className={`${errors.description ? 'outline-1 outline-red-400' : ''} min-h-15 resize-none break-all max-h-80`}
                            {...register('description')}
                            placeholder='Введите описание задачи'
                        />
                    </div>

                </div>

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
                                <p className="max-w-50 truncate">Вы не заполнили форму</p>
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

export default EditTask
