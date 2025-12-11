import React, { useEffect, useState } from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Textarea } from '../ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Button } from '../ui/button'
import { useMutation } from '@apollo/client/react'
import { EDIT_COMMENT } from '@/apollo/requests/task-comments'
import { toast } from 'sonner'
import { useCurrentUser } from '@/hooks/use-user'
import { Comment } from '@/types/board.type'

interface Props {
    isOpen: boolean, 
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>,
    initialComment: Comment
}

const EditTaskComment = ({ isOpen, onOpenChange, initialComment }: Props) => {

    const [comment, setComment] = useState(initialComment.content)
    const { user } = useCurrentUser()
    const [editComment, { loading }] = useMutation(EDIT_COMMENT, {
        onCompleted() {
            setTimeout(() => {
                toast.success('Ваш комментарий успешно изменен!')
                onOpenChange(false)

            }, 150)

        },
    })

    const handleSubmit = () => {
        editComment({
            variables: {
                commentInput: {
                    content: comment,
                    id: initialComment.id
                }
            }
        })
    }

    const isUpdated = comment !== initialComment.content

    useEffect(() => {
        setComment(initialComment.content)
    }, [isOpen])

    return (
        <form>
            <DialogContent className={`dark ${loading && 'bg-neutral-900'}`}>
                <DialogHeader>
                    <DialogTitle>Изменить комменатарий</DialogTitle>
                    <DialogDescription>
                        Здесь вы можете изменить ваш комментарий к задаче
                    </DialogDescription>
                </DialogHeader>

                <Textarea
                    maxLength={500}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder='Ваш комментарий:'
                    className='max-h-50 min-h-30'
                />

                <DialogFooter className='flex-col'>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div>
                                <Button onClick={handleSubmit} className='w-full' disabled={!isUpdated || loading}>
                                    Оставить
                                </Button>
                            </div>
                        </TooltipTrigger>

                        {!isUpdated && (
                            <TooltipContent side="top">
                                <p className="max-w-50 truncate">Вы не написали комменатарий</p>
                            </TooltipContent>
                        )}
                    </Tooltip>
                    <DialogClose asChild>
                        <Button variant="outline">Отмена</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </form>
    )
}

export default EditTaskComment
