'use client'

import React from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../shared/ui-kit/dialog'
import { Button } from '../../../shared/ui-kit/button'
import { Label } from '../../../shared/ui-kit/label'
import DefaultUserPreview from '../../../shared/components/DefaultUserPreview'
import { copyToClipboard } from '@/shared/lib/copy-to-clipboard.util'
import { Board } from '@/entities/board/model/board.type'

interface Props {
    board: Board
    isOpened: boolean
}

const SettingsForMembers = ({ board, isOpened }: Props) => {

    return (
        <DialogContent className="dark">
            <DialogHeader>
                <DialogTitle>Board Settings</DialogTitle>
                <DialogDescription>
                    View the settings for this board below.
                </DialogDescription>
            </DialogHeader>

            <section className='flex flex-col gap-5 mt-4'>
                <div className='flex flex-col gap-1'>
                    <Label className='pl-2 text-neutral-500 font-normal'>Board Name:</Label>
                    <p className='break-all whitespace-normal pl-2 text-neutral-300'>{board?.name}</p>
                </div>

                <div className='flex flex-col gap-1'>
                    <Label className='pl-2 text-neutral-500 font-normal'>Board Description:</Label>
                    <p className='break-all whitespace-normal pl-2 text-neutral-300'>{board?.description || '-'}</p>
                </div>

                <div className='flex flex-col gap-1'>
                    <Label className='pl-2 text-neutral-500 font-normal'>Board Type:</Label>
                    <p className='pl-2 text-neutral-300'>{board?.boardType ? 'Private' : 'Public'}</p>
                </div>

                <p
                    onClick={(e) => copyToClipboard(e, board?.id ?? '')}
                    className='pl-2 w-fit text-sm hover:text-neutral-300 cursor-pointer transition-colors text-neutral-500'>
                    {`ID: ${board?.id}`}
                </p>
                <p
                    className='pl-2 w-fit text-sm text-neutral-500'>
                    {`Created on: ${new Date(board?.createdAt).toLocaleDateString()}`}
                </p>

                <div className='flex flex-col gap-2'>
                    <Label className='pl-2 text-neutral-500 font-normal'>Board Members:</Label>
                    <div className='flex flex-wrap gap-3 px-2'>
                        {board?.members.map(member => (
                            <div key={member.user.id} className='text-neutral-300'>
                                <DefaultUserPreview
                                    nickName={member.user.nickName ?? ''}
                                    email={member.user.email ?? ''}
                                    avatarUrl={member.user.avatarUrl ?? ''}
                                />
                            </div>
                        ))}
                        {board?.members.length === 0 && (
                            <p className='pl-2 text-neutral-400'>No members</p>
                        )}
                    </div>
                </div>
            </section>

            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    )
}

export default SettingsForMembers
