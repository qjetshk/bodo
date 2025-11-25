'use client'
import RecentBoards from './RecentBoards'
import HelloPage from './HelloPage'
import { useQuery } from '@apollo/client/react'
import { GET_ALL_USER_BOARDS_FOR_DASHBOARD } from '@/apollo/requests/boards'
import { Loader2 } from 'lucide-react'
import { useMemo } from 'react'

const DashBoard = () => {

    const { data, loading } = useQuery(GET_ALL_USER_BOARDS_FOR_DASHBOARD);

    const sortedBoards = useMemo(() => {
        if (!data?.getAllUserBoards) return [];

        const sorted = [...data.getAllUserBoards].sort((a, b) => {
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });

        return sorted.slice(0, 6);
    }, [data?.getAllUserBoards]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-120px)]">
                <Loader2 className="animate-spin size-8" />
            </div>
        )
    } else {
        return data?.getAllUserBoards?.length ? <RecentBoards boards={sortedBoards} /> : <HelloPage />
    }

}

export default DashBoard