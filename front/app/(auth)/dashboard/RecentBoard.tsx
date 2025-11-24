import { GetAllUserBoardsForDashboardQuery } from '@/apollo/gql/graphql'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getAvatarFallback } from '@/utils/avatar-fallback.util'
import { ExternalLink } from 'lucide-react'

interface Props {
    board: BoardsData
}

type BoardsData = GetAllUserBoardsForDashboardQuery['getAllUserBoards'][number]

const RecentBoard = ({ board }: Props) => {
    const timeAgo = formatDistanceToNow(new Date(board.updatedAt), {
        addSuffix: true,
        locale: ru,
    })

    const firstThreeMembers = board.members.slice(0, 3)
    return (
        <Link href={`/dashboard/kanban/${board.id}`}>
            <Card className='hover:bg-neutral-800 transition-colors relative'>
                <CardHeader className='min-h-11 max-w-[85%]'>
                    <CardTitle className='truncate h-5'>{board.name}</CardTitle>
                    <CardDescription className='truncate'>{board.description}</CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col gap-3'>
                    <div className='flex justify-between'>
                        <div className="flex items-center gap-2 text-left text-sm">
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={board.owner.avatarUrl ?? ''} alt={board.owner.nickName} />
                                <AvatarFallback className="rounded-lg">
                                    {getAvatarFallback(board.owner.nickName)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{`@${board.owner.nickName}`}</span>
                                <span className="truncate text-xs">{board.owner.email}</span>
                            </div>
                        </div>
                        <div className='flex'>
                            {firstThreeMembers.map((member, i) => (
                                <div key={i} className={`z-${i} not-first:ml-[-15px] filter not-first:drop-shadow-[-3px_0_3px_rgba(0,0,0,0.15)]`}>
                                    <Avatar className="h-8 w-8 rounded-full">
                                        <AvatarImage src={member.user.avatarUrl ?? ''} alt={board.owner.nickName} />
                                        <AvatarFallback className="rounded-lg">
                                            {getAvatarFallback(member.user.nickName)}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                            ))}
                        </div>
                    </div>
                    <span className='text-sm text-neutral-500 mt-auto'>{timeAgo}</span>
                </CardContent>
                <ExternalLink className='text-neutral-600 w-5 h-5 absolute top-5 right-5'/>
            </Card>
        </Link>
    )
}

export default RecentBoard
