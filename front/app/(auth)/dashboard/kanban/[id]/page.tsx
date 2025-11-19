'use client'
import { GET_INITIAL_BOARD } from "@/apollo/requests/boards";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@apollo/client/react";
import { Loader2, Settings as SettingsIcon } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import DefaultUserPreview from "@/components/DefaultUserPreview";
import SettingsForOwner from "@/components/board/SettingsForOwner";
import SettingsForMembers from "@/components/board/SettingsForMembers";
import { motion } from 'motion/react'

const BoardPage = () => {
  const { id } = useParams();
  const boardId = id as string
  const { data, loading, error } = useQuery(GET_INITIAL_BOARD, {
    variables: {
      boardId
    }
  })

  const user_ = localStorage.getItem('user')
  const user = JSON.parse(user_ ?? '')

  const board = data?.getBoardById

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <Loader2 className="animate-spin size-8" />
      </div>
    )
  }

  return (
    <motion.section className="lg:py-10 sm:py-5 py-3 xl:px-[6%] px-[2%] lg:px-[4%] 2xl:px-[8%] flex flex-col gap-5"
      initial={{ y: 5, opacity: 0, filter: 'blur(10px)' }}
      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="flex gap-2 items-center justify-between">
          <div >
            <CardTitle className="font-medium font-unbounded text-2xl">{board?.name}</CardTitle>
            <CardDescription className="text-neutral-600 max-w-150">{board?.description}</CardDescription>
          </div>
          <div className="flex gap-10 items-center">
            <div className="flex items-center gap-3">
              <DefaultUserPreview nickName={board?.owner.nickName ?? ''} email={board?.owner.email ?? ''} avatarUrl={board?.owner.avatarUrl ?? ''} />
              {user.id === board?.owner.id && <span className="text-neutral-500">(ВЫ)</span>}
            </div>


            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <SettingsIcon className="text-neutral-500 cursor-pointer hover:text-neutral-400 transition-colors" />
              </DialogTrigger>
              {user.id === board?.owner.id ?
                <SettingsForOwner isOpened={isSettingsOpen} board={board} />
                :
                <SettingsForMembers isOpened={isSettingsOpen} board={board} />
              }
            </Dialog>
          </div>
        </CardHeader>

      </Card>

    </motion.section>
  )


};

export default BoardPage;
