import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui-kit/avatar';
import { getAvatarFallback } from '@/shared/lib/avatar-fallback.util';

interface Members {
    user: {
        avatarUrl?: string | null | undefined;
        nickName: string;
    };
}

function FirstThreeAvatars<T extends Members[]>({ members, avatarSize = 32 }: { members: T, avatarSize?: number }) {

    const firstThreeMembers = members?.slice(0, 3)
    return (
        <div className='flex items-center gap-1'>
            {firstThreeMembers?.map((member, i) => (
                <div key={i} className={` z-${i} not-first:ml-[-15px] filter not-first:drop-shadow-[-3px_0_3px_rgba(0,0,0,0.15)]`}>
                    <Avatar style={{ width: `${avatarSize}px`, height: `${avatarSize}px` }}
                        className={`rounded-full`}>
                        <AvatarImage src={member.user.avatarUrl ?? ''} alt={member.user.nickName} />
                        <AvatarFallback className="rounded-lg">
                            {getAvatarFallback(member.user.nickName)}
                        </AvatarFallback>
                    </Avatar>
                </div>
            ))}
            {members?.length > 3 &&
                <div className='text-neutral-400 font-bold italic'>
                    {`+${members?.length - 3}`}
                </div>
            }
        </div>
    )
}

export default FirstThreeAvatars
