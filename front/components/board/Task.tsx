import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Task as TaskType } from '@/types/board.type'
import { PencilLine, Trash2 } from 'lucide-react'
import { Dialog } from '../ui/dialog'
import EditTask from './EditTask'
import ConfirmDelete from '../ConfirmDelete'
import { useMutation } from '@apollo/client/react'
import { DELETE_TASK } from '@/apollo/requests/tasks'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const Task = ({ task }: { task: TaskType }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

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
        <div  className='relative hover:text-neutral-600 text-neutral-900 transition-colors cursor-grab'>
            <Card style={style} ref={setNodeRef} {...attributes} {...listeners} className="gap-2 py-4 dark">
                <CardHeader className='block px-4'>
                    <CardTitle className={`${isDragging && 'opacity-0'}  max-w-[87%] break-all line-clamp-3`}>
                        {task.title}
                    </CardTitle>

                </CardHeader>
                <CardContent className={`px-4 max-h-30 overflow-y-auto text-sm ${isDragging && 'opacity-0'} scrollbar-track-neutral-900! break-all`}>
                    {task.description ? <pre className='text-neutral-400 font-mono'>{task.description}</pre> : <p className='text-center w-full text-neutral-600'>-- Без описания --</p>}
                </CardContent>
            </Card>
            {!isDragging &&
                <div className='flex gap-1 absolute top-2 right-2'>
                    <PencilLine onClick={() => setIsOpen(true)} className=' cursor-pointer hover:text-neutral-400 transition-colors' size={16} />
                    <Trash2 onClick={() => setIsDeleteOpen(true)} className='cursor-pointer hover:text-rose-400 transition-colors' size={16} />
                </div>
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

export default Task
