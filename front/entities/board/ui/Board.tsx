"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
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
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Column from "../../column/ui/Column";
import Task from "../../task/ui/Task";
import type { Board, ColumnWithoutTasks, Task as TaskType, Column as ColumnType } from "@/entities/board/model/board.type";
import { CirclePlus } from "lucide-react";
import { motion } from "motion/react";
import { useMutation, useSubscription } from "@apollo/client/react";
import { ADD_NEW_COLUMN, CHANGE_COLUMNS_ORDER, COLUMN_ADDED, COLUMN_DELETED, COLUMN_ORDER_CHANGED } from "@/apollo/requests/columns";
import { CHANGE_TASKS_ORDER, TASK_CREATED, TASK_DELETED, TASK_EDITED, TASKS_ORDER_CHANGED_IN_ONE_COLUMN } from "@/apollo/requests/tasks";
import { createPortal } from "react-dom";
import { updateBoardTimeCache } from "@/shared/lib/update-board-time.util";

export default function Board({ board, isSidebarOpened, isMobile }: { board: Board, isSidebarOpened: boolean, isMobile: boolean }) {
  const [allColumns, setAllColumns] = useState<ColumnWithoutTasks[]>(board.columns);
  const [allTasks, setAllTasks] = useState<TaskType[]>(board.columns.flatMap(c => c.tasks));
  const [activeColumn, setActiveColumn] = useState<ColumnWithoutTasks | null>(null);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const [addingNewColumn, setAddingNewColumn] = useState(false);

  const membersWithOwner = [board.owner, ...board.members.map(m => m.user)]

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const [changeOrder] = useMutation(CHANGE_COLUMNS_ORDER);
  const [addColumn] = useMutation(ADD_NEW_COLUMN);
  const [changeTasksOrder] = useMutation(CHANGE_TASKS_ORDER)

  const [isGridActive, setIsGridActive] = useState(false);

  useEffect(() => {
    const checkGrid = () => {
      const isLg = window.matchMedia('(min-width: 1024px)').matches;
      const actuallyGrid = !isLg && (isMobile || isSidebarOpened);
      setIsGridActive(actuallyGrid);
    };

    checkGrid();

    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handler = () => checkGrid();
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [isMobile, isSidebarOpened]);


  useSubscription(TASK_CREATED, {
    onData: ({ data, client }) => {
      const created = data.data?.taskCreated;
      if (!created) return;
      setAllTasks(prev => prev.some(t => t.id === created.id) ? prev : [...prev, created as TaskType]);

      updateBoardTimeCache(client, board.id)
    },
  });

  useSubscription(TASK_EDITED, {
    onData: ({ data, client }) => {
      const edited = data.data?.taskEdited;

      if (!edited) return;
      setAllTasks(prev => {
        const tasksinColumn = prev.filter(t => t.columnId === edited.columnId && t.id !== edited.id).sort((a, b) => a.order - b.order)
        const otherTasks = prev.filter(t => t.columnId !== edited.columnId)

        return [...tasksinColumn, ...otherTasks, edited as TaskType].sort((a, b) => a.order - b.order)
      })

      updateBoardTimeCache(client, board.id)
    }
  })

  useSubscription(TASK_DELETED, {
    onData: ({ data, client }) => {
      const deletedTask = data.data?.taskDeleted;
      if (!deletedTask) return;

      const { taskId, columnId } = deletedTask;

      setAllTasks(prev => {
        const columnTasks = prev.filter(t => t.columnId === columnId && t.id !== taskId);
        const otherTasks = prev.filter(t => t.columnId !== columnId);

        const reorderedTasks = columnTasks
          .sort((a, b) => a.order - b.order)
          .map((t, index) => ({ ...t, order: index }));

        return [...otherTasks, ...reorderedTasks];
      });

      updateBoardTimeCache(client, board.id);
    }
  });


  useSubscription(TASKS_ORDER_CHANGED_IN_ONE_COLUMN, {
    onData: ({ data, client }) => {
      const result = data.data?.tasksOrderChangedInOneColumn;
      if (!result) return;

      const updatedTasksFromServer = result.tasks;

      setAllTasks(prev => {
        const updates = new Map(
          updatedTasksFromServer.map(t => [t.id, t])
        );

        // Обновляем только изменённые таски
        const updated = prev.map(task => {
          const update = updates.get(task.id);
          if (!update) return task;

          return {
            ...task,
            order: update.order,
            columnId: update.columnId
          };
        });

        // Сортируем внутри каждой колонки отдельно
        const sorted = [...updated].sort((a, b) => {
          if (a.columnId !== b.columnId) return 0;
          return a.order - b.order;
        });

        return sorted as TaskType[];
      });

      updateBoardTimeCache(client, board.id);
    }
  });

  useSubscription(COLUMN_ADDED, {
    onData: ({ data, client }) => {
      const added = data.data?.columnAdded;
      if (!added) return;
      setAllColumns(prev => [...prev, added as ColumnWithoutTasks].sort((a, b) => a.order - b.order));
      setAddingNewColumn(true);

      updateBoardTimeCache(client, board.id)
    },
  });

  useSubscription(COLUMN_DELETED, {
    onData: ({ data, client }) => {
      const updated = data.data?.columnDeleted?.columns;
      if (!updated) return;
      const orderMap = new Map(updated.map((c) => [c.id, c.order]));
      setAllColumns(prev =>
        prev.filter(c => orderMap.has(c.id)).map(c => ({ ...c, order: orderMap.get(c.id)! })).sort((a, b) => a.order - b.order)
      );

      updateBoardTimeCache(client, board.id)
    },
  });

  useSubscription(COLUMN_ORDER_CHANGED, {
    onData: ({ data, client }) => {
      const updated = data.data?.columnOrderChanged?.columns;
      if (!updated) return;
      setAllColumns(prev =>
        prev
          .map(c => ({ ...c, order: updated.find(u => u.id === c.id)?.order ?? c.order }))
          .sort((a, b) => a.order - b.order)
      );

      updateBoardTimeCache(client, board.id)
    },
  });

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const type = event.active.data.current?.type;
    if (type === "Column") setActiveColumn(event.active.data.current?.column);
    if (type === "Task") setActiveTask(event.active.data.current?.task);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    setActiveColumn(null);
    setActiveTask(null);
    if (!over) return;

    //               ПЕРЕМЕЩЕНИЕ КОЛОНОК
    if (active.data.current?.type === "Column") {
      const activeId = active.id.toString();
      const overId = over.id.toString();
      if (activeId === overId) return;

      setAllColumns(cols => {
        const oldIndex = cols.findIndex(c => c.id === activeId);
        const newIndex = cols.findIndex(c => c.id === overId);
        if (oldIndex === -1 || newIndex === -1) return cols;

        const moved = arrayMove(cols, oldIndex, newIndex)
          .map((c, i) => ({ ...c, order: i }));

        changeOrder({
          variables: {
            boardId: board.id,
            changeColumnInput: moved.map(c => ({ id: c.id, order: c.order }))
          }
        });

        return moved;
      });

      return;
    }

    //               ПЕРЕМЕЩЕНИЕ ТАСКОВ
    if (active.data.current?.type === "Task") {
      const activeTask = active.data.current.task;
      if (!activeTask) return;

      const overTask = over.data.current?.task ?? null;
      const overColumnId = over.data.current?.columnId ?? over.id;
      const prevColumnId = activeTask.columnId;

      setAllTasks(prev => {
        const tasks = [...prev];
        const oldIndex = tasks.findIndex(t => t.id === activeTask.id);
        if (oldIndex === -1) return prev;

        // -------- ПЕРЕМЕЩЕНИЕ НА ДРУГОЙ ТАСК --------
        if (overTask) {
          const newIndex = tasks.findIndex(t => t.id === overTask.id);
          if (newIndex === -1) return prev;

          const newColumnId = tasks[newIndex].columnId;

          const tempTasks = [...tasks];

          const newTasks = arrayMove(tempTasks, oldIndex, newIndex);

          const curTasks = newTasks
            .filter(t => t.columnId === newColumnId)
            .map((t, i) => ({ ...t, order: i }));

          changeTasksOrder({
            variables: {
              columnId: newColumnId,
              newTasks: curTasks.map(({ id, order, columnId }) => ({ id, order, columnId })),

            }
          });

          return newTasks;
        }
        if (prevColumnId !== overColumnId) {
          tasks[oldIndex] = { ...tasks[oldIndex], columnId: overColumnId };

          return [...tasks];
        }
        return prev;
      });
    }
  }, [board.id, changeOrder, changeTasksOrder]);


  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.data.current?.type !== "Task") return;

    const activeTask = active.data.current.task;
    if (!activeTask) return;

    const overTask = over.data.current?.task ?? null;
    const overColumnId = over.data.current?.columnId ?? over.id;

    setAllTasks(prev => {
      const tasks = [...prev];
      const oldIndex = tasks.findIndex(t => t.id === activeTask.id);
      if (oldIndex === -1) return prev;

      // --- ПЕРЕТАСКИВАНИЕ НА ДРУГОЙ ТАСК ---
      if (overTask) {
        const newIndex = tasks.findIndex(t => t.id === overTask.id);
        if (newIndex === -1 || oldIndex === newIndex) return prev;

        // временно меняем columnId (VISUAL ONLY)
        if (tasks[oldIndex].columnId !== tasks[newIndex].columnId) {
          tasks[oldIndex] = { ...tasks[oldIndex], columnId: tasks[newIndex].columnId };
        }

        // визуальный move
        return arrayMove(tasks, oldIndex, newIndex);
      }

      // --- ПЕРЕМЕЩЕНИЕ НА ПУСТУЮ КОЛОНКУ ---
      if (tasks[oldIndex].columnId !== overColumnId) {
        // временно подменяем колонку (VISUAL ONLY)
        tasks[oldIndex] = { ...tasks[oldIndex], columnId: overColumnId };
      }

      return tasks;
    });

  }, []);


  const addNewColumn = useCallback(() => {
    addColumn({ variables: { columnInput: { boardId: board.id, title: `New Column ${allColumns.length + 1}` } } });
  }, [addColumn, allColumns.length, board.id]);

  const columnIds = useMemo(() => allColumns.map(c => c.id), [allColumns]);

  const tasksByColumn = useMemo(() => {
    const map = new Map<string, TaskType[]>();
    allColumns.forEach(col => {
      map.set(col.id, allTasks.filter(t => t.columnId === col.id));
    });
    return map;
  }, [allColumns, allTasks]);

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
      <div className={`${isSidebarOpened && !isMobile ? 'grid' : 'flex'} ${isMobile && 'grid'} lg:flex gap-4 overflow-x-auto p-4 pb-10 max-w-screen`}>
        <SortableContext items={columnIds} strategy={isGridActive ? verticalListSortingStrategy : horizontalListSortingStrategy}>
          {allColumns.map((col, i) => (
            <motion.div key={col.id} className={` ${isSidebarOpened && !isMobile ? 'max-w-none!' : 'flex-1'} ${isMobile ? '' : 'min-w-[300px]'} w-full  max-w-none!`} style={{ maxWidth: `${100 / allColumns.length}%` }}
              initial={{ y: 10, opacity: 0, filter: "blur(5px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.3, delay: i * 0.15 }}
            >
              <Column isPrivate={board.boardType} membersWithOwner={membersWithOwner} boardId={board.id} column={col} tasks={tasksByColumn.get(col.id) ?? []} canDelete={allColumns.length > 2} />
            </motion.div>
          ))}
        </SortableContext>

        {allColumns.length < 10 && (
          <motion.div onClick={addNewColumn} style={{ maxWidth: `${100 / allColumns.length}%` }}
            className="border-3 border-dashed max-w-none! opacity-65 hover:opacity-95 transition-all border-neutral-700 text-neutral-400 cursor-pointer hover:text-neutral-300 bg-neutral-900 rounded-xl max-h-[700px] flex justify-center items-center min-h-50 min-w-[300px]"
            initial={{ opacity: 0, filter: "blur(5px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.3, delay: addingNewColumn ? allColumns.length * 0.15 : 0 }}
          >
            <div className="flex gap-2 items-center">
              <CirclePlus size={20} />
              <span>New Column</span>
            </div>
          </motion.div>
        )}
      </div>

      {createPortal(
        <DragOverlay>
          {activeColumn && <Column isOverlay isPrivate={board.boardType} membersWithOwner={membersWithOwner} boardId={board.id} column={activeColumn} tasks={allTasks.filter(t => t.columnId === activeColumn.id)} canDelete={allColumns.length > 2} />}
          {activeTask && !activeColumn && <Task isPrivate={board.boardType} membersWithOwner={membersWithOwner} task={activeTask} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
