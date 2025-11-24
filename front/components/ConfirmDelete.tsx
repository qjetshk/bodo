import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { toast } from "sonner"

interface Props<T> {
  isOpen: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  deleteFn?: (arg: T) => Promise<unknown>
  payload: T
  title?: string
}

function ConfirmDelete<T>({
  isOpen,
  onOpenChange,
  deleteFn,
  payload,
  title = "Удалить?",
}: Props<T>) {

  const [loading, setLoading] = useState(false)

  const onConfirm = async () => {
    try { 
      if (!deleteFn) return
      setLoading(true)
      await deleteFn(payload)

      toast.success("Успешно удалено", {duration: 1500})

      onOpenChange(false)
    } catch (err) {
      toast.error("Ошибка при удалении", {duration: 1500})
    } finally {
      setLoading(false)
    }
  }

  return (
      <DialogContent className={`${loading && 'bg-neutral-800'} dark`}>
        <DialogHeader className='py-5'>
          <DialogTitle className='text-center'>{title}</DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex gap-2 justify-center w-full flex-col">
          <Button
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Удаление..." : "Удалить"}
          </Button>

          <DialogClose asChild>
            <Button variant="outline" disabled={loading}>
              Отмена
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
  )
}

export default ConfirmDelete
