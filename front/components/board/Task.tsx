import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Task as TaskType } from '@/types/board.type'
import { Ellipsis, PencilLine, Trash2 } from 'lucide-react'
import { Dialog } from '../ui/dialog'
import EditTask from './EditTask'
import ConfirmDelete from '../ConfirmDelete'
import { useMutation } from '@apollo/client/react'
import { DELETE_TASK } from '@/apollo/requests/tasks'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { useIsTouchDevice } from '@/hooks/is-touch-device'

const Task = ({ task }: { task: TaskType }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const isTouchDevice = useIsTouchDevice()

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
        //disabled: isEditing,
    });

    const [deleteTask] = useMutation(DELETE_TASK, {
        variables: {
            taskId: task.id
        }
    })

    const payload = {
        variables: {
            taskId: task.id
        }
    }

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? '0.5' : '1',
        border: isDragging ? '3px dashed var(--color-neutral-800)' : ''
    };

    return (
        <div className='relative hover:text-neutral-600 text-neutral-900 transition-colors cursor-grab'>
            <Card style={style} ref={setNodeRef} {...attributes} {...listeners} className="gap-2 py-4 dark">
                <CardHeader className='block px-4'>
                    <CardTitle className={`${isDragging && 'opacity-0'}  max-w-[87%] break-all line-clamp-3 h-4.5`}>
                        {task.title}
                    </CardTitle>

                </CardHeader>
                <CardContent className={`px-4 max-h-30 overflow-y-auto text-sm ${isDragging && 'opacity-0'} scrollbar-track-neutral-900! break-all`}>
                    {task.description ? <p className='text-neutral-400 font-mono break-all'>{task.description}</p> : <p className='text-center w-full text-neutral-600'>-- Без описания --</p>}
                </CardContent>
            </Card>
            {!isDragging &&
                <DropdownMenu>
                    <DropdownMenuTrigger asChild className={`${isTouchDevice && 'text-neutral-600!'} absolute top-1.5 right-3 cursor-pointer`}>
                        <Ellipsis size={18}/>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="dark">
                        <DropdownMenuItem onClick={() => setIsOpen(true)} className="cursor-pointer hover:text-neutral-400 transition-colors">
                            <PencilLine />
                            Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIsDeleteOpen(true)} className="cursor-pointer hover:text-neutral-400 transition-colors hover:bg-red-700/15!">
                            <Trash2 />
                            Удалить задачу
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            }
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <EditTask isOpen={isOpen} task={task} />
            </Dialog>
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <ConfirmDelete onOpenChange={setIsDeleteOpen} deleteFn={deleteTask} payload={payload} isOpen={isDeleteOpen} title='Вы действительно хотите удалить эту задачу?' />
            </Dialog>
        </div>
    )
}

export default React.memo(Task)