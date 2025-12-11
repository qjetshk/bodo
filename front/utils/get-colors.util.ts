import { Priority } from "@/data/priorities.data";
import { Task } from "@/types/board.type";

export const getPriorityColor = (priorities: Priority[], task: Task) =>
    priorities.find(p => p.priority === task.priority)?.secondaryColor ?? ''

export const getDateColor = (deadlineDate: Date) => {
    const now = new Date().getTime();
    const deadline = new Date(deadlineDate).getTime();

    const msInDay = 24 * 60 * 60 * 1000;
    const diff = deadline - now;
    if (diff <= 0) {
        // Дедлайн прошёл
        return 'text-red-600';
    } else if (diff <= msInDay) {
        // Меньше 24 часов
        return 'text-red-400';
    } else if (diff <= 3 * msInDay) {
        // 1-3 дня
        return 'text-yellow-400';
    } else {
        // Больше 3 дней
        return 'text-green-400';
    }
};