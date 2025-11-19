'use client'

import React from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { GetInitialBoardQuery } from '@/apollo/gql/graphql'
import DefaultUserPreview from '../DefaultUserPreview'
import { copyToClipboard } from '@/utils/copy-to-clipboard.util'

interface Props {
    board?: InitialBoard
    isOpened: boolean
}

export type InitialBoard = GetInitialBoardQuery['getBoardById']

const SettingsForMembers = ({ board, isOpened }: Props) => {
    if (!board) return null

    return (
        <DialogContent className="dark">
            <DialogHeader>
                <DialogTitle>Настройки</DialogTitle>
                <DialogDescription>
                    Здесь вы можете посмотреть настройки этой доски
                </DialogDescription>
            </DialogHeader>

            <section className='flex flex-col gap-5 mt-4'>
                <div className='flex flex-col gap-1'>
                    <Label className='pl-2 text-neutral-500 font-normal'>Название доски:</Label>
                    <p className='break-all whitespace-normal pl-2 text-neutral-300'>{board.name}</p>
                </div>

                <div className='flex flex-col gap-1'>
                    <Label className='pl-2 text-neutral-500 font-normal'>Описание доски:</Label>
                    <p className='break-all whitespace-normal pl-2 text-neutral-300'>{board.description || '-'}</p>
                </div>

                <div className='flex flex-col gap-1'>
                    <Label className='pl-2 text-neutral-500 font-normal'>Тип доски:</Label>
                    <p className='pl-2 text-neutral-300'>{board.boardType ? 'Приватная' : 'Публичная'}</p>
                </div>

                <p
                    onClick={(e) => copyToClipboard(e, board?.id ?? '')}
                    className='pl-2 w-fit text-sm hover:text-neutral-300 cursor-pointer transition-colors text-neutral-500'>
                    {`id: ${board?.id}`}
                </p>

                <div className='flex flex-col gap-2'>
                    <Label className='pl-2 text-neutral-500 font-normal'>Участники доски:</Label>
                    <div className='flex flex-wrap gap-3 px-2'>
                        {board.members.map(member => (
                            <div key={member.user.id} className='text-neutral-300'>
                                <DefaultUserPreview
                                    nickName={member.user.nickName ?? ''}
                                    email={member.user.email ?? ''}
                                    avatarUrl={member.user.avatarUrl ?? ''}
                                />
                            </div>
                        ))}
                        {board.members.length === 0 && (
                            <p className='pl-2 text-neutral-400'>Нет участников</p>
                        )}
                    </div>
                </div>
            </section>

            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Закрыть</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    )
}

export default SettingsForMembers
