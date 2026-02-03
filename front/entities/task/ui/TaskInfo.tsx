import React from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../shared/ui-kit/dialog'
import { Task } from '@/entities/board/model/board.type'
import { Button } from '../../../shared/ui-kit/button'
import { getDateColor, getPriorityColor } from '@/entities/task/model/get-colors.util'
import FirstThreeAvatars from '../../../shared/components/FirstThreeAvatars'
import { PRIORITIES } from '@/entities/task/model/priorities.data'
import DefaultUserPreview from '../../../shared/components/DefaultUserPreview'
import { Label } from '../../../shared/ui-kit/label'
import { ScrollArea } from '../../../shared/ui-kit/scroll-area'
import { commentsWordEn } from '@/shared/lib/get-comments-words.util'
import TaskComment from './TaskComment'

const TaskInfo = ({ task }: { task: Task }) => {

    function normalizeDate(input: any): Date {
        return input instanceof Date ? input : new Date(input);
    }

    return (
        <DialogContent className='dark'>
            <DialogHeader>
                <DialogTitle>{task.title}</DialogTitle>
                <DialogDescription asChild>
                    <ScrollArea className='max-h-50 pr-3'>
                        {task.description ? <div>{task.description}</div> : <div className='text-center text-neutral-600'>-- No description --</div>}
                    </ScrollArea>
                </DialogDescription>
            </DialogHeader>

            <div className='text-neutral-400 flex items-center justify-between mt-2'>
                <div className={`${getDateColor(task.deadlineDate)} opacity-75`}>
                    Deadline: {normalizeDate(task.deadlineDate).toLocaleDateString()}
                </div>
                <div className={`w-3.5 h-3.5 rounded-full ${getPriorityColor(PRIORITIES, task)}`} />
            </div>

            {task.assignments && task.assignments.length ?
                <div className='flex flex-col gap-2'>
                    <Label className='text-neutral-400'>Assigned to:</Label>
                    <div className='flex gap-4 flex-wrap'>
                        {task.assignments.map(a => (
                            <DefaultUserPreview
                                avatarUrl={a.user.avatarUrl ?? ''}
                                email={a.user.email}
                                nickName={a.user.nickName}
                                key={a.user.id}
                            />
                        ))}
                    </div>
                </div> : null
            }

            <div className='text-neutral-500 flex items-center justify-between'>
                {`${commentsWordEn(task.comments?.length ?? 0, true)}${task.comments?.length && task.comments.length > 0 ? ':' : ''}`}
                <div className='text-neutral-700 text-sm select-none'>
                    Created on: {normalizeDate(task.createdAt).toLocaleDateString()}
                </div>
            </div>

            <ScrollArea className='max-h-60 pr-4'>
                <div className='flex flex-col gap-3'>
                    {task.comments?.map(c => (
                        <TaskComment key={c.id} comment={c} />
                    ))}
                </div>
            </ScrollArea>

            <DialogFooter className='flex-col'>
                <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    )
}

export default TaskInfo
