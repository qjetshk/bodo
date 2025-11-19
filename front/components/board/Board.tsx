"use client";

import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import Column from "./Column";

import { GetInitialBoardQuery } from "@/apollo/gql/graphql";

interface Props {
  initialBoard: GetInitialBoardQuery["getBoardById"];
}

export default function Board({ initialBoard }: Props) {
  const [board, setBoard] = useState(initialBoard);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor)
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    //
    // --- ПЕРЕТАСКИВАНИЕ КОЛОНОК ---
    //
    if (active.data.current?.type === "COLUMN") {
      const oldIndex = board.columns.findIndex((col) => col.id === active.id);
      const newIndex = board.columns.findIndex((col) => col.id === over.id);

      if (oldIndex !== newIndex) {
        setBoard((prev) => ({
          ...prev,
          columns: arrayMove(prev.columns, oldIndex, newIndex),
        }));
      }
      return;
    }

    //
    // --- ПЕРЕТАСКИВАНИЕ ЗАДАЧ ---
    //
    if (active.data.current?.type === "TASK") {
      const activeTaskId = active.id;
      const overTaskId = over.id;

      const sourceCol = board.columns.find((col) =>
        col.tasks.some((task) => task.id === activeTaskId)
      );
      const targetCol = board.columns.find((col) =>
        col.tasks.some((task) => task.id === overTaskId)
      );

      if (!sourceCol || !targetCol) return;

      const sourceTasks = [...sourceCol.tasks];
      const targetTasks = [...targetCol.tasks];

      const oldIndex = sourceTasks.findIndex((t) => t.id === activeTaskId);
      const newIndex = targetTasks.findIndex((t) => t.id === overTaskId);

      const activeTaskObj = sourceTasks[oldIndex];

      // Перемещение между колонками
      if (sourceCol.id !== targetCol.id) {
        sourceTasks.splice(oldIndex, 1);
        targetTasks.splice(newIndex, 0, activeTaskObj);
      } else {
        // Перемещение внутри одной колонки
        const reordered = arrayMove(sourceTasks, oldIndex, newIndex);
        sourceTasks.length = 0;
        sourceTasks.push(...reordered);
      }

      // Обновляем board
      setBoard((prev) => ({
        ...prev,
        columns: prev.columns.map((col) => {
          if (col.id === sourceCol.id) {
            return { ...col, tasks: sourceTasks };
          }
          if (col.id === targetCol.id) {
            return { ...col, tasks: targetTasks };
          }
          return col;
        }),
      }));
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      {/* dnd-kit требует список ID колонок */}
      <SortableContext items={board.columns.map((c) => c.id)}>
        <div className="flex gap-4 overflow-x-auto p-4">
          {board.columns.map((column) => (
            <Column tasks={column.tasks} key={column.id} column={column} />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>{/* Task preview */}</DragOverlay>
    </DndContext>
  );
}
