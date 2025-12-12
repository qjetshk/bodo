import React, { useEffect, useState } from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
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
        onCompleted(data, clientOptions) {
            setTimeout(() => {
                toast.success('Ваш комментарий успешно добавлен!')
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
                    <DialogTitle>Написать комменатарий</DialogTitle>
                    <DialogDescription>
                        Здесь вы можете написать комментарий к задаче
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

export default AddTaskComment
