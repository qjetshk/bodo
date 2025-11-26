'use client'
import { BOARD_DELETED, BOARD_EDITED, GET_ALL_USER_BOARDS_FOR_DASHBOARD, GET_ALL_USER_BOARDS_FOR_NAVIGATION, GET_INITIAL_BOARD } from "@/apollo/requests/boards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useSubscription } from "@apollo/client/react";
import { Loader2, MoveLeft, Settings as SettingsIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DefaultUserPreview from "@/components/DefaultUserPreview";
import SettingsForOwner from "@/components/board/SettingsForOwner";
import SettingsForMembers from "@/components/board/SettingsForMembers";
import { motion } from 'motion/react'
import Board from "@/components/board/Board";
import { GetInitialBoardQuery } from "@/apollo/gql/graphql";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { USER_ACCEPT_INVITATION, USER_DECLINE_INVITATION } from "@/apollo/requests/invitation";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-user";

const BoardPage = () => {
  const { id } = useParams();
  const boardId = id as string
  const { data, loading, error } = useQuery(GET_INITIAL_BOARD, {
    variables: {
      boardId
    },
    fetchPolicy: "network-only"
  })

  const { user } = useCurrentUser()

  const boardData = data?.getBoardById as GetInitialBoardQuery['getBoardById']

  const [board, setBoard] = useState(boardData);

  useEffect(() => {
    if (data?.getBoardById) {
      setBoard(data.getBoardById);
    }
  }, [data]);

  useSubscription(USER_ACCEPT_INVITATION, {
    onData: ({ data, client }) => {
      console.log(data)
      const member = data.data?.invitationAccepted.member

      if (!member) return

      toast.success(`@${member?.user.nickName} принял Ваше приглашение!`)

      setBoard(prev => {
        const newMembers = [...prev.members, member];

        return { ...prev, members: newMembers }
      })

      client.cache.modify({
        id: client.cache.identify({__typename: 'Board', id: board.id}),
        fields: {
          updatedAt: () => new Date().toISOString()
        }
      })
    }
  })

  useSubscription(USER_DECLINE_INVITATION, {
    onData: ({ data }) => {
      const member = data.data?.invitationDeclined.member
      if (!member) return

      toast.error(`@${member?.user.nickName} отклонил Ваше приглашение!`)
    }
  })

  useSubscription(BOARD_EDITED, {
    onData: ({ data, client }) => {
      const updatedBoard = data.data?.boardEdited
      if (!updatedBoard) return

      client.refetchQueries({
        include: [GET_ALL_USER_BOARDS_FOR_NAVIGATION]
      }),
        client.cache.modify({
          id: client.cache.identify({ __typename: 'Board', id: updatedBoard.id }),
          fields: {
            name: () => updatedBoard.name,
            description: () => updatedBoard.description,
            updatedAt: () => updatedBoard.updatedAt
          },
        })
    },
  })



  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const router = useRouter()

  const isSidebarOpened = useSelector((state: RootState) => state.sidebar.isOpened);
  const isMobile = useSelector((state: RootState) => state.sidebar.isMobile);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <Loader2 className="animate-spin size-8 " />
      </div>
    )
  }

  if (error) {
    return (
      <motion.div className="w-full h-[calc(100vh-120px)] flex justify-center items-center text-center"
        initial={{ y: 5, opacity: 0, filter: 'blur(10px)' }}
        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex gap-3 flex-wrap-reverse justify-center">
          <MoveLeft onClick={() => router.back()} className="text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer" />
          <span className="text-neutral-400 text-xl">{error.message}</span>
        </div>

      </motion.div>
    )
  }

  return (
    <motion.section className="px-5 py-5"
      initial={{ y: 5, opacity: 0, filter: 'blur(10px)' }}
      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`bg-transparent mx-auto transition-all duration-200 ease-linear
          ${isSidebarOpened ? 'max-w-[calc(100vw-336px)]' : 'max-w-[calc(100vw-132px)]'} 
          ${isMobile && 'max-w-[calc(100vw-80px)]'}
        `} >
        <CardHeader className="flex gap-2 items-center justify-between px-15 ">
          <div className="2xl:max-w-[80%] xl:max-w-[75%] lg:max-w-[65%] md:max-w-[80%] max-w-[85%]">
            <CardTitle className="font-medium font-unbounded break-all text-xl md:text-2xl ">{board?.name}</CardTitle>
            <CardDescription className="text-neutral-600 max-w-150">{board?.description}</CardDescription>
          </div>
          <div className="flex gap-10 items-center">
            <div className="lg:flex hidden items-center gap-3">
              <DefaultUserPreview nickName={board?.owner.nickName ?? ''} email={board?.owner.email ?? ''} avatarUrl={board?.owner.avatarUrl ?? ''} />
              {user && user.id === board?.owner.id && <span className="text-neutral-500">(ВЫ)</span>}
            </div>


            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <SettingsIcon className="text-neutral-500 cursor-pointer hover:text-neutral-400 transition-colors" />
              </DialogTrigger>
              {(user && user?.id === board?.owner.id) ?
                <SettingsForOwner isOpened={isSettingsOpen} board={board} />
                :
                <SettingsForMembers isOpened={isSettingsOpen} board={board} />
              }
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="">
          <Board board={boardData} />
        </CardContent>

      </Card>
    </motion.section>
  )


};

export default BoardPage;
