"use client";

import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  closestCorners
} from "@dnd-kit/core";
import { SortableContext, arrayMove, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import React, { useState, useCallback } from "react";
import Column from "./Column";
import Task from "./Task";
import type { Board, ColumnWithoutTasks, Task as TaskType } from "@/types/board.type";
import { createPortal } from "react-dom";
import { useMutation, useSubscription } from "@apollo/client/react";
import { CHANGE_COLUMNS_ORDER, COLUMN_ORDER_CHANGED, COLUMN_TITLE_CHANGED, GET_INITIAL_BOARD } from "@/apollo/requests/boards";
import { TASK_CREATED, TASK_DELETED } from "@/apollo/requests/tasks";
import { motion } from 'motion/react';
import { CirclePlus } from "lucide-react";


export default function Board({ board }: { board: Board }) {


  const [allTasks, setAllTasks] = useState<TaskType[]>(board.columns.flatMap(c => c.tasks));
  const [allColumns, setAllColumns] = useState<ColumnWithoutTasks[]>(board.columns.map(({ tasks, ...rest }) => rest))
  const [activeColumn, setActiveColumn] = useState<ColumnWithoutTasks | null>(null);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  const [changeOrder] = useMutation(CHANGE_COLUMNS_ORDER);

  // Apollo subscriptions
  useSubscription(COLUMN_TITLE_CHANGED, {
    onData: ({ data, client }) => {
      const updatedColumn = data.data?.columnTitleChanged;
      if (!updatedColumn) return;
      setAllColumns(cols => {
        const currentColumn = cols.find(c => c.id === updatedColumn.id)
        const changedColumn = { ...currentColumn, title: updatedColumn.title } as ColumnWithoutTasks
        return [...cols, changedColumn]
      })
    }
  });

  useSubscription(COLUMN_ORDER_CHANGED, {
    onData: ({ data }) => {
      const updatedColumns = data.data?.columnOrderChanged.columns;
      if (!updatedColumns) return;
      setAllColumns(prev => {
        return prev.map(col => ({ ...col, order: updatedColumns.find(c => c.id === col.id)?.order ?? col.order }))
          .sort((a, b) => a.order - b.order)
      });
    }
  });

  useSubscription(TASK_DELETED, {
    onData: ({ data }) => {
      const tasks = data.data?.taskDeleted.tasks;
      const columnId = data.data?.taskDeleted.columnId;

      if (!tasks || !columnId) return;

      setAllTasks(prev => {
        const withoutColumnTasks = prev.filter(t => t.columnId !== columnId);

        return [...withoutColumnTasks, ...tasks] as TaskType[];
      });
    }
  });


  useSubscription(TASK_CREATED, {
    onData: ({ data }) => {
      const createdTask = data.data?.taskCreated
      if (!createdTask) return

      setAllTasks(prev => {
        const newTasks = [...prev];
        newTasks.push({
          id: createdTask.id,
          title: createdTask.title,
          description: createdTask.description ?? '',
          order: createdTask.order,
          columnId: createdTask.columnId,
          updatedAt: createdTask.updatedAt
        });

        return newTasks.sort((a, b) => a.order - b.order);
      });

    }
  })

  // Sensors
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  // Drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === "Column") setActiveColumn(active.data.current.column);
    if (active.data.current?.type === "Task") setActiveTask(active.data.current.task);
  };

  // Drag end
  const handleDragEnd = (event: DragEndEvent) => {

    const { active, over } = event;
    setActiveColumn(null);
    setActiveTask(null);
    if (!over) return;

    // Column drag

    // Task drag

  };

  // Drag over for tasks (supports empty columns)
  const handleDragOver = (event: DragOverEvent) => {

  };

  const addNewColumn = () => {
    
  }

  // Memoized column tasks to avoid unnecessary re-renders
  const getColumnTasks = useCallback(
    (columnId: string) => allTasks.filter(t => t.columnId === columnId),
    [allTasks]
  );

  const columnsIds = allColumns.map(col => col.id);


  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}

    >
      <div className="flex gap-4 overflow-x-auto p-4 2xl:pb-4! pb-10! max-w-screen">
        <SortableContext items={columnsIds} strategy={horizontalListSortingStrategy}>
          {allColumns.map((col, i) => (
            <motion.div
              key={col.id}
              className="flex-1 min-w-[300px]"
              style={{ maxWidth: `${100 / allColumns.length}%` }}
              initial={{ y: 10, opacity: 0, filter: 'blur(5px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.3, delay: i * 0.2 }}
            >
              <Column column={col} tasks={getColumnTasks(col.id)} />
            </motion.div>
          ))}
        </SortableContext>
        <div onClick={addNewColumn} className="dark border-3 border-dashed opacity-65 hover:opacity-95 transition-all border-neutral-700 text-neutral-400 cursor-pointer hover:text-neutral-300 bg-neutral-900 rounded-xl max-h-[700px] flex justify-center items-center min-h-50 min-w-[300px]">
          <div className="flex gap-3">
            <CirclePlus/>
            <span>Новая колонка</span>
          </div>  
        </div>
      </div>

      {createPortal(
        <DragOverlay>
          {activeColumn && <Column column={activeColumn} tasks={getColumnTasks(activeColumn.id)} />}
          {activeTask && !activeColumn && <Task task={activeTask} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}



