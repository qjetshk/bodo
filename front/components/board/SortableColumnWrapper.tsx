import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableColumnWrapper({ id, children }) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id,
      data: { type: "COLUMN" },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}
