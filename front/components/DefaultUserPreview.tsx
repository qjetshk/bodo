import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { getAvatarFallback } from '@/utils/avatar-fallback.util'

interface Props {
    nickName: string,
    avatarUrl: string
    email: string
}

const DefaultUserPreview = ({ nickName, avatarUrl, email }: Props) => {
    return (
        <div className="flex items-center gap-2 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={avatarUrl} alt={nickName} />
                <AvatarFallback className="rounded-lg">
                    {getAvatarFallback(nickName)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{`@${nickName}`}</span>
                <span className="truncate text-xs">{email}</span>
            </div>
        </div>
    )
}

export default DefaultUserPreview
