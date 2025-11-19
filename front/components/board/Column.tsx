"use client";

import { SortableContext } from "@dnd-kit/sortable";
import SortableColumnWrapper from "./SortableColumnWrapper";
import SortableTask from "./SortableTask";
import { GetInitialBoardQuery } from "@/apollo/gql/graphql";

interface Props {
    column: Column
    tasks: Column['tasks']
}

type Column = InitialBoard['columns'][number]
type InitialBoard = GetInitialBoardQuery['getBoardById']

export default function Column({ column, tasks }: Props) {
  return (
    <SortableColumnWrapper id={column.id}>
      <div className="bg-card p-4 rounded-xl w-80 shrink-0">
        <h2 className="font-bold mb-3">{column.title}</h2>

        <SortableContext items={column.tasks}>
          <div className="flex flex-col gap-2">
            {tasks.map((task) => (
              <SortableTask key={task.id} id={task.id} task={tasks[task.id]} />
            ))}
          </div>
        </SortableContext>
      </div>
    </SortableColumnWrapper>
  );
}
