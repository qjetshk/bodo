'use client'
import React from 'react'
import RecentBoards from './RecentBoards'
import HelloPage from './HelloPage'
import { useQuery } from '@apollo/client/react'
import { GET_ALL_USER_BOARDS_FOR_DASHBOARD } from '@/apollo/requests/boards'
import { Loader2 } from 'lucide-react'

const DashBoard = () => {

    const { data, loading } = useQuery(GET_ALL_USER_BOARDS_FOR_DASHBOARD)

    const boards = data?.getAllUserBoards.slice(data?.getAllUserBoards.length - 6)
    const sortedBoards = boards?.sort((a, b) => {
        const dateA = new Date(a.updatedAt)
        const dateB = new Date(b.updatedAt)
        return dateB.getTime() - dateA.getTime()
    })

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-120px)]">
                <Loader2 className="animate-spin size-8" />
            </div>
        )
    } else {
        return data?.getAllUserBoards?.length ? <RecentBoards boards={sortedBoards  ?? []} /> : <HelloPage />
    }

}

export default DashBoard