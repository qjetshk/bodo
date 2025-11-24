import React, { useMemo } from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Tooltip, TooltipContent } from '../ui/tooltip'
import { TooltipTrigger } from '@radix-ui/react-tooltip'
import { Button } from '../ui/button'
import { SubmitHandler, useForm } from 'react-hook-form'
import { NewTaskForm } from '@/types/new-task-form.type'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { normalizeSpaces } from '@/utils/normalize-spaces.util'
import { useMutation } from '@apollo/client/react'
import { CREATE_TASK } from '@/apollo/requests/tasks'
import { toast } from 'sonner'

interface Props {
    columnId: string,
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}

const AddNewTask = ({ columnId, onOpenChange }: Props) => {

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
            title: '',
            description: ''
        },
    })

    const [createTask, { loading }] = useMutation(CREATE_TASK, {
        onCompleted: () => {
            toast.success('Задача успешно создана!', { duration: 1500 })
            
            onOpenChange(false)
            reset({
                description: '',
                title: ''
            })
        }
    })

    const watchedTitle = watch('title')
    const watchedDescription = watch('description')

    const isUpdated = useMemo(() => {
        const nameChanged = normalizeSpaces(watchedTitle).length > 0;
        const descriptionChanged = normalizeSpaces(watchedDescription ?? "").length > 0;

        return nameChanged && descriptionChanged
    }, [watchedDescription, watchedTitle])

    const onSubmit: SubmitHandler<NewTaskForm> = (formData) => {
        createTask({
            variables: {
                taskInput: {
                    title: normalizeSpaces(formData.title),
                    description: normalizeSpaces(formData.description),
                    columnId
                }
            }
        })
    }

    return (
        <DialogContent className={`dark ${loading && 'bg-neutral-900'}`}>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
                <DialogHeader>
                    <DialogTitle>Новая задача</DialogTitle>
                    <DialogDescription>
                        Здесь вы создать новую задачу
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
                            disabled={loading}
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
                            disabled={loading}
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
                                <Button className='w-full' disabled={!isUpdated || loading} type="submit">
                                    Добавить
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

export default AddNewTask
