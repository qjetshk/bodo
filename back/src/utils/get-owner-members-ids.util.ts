interface BoardLike {
    ownerId: string;
    members: { user: { id: string } }[];
}


export function getOwnerAndMembersIds<T extends BoardLike>(board: T) {
    const membersIds = board.members.map(member => member.user.id);

    const membersAndOwnerIds = [
        ...membersIds,
        board.ownerId
    ];

    return membersAndOwnerIds as string[]
}

export function getRecipientsIds<T extends BoardLike>(board: T, movedById: string) {
    return getOwnerAndMembersIds<typeof board>(board).filter(id => id !== movedById)
}