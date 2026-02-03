import { CREATE_TASK } from '@/apollo/requests/tasks'
import { cn } from '@/shared/lib/cn.util'
import { NewTaskForm } from '@/features/board/add-new-task/model/new-task-form.type'
import { Priorities } from "@/apollo/gql/graphql"
import { getAvatarFallback } from '@/shared/lib/avatar-fallback.util'
import { normalizeSpaces } from '@/shared/lib/normalize-spaces.util'
import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { TooltipTrigger } from '@radix-ui/react-tooltip'
import { Check, ChevronDownIcon, ChevronsUpDown } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/ui-kit/avatar'
import { Button } from '../../../../shared/ui-kit/button'
import { Calendar } from '../../../../shared/ui-kit/calendar'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../../../../shared/ui-kit/command'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../../shared/ui-kit/dialog'
import { Input } from '../../../../shared/ui-kit/input'
import { Label } from '../../../../shared/ui-kit/label'
import { Popover } from '../../../../shared/ui-kit/popover'
import { Textarea } from '../../../../shared/ui-kit/textarea'
import { Toggle } from '../../../../shared/ui-kit/toggle'
import { Tooltip, TooltipContent } from '../../../../shared/ui-kit/tooltip'
import { PRIORITIES, Priority } from '@/entities/task/model/priorities.data'
import { Member } from '@/entities/board/model/board.type'

interface Props {
    columnId: string,
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
    isOpen: boolean,
    isPrivate: boolean
    membersWithOwner: Member[]
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
            toast.success('Task successfully created!', { duration: 1500 })

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

    const watchedDeadlineDate = watch('deadlineDate')
    const watchedTitle = watch('title')
    const watchedDescription = watch('description')

    const isUpdated = useMemo(() => {
        const nameChanged = normalizeSpaces(watchedTitle).length > 0;
        return nameChanged && watchedDeadlineDate
    }, [watchedDescription, watchedTitle, watchedDeadlineDate])

    const onSubmit: SubmitHandler<NewTaskForm> = (formData) => {
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
                    <DialogTitle>New Task</DialogTitle>
                    <DialogDescription>
                        Fill in the details to create a new task
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
                            placeholder='Enter task title*'
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
                            placeholder='Enter task description'
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                            <PopoverTrigger asChild>
                                <Button className='w-full flex items-center justify-between' variant={'outline'}>
                                    {watchedDeadlineDate ? `Due ${watchedDeadlineDate.toLocaleDateString()}` : "Select deadline date*"}
                                    <ChevronDownIcon className='mt-0.5 opacity-50' />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className='z-100'>
                                <Calendar
                                    mode="single"
                                    selected={watchedDeadlineDate}
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
                                            : "Select task assignees"}
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 z-100">
                                    <Command>
                                        <CommandInput placeholder="Search member..." className="h-9" />
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
                                    Create
                                </Button>
                            </div>
                        </TooltipTrigger>

                        {!isUpdated && (
                            <TooltipContent side="top">
                                <p className="max-w-50 truncate">Form is incomplete</p>
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

export default AddNewTask
