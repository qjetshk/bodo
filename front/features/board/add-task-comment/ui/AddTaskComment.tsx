import React, { useEffect, useState } from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../../shared/ui-kit/dialog'
import { Button } from '../../../../shared/ui-kit/button'
import { Textarea } from '../../../../shared/ui-kit/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../shared/ui-kit/tooltip'
import { useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import { CREATE_COMMENT } from '@/apollo/requests/task-comments'

interface Props {
    isOpen: boolean, 
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>,
    taskId: string
}

const AddTaskComment = ({ isOpen, onOpenChange, taskId }: Props) => {

    const [comment, setComment] = useState('')
    const [createComment, { loading }] = useMutation(CREATE_COMMENT, {
        onCompleted() {
            setTimeout(() => {
                toast.success('Comment added successfully!')
                onOpenChange(false)
            }, 150)
        },
    })

    const handleSubmit = () => {
        createComment({
            variables: {
                commentInput: {
                    content: comment,
                    taskId
                }
            }
        })
    }

    const isUpdated = comment && comment.length > 0

    useEffect(() => {
        setComment('')
    }, [isOpen])

    return (
        <form>
            <DialogContent className={`dark ${loading && 'bg-neutral-900'}`}>
                <DialogHeader>
                    <DialogTitle>Add Comment</DialogTitle>
                    <DialogDescription>
                        Write a comment for this task
                    </DialogDescription>
                </DialogHeader>

                <Textarea
                    maxLength={500}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder='Your comment'
                    className='max-h-50 min-h-30'
                />

                <DialogFooter className='flex-col'>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div>
                                <Button onClick={handleSubmit} className='w-full' disabled={!isUpdated || loading}>
                                    Submit
                                </Button>
                            </div>
                        </TooltipTrigger>

                        {!isUpdated && (
                            <TooltipContent side="top">
                                <p className="max-w-50 truncate">Comment cannot be empty</p>
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

export default AddTaskComment
