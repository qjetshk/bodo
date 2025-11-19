import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableTask({ id, task }) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id,
      data: { type: "TASK" },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="rounded-md border p-3 bg-secondary cursor-grab"
    >
      {task.title}
    </div>
  );
}
