export type ModelTypeWithMembersAndOwnerIds<T> = T & {
    membersAndOwnerIds: string[]
}