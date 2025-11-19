'use client'
import { GetAllUserBoardsForDashboardQuery } from '@/apollo/gql/graphql'
import { Label } from '@/components/ui/label'
import React from 'react'
import RecentBoard from './RecentBoard'
import { motion } from 'motion/react'

interface Props {
    boards: BoardsData
}

type BoardsData = GetAllUserBoardsForDashboardQuery['getAllUserBoards']

const RecentBoards = ({ boards }: Props) => {

    return (
        <motion.section
            className='lg:py-20 sm:py-10 py-5 xl:px-[15%] px-[5%] lg:px-[10%] 2xl:px-[20%] flex flex-col gap-5'
            initial={{ y: 10, opacity: 0, filter: 'blur(10px)' }}
            animate={{ y: 0, opacity: 10, filter: 'blur(0px)' }}
            transition={{ duration: 0.5 }}
        >
            <Label className='font-unbounded font-semibold text-2xl pl-3'>Недавние доски</Label>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 p-1">
                {boards.map((board, i) => (
                    <motion.div key={board.id}
                        initial={{ y: 5, opacity: 0, filter: 'blur(5x)' }}
                        animate={{ y: 0, opacity: 10, filter: 'blur(0px)' }}
                        transition={{ duration: 0.5, delay: i * 0.2 }}
                    >
                        <RecentBoard board={board} />
                    </motion.div>
                ))}
            </div>
        </motion.section>
    )
}

export default RecentBoards
