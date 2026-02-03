import React, { useEffect, useState } from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../../shared/ui-kit/dialog'
import { Textarea } from '../../../../shared/ui-kit/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../shared/ui-kit/tooltip'
import { Button } from '../../../../shared/ui-kit/button'
import { useMutation } from '@apollo/client/react'
import { EDIT_COMMENT } from '@/apollo/requests/task-comments'
import { toast } from 'sonner'
import { useCurrentUser } from '@/shared/hooks/use-user'
import { Comment } from '@/entities/board/model/board.type'

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
                toast.success('Comment updated successfully!')
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

    const isUpdated = comment !== initialComment.content && comment.length > 0

    useEffect(() => {
        setComment(initialComment.content)
    }, [isOpen, initialComment.content])

    return (
        <form>
            <DialogContent className={`dark ${loading && 'bg-neutral-900'}`}>
                <DialogHeader>
                    <DialogTitle>Edit Comment</DialogTitle>
                    <DialogDescription>
                        Modify your comment for this task below.
                    </DialogDescription>
                </DialogHeader>

                <Textarea
                    maxLength={500}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder='Your comment...'
                    className='max-h-50 min-h-30'
                />

                <DialogFooter className='flex-col'>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div>
                                <Button onClick={handleSubmit} className='w-full' disabled={!isUpdated || loading}>
                                    Save
                                </Button>
                            </div>
                        </TooltipTrigger>

                        {!isUpdated && (
                            <TooltipContent side="top">
                                <p className="max-w-50 truncate">No changes to save</p>
                            </TooltipContent>
                        )}
                    </Tooltip>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </form>
    )
}

export default EditTaskComment
