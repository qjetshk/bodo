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
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Column from "./Column";
import Task from "./Task";
import type { Board, ColumnWithoutTasks, Task as TaskType, Column as ColumnType } from "@/types/board.type";
import { CirclePlus } from "lucide-react";
import { motion } from "motion/react";
import { useMutation, useSubscription } from "@apollo/client/react";
import { ADD_NEW_COLUMN, CHANGE_COLUMNS_ORDER, COLUMN_ADDED, COLUMN_DELETED, COLUMN_ORDER_CHANGED } from "@/apollo/requests/columns";
import { CHANGE_TASKS_ORDER_IN_ONE_COLUMN, MOVE_TASK_TO_ANOTHER_COLUMN, TASK_CREATED, TASK_DELETED, TASK_MOVED_TO_ANOTHER_COLUMN, TASKS_ORDER_CHANGED_IN_ONE_COLUMN } from "@/apollo/requests/tasks";
import { createPortal } from "react-dom";
import { updateBoardTimeCache } from "@/utils/update-board-time.util";

export default function Board({ board, isSidebarOpened, isMobile }: { board: Board, isSidebarOpened: boolean, isMobile: boolean }) {
  const [allColumns, setAllColumns] = useState<ColumnWithoutTasks[]>(board.columns);
  const [allTasks, setAllTasks] = useState<TaskType[]>(board.columns.flatMap(c => c.tasks));
  const [activeColumn, setActiveColumn] = useState<ColumnWithoutTasks | null>(null);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const [addingNewColumn, setAddingNewColumn] = useState(false);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const [changeOrder] = useMutation(CHANGE_COLUMNS_ORDER);
  const [addColumn] = useMutation(ADD_NEW_COLUMN);
  const [changeTasksOrderInOneCol] = useMutation(CHANGE_TASKS_ORDER_IN_ONE_COLUMN, {
    onCompleted(data, clientOptions) {
      console.log(data.changeTasksOrderInOneColumn)
    },
    onError(error, clientOptions) {
      console.log(error)
    },
  })
  const [moveTaskToAnotherColumn] = useMutation(MOVE_TASK_TO_ANOTHER_COLUMN, {
    onCompleted(data, clientOptions) {
      console.log(data.moveTaskToAnotherColumn)
    },
  })

  const [isGridActive, setIsGridActive] = useState(false);

  useEffect(() => {
    const checkGrid = () => {
      const isLg = window.matchMedia('(min-width: 1024px)').matches;
      const actuallyGrid = !isLg && (isMobile || isSidebarOpened);
      setIsGridActive(actuallyGrid);
    };

    checkGrid(); // инициализация

    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handler = () => checkGrid();
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [isMobile, isSidebarOpened]);

  // --- Подписки ---


  useSubscription(TASK_CREATED, {
    onData: ({ data, client }) => {
      const created = data.data?.taskCreated;
      if (!created) return;
      setAllTasks(prev => prev.some(t => t.id === created.id) ? prev : [...prev, created as TaskType]);

      updateBoardTimeCache(client, board.id)
    },
  });

  useSubscription(TASK_DELETED, {
    onData: ({ data, client }) => {
      const tasks = data.data?.taskDeleted.tasks
      const columnId = data.data?.taskDeleted.columnId
      console.log(tasks)

      if (!tasks || !columnId) return

      setAllTasks(prev => {
        const newTasks = tasks.map(t => {
          return { ...t, columnId } as TaskType
        })
        const otherTasks = prev.filter(c => c.columnId !== columnId)
        return [...otherTasks, ...newTasks].sort((a, b) => a.order - b.order)
      })

      updateBoardTimeCache(client, board.id)

    }
  })

  useSubscription(TASKS_ORDER_CHANGED_IN_ONE_COLUMN, {
    onData: ({ data, client }) => {
      const tasks = data.data?.tasksOrderChangedInOneColumn.tasks
      const columnId = data.data?.tasksOrderChangedInOneColumn.columnId
      console.log(tasks)

      if (!tasks || !columnId) return

      setAllTasks(prev => {
        const tasksInColumn = prev.filter(task => task.columnId === columnId);
        const otherTasks = prev.filter(task => task.columnId !== columnId);

        const updatedOrders = new Map<string, number>();
        tasks.forEach(({ id, order }) => {
          updatedOrders.set(id, order);
        });

        const updatedTasksInColumn = tasksInColumn.map(task => {
          const newOrder = updatedOrders.get(task.id);
          return newOrder !== undefined ? { ...task, order: newOrder } : task;
        });

        updatedTasksInColumn.sort((a, b) => a.order - b.order);

        console.log([...otherTasks, ...updatedTasksInColumn])
        return [...otherTasks, ...updatedTasksInColumn];
      });

      updateBoardTimeCache(client, board.id)
    }
  })

  useSubscription(TASK_MOVED_TO_ANOTHER_COLUMN, {
    onData: ({ data, client }) => {
      const prevColumn = data.data?.taskMovedToAnotherColumn.prevColumn;
      const currentColumn = data.data?.taskMovedToAnotherColumn.currentColumn;
      console.log(prevColumn)
      console.log(currentColumn)

      if (!prevColumn || !currentColumn) return;

      setAllTasks(prev => {
        // Создаём мапу задач по id для быстрого поиска
        const taskMap = new Map<string, TaskType>(prev.map(task => [task.id, { ...task }]));

        // Обновляем задачи, которые ушли из prevColumn (теперь они в другой колонке или ушли)
        if (prevColumn.columnId) {
          for (const taskUpdate of prevColumn.tasks) {
            const existingTask = taskMap.get(taskUpdate.id);
            if (existingTask) {
              // Обновляем columnId и order
              existingTask.columnId = prevColumn.columnId;
              existingTask.order = taskUpdate.order;
            }
          }
        }

        // Обновляем задачи, которые пришли в currentColumn
        for (const taskUpdate of currentColumn.tasks) {
          const existingTask = taskMap.get(taskUpdate.id);
          if (existingTask) {
            existingTask.columnId = currentColumn.columnId;
            existingTask.order = taskUpdate.order;
          }
        }

        // Возвращаем обновлённый массив
        return Array.from(taskMap.values());
      });

      updateBoardTimeCache(client, board.id);
    }
  });

  useSubscription(COLUMN_ADDED, {
    onData: ({ data, client }) => {
      const added = data.data?.columnAdded;
      if (!added) return;
      setAllColumns(prev => [...prev, added as ColumnType].sort((a, b) => a.order - b.order));
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

  // --- Drag & Drop ---
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

    //
    // ======================================================
    //               ПЕРЕМЕЩЕНИЕ КОЛОНОК
    // ======================================================
    //
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

        // --- ТВОЯ ИСХОДНАЯ МУТАЦИЯ ---
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

    //
    // ======================================================
    //               ПЕРЕМЕЩЕНИЕ ТАСКОВ
    // ======================================================
    //
    if (active.data.current?.type === "Task") {
      const activeTask = active.data.current.task;
      if (!activeTask) return;

      const overTask = over.data.current?.task ?? null;
      const overColumnId = over.data.current?.columnId ?? over.id;
      const prevColumnId = activeTask.columnId;
      console.log(prevColumnId)
      console.log(overColumnId)

      setAllTasks(prev => {
        const tasks = [...prev];
        const oldIndex = tasks.findIndex(t => t.id === activeTask.id);
        if (oldIndex === -1) return prev;

        //
        // -------- ПЕРЕМЕЩЕНИЕ НА ДРУГОЙ ТАСК --------
        //
        if (overTask) {
          const newIndex = tasks.findIndex(t => t.id === overTask.id);
          if (newIndex === -1) return prev;

          const task = tasks[oldIndex];

          // сохраняем колонки ДО изменений
          const prevColumnId = task.columnId;
          const newColumnId = tasks[newIndex].columnId;

          const isMovingToAnotherColumn = prevColumnId !== newColumnId;

          // 1) Делаем копию массива, чтобы потом arrayMove работал правильно
          const tempTasks = [...tasks];

          // 2) Если колонка меняется — сначала только меняем columnId
          if (isMovingToAnotherColumn) {
            tempTasks[oldIndex] = { ...task, columnId: newColumnId };
          }

          // 3) Выполняем перемещение
          const newTasks = arrayMove(tempTasks, oldIndex, newIndex);

          // 4) Теперь спокойно считаем prev + current
          const prevTasks = newTasks
            .filter(t => t.columnId === prevColumnId)
            .map((t, i) => ({ ...t, order: i }));

          const curTasks = newTasks
            .filter(t => t.columnId === newColumnId)
            .map((t, i) => ({ ...t, order: i }));

          console.log("prevTasks:", prevTasks);
          console.log("curTasks:", curTasks);
          // --- ТВОЯ ИСХОДНАЯ МУТАЦИЯ ---
          changeTasksOrderInOneCol({
            variables: {
              // основная колонка (куда переместили)
              columnId: newColumnId,
              newTasks: curTasks.map(({ id, order }) => ({ id, order })),

              // вторичная колонка (откуда забрали)
              /* sourceColumnId: isColumnChanged ? sourceColumnId : null,
              sourceTasks: sourceTasks
                ? sourceTasks.map(({ id, order }) => ({ id, order }))
                : null,

              movedTaskId: activeTask.id */
            }
          });

          return newTasks;
        }

        //
        // -------- ПЕРЕМЕЩЕНИЕ НА ПУСТУЮ КОЛОНКУ --------
        //
        if (prevColumnId !== overColumnId) {

          // меняем колонку у таски
          tasks[oldIndex] = { ...tasks[oldIndex], columnId: overColumnId };

          // таски в старой колонке
          const newOtherColTasks = tasks
            .filter(t => t.columnId === prevColumnId)
            .map((t, i) => ({ ...t, order: i }));

          // таски в новой колонке (таска уже перемещена)
          const newColTasks = tasks
            .filter(t => t.columnId === overColumnId)
            .map((t, i) => ({ ...t, order: i }));

          // определяем newIndex корректно: это order перемещённой таски в новой колонке
          const movedTaskOrder = newColTasks.find(t => t.id === activeTask.id)!.order;

          // вызываем мутацию
          /*           moveTaskToAnotherColumn({
                      variables: {
                        movedTaskId: activeTask.id,
                        prevColumnId,
                        curColumnId: overColumnId,
                        newIndex: movedTaskOrder
                      }
                    }); */

          return [...tasks];
        }

        return prev;
      });
    }

  }, [board.id, changeOrder, changeTasksOrderInOneCol, moveTaskToAnotherColumn]);


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
    addColumn({ variables: { columnInput: { boardId: board.id, title: `Новая колонка ${allColumns.length + 1}` } } });
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
              <Column boardId={board.id} column={col} tasks={tasksByColumn.get(col.id) ?? []} canDelete={allColumns.length > 2} />
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
              <span>Новая колонка</span>
            </div>
          </motion.div>
        )}
      </div>

      {createPortal(
        <DragOverlay>
          {activeColumn && <Column boardId={board.id} column={activeColumn} tasks={allTasks.filter(t => t.columnId === activeColumn.id)} canDelete={allColumns.length > 2} />}
          {activeTask && !activeColumn && <Task task={activeTask} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
