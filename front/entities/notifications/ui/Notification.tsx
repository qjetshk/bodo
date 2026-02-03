import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader } from '../../../shared/ui-kit/card'
import { GetAllUserBoardInvitationQuery } from '@/apollo/gql/graphql'
import { Avatar, AvatarFallback, AvatarImage } from '../../../shared/ui-kit/avatar'
import { getAvatarFallback } from '@/shared/lib/avatar-fallback.util'
import { Button } from '../../../shared/ui-kit/button'
import { useMutation } from '@apollo/client/react'
import { ACCEPT_INVITATION, DECLINE_INVITATION, GET_ALL_USER_BOARD_INVITATIONS } from '@/apollo/requests/invitation'
import { GET_ALL_USER_BOARDS_FOR_NAVIGATION } from '@/apollo/requests/boards'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Props {
  notification: GetAllUserBoardInvitationQuery['getAllUserBoardInvitation'][number]
}

const Notification = ({ notification }: Props) => {

  const router = useRouter()

  const [acceptInvitation, { data: acceptedInvitation }] = useMutation(ACCEPT_INVITATION, {
    refetchQueries: [GET_ALL_USER_BOARDS_FOR_NAVIGATION]
  })
  const [declineInvitation, { data: declinedInvitation }] = useMutation(DECLINE_INVITATION)

  useEffect(() => {
    if (acceptedInvitation) {
      toast.success(`You accepted the invitation from @${notification.invitedBy.nickName}!`, { duration: 1500 })
      setTimeout(() => {
        router.replace(`/dashboard/kanban/${acceptedInvitation.acceptInvitation.id}`)
      }, 1500)
    }
  }, [acceptedInvitation])

  useEffect(() => {
    if (declinedInvitation) {
      toast.error(`You declined the invitation from @${notification.invitedBy.nickName}!`, { duration: 1500 })
    }
  }, [declinedInvitation])

  return (
    <Card className='p-2'>
      <CardContent className="sm:p-2 p-1 flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-5">
        <div className="flex items-center gap-2 min-w-0 flex-1 max-w-[600px] flex-wrap">
          <div className="flex items-center gap-1 text-left text-xs sm:text-sm">
            <Avatar className="h-7 w-7 rounded-lg">
              <AvatarImage src={notification.invitedBy.avatarUrl || ''} />
              <AvatarFallback className="rounded-lg">
                {getAvatarFallback()}
              </AvatarFallback>
            </Avatar>
            <span className="truncate font-medium text-xs sm:text-sm">{`@${notification.invitedBy.nickName}`}</span>
          </div>

          <span className="whitespace-nowrap text-xs sm:text-sm">
            invited you to their board
          </span>

          <span className="font-bold truncate max-w-[200px] text-xs sm:text-sm">
            {`«${notification.board.name}»`}
          </span>
        </div>

        <div className="flex gap-2 flex-shrink-0 justify-end w-full lg:w-auto lg:ml-auto">
          <Button onClick={() => {
            acceptInvitation({
              variables: {
                invitationId: notification.id
              },
              refetchQueries: [GET_ALL_USER_BOARD_INVITATIONS, GET_ALL_USER_BOARDS_FOR_NAVIGATION]
            })
          }} className='text-xs! sm:text-sm!' size="sm">Accept</Button>
          <Button onClick={() => {
            declineInvitation({
              variables: {
                invitationId: notification.id
              },
              refetchQueries: [GET_ALL_USER_BOARD_INVITATIONS, GET_ALL_USER_BOARDS_FOR_NAVIGATION]
            })
          }} className='text-xs! sm:text-sm!' variant="outline" size="sm">Decline</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Notification
