import { Task } from '@/types/board.type'
import { NewTaskForm } from '@/types/new-task-form.type'
import { normalizeSpaces } from '@/utils/normalize-spaces.util'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Check, ChevronDownIcon, ChevronsUpDown } from 'lucide-react'
import { Calendar } from '../ui/calendar'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { getAvatarFallback } from '@/utils/avatar-fallback.util'
import { PRIORITIES, Priority } from '@/data/priorities.data'
import { Member } from './AddNewTask'
import { Label } from '../ui/label'
import { Toggle } from '../ui/toggle'
import { cn } from '@/lib/utils'
import { useMutation } from '@apollo/client/react'
import { EDIT_TASK } from '@/apollo/requests/tasks'
import { toast } from 'sonner'

interface Props {
    task: Task,
    isOpen: boolean
    isPrivate: boolean
    membersWithOwner: Member[]
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}

const EditTask = ({ task, isOpen, isPrivate, membersWithOwner, onOpenChange }: Props) => {

    const [calendarOpen, setCalendarOpen] = useState(false)
    const [commandOpen, setCommandOpen] = useState(false)
    const [membersNicknames, setMembersNicknames] = useState<string[]>(task.assignments.map(a => a.user.nickName))
    const [members, setMembers] = useState<Member[]>(task.assignments.map(a => a.user))
    const [priorities, setPriorities] = useState<Priority[]>(PRIORITIES)

    const [editTask, { loading }] = useMutation(EDIT_TASK, {
        onCompleted: () => {
            toast.success('Задача успешно изменена!', { duration: 1500 })

            onOpenChange(false)
            reset({
                description: '',
                title: '',
                membersIds: [],
                deadlineDate: undefined,
                priority: task.priority
            })
        }
    })

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors },
    } = useForm<NewTaskForm>({
        resolver: zodResolver(NewTaskForm),
        mode: "onSubmit",
        defaultValues: {
            title: task.title,
            description: task?.description ?? '',
            deadlineDate: new Date(task.deadlineDate),
            membersIds: task.assignments.map(a => a.user.id),
            priority: task.priority
        },
    })

    const wathedDeadlineDate = watch('deadlineDate')
    const watchedTitle = watch('title')
    const watchedDescription = watch('description')
    const wathedPriority = watch('priority')

    const isUpdated = useMemo(() => {
        const nameChanged = (normalizeSpaces(watchedTitle) !== task.title) && (watchedTitle.length > 0);
        const descriptionChanged = (normalizeSpaces(watchedDescription ?? "") !== task.description);
        const deadlineDateChanged = (new Date(wathedDeadlineDate).getTime() !== new Date(task.deadlineDate).getTime())
        const assignedIds = new Set(task.assignments.map(a => a.user.id));
        const memberIds = new Set(members?.map(m => m.id) || []);

        const membersIdsChanged =
            assignedIds.size !== memberIds.size ||
            ![...assignedIds].every(id => memberIds.has(id));

        const priorityChanged = wathedPriority !== task.priority


        return nameChanged || descriptionChanged || deadlineDateChanged || membersIdsChanged || priorityChanged
    }, [watchedDescription, watchedTitle, wathedDeadlineDate, members, wathedPriority, task])

    const onSubmit: SubmitHandler<NewTaskForm> = (formData) => {
        editTask({
            variables: {
                taskInput: {
                    deadlineDate: new Date(formData.deadlineDate),
                    id: task.id,
                    priority: formData.priority,
                    title: formData.title,
                    description: formData.description,
                    membersIds: members.map(m => m.id)
                }
            }
        })
    }

    useEffect(() => {
        setTimeout(() => {
            reset({
                title: task.title,
                description: task?.description ?? '',
                deadlineDate: new Date(task.deadlineDate),
                membersIds: task.assignments.map(a => a.user.id),
                priority: task.priority
            })
            setPriorities(prev => {
                const currentPriority = prev.find(p => p.priority === task.priority)
                const otherPriorities = prev.filter(p => p.priority !== task.priority).map(p => ({ ...p, isChecked: false }))

                if (!currentPriority) return prev

                const updatedPriority: Priority = { ...currentPriority, isChecked: true }

                return [...otherPriorities, updatedPriority].sort((a, b) => a.order - b.order)
            })
        }, 150)

    }, [isOpen])

    return (
        <DialogContent className={`dark ${loading && 'bg-neutral-900'}`}>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
                <DialogHeader>
                    <DialogTitle>Edit task</DialogTitle>
                    <DialogDescription>
                        Here you can change the current task
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

                    <div className='flex flex-col gap-2 '>
                        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                            <PopoverTrigger asChild>
                                <Button className='w-full flex items-center justify-between' variant={'outline'}>
                                    {wathedDeadlineDate ? `до ${new Date(wathedDeadlineDate).toLocaleDateString()}` : "Выберите дату дедлайна*"}
                                    <ChevronDownIcon className='mt-0.5 opacity-50' />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className='z-100 dark p-0 w-fit'>
                                <Calendar
                                    className=' dark:border-neutral-700 dark:bg-neutral-950!'
                                    mode="single"
                                    selected={wathedDeadlineDate}
                                    captionLayout="dropdown-months"
                                    onSelect={(date) => {
                                        if (!date) return
                                        setValue('deadlineDate', date)
                                        setCalendarOpen(false)
                                    }}
                                    disabled={(day) => day < today}
                                />

                            </PopoverContent>
                        </Popover>
                    </div>
                    {!isPrivate &&
                        <div className='flex flex-col gap-2'>
                            <Popover open={commandOpen} onOpenChange={setCommandOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={'outline'}
                                        role="combobox"
                                        className="justify-between w-full"
                                    >
                                        {membersNicknames.length > 0
                                            ? membersNicknames.map(n => `@${n}`).join(', ')
                                            : "Выберите исполнителей задачи"}
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 z-100 dark w-fit">
                                    <Command className='w-fit'>
                                        <CommandInput placeholder="Найти участника..." className="h-9" />
                                        <CommandList>
                                            <CommandEmpty className='py-3 text-center text-sm'>No members found</CommandEmpty>
                                            <CommandGroup>
                                                {membersWithOwner.map((member) => (
                                                    <CommandItem
                                                        key={member.id}
                                                        value={member.nickName}
                                                        onSelect={(value: string) => {
                                                            setMembersNicknames(prev => {
                                                                if (prev.includes(value)) {
                                                                    return prev.filter(n => n !== value);
                                                                }
                                                                return [...prev, value];
                                                            });

                                                            setMembers(prev => {
                                                                const arr = prev ?? [];

                                                                if (arr.some(m => m.id === member.id)) {
                                                                    return arr.filter(m => m.id !== member.id);
                                                                }

                                                                return [...arr, member];
                                                            });;

                                                            setCommandOpen(false);
                                                        }}
                                                    >
                                                        <div className='flex justify-between w-full items-center'>
                                                            <div className='flex gap-2 items-center'>
                                                                <Avatar className="h-7 w-7 rounded-lg">
                                                                    <AvatarImage src={member.avatarUrl ?? ''} alt={member.nickName} />
                                                                    <AvatarFallback className="rounded-lg">
                                                                        {getAvatarFallback(member.nickName)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className='mb-1'>
                                                                    {`@${member.nickName}`}
                                                                </div>
                                                            </div>
                                                            <Check
                                                                className={cn(
                                                                    "ml-auto",
                                                                    membersNicknames?.includes(member.nickName) ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    }

                    <div className='flex flex-col gap-2'>
                        <Label className='pl-1 text-neutral-400'>Priority:</Label>
                        <div className='flex sm:gap-3 gap-1.5'>
                            {priorities.map(priority => (
                                <Toggle
                                    size="sm"
                                    key={priority.priority}
                                    variant="outline"
                                    onPressedChange={() => {
                                        setPriorities(prev =>
                                            prev.map(p => ({
                                                ...p,
                                                isChecked: p.priority === priority.priority && true
                                            }))
                                        );

                                        setValue('priority', priority.priority)
                                    }}
                                    className={`sm:text-sm text-[13px] rounded-2xl px-2 pr-3 flex items-center ${priority.isChecked ? `${priority.primaryColor}` : 'bg-transparent'}`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${priority.isChecked ? 'bg-white' : `${priority.secondaryColor}`} `} />
                                    {priority.title}
                                </Toggle>
                            ))}

                        </div>
                    </div>

                </div>

                <DialogFooter className='flex-col'>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div>
                                <Button className='w-full' disabled={!isUpdated || loading} type="submit">
                                    Save
                                </Button>
                            </div>
                        </TooltipTrigger>

                        {!isUpdated && (
                            <TooltipContent side="top">
                                <p className="max-w-50 truncate">You haven't changed anything.</p>
                            </TooltipContent>
                        )}
                    </Tooltip>

                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                </DialogFooter>
            </form>
        </DialogContent>
    )
}

export default EditTask
