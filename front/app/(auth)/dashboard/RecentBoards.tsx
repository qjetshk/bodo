'use client'
import { GetAllUserBoardsForDashboardQuery } from '@/apollo/gql/graphql'
import { Label } from '@/components/ui/label'
import React, { useEffect, useMemo, useState } from 'react'
import RecentBoard from './RecentBoard'
import { motion } from 'motion/react'
import { Input } from '@/components/ui/input'

interface Props {
    boards: BoardsData
}

type BoardsData = GetAllUserBoardsForDashboardQuery['getAllUserBoards']

const RecentBoards = ({ boards }: Props) => {
    const [isSearchingBoards, setIsSearchingBoards] = useState(false)
    const [inputQuery, setInputQuery] = useState('')

    const sortedBoards = useMemo(() => {
        const sorted = boards.sort((a, b) => {
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });

        return sorted.slice(0, 6);
    }, [boards]);

    useMemo(() => {
        setIsSearchingBoards(inputQuery.length > 0)
    }, [inputQuery])

    const filteredBoards = useMemo(() => {
        const query = inputQuery.trim().toLocaleLowerCase()
        return boards.filter(b => b.name.toLocaleLowerCase().includes(query) || b.description?.toLocaleLowerCase().includes(query))
    }, [boards, inputQuery])

    return (
        <div className="relative xl:px-[15%] px-[5%] lg:px-[10%] 2xl:px-[20%]"> 
            <Input
                placeholder='Search board'
                className='absolute top-0 sm:top-2 lg:top-5 left-[5%] lg:left-[10%] xl:left-[15%] 2xl:left-[20%] w-[90%] lg:w-[80%] xl:w-[70%] 2xl:w-[60%] z-10'
                onChange={(e) => setInputQuery(e.target.value)}
                value={inputQuery}
            />

            <motion.section
                className='lg:py-22 sm:py-17 py-15 flex flex-col gap-5 relative'
                initial={{ y: 10, opacity: 0, filter: 'blur(10px)' }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.5 }}
            >
                {!isSearchingBoards && <Label className='font-unbounded font-semibold text-2xl pl-3'>Recent Boards</Label>}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 p-1">
                    {isSearchingBoards ? (filteredBoards && filteredBoards.length > 0 ? filteredBoards.map((board, i) => (
                        <motion.div
                            key={board.id}
                            initial={{ y: 5, opacity: 0, filter: 'blur(5px)' }}
                            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                            transition={{ duration: 0.5, delay: i * 0.2 }}
                        >
                            <RecentBoard board={board} />
                        </motion.div>
                    )) : <div className='text-center col-span-full text-neutral-400'>Nothing found</div>) :
                        sortedBoards.map((board, i) => (
                            <motion.div
                                key={board.id}
                                initial={{ y: 5, opacity: 0, filter: 'blur(5px)' }}
                                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                                transition={{ duration: 0.5, delay: i * 0.2 }}
                            >
                                <RecentBoard board={board} />
                            </motion.div>
                        ))
                    }
                </div>
            </motion.section>
        </div>
    )
}

export default RecentBoards
