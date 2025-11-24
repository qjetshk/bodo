"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { Column as ColumnType, ColumnWithoutTasks, Task as TaskType } from "@/types/board.type";
import { CirclePlus, PencilLine } from "lucide-react";
import { Input } from "../ui/input";
import { useMutation, useSubscription } from "@apollo/client/react";
import { CHANGE_COLUMN_TITLE } from "@/apollo/requests/boards";
import Task from "./Task";
import { Dialog } from "@radix-ui/react-dialog";
import AddNewTask from "./AddNewTask";

interface Props {
  column: ColumnWithoutTasks;
  tasks: TaskType[]
}

export default function Column({ column, tasks }: Props) {

  const tasksIds = useMemo(() => {
    return tasks.map(t => t.id)
  }, [tasks])

  const [isEditing, setIsEditing] = useState(false);
  const [isNewTaskFormOpen, setIsNewTaskFormOpen] = useState(false)

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: isEditing,
  });


  const [title, setTitle] = useState(column.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const [changeColumnTitle] = useMutation(CHANGE_COLUMN_TITLE, {
    variables: {
      columnId: column.id,
      newTitle: title
    }
  })


  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (title.trim() === "") setTitle(column.title);
      if (title === column.title) {
        console.log('sdfsd')
        setIsEditing(false);
      }
      setIsEditing(false);
      changeColumnTitle()
    }
    if (e.key === "Escape") {
      setTitle(column.title);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    if (title.trim() === "") setTitle(column.title);
    setIsEditing(false);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    border: isDragging  ? "dashed 3px var(--color-neutral-700)" : "",
    backgroundColor: isDragging  ? "var(--color-neutral-900)" : "",
  };


  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="dark bg-neutral-950 max-h-[700px] flex flex-col pt-0 border-neutral-800 pb-4 min-h-50"
    >
      <CardHeader
        className={`
          pt-4 pb-4 flex select-none
          cursor-grab transition-colors 
          rounded-t-lg hover:bg-neutral-900/60 text-neutral-950 hover:text-neutral-600 relative ${isDragging && 'opacity-0'}
        `}
      >
        <div {...attributes} {...listeners} className="w-full cursor-grab">
          {!isEditing ? (
            <CardTitle className="truncate max-w-[calc(100%-62px)] text-white h-5">{title}</CardTitle>
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

        {(!isEditing) && (
          <div className="flex gap-2 absolute top-3.5 right-3.5 items-center">
            <PencilLine
              strokeWidth={2}
              size={20}
              className="cursor-pointer hover:text-neutral-400 transition-colors"
              onClick={(e) => {
                if (e.button !== 0) return;
                setIsEditing(true);
              }}
            />
            <CirclePlus onClick={() => setIsNewTaskFormOpen(true)} className="cursor-pointer hover:text-neutral-400 transition-colors" />
          </div>

        )}

      </CardHeader>
        <CardContent className={`${isDragging && 'opacity-0'} flex flex-col gap-3 flex-1 px-4 max-h-[548px] h-full overflow-y-auto`}>
          <SortableContext items={tasksIds} >
            {tasks.length > 0 ? (
              tasks.map(task => <Task key={task.id} task={task} />)
            ) : (
              <div className="text-center text-neutral-600">
                Здесь пока нет задач
              </div>
            )}
          </SortableContext>
          
        </CardContent>

      <Dialog open={isNewTaskFormOpen} onOpenChange={setIsNewTaskFormOpen}>
        <AddNewTask isOpen={isNewTaskFormOpen} onOpenChange={setIsNewTaskFormOpen} columnId={column.id} />
      </Dialog>
    </Card>
  );
}
