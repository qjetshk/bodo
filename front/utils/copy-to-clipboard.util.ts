import { toast } from "sonner";

export function copyToClipboard<T>(event: React.MouseEvent<T>, text: string) {
  event.preventDefault();
  navigator.clipboard.writeText(text);
  toast.success("Скопировано в буфер обмена!", { duration: 1000 });
}
