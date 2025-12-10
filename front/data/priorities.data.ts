import { Priorities } from "@/apollo/gql/graphql"

export type Priority = {
    title: string
    priority: Priorities
    primaryColor: string
    secondaryColor: string
    isChecked: boolean
    order: number
}

export const PRIORITIES: Priority[] = [
    {
        title: 'Высокий',
        priority: Priorities.High,
        primaryColor: 'bg-red-600!',
        isChecked: true,
        order: 0,
        secondaryColor: 'bg-red-400'
    },
    {
        title: 'Средний',
        priority: Priorities.Medium,
        primaryColor: 'bg-orange-600!',
        isChecked: false,
        order: 1,
        secondaryColor: 'bg-orange-500'
    },
    {
        title: 'Низкий',
        priority: Priorities.Low,
        primaryColor: 'bg-green-600!',
        isChecked: false,
        order: 2,
        secondaryColor: 'bg-green-400'
    },
]