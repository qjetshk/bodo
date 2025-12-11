import { CREATE_TASK } from '@/apollo/requests/tasks'
import { cn } from '@/lib/utils'
import { NewTaskForm } from '@/types/new-task-form.type'
import { Priorities } from "@/apollo/gql/graphql"
import { getAvatarFallback } from '@/utils/avatar-fallback.util'
import { normalizeSpaces } from '@/utils/normalize-spaces.util'
import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { TooltipTrigger } from '@radix-ui/react-tooltip'
import { Check, ChevronDownIcon, ChevronsUpDown } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Popover } from '../ui/popover'
import { Textarea } from '../ui/textarea'
import { Toggle } from '../ui/toggle'
import { Tooltip, TooltipContent } from '../ui/tooltip'
import { PRIORITIES, Priority } from '@/data/priorities.data'

interface Props {
    columnId: string,
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
    isOpen: boolean,
    isPrivate: boolean
    membersWithOwner: Member[]
}

export type Member = {
    __typename?: "User" | undefined;
    avatarUrl?: string | null | undefined;
    email: string;
    nickName: string;
    id: string;

}


const AddNewTask = ({ membersWithOwner, isPrivate, columnId, onOpenChange, isOpen }: Props) => {

    const [calendarOpen, setCalendarOpen] = useState(false)
    const [commandOpen, setCommandOpen] = useState(false)
    const [membersNicknames, setMembersNicknames] = useState<string[]>([])
    const [members, setMembers] = useState<Member[] | undefined>(undefined)
    const [priorities, setPriorities] = useState<Priority[]>(PRIORITIES)

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
            title: '',
            description: '',
            membersIds: [],
            deadlineDate: undefined,
            priority: Priorities.High
        },
    })

    const [createTask, { loading }] = useMutation(CREATE_TASK, {
        onCompleted: () => {
            toast.success('Задача успешно создана!', { duration: 1500 })

            onOpenChange(false)
            reset({
                description: '',
                title: '',
                membersIds: [],
                deadlineDate: undefined,
                priority: Priorities.High
            })
            setPriorities(PRIORITIES)
        }
    })

    useEffect(() => {
        reset({
            description: '',
            title: '',
            membersIds: [],
            deadlineDate: undefined,
            priority: Priorities.High
        })
        setPriorities(PRIORITIES)
        setMembersNicknames([])
    }, [isOpen])

    useEffect(() => {
        if (!members) {
            setValue('membersIds', []);
            return;
        }
        setValue('membersIds', members.map(m => m.id));
    }, [members, setValue]);

    const wathedDeadlineDate = watch('deadlineDate')
    const watchedTitle = watch('title')
    const watchedDescription = watch('description')

    const isUpdated = useMemo(() => {
        const nameChanged = normalizeSpaces(watchedTitle).length > 0;

        return nameChanged && wathedDeadlineDate
    }, [watchedDescription, watchedTitle, wathedDeadlineDate])

    const onSubmit: SubmitHandler<NewTaskForm> = (formData) => {
        console.log(formData)
        createTask({
            variables: {
                taskInput: {
                    title: normalizeSpaces(formData.title),
                    description: formData?.description,
                    deadlineDate: formData?.deadlineDate,
                    priority: formData?.priority,
                    membersIds: formData?.membersIds,
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
                        Здесь вы можете создать новую задачу
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
                            placeholder='Введите название задачи*'
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
                    <div className='flex flex-col gap-2'>
                        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                            <PopoverTrigger asChild>
                                <Button className='w-full flex items-center justify-between' variant={'outline'}>
                                    {wathedDeadlineDate ? `до ${wathedDeadlineDate.toLocaleDateString()}` : "Выберите дату дедлайна*"}
                                    <ChevronDownIcon className='mt-0.5 opacity-50' />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className='z-100'>
                                <Calendar
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
                                <PopoverContent className="p-0 z-100">
                                    <Command>
                                        <CommandInput placeholder="Найти участника..." className="h-9" />
                                        <CommandList>
                                            <CommandEmpty className='py-3 text-center text-sm'>Участники не найдены</CommandEmpty>
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
                        <Label className='pl-1 text-neutral-400'>Приоритет:</Label>
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
                                    Создать
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
