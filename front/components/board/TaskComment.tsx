import React, { useState } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { getAvatarFallback } from '@/utils/avatar-fallback.util'
import { Comment } from '@/types/board.type'
import { formatDateShort } from '@/utils/format-date-short.util'
import { Dialog } from '../ui/dialog'
import EditTaskComment from './EditTaskComment'
import ConfirmDelete from '../ConfirmDelete'
import { useMutation } from '@apollo/client/react'
import { DELETE_COMMENT } from '@/apollo/requests/task-comments'
import { useCurrentUser } from '@/hooks/use-user'
import { PencilLine, Trash2 } from 'lucide-react'

const TaskComment = ({ comment }: { comment: Comment }) => {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [deleteComment] = useMutation(DELETE_COMMENT)
    const {user} = useCurrentUser()

    const payload = {
        variables: {
            commentId: comment.id
        }
    }
    return (
        <Card className='pt-4 pb-0'>
            <CardHeader className='px-4 gap-1'>
                <CardTitle>
                    <div className="flex items-center w-full gap-2 text-left text-sm">
                        <Avatar className="h-6 w-6 rounded-full">
                            <AvatarImage src={comment.author.avatarUrl ?? ''} alt={comment.author.nickName} />
                            <AvatarFallback className="rounded-lg">
                                {getAvatarFallback(comment.author.nickName)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-left w-full text-sm leading-tight grid grid-cols-[1fr_auto] items-center justify-between gap-5">
                            <div className="truncate font-medium">{`@${comment.author.nickName}`}</div>
                            <div className='text-sm text-neutral-700 select-none font-normal'>{formatDateShort(comment.updatedAt)}</div>
                        </div>
                    </div>
                </CardTitle>
                <CardDescription className='max-h-30 overflow-y-auto overflow-x-hidden break-all'>
                    {comment.content}
                </CardDescription>
                {comment.author.id === user?.id && 
                    <div className='flex justify-end gap-1 mt-2'>
                        <PencilLine size={16} className='text-neutral-700 cursor-pointer hover:text-neutral-400 transition-colors' onClick={() => setIsEditOpen(true)}/>
                        <Trash2 size={16} className='text-neutral-700 cursor-pointer hover:text-red-400 transition-colors' onClick={() => setIsDeleteOpen(true)}/>
                    </div>
                }
            </CardHeader>
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <EditTaskComment initialComment={comment} isOpen={isEditOpen} onOpenChange={setIsEditOpen} />
            </Dialog>
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <ConfirmDelete isOpen={isDeleteOpen} onOpenChange={setIsDeleteOpen} deleteFn={deleteComment} title='Вы действительно хотите удалить этот комментарий?' payload={payload} />
            </Dialog>
        </Card>
    )
}

export default TaskComment
