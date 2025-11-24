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
  PointerSensor
} from "@dnd-kit/core";
import { SortableContext, arrayMove, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import Column from "./Column";
import Task from "./Task";
import type { Board, Column as ColumnType, Task as TaskType } from "@/types/board.type";
import { createPortal } from "react-dom";
import { useMutation, useSubscription } from "@apollo/client/react";
import { CHANGE_COLUMNS_ORDER, COLUMN_ORDER_CHANGED, COLUMN_TITLE_CHANGED } from "@/apollo/requests/boards";
import { TASK_CREATED, TASK_DELETED } from "@/apollo/requests/tasks";
import { motion } from 'motion/react';
import { CirclePlus } from "lucide-react";

export default function Board({ board }: { board: Board }) {
  const [allColumns, setAllColumns] = useState<ColumnType[]>(board.columns);
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  useEffect(() => {
    setAllColumns(board.columns)
  }, [board])

  const [changeOrder] = useMutation(CHANGE_COLUMNS_ORDER);


  useSubscription(COLUMN_ORDER_CHANGED, {
    onData: ({ data }) => {
      const updatedColumns = data.data?.columnOrderChanged.columns;
      if (!updatedColumns) return;
      setAllColumns(prev =>
        prev
          .map(col => ({ ...col, order: updatedColumns.find(c => c.id === col.id)?.order ?? col.order }))
          .sort((a, b) => a.order - b.order)
      );
    }
  });

  useSubscription(TASK_DELETED, {
    onData: ({ data }) => {
      const payload = data.data?.taskDeleted;
      if (!payload) return;
      const { columnId, tasks } = payload;
      setAllColumns(prev =>
        prev.map(col =>
          col.id === columnId ? { ...col, tasks: tasks.sort((a, b) => a.order - b.order) } : col
        ) as ColumnType[]
      );
    }
  });

  useSubscription(TASK_CREATED, {
    onData: ({ data }) => {
      const created = data.data?.taskCreated;
      if (!created) return;
      setAllColumns(prev =>
        prev.map(col =>
          col.id === created.columnId
            ? { ...col, tasks: [...col.tasks, created].sort((a, b) => a.order - b.order) }
            : col
        ) as ColumnType[]
      );
    }
  });

  // Sensors
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

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

    const activeColumnId = active.id.toString();
    const overColumnId = over.id.toString();

    if (activeColumnId === overColumnId) return;

    setAllColumns(columns => {
      const activeColumnIdx = columns.findIndex(col => col.id === activeColumnId);
      const overColumnIdx = columns.findIndex(col => col.id === overColumnId);

      const movedColumns = arrayMove(columns, activeColumnIdx, overColumnIdx);

      const updatedColumns = movedColumns.map((col, index) => ({
        ...col,
        order: index
      }));

      changeOrder({
        variables: {
          boardId: board.id,
          changeColumnInput: updatedColumns.map(col => ({ id: col.id, order: col.order }))
        }
      });

      return updatedColumns;
    });
  };


  const handleDragOver = (event: DragOverEvent) => {
    // TODO: поддержка перетаскивания тасок между колонками
  };

  const addNewColumn = () => {
    // TODO: логика создания новой колонки
  };

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
              <Column column={col} />
            </motion.div>
          ))}
        </SortableContext>

        <motion.div
          onClick={addNewColumn}
          style={{ maxWidth: `${100 / allColumns.length}%` }}
          className=" border-3 border-dashed opacity-65 hover:opacity-95 transition-all border-neutral-700 text-neutral-400 cursor-pointer hover:text-neutral-300 bg-neutral-900 rounded-xl max-h-[700px] flex justify-center items-center min-h-50 min-w-[300px]"
          initial={{ opacity: 0, filter: 'blur(5px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.3, delay: allColumns.length * 0.2 }}
        >
          <div className="flex gap-2 items-center">
            <CirclePlus size={20} />
            <span>Новая колонка</span>
          </div>
        </motion.div>
      </div>

      {createPortal(
        <DragOverlay>
          {activeColumn && <Column column={activeColumn} />}
          {activeTask && !activeColumn && <Task task={activeTask} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
