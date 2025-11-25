"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { Column as ColumnType, Task as TaskType } from "@/types/board.type";
import { CirclePlus, PencilLine, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { useMutation, useSubscription } from "@apollo/client/react";
import Task from "./Task";
import { Dialog } from "@radix-ui/react-dialog";
import AddNewTask from "./AddNewTask";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Ellipsis } from 'lucide-react'
import ConfirmDelete from "../ConfirmDelete";
import { CHANGE_COLUMN_TITLE, COLUMN_TITLE_CHANGED, DELETE_COLUMN } from "@/apollo/requests/columns";

interface Props {
  column: ColumnType;
  canDelete: boolean
}

export default function Column({ column, canDelete }: Props) {
  const tasksIds = useMemo(() => column.tasks.map(t => t.id), [column.tasks]);

  const [isEditing, setIsEditing] = useState(false);
  const [isNewTaskFormOpen, setIsNewTaskFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [title, setTitle] = useState(column.title);

  const inputRef = useRef<HTMLInputElement>(null);

  const [deleteCol] = useMutation(DELETE_COLUMN)

  useSubscription(COLUMN_TITLE_CHANGED, {
    onData: ({ data, client }) => {
      const updatedColumn = data.data?.columnTitleChanged;
      console.log(updatedColumn)
      if (!updatedColumn) return;
      if (updatedColumn.id === column.id) {
        setTitle(updatedColumn.title);
      }

      client.cache.modify({
        id: client.cache.identify({ __typename: 'Column', id: updatedColumn.id }),
        fields: {
          title: () => updatedColumn.title
        }
      })
    }
  });

  const [changeColumnTitle] = useMutation(CHANGE_COLUMN_TITLE, {
    variables: {
      columnId: column.id,
      newTitle: title
    }
  });

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (title.trim().length > 0) {
        changeColumnTitle();
      }
      setTitle(column.title)
      setIsEditing(false);
    }
    if (e.key === "Escape") {
      setTitle(column.title);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    if (!title.trim()) setTitle(column.title);
    setIsEditing(false);
  };

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: { type: "Column", column },
    disabled: isEditing
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    border: isDragging ? "dashed 3px var(--color-neutral-700)" : "",
    backgroundColor: isDragging ? "var(--color-neutral-900)" : ""
  };

  const payload = {
    variables: {
      columnId: column.id
    }
  }

  return (
    <Card ref={setNodeRef} style={style} className="dark bg-neutral-950 max-h-[700px] flex flex-col pt-0 border-neutral-800 pb-4 min-h-50">
      <CardHeader className={`pt-4 pb-4 flex select-none cursor-grab transition-colors rounded-t-lg hover:bg-neutral-900/60 text-neutral-950 hover:text-neutral-600 relative ${isDragging && "opacity-0"}`}>
        <div {...attributes} {...listeners} className="w-full cursor-grab">
          {!isEditing ? (
            <CardTitle className="truncate max-w-[calc(100%-30px)] text-white h-5">{title}</CardTitle>
          ) : (
            <Input
              ref={inputRef}
              value={title}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              className="bg-neutral-950 text-white max-w-full"
              maxLength={30}
            />
          )}
        </div>

        {!isEditing &&
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="absolute top-3.5 right-3.5 cursor-pointer">
              <Ellipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dark">
              <DropdownMenuItem onClick={() => setIsEditing(true)} className="cursor-pointer hover:text-neutral-400 transition-colors">
                <PencilLine />
                Редактировать
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsNewTaskFormOpen(true)} className="cursor-pointer hover:text-neutral-400 transition-colors">
                <CirclePlus />
                Добавить задачу
              </DropdownMenuItem>
              <DropdownMenuItem disabled={!canDelete} onClick={() => setIsDeleteOpen(true)} className="cursor-pointer hover:text-neutral-400 transition-colors hover:bg-red-700/15!">
                <Trash2 />
                Удалить колонку
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      </CardHeader>

      <CardContent className={`${isDragging && "opacity-0"} flex flex-col gap-3 flex-1 px-4 max-h-[548px] h-full overflow-y-auto`}>
        <SortableContext items={tasksIds} strategy={verticalListSortingStrategy}>
          {column.tasks.length > 0 ? (
            column.tasks.map(task => <Task key={task.id} task={task} />)
          ) : (
            <div className="text-center text-neutral-600">Здесь пока нет задач</div>
          )}
        </SortableContext>
      </CardContent>

      <Dialog open={isNewTaskFormOpen} onOpenChange={setIsNewTaskFormOpen}>
        <AddNewTask isOpen={isNewTaskFormOpen} onOpenChange={setIsNewTaskFormOpen} columnId={column.id} />
      </Dialog>
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <ConfirmDelete deleteFn={deleteCol} onOpenChange={setIsDeleteOpen} payload={payload} isOpen={isDeleteOpen} title='Вы действительно хотите удалить эту колонку?' />
      </Dialog>
    </Card>
  );
}



