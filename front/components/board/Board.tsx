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
import React, { useEffect, useState, useMemo, useCallback } from "react";
import Column from "./Column";
import Task from "./Task";
import type { Board, Column as ColumnType, Task as TaskType } from "@/types/board.type";
import { createPortal } from "react-dom";
import { useMutation, useSubscription } from "@apollo/client/react";
import { CHANGE_COLUMNS_ORDER, COLUMN_ORDER_CHANGED, COLUMN_TITLE_CHANGED } from "@/apollo/requests/boards";
import { TASK_DELETED } from "@/apollo/requests/tasks";
import { motion } from 'motion/react';

interface Props {
  board: Board;
  setBoard: React.Dispatch<React.SetStateAction<Board>>;
}

export default function Board({ board, setBoard }: Props) {
  const [allTasks, setAllTasks] = useState<TaskType[]>(board.columns.flatMap(c => c.tasks));
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);


  useEffect(() => {
    setAllTasks(board.columns.flatMap(c => c.tasks));
  }, [board]);

  const [changeOrder] = useMutation(CHANGE_COLUMNS_ORDER);

  // Apollo subscriptions
  useSubscription(COLUMN_TITLE_CHANGED, {
    onData: ({ data, client }) => {
      const updatedColumn = data.data?.columnTitleChanged;
      if (!updatedColumn) return;
      client.cache.modify({
        id: client.cache.identify({ __typename: "Column", id: updatedColumn.id }),
        fields: { title: () => updatedColumn.title }
      });
    }
  });

  useSubscription(COLUMN_ORDER_CHANGED, {
    onData: ({ data }) => {
      const updatedColumns = data.data?.columnOrderChanged.columns;
      if (!updatedColumns) return;
      setBoard(prev => ({
        ...prev,
        columns: prev.columns
          .map(col => ({ ...col, order: updatedColumns.find(c => c.id === col.id)?.order ?? col.order }))
          .sort((a, b) => a.order - b.order)
      }));
    }
  });

  useSubscription(TASK_DELETED, {
    onData: ({ data }) => {
      const tasks = data.data?.taskDeleted.tasks;
      const columnId = data.data?.taskDeleted.columnId;
      if (!tasks || !columnId) return;
      setBoard(prev => ({
        ...prev,
        columns: prev.columns.map(col =>
          col.id === columnId
            ? { ...col, tasks: tasks.map(t => ({ columnId, ...t })) }
            : col
        ) as ColumnType[]
      }));
      setAllTasks(prev => prev.filter(t => t.columnId !== columnId));
    }
  });

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
    if (active.data.current?.type === "Column") {
      const oldIndex = board.columns.findIndex(c => c.id === active.id);
      const newIndex = board.columns.findIndex(c => c.id === over.id);
      if (oldIndex === newIndex) return;
      setBoard(prev => {
        const moved = arrayMove(prev.columns, oldIndex, newIndex);
        const withUpdatedOrder = moved.map((col, idx) => ({ ...col, order: idx }));
        changeOrder({
          variables: {
            boardId: prev.id,
            changeColumnInput: withUpdatedOrder.map(col => ({ id: col.id, order: col.order }))
          }
        });
        return { ...prev, columns: withUpdatedOrder };
      });
    }

    // Task drag
    if (active.data.current?.type === "Task") {
      const activeIdx = allTasks.findIndex(t => t.id === active.id);
      const overColumnId = over.data.current?.type === "Column"
        ? over.id.toString()
        : over.data.current?.task.columnId;
      setAllTasks(tasks => {
        const updatedTasks = [...tasks];
        updatedTasks[activeIdx] = { ...tasks[activeIdx], columnId: overColumnId };
        return updatedTasks;
      });
    }
  };

  // Drag over for tasks (supports empty columns)
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.data.current?.type !== "Task") return;

    const activeIdx = allTasks.findIndex(t => t.id === active.id);

    if (over.data.current?.type === "Task") {
      const overIdx = allTasks.findIndex(t => t.id === over.id);
      setAllTasks(tasks => {
        const updatedTasks = [...tasks];
        if (tasks[activeIdx].columnId !== tasks[overIdx].columnId) {
          updatedTasks[activeIdx] = { ...tasks[activeIdx], columnId: tasks[overIdx].columnId };
        }
        return arrayMove(updatedTasks, activeIdx, overIdx);
      });
    } else if (over.data.current?.type === "Column") {
      const overColumnId = over.id.toString();
      setAllTasks(tasks => {
        const updatedTasks = [...tasks];
        updatedTasks[activeIdx] = { ...tasks[activeIdx], columnId: overColumnId };
        return updatedTasks;
      });
    }
  };

  // Memoized column tasks to avoid unnecessary re-renders
  const getColumnTasks = useCallback(
    (columnId: string) => allTasks.filter(t => t.columnId === columnId),
    [allTasks]
  );

  const columnsIds = board.columns.map(col => col.id);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}

    >
      <div className="flex gap-4 overflow-x-auto p-4 2xl:pb-4! pb-10! max-w-screen">
        <SortableContext items={columnsIds} strategy={horizontalListSortingStrategy}>
          {board.columns.map((col, i) => (
            <motion.div
              key={col.id}
              className="flex-1 min-w-[300px]"
              style={{ maxWidth: `${100 / board.columns.length}%` }}
              initial={{ y: 10, opacity: 0, filter: 'blur(5px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.3, delay: i * 0.2 }}
            >
              <Column column={col} tasks={getColumnTasks(col.id)} />
            </motion.div>
          ))}
        </SortableContext>
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
