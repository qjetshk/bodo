import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/ui-kit/card'
import { Member, Task as TaskType } from '@/entities/board/model/board.type'
import { Ellipsis, Maximize2, MessageCirclePlus, PencilLine, Trash2 } from 'lucide-react'
import { Dialog } from '../../../shared/ui-kit/dialog'
import EditTask from '../../../features/board/edit-task/ui/EditTask'
import ConfirmDelete from '../../../shared/components/ConfirmDelete'
import { useMutation } from '@apollo/client/react'
import { DELETE_TASK } from '@/apollo/requests/tasks'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../shared/ui-kit/dropdown-menu'
import { useIsTouchDevice } from '@/shared/hooks/is-touch-device'
import FirstThreeAvatars from '../../../shared/components/FirstThreeAvatars'
import TaskInfo from './TaskInfo'
import { getDateColor, getPriorityColor } from '@/entities/task/model/get-colors.util'
import { PRIORITIES } from '@/entities/task/model/priorities.data'
import AddComment from '../../../features/board/add-task-comment/ui/AddTaskComment'
import { commentsWordEn } from '@/shared/lib/get-comments-words.util'

const Task = ({ task, isPrivate, membersWithOwner }: { task: TaskType, isPrivate: boolean, membersWithOwner: Member[] }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isInfoOpen, setIsInfoOpen] = useState(false)
    const [isCommentOpen, setIsCommentOpen] = useState(false)
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
                <CardContent className={`px-4 text-sm ${isDragging && 'opacity-0'} flex flex-col gap-2`}>
                    <div className='max-h-25 overflow-y-auto scrollbar-track-neutral-900! break-all'>
                        {task.description ? (
                            <p className='text-neutral-400 font-mono break-all'>{task.description}</p>
                        ) : (
                            <p className='text-center w-full text-neutral-600'>-- No description --</p>
                        )}
                    </div>
                    <div className='text-neutral-400 flex items-center justify-between mt-2'>
                        <div className={`${getDateColor(task.deadlineDate)} opacity-75`}>
                            {new Date(task.deadlineDate).toLocaleDateString()}
                        </div>
                        <FirstThreeAvatars avatarSize={20} members={task.assignments} />
                    </div>
                    <div className='text-neutral-500 flex items-center justify-between'>
                        {`${commentsWordEn(task.comments?.length ?? 0, true)}`}
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(PRIORITIES, task)}`} />
                    </div>
                </CardContent>
            </Card>

            {!isDragging &&
                <DropdownMenu>
                    <DropdownMenuTrigger asChild className={`${isTouchDevice && 'text-neutral-600!'} absolute top-1.5 right-3 cursor-pointer`}>
                        <Ellipsis size={18} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="dark">
                        <DropdownMenuItem onClick={() => setIsInfoOpen(true)} className="cursor-pointer hover:text-neutral-400 transition-colors">
                            <Maximize2 />
                            Expand
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIsOpen(true)} className="cursor-pointer hover:text-neutral-400 transition-colors">
                            <PencilLine />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIsCommentOpen(true)} className="cursor-pointer hover:text-neutral-400 transition-colors">
                            <MessageCirclePlus />
                            Add Comment
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIsDeleteOpen(true)} className="cursor-pointer hover:text-neutral-400 transition-colors hover:bg-red-700/15!">
                            <Trash2 />
                            Delete Task
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            }

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <EditTask onOpenChange={setIsOpen} isPrivate={isPrivate} membersWithOwner={membersWithOwner} isOpen={isOpen} task={task} />
            </Dialog>
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <ConfirmDelete onOpenChange={setIsDeleteOpen} deleteFn={deleteTask} payload={payload} isOpen={isDeleteOpen} title='Are you sure you want to delete this task?' />
            </Dialog>
            <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
                <TaskInfo task={task} />
            </Dialog>
            <Dialog open={isCommentOpen} onOpenChange={setIsCommentOpen}>
                <AddComment taskId={task.id} isOpen={isCommentOpen} onOpenChange={setIsCommentOpen}/>
            </Dialog>
        </div>
    )
}

export default React.memo(Task)
