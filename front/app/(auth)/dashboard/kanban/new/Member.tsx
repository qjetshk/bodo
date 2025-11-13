import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarFallback } from "@/utils/avatar-fallback.util";

interface Props {
    user: {
        id: string;
        email: string;
        nickName: string;
        avatarUrl: string
    }
}

const Member = ({ user }: Props) => {
    return (
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatarUrl} alt={user.nickName} />
                <AvatarFallback className="rounded-lg">
                    {getAvatarFallback()}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.nickName}</span>
                <span className="truncate text-xs">{user.email}</span>
            </div>
        </div>
    )
}

export default Member